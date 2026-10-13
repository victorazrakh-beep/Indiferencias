import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {receiptAdminEmail} from '@/lib/receipt-storage';
import ReceiptReview from './review';
export const dynamic='force-dynamic';
export default function Page(){return <Protected/>;}
async function Protected(){const user=await requireChatGPTUser('/admin/comprobantes');const allowed=receiptAdminEmail();if(!allowed||user.email.toLowerCase()!==allowed.toLowerCase())return <main className="section"><h1>Acceso reservado</h1><p>Los comprobantes solo están disponibles para la cuenta administradora del sitio.</p><a href="/">Volver al sitio</a></main>;return <ReceiptReview/>;}
