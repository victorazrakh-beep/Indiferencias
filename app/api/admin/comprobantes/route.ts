import {database} from '@/lib/db';
import {receiptAdmin} from '@/lib/receipt-storage';
export async function GET(request:Request){
 if(!receiptAdmin(request))return Response.json({error:'Acceso reservado al administrador.'},{status:403});
 try{const data=await database().prepare(`SELECT r.*, f.mime, f.ocr_text, f.review_note, f.reviewed_at,
 (SELECT COUNT(*) FROM receipt_files other WHERE other.report_id<>f.report_id AND (other.sha256=f.sha256 OR (f.normalized_reference<>'' AND other.normalized_reference=f.normalized_reference))) AS duplicates
 FROM yappy_reports r LEFT JOIN receipt_files f ON f.report_id=r.id ORDER BY r.created_at DESC LIMIT 100`).all();return Response.json({reports:data.results},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'No pudimos cargar los comprobantes.'},{status:503});}
}
