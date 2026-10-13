// The OCR model and image processing stay on the visitor's device.
export async function readReceipt(file:Blob,onProgress?:(value:string)=>void){
 const {createWorker}=await import('tesseract.js');
 let timer:ReturnType<typeof setTimeout>|undefined;
 const timeout=new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new Error('OCR timeout')),35000);});
 const ready=createWorker('spa',1,{workerPath:'/ocr/worker.min.js',corePath:'/ocr/core',langPath:'/ocr/lang',logger:m=>{if(m.status==='recognizing text')onProgress?.(`Leyendo comprobante… ${Math.round(m.progress*100)}%`);},cacheMethod:'none'});
 try{const worker=await Promise.race([ready,timeout]);return (await Promise.race([worker.recognize(file),timeout])).data.text.slice(0,12000);}finally{clearTimeout(timer);void ready.then(w=>w.terminate()).catch(()=>{});}
}
