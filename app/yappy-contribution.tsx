"use client";
import {useEffect,useState,useRef} from 'react';
import {yappyNumber,yappyDisplay} from '@/lib/payment-config';
import {Copy,CheckCircle2,Smartphone} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {readReceipt} from '@/lib/receipt-ocr';
import {Checkbox} from '@/components/ui/checkbox';

export default function YappyContribution({open,onClose,initialAmount,caseLabel}:{open:boolean;onClose:()=>void;initialAmount:string;caseLabel:string}){
 const [receipt,setReceipt]=useState<File|null>(null);const [preview,setPreview]=useState('');const [progress,setProgress]=useState('');const fileInput=useRef<HTMLInputElement>(null);
 const [amount,setAmount]=useState(initialAmount);
 const [step,setStep]=useState('pay');const [copy,setCopy]=useState('');
 const [consent,setConsent]=useState(false);const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');const [requestKey,setRequestKey]=useState('');
 useEffect(()=>{if(open){setAmount(initialAmount);setStep('pay');setConsent(false);setCopy('');setError('');setRequestKey(crypto.randomUUID());setReceipt(null);setProgress('');}},[open,initialAmount]);
 useEffect(()=>{if(!receipt){setPreview('');return;}const url=URL.createObjectURL(receipt);setPreview(url);return()=>URL.revokeObjectURL(url);},[receipt]);
 async function copyNumber(){if(!yappyNumber){setCopy('Configura el destinatario antes de usar Yappy.');return;}try{await navigator.clipboard.writeText(yappyNumber);setCopy('Número copiado');}catch{setCopy('Copia este número: '+yappyDisplay);}}
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(busy)return;setBusy(true);setError('');const data=new FormData(e.currentTarget);
  try{if(!receipt)throw new Error('Adjunta el comprobante de tu Yappy.');
   setProgress('Leyendo comprobante…');let ocrText='';try{ocrText=await readReceipt(receipt,setProgress);}catch{/* Store for manual reading if OCR is unavailable. */}
   data.set('receipt',receipt);data.set('requestKey',requestKey);data.set('caseRef','002');data.set('amount',amount);data.set('consent',String(consent));data.set('ocrText',ocrText);
   setProgress('Guardando comprobante…');const r=await fetch('/api/yappy/reportar',{method:'POST',body:data});const result=await r.json() as {error?:string};if(!r.ok)throw new Error(result.error||'No pudimos guardar el reporte.');setStep('done');}

  catch(e){setError(e instanceof Error?e.message:'Intenta de nuevo. No necesitas repetir el pago.');}finally{setBusy(false);}
 }
 return <Dialog open={open} onOpenChange={v=>!v&&!busy&&onClose()}><DialogContent className="form-dialog yappy-dialog"><DialogTitle>{step==='done'?'Gracias por sumar tu ayuda':step==='report'?'Reporta tu envío':'Aporta por Yappy'}</DialogTitle><DialogDescription>{step==='done'?'Tu comprobante quedó guardado y pendiente de revisión.':`Tu aporte para ${caseLabel}.`}</DialogDescription>
 {step==='done'?<div className="success"><CheckCircle2 size={42}/><h3>Vamos a verificar tu aporte.</h3><p>Revisaremos el movimiento recibido en Yappy. Este reporte todavía no confirma el pago ni modifica lo recaudado.</p><p>Conserva tu comprobante. Te contactaremos si necesitamos aclarar algún dato.</p><button className="btn full" onClick={onClose}>Listo</button></div>:step==='pay'?<div>
 <label className="amount-label">Tu aporte (USD)<input type="number" min="1" max="1000000" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/></label>
 <div className="yappy-recipient"><span><Smartphone size={19}/> Yappy al número</span><strong>{yappyDisplay}</strong><button type="button" className="btn full" onClick={copyNumber} disabled={!yappyNumber}><Copy size={17}/> Copiar número</button><span className="small" role="status">{copy}</span></div>
 <ol className="yappy-steps"><li>Abre Yappy en tu aplicación y selecciona enviar dinero a <strong>{yappyDisplay}</strong>.</li><li>Revisa el destinatario y envía <strong>{Number(amount)>0?Number(amount).toLocaleString('es-PA',{style:'currency',currency:'USD'}):'el monto que elijas'}</strong>. En el mensaje escribe <strong>Próxima casa</strong>.</li><li>Guarda el comprobante y vuelve aquí para subirlo. Es obligatorio para revisar tu aporte.</li></ol>
 <button className="btn full" onClick={()=>setStep('report')} disabled={!yappyNumber}>Ya hice el Yappy</button><p className="small">El pago se hace en tu aplicación. Aquí no te pedimos claves ni códigos bancarios. Revisamos el comprobante y confirmamos el ingreso en Yappy.</p>
 </div>:<form onSubmit={submit}>
 <label>Nombre de quien envió el Yappy<input name="name" required minLength={2} maxLength={120} autoComplete="name"/></label>
 <label>Correo o WhatsApp de contacto<input name="contact" required minLength={6} maxLength={160}/></label>
 <label>Monto enviado (USD)<input type="number" required min="1" max="1000000" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/></label>
 <label>Comprobante de Yappy (obligatorio)<input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" required disabled={busy} onChange={e=>{const f=e.target.files?.[0];setError('');if(f&&(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>5*1024*1024)){setReceipt(null);e.target.value='';setError('Adjunta una imagen JPG, PNG o WebP de hasta 5 MB.');return;}setReceipt(f||null);}}/></label>
 <p className="small">Incluye monto, fecha y destinatario. No incluyas tu saldo ni otros movimientos. El comprobante es privado y solo se usa para verificar este aporte.</p>
 {preview&&<img className="receipt-preview" src={preview} alt="Vista previa del comprobante que vas a enviar"/>}
 <label className="consent"><Checkbox checked={consent} onCheckedChange={v=>setConsent(v===true)}/><span>Autorizo la lectura automática y el uso de este comprobante y mis datos para verificar mi aporte y contactarme sobre este envío. Mis datos de contacto no se publicarán.</span></label>
 {error&&<p className="error" role="alert">{error} Conserva tu comprobante; no repitas el pago.</p>}
 <button className="btn full" disabled={busy||!consent||!receipt}>{busy?progress:'Enviar comprobante para revisión'}</button><button className="share" type="button" disabled={busy} onClick={()=>setStep('pay')}>Volver a las instrucciones</button>
 </form>}
 </DialogContent></Dialog>
}
