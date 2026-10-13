import {database} from '@/lib/db';
import {receiptBucket,imageMime} from '@/lib/receipt-storage';
import {normalizeReference} from '@/lib/receipt-checks';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Solicitud no permitida.'},{status:403});
 let key:string|undefined;
 try{
  if(Number(request.headers.get('content-length'))>6*1024*1024)return Response.json({error:'El comprobante debe pesar menos de 5 MB.'},{status:413});
  const reader=request.body?.getReader();if(!reader)return Response.json({error:'Adjunta tu comprobante.'},{status:400});
  const chunks:Uint8Array[]=[];let length=0;while(true){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>6*1024*1024){await reader.cancel();return Response.json({error:'El comprobante debe pesar menos de 5 MB.'},{status:413});}chunks.push(value);}
  const bytes=new Uint8Array(length);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.length;}
  const form=await new Response(bytes,{headers:{'Content-Type':request.headers.get('content-type')||''}}).formData();
  const b=Object.fromEntries(form);const file=form.get('receipt');
  const validText=(v:unknown,min:number,max:number)=>typeof v==='string'&&v.trim().length>=min&&v.length<=max;
  if(!validText(b.name,2,120)||!validText(b.contact,6,160)||(b.reference!==undefined&&!validText(b.reference,0,100))||b.caseRef!=='002'||b.consent!=='true'||typeof b.requestKey!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(b.requestKey)||typeof b.amount!=='string'||!/^\d{1,7}(\.\d{1,2})?$/.test(b.amount)||Number(b.amount)<1||Number(b.amount)>1000000||!(file instanceof File)||file.size<32||file.size>5*1024*1024)return Response.json({error:'Completa los datos y adjunta una imagen JPG, PNG o WebP de hasta 5 MB.'},{status:400});
  const reportedReference=typeof b.reference==='string'?b.reference.trim():'';
  const reference=normalizeReference(reportedReference);
  const content=await file.arrayBuffer();const mime=imageMime(new Uint8Array(content));if(!mime)return Response.json({error:'Solo aceptamos imágenes JPG, PNG o WebP.'},{status:400});
  const db=database();const existing=await db.prepare('SELECT id FROM yappy_reports WHERE request_key=?').bind(b.requestKey).first();if(existing)return Response.json({status:'pending_review'},{status:200});
  const sha=[...new Uint8Array(await crypto.subtle.digest('SHA-256',content))].map(v=>v.toString(16).padStart(2,'0')).join('');
  const id=crypto.randomUUID();key=`receipts/${id}`;
  await receiptBucket().put(key,content,{httpMetadata:{contentType:mime}});
  // Never trust browser OCR for payment confirmation. It is a preliminary reading only.
  const ocrText=typeof b.ocrText==='string'?b.ocrText.slice(0,12000):'';
  try{await db.batch([
   db.prepare('INSERT INTO yappy_reports (id,request_key,case_ref,name,contact,reference,amount_cents,status) VALUES (?,?,?,?,?,?,?,?)').bind(id,b.requestKey,b.caseRef,String(b.name).trim(),String(b.contact).trim(),reportedReference,Math.round(Number(b.amount)*100),'pending_review'),
   db.prepare('INSERT INTO receipt_files (report_id,object_key,mime,sha256,normalized_reference,ocr_text) VALUES (?,?,?,?,?,?)').bind(id,key,mime,sha,reference,ocrText)
  ]);}catch(e){await receiptBucket().delete(key);key=undefined;if(await db.prepare('SELECT id FROM yappy_reports WHERE request_key=?').bind(b.requestKey).first())return Response.json({status:'pending_review'},{status:200});throw e;}
  return Response.json({status:'pending_review'},{status:201});
 }catch(error){console.error('Receipt submission failed',error instanceof Error?error.name:'storage');return Response.json({error:'No pudimos guardar el comprobante. Intenta de nuevo sin repetir el pago.'},{status:503});}
}
