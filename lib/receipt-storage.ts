import {env} from 'cloudflare:workers';
export function receiptBucket(){const bucket=(env as unknown as {BUCKET:R2Bucket}).BUCKET;if(!bucket)throw new Error('Receipt storage unavailable');return bucket;}
export function receiptAdmin(request:Request){const allowed=(env as unknown as {RECEIPT_ADMIN_EMAIL?:string}).RECEIPT_ADMIN_EMAIL;return !!allowed&&!!request.headers.get('oai-authenticated-user-id')&&request.headers.get('oai-authenticated-user-email')?.toLowerCase()===allowed.toLowerCase();}
export function receiptAdminEmail(){return (env as unknown as {RECEIPT_ADMIN_EMAIL?:string}).RECEIPT_ADMIN_EMAIL;}
export function imageMime(bytes:Uint8Array){if(bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)return 'image/jpeg';if([137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v))return 'image/png';if(new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP')return 'image/webp';return null;}
