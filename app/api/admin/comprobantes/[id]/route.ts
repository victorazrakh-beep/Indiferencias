import {database} from '@/lib/db';
import {receiptAdmin,receiptBucket} from '@/lib/receipt-storage';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!receiptAdmin(request))return new Response('Acceso reservado',{status:403});
 try{const {id}=await params;const row=await database().prepare('SELECT object_key,mime FROM receipt_files WHERE report_id=?').bind(id).first<{object_key:string;mime:string}>();if(!row)return new Response('Comprobante no encontrado',{status:404});const file=await receiptBucket().get(row.object_key);if(!file)return new Response('Comprobante no encontrado',{status:404});return new Response(file.body,{headers:{'Content-Type':row.mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox",'Content-Disposition':'inline'}});}catch{return new Response('No pudimos abrir el comprobante',{status:503});}
}
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!receiptAdmin(request))return Response.json({error:'Acceso reservado.'},{status:403});
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Solicitud no permitida.'},{status:403});
 try{const {id}=await params;const b=await request.json() as {action?:string;matched?:boolean;note?:string};if(!['confirm','reject'].includes(b.action||'')||typeof b.note!=='string'||b.note.length>500||(b.action==='confirm'&&b.matched!==true)||(b.action==='reject'&&!b.note.trim()))return Response.json({error:'Confirma que revisaste el movimiento recibido en Yappy.'},{status:400});
 const db=database();const row=await db.prepare('SELECT r.status,f.sha256,f.normalized_reference FROM yappy_reports r JOIN receipt_files f ON f.report_id=r.id WHERE r.id=?').bind(id).first<{status:string;sha256:string;normalized_reference:string}>();if(!row)return Response.json({error:'Comprobante no encontrado.'},{status:404});if(row.status!=='pending_review')return Response.json({error:'Este comprobante ya fue revisado. Actualiza la lista.'},{status:409});
 const status=b.action==='confirm'?'confirmed':'rejected';
 const statements=[];
 if(status==='confirmed')statements.push(db.prepare("INSERT INTO confirmed_receipts (report_id,sha256,normalized_reference) SELECT ?,?,? WHERE EXISTS (SELECT 1 FROM yappy_reports WHERE id=? AND status='pending_review')").bind(id,row.sha256,row.normalized_reference||`unprovided:${id}`,id));
 statements.push(db.prepare("UPDATE receipt_files SET review_note=?,reviewed_at=CURRENT_TIMESTAMP WHERE report_id=? AND EXISTS (SELECT 1 FROM yappy_reports WHERE id=? AND status='pending_review')").bind(b.note,id,id));
 statements.push(db.prepare("UPDATE yappy_reports SET status=? WHERE id=? AND status='pending_review'").bind(status,id));
 try{await db.batch(statements);}catch{return Response.json({error:'No se pudo confirmar. La referencia o imagen puede pertenecer a un aporte ya confirmado. Actualiza y revisa.'},{status:409});}
 return Response.json({status});
 }catch{return Response.json({error:'No pudimos guardar la revisión.'},{status:503});}
}
