"use client";
import {useEffect,useRef,useState} from 'react';
import {Camera,CheckCircle2,Fan,Hammer,Heart,House,Lightbulb,MapPin,Share2} from 'lucide-react';
import {Progress} from '@/components/ui/progress';
import {Slider} from '@/components/ui/slider';
import {Tabs,TabsContent,TabsList,TabsTrigger} from '@/components/ui/tabs';

const photos=['IMG_4592.jpeg','IMG_4591.jpeg','IMG_4589.jpeg','IMG_4590.jpeg'];
const photoNames=['Cocina','Área de lavado','Descanso','Interiores'];

export function HeroGallery({onPhoto}:{onPhoto:(index:number)=>void}){
 const [active,setActive]=useState(0);
 return <div className="hero-image interactive-hero"><img key={active} src={'/photos/'+photos[active]} alt={'Antes de las mejoras en Pacora: '+photoNames[active]}/><span className="photo-label"><MapPin size={15}/> PACORA, PANAMÁ</span><span className="hero-photo-index" aria-live="polite">{active+1} / 4</span><div className="image-caption"><span>UNA FAMILIA DE 15 PERSONAS</span><p>La ayuda ya llegó a Pacora.</p><button onClick={()=>onPhoto(active)}><Camera size={18}/> Ampliar foto del antes</button><div className="hero-thumbnails" aria-label="Explorar fotografías del antes">{photos.map((photo,i)=><button key={photo} className={i===active?'is-selected':''} aria-pressed={i===active} aria-label={'Ver '+photoNames[i]} onClick={()=>setActive(i)}><img src={'/photos/'+photo} alt=""/><span>{photoNames[i]}</span></button>)}</div></div></div>;
}

export function PacoraGoal({compact=false}:{compact?:boolean}){
 const ref=useRef<HTMLDivElement>(null);const [visible,setVisible]=useState(false);const [count,setCount]=useState(4234);
 useEffect(()=>{const node=ref.current;if(!node)return;let frame=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)return;setVisible(true);observer.disconnect();if(reduced)return;const start=performance.now();const tick=(now:number)=>{const p=Math.min((now-start)/1000,1);setCount(Math.round(4234*(1-Math.pow(1-p,3))));if(p<1)frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);},{threshold:0.25});observer.observe(node);return()=>{observer.disconnect();cancelAnimationFrame(frame);};},[]);
 return <div ref={ref} className={'pacora-goal '+(compact?'goal-compact':'')}><div className="goal-topline"><span><CheckCircle2 size={18}/> Nuestra meta</span><span className="goal-bonus">¡Meta alcanzada!</span></div>{!compact&&<><strong className="goal-total" aria-label="4,234 dólares recaudados"><span aria-hidden="true">${count.toLocaleString('en-US')}</span><small>recaudados para Pacora</small></strong><p>Con el sorteo de unos AirPods Pro recaudamos $4,234 y alcanzamos el 100% de nuestra meta. ¡Gracias a cada persona que compró un boleto!</p></>}<Progress className={'campaign-progress '+(visible?'progress-visible':'')} value={100} aria-label="Meta de Pacora recaudada al 100%"/><div className="goal-scale"><span>Meta: $4,234 · 177 boletos de $24</span><strong>100%</strong></div></div>;
}

const improvements=[
 {id:'pisos',label:'Pisos',icon:Hammer,title:'Un piso para este hogar.',description:'La casa tenía piso de tierra. Con los aportes recibidos instalamos pisos para mejorar los espacios que comparte esta familia de 15 personas.',result:'Pisos instalados',photo:3},
 {id:'luz',label:'Luz',icon:Lightbulb,title:'Electricidad e iluminación.',description:'La familia no contaba con luz ni electricidad. Instalamos electricidad e iluminación como parte de la ayuda entregada en Pacora.',result:'Electricidad e iluminación instaladas',photo:1},
 {id:'aire',label:'Ventiladores',icon:Fan,title:'Ventiladores para la casa.',description:'También instalamos ventiladores. Cada mejora respondió a necesidades del hogar y se hizo posible con los aportes de nuestra comunidad.',result:'Ventiladores instalados',photo:2},
 {id:'hogar',label:'Hogar',icon:House,title:'Ayuda para el día a día.',description:'Además de las mejoras en la vivienda, entregamos artículos para el hogar. Gracias a quienes aportaron para acompañar a esta familia, incluidos sus dos bebés con discapacidad.',result:'Artículos para el hogar entregados',photo:0},
];
export function ImprovementExplorer({onPhoto}:{onPhoto:(index:number)=>void}){
 return <div className="improvement-explorer"><h3>Explora lo que logramos juntos</h3><p className="explorer-hint">Elige una mejora para conocer cómo ayudamos.</p><Tabs defaultValue="pisos"><TabsList className="improvement-tabs" aria-label="Mejoras realizadas en Pacora">{improvements.map(item=><TabsTrigger key={item.id} value={item.id}><item.icon size={19}/><span>{item.label}</span></TabsTrigger>)}</TabsList>{improvements.map(item=><TabsContent className="improvement-panel" key={item.id} value={item.id}><button className="improvement-photo" onClick={()=>onPhoto(item.photo)} aria-label={'Ampliar foto del antes: '+photoNames[item.photo]}><img src={'/photos/'+photos[item.photo]} alt={'Antes de las mejoras: '+photoNames[item.photo]} loading="lazy"/><span><Camera size={14}/> Foto del antes</span></button><div className="improvement-copy"><span className="eyebrow">AYUDA ENTREGADA</span><h4>{item.title}</h4><p>{item.description}</p><span className="improvement-done"><CheckCircle2 size={17}/>{item.result}</span></div></TabsContent>)}</Tabs><p className="small">Estas fotos muestran cómo estaba la casa antes de recibir la ayuda. Arriba puedes ver las imágenes del después.</p></div>;
}

export function ContributionPicker({amount,onAmount,onDonate}:{amount:string;onAmount:(value:string)=>void;onDonate:()=>void}){
 const pickerRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{const thumb=pickerRef.current?.querySelector('[role="slider"]');thumb?.setAttribute('aria-label','Monto del aporte en dólares, de 1 a 250');},[]);
 const value=Number(amount);const valid=Number.isFinite(value)&&value>=1&&value<=1000000&&Math.abs(Math.round(value*100)-value*100)<0.00001;
 return <div className="contribution-picker" ref={pickerRef}><div className="amounts" aria-label="Selecciona tu aporte">{['10','25','50','100'].map(a=><button key={a} className={amount===a?'selected':''} aria-pressed={amount===a} onClick={()=>onAmount(a)}>${a}</button>)}</div><label className="slider-label" id="contribution-range-label">Desliza para elegir tu aporte</label><Slider className="contribution-slider" aria-labelledby="contribution-range-label" min={1} max={250} step={1} value={[Math.min(250,Math.max(1,value||1))]} onValueChange={v=>onAmount(String(v[0]))}/><div className="slider-scale"><span>$1</span><span>$250</span></div><label className="amount-label">O escribe otro monto (USD)<input type="number" min="1" max="1000000" step="0.01" value={amount} onChange={e=>onAmount(e.target.value)}/></label><div className="contribution-summary" aria-live="polite"><Heart size={20}/><div><strong>{valid?'Tu aporte: $'+value.toLocaleString('en-US',{maximumFractionDigits:2}):'Elige un monto desde $1'}</strong><span>Para la próxima casa</span></div></div><button className="btn full" disabled={!valid} onClick={onDonate}>Aportar por Yappy</button></div>;
}

export function MobileContribution({hidden,onDonate,onShare}:{hidden:boolean;onDonate:()=>void;onShare:()=>void}){
 const [visible,setVisible]=useState(false);
 useEffect(()=>{const hero=document.querySelector('.hero');if(!hero)return;const observer=new IntersectionObserver(entries=>setVisible(!entries[0].isIntersecting&&entries[0].boundingClientRect.bottom<0));observer.observe(hero);return()=>observer.disconnect();},[]);
 if(hidden||!visible)return null;
 return <div className="mobile-contribution"><div><strong>La próxima casa.</strong><span>Tu aporte puede sumarse.</span></div><button className="mobile-share" aria-label="Compartir la campaña" onClick={onShare}><Share2 size={20}/></button><button className="btn compact" onClick={onDonate}><Heart size={17}/> Ayudar</button></div>;
}
