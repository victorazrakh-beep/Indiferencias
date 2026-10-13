import {database} from '@/lib/db';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Solicitud no permitida.'},{status:403});
 try{if(Number(request.headers.get('content-length'))>12000)return Response.json({error:'Mensaje demasiado largo.'},{status:413});
 const b=await request.json() as any;
 if(!['aportar','empresa','caso'].includes(b.kind)||b.consent!==true||typeof b.name!=='string'||b.name.trim().length<2||b.name.length>120||typeof b.contact!=='string'||b.contact.trim().length<6||b.contact.length>160||typeof b.message!=='string'||b.message.length>1500||(b.kind==='caso'&&b.message.trim().length<5)||(b.kind==='aportar'&&(typeof b.amount!=='number'||!Number.isFinite(b.amount)||b.amount<1||b.amount>1000000)))return Response.json({error:'Revisa tu nombre, contacto y los campos del formulario.'},{status:400});
 const id=crypto.randomUUID();await database().prepare('INSERT INTO submissions (id,kind,name,contact,message,amount) VALUES (?,?,?,?,?,?)').bind(id,b.kind,b.name.trim(),b.contact.trim(),b.message.trim(),b.kind==='aportar'?b.amount:0).run();return Response.json({id,status:'registered'},{status:201});
 }catch(error){console.error('Submission failed',error);return Response.json({error:'No pudimos guardar tu solicitud. Conserva tus datos e intenta nuevamente.'},{status:503})}
}
