import {yappyNumber} from './payment-config';
export function normalizeReference(value:string){return value.toUpperCase().replace(/[^A-Z0-9]/g,'');}
export function receiptChecks(text:string,amountCents:number,reference:string){
 const plain=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const digits=plain.replace(/\D/g,'');
 const amounts=[...plain.matchAll(/(?:\$|usd|b\/.?|monto|total)\s*[:=]?\s*(\d[\d,.]*)/g)].map(x=>{let v=x[1];if(/,\d{2}$/.test(v)&&!v.includes('.'))v=v.replace(',','.');else v=v.replace(/,/g,'');return Math.round(Number(v)*100);});
 const date=plain.match(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}\b|\b\d{1,2}\s+(?:de\s+)?(?:ene\w*|feb\w*|mar\w*|abr\w*|may\w*|jun\w*|jul\w*|ago\w*|sep\w*|oct\w*|nov\w*|dic\w*)\s+(?:de\s+)?\d{4}\b/)?.[0];
 return [
  {label:'Lectura del comprobante',ok:text.trim().length>25,detail:text.trim().length>25?'Texto legible para revisión':'No se pudo leer suficiente texto. Revisa la imagen.'},
  {label:'Mención de Yappy',ok:plain.includes('yappy'),detail:plain.includes('yappy')?'Encontrada en el texto':'No identificada en la imagen'},
  {label:'Número del destinatario',ok:!!yappyNumber&&digits.includes(yappyNumber),detail:!!yappyNumber&&digits.includes(yappyNumber)?'Número encontrado. Confirma que sea el destinatario.':'No se pudo identificar el número. Puede aparecer solo el nombre.'},
  {label:'Monto reportado',ok:amounts.includes(amountCents),detail:amounts.includes(amountCents)?'Monto encontrado en el texto':'No se pudo hacer coincidir el monto. Revisa el comprobante.'},
  ...(reference ? [{label:'Referencia reportada',ok:normalizeReference(text).includes(normalizeReference(reference))&&normalizeReference(reference).length>=3,detail:'Compara la referencia con el movimiento recibido en Yappy.'}] : []),
  {label:'Fecha en la imagen',ok:!!date,detail:date||'No se pudo leer una fecha. Revisa la imagen.'},
  {label:'Estado del envío',ok:!/(pendiente|rechazad|cancelad|fallid)/.test(plain)&&/(exitos|enviad|completad|realizad)/.test(plain),detail:/(pendiente|rechazad|cancelad|fallid)/.test(plain)?'El texto menciona un envío pendiente o no completado.':'Revisa que el comprobante corresponda a un envío completado.'},
 ];
}
