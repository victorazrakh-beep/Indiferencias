"use client";
import {useState} from 'react';
import {Camera,Mic} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';

const photos=[
 {src:'/photos/after-1.jpg',title:'Piso e iluminación instalados',alt:'Interior de la casa de Pacora después de las mejoras, con piso de cemento y una luz encendida.'},
 {src:'/photos/after-2.jpg',title:'Así se ve el nuevo piso',alt:'Otra vista del piso de cemento instalado en los espacios interiores de la casa de Pacora.'},
 {src:'/photos/entrega-1.jpg',title:'Un coche nuevo para el bebé',alt:'Un bebé con ropa roja de Mickey Mouse descansa en un coche gris nuevo mientras una niña pequeña lo acompaña. Detrás se ve la cuna portátil.'},
 {src:'/photos/entrega-2.jpg',title:'Estrenando el coche en familia',alt:'Un hombre acomoda al bebé en el coche nuevo mientras una mujer y una niña lo miran sonriendo junto a la cuna con mosquitero.'},
 {src:'/photos/entrega-3.jpg',title:'Abriendo la cuna y el coche',alt:'Un voluntario desempaca el coche mientras una niña saca la cuna portátil de su bolsa y una mujer carga al bebé.'},
 {src:'/photos/entrega-4.jpg',title:'Armando la cuna juntos',alt:'Un voluntario sostiene los tubos de la estructura mientras una niña ayuda a armar la cuna portátil.'},
];
export default function AfterGallery(){
 const [selected,setSelected]=useState<number|null>(null);
 const current=selected??0;
 const step=(delta:number)=>setSelected((current+delta+photos.length)%photos.length);
 return <section className="after-gallery" aria-labelledby="after-heading"><span className="eyebrow">PACORA · DESPUÉS</span><h3 id="after-heading">La ayuda se convirtió en mejoras.</h3><p>Ya podemos compartir el nuevo piso y la iluminación de este hogar, y la entrega de una cuna portátil con mosquitero y un coche para el bebé. Gracias a cada persona que lo hizo posible.</p><div className="after-grid">{photos.map((photo,index)=><figure key={photo.src}><button className="after-photo" onClick={()=>setSelected(index)} aria-label={'Ampliar: '+photo.title}><img src={photo.src} alt={photo.alt} loading="lazy"/><span><Camera size={16}/> Ampliar foto</span></button><figcaption>{photo.title}</figcaption></figure>)}</div><p className="small">Imágenes de las mejoras realizadas y de la entrega de artículos esenciales.</p><figure className="voice-message"><div className="voice-message-head"><span className="voice-message-icon"><Mic size={20}/></span><figcaption><strong>Un mensaje que nos llegó después de la entrega</strong><span>Mensaje de voz · 1:49</span></figcaption></div><audio controls preload="metadata" src="/audio/mensaje-agradecimiento.mp3">Tu navegador no puede reproducir este mensaje de voz.</audio></figure><Dialog open={selected!==null} onOpenChange={open=>{if(!open)setSelected(null);}}><DialogContent className="after-dialog" onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}if(e.key==='ArrowRight'){e.preventDefault();step(1)}}}><DialogTitle>{photos[current].title}</DialogTitle><DialogDescription>Casa 001 · Pacora · Después de la ayuda</DialogDescription><div className="after-photo after-enlarged"><img src={photos[current].src} alt={photos[current].alt}/></div><div className="after-controls"><button className="btn outline" onClick={()=>step(-1)}>Anterior</button><span>{current+1} de {photos.length}</span><button className="btn outline" onClick={()=>step(1)}>Siguiente</button></div></DialogContent></Dialog></section>;
}
