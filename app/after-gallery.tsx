"use client";
import {useState} from 'react';
import {Camera} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';

const photos=[
 {src:'/photos/after-1.jpg',title:'Piso e iluminación instalados',alt:'Interior de la casa de Pacora después de las mejoras, con piso de cemento y una luz encendida.'},
 {src:'/photos/after-2.jpg',title:'Así se ve el nuevo piso',alt:'Otra vista del piso de cemento instalado en los espacios interiores de la casa de Pacora.'},
];
export default function AfterGallery(){
 const [selected,setSelected]=useState<number|null>(null);
 return <section className="after-gallery" aria-labelledby="after-heading"><span className="eyebrow">PACORA · DESPUÉS</span><h3 id="after-heading">La ayuda se convirtió en mejoras.</h3><p>Ya podemos compartir el nuevo piso y la iluminación de este hogar. Gracias a cada persona que lo hizo posible.</p><div className="after-grid">{photos.map((photo,index)=><figure key={photo.src}><button className="after-photo" onClick={()=>setSelected(index)} aria-label={'Ampliar: '+photo.title}><img src={photo.src} alt={photo.alt} loading="lazy"/><span><Camera size={16}/> Ampliar foto</span></button><figcaption>{photo.title}</figcaption></figure>)}</div><p className="small">Imágenes del video de las mejoras realizadas.</p><Dialog open={selected!==null} onOpenChange={open=>{if(!open)setSelected(null);}}><DialogContent className="after-dialog"><DialogTitle>{photos[selected??0].title}</DialogTitle><DialogDescription>Casa 001 · Pacora · Después de las mejoras</DialogDescription><div className="after-photo after-enlarged"><img src={photos[selected??0].src} alt={photos[selected??0].alt}/></div><div className="after-controls"><button className="btn outline" onClick={()=>setSelected(selected===0?1:0)}>Ver otra foto</button><span>{(selected??0)+1} de 2</span></div></DialogContent></Dialog></section>;
}
