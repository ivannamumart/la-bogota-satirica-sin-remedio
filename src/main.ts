/** La Bogotá satírica de Sin remedio · Versión de reconstrucción cinematográfica.
 * La esfera es una cartografía especulativa, no una réplica métrica de Bogotá.
 * La distinción entre citas de la novela e interpretaciones se mantiene en los datos.
 */
import * as T from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {createPlanet,interpolateTrack,SITES,R,dir,type Site,type Track} from './world/planet';
import {character,type Person} from './world/people';
import {makeStage,type Stage} from './world/scenes';
import {DIALOGOS,type Linea} from './story/dialogues';
import './ui/styles.css';
const el=<E extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as E;
const mount=el<HTMLDivElement>('world'),subtitles=el('subtitles'),speaker=el('speaker'),subtitleText=el('subtitle-text'),source=el('source'),
 decisions=el('decisions'),choices=el('choices'),caption=el('place-caption'),hint=el('scene-hint'),veil=el('fade'),about=el('about');
const scene=new T.Scene();
const camera=new T.PerspectiveCamera(38,window.innerWidth/window.innerHeight,.10,260);
camera.position.set(0,11.1,40.5);camera.lookAt(0,0,0);
const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.55));
renderer.setClearColor(0xffffff,0);
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
mount.appendChild(renderer.domElement);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.dampingFactor=.055;orbit.enablePan=false;
orbit.minDistance=24;orbit.maxDistance=59;orbit.minPolarAngle=.18;orbit.maxPolarAngle=Math.PI-.15;orbit.rotateSpeed=.48;
orbit.autoRotate=true;orbit.autoRotateSpeed=.20;
const sky=new T.HemisphereLight(0xe7eeea,0x6a6c66,1.55);scene.add(sky);
const sun=new T.DirectionalLight(0xffe6c6,2.90);sun.position.set(27,31,22);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-31;sun.shadow.camera.right=31;sun.shadow.camera.top=31;sun.shadow.camera.bottom=-31;
sun.shadow.camera.near=.5;sun.shadow.camera.far=94;sun.shadow.bias=-.00045;scene.add(sun);
const bounce=new T.DirectionalLight(0x97c3ca,.65);bounce.position.set(-17,4,-20);scene.add(bounce);
// Estrellas en el hemisferio lejano; ciclo natural continuo en cinco minutos.
const starGeo=new T.BufferGeometry();const stars:number[]=[];let seed=23;
for(let i=0;i<680;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const z=seed/4294967296*2-1;
 seed=(Math.imul(seed,1664525)+1013904223)>>>0;const a=seed/4294967296*Math.PI*2;
 stars.push(108*Math.sqrt(1-z*z)*Math.sin(a),108*z,108*Math.sqrt(1-z*z)*Math.cos(a));}
starGeo.setAttribute('position',new T.Float32BufferAttribute(stars,3));
const starMat=new T.PointsMaterial({color:0xecead9,size:.64,transparent:true,opacity:0,depthWrite:false});scene.add(new T.Points(starGeo,starMat));
const {world,routes}=createPlanet();scene.add(world);
const hero=character('escobar',.45);world.add(hero.root);
type Mode='overview'|'walk'|'interior'|'transition';type Phase='arrival'|'canonical'|'choice'|'branch'|'complete';
let mode:Mode='overview',phase:Phase='arrival',stage:Stage|null=null,currentSite:Site|null=null;
let route:Track=routes[0],routeDistance=Math.min(1.0,routes[0].total*.20),facing=1;
let paused=false,lock=false,ignoreEntryUntil=0;let timeOfDay=74,stageTime=0,currentLine=-1,choiceIndex=-1;
const input=new Set<string>();let mobileForward=0,mobileSide=0,touchStart: {x:number;y:number}|null=null;
const keyset=['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift','escape','1','2','3','n'];
const getKey=(...keys:string[])=>keys.some(k=>input.has(k));
const originalActorPos=new WeakMap<Person,T.Vector3>();
let lastHeroPos=new T.Vector3(),lastHeroDir=new T.Vector3(0,0,1),lastNormal=new T.Vector3(0,1,0);
const classToggle=(node:HTMLElement,name:string,on:boolean)=>node.classList.toggle(name,on);
function updateHero(){
 const {pos,normal,tangent}=interpolateTrack(route,routeDistance);let f=tangent.multiplyScalar(facing);
 const right=new T.Vector3().crossVectors(normal,f).normalize();f=new T.Vector3().crossVectors(right,normal).normalize();
 hero.root.position.copy(pos).addScaledVector(normal,.035);
 const basis=new T.Matrix4().makeBasis(right,normal,f);hero.root.quaternion.setFromRotationMatrix(basis);
 lastHeroPos.copy(hero.root.position);lastNormal.copy(normal);lastHeroDir.copy(f);
}
updateHero();
const sideOptions=(siteId:number,desired:'left'|'right')=>{
 const edgeOptions=routes.filter(r=>r.from===siteId||r.to===siteId);
 const candidate=edgeOptions.find(r=>r.index>=11);
 return candidate&&desired==='left'?candidate:null;
};
function switchTrack(siteId:number,direction:1|-1){
 const branch=sideOptions(siteId,getKey('a','arrowleft')?'left':'right');
 let next:Track|undefined;
 if(branch)next=branch;
 if(!next)next=direction===1?routes[siteId%11]:routes[(siteId+10)%11];
 route=next;
 if(branch){facing=branch.from===siteId?1:-1;routeDistance=facing===1?0:route.total;}
 else{facing=1;routeDistance=direction===1?0:route.total;}
}
function labelFor(index:number){const site=SITES[index];if(!site)return;el('place-number').textContent=String(index+1).padStart(2,'0')+' / 12';el('place-name').textContent=site.name;}
function handleWalk(dt:number){
 const forward=(getKey('w','arrowup')?1:0)-(getKey('s','arrowdown')?1:0)+mobileForward;
 if(Math.abs(forward)<.10){hero.update(performance.now()/1000,false);return;}
 const speed=(getKey('shift')?5.25:3.70)*dt;
 const move=forward>0?1:-1;
 routeDistance+=speed*move*facing;
 const reachEnd=routeDistance>route.total,reachStart=routeDistance<0;
 if(reachEnd||reachStart){
   const index=reachEnd?route.to:route.from;
   routeDistance=reachEnd?route.total:0;
   const s=SITES[index];
   if(s?.scene&&performance.now()>ignoreEntryUntil){enter(s);return;}
   // El cruce permite avanzar por la red; A elige un atajo cuando existe.
   switchTrack(index,reachEnd?1:-1);
 }
 const angle=routeDistance/Math.max(1,route.total);
 // Puerta automática sin botón: el nodo final es la puerta del edificio.
 if(performance.now()>ignoreEntryUntil){
   for(let i=0;i<11;i++){
     const s=SITES[i];const dist=dir(s.lat,s.lon).angleTo(interpolateTrack(route,routeDistance).normal);
     if(dist<.022&&((route.from===i&&routeDistance<.22)||(route.to===i&&route.total-routeDistance<.22))){enter(s);return;}
   }
 }
 if(angle>.22&&angle<.78)classToggle(caption,'visible',false);
 hero.update(performance.now()/1000,true);
 updateHero();
}
function showCaption(item:Linea|null){if(!item){subtitles.classList.remove('active');subtitles.setAttribute('aria-hidden','true');return;}
 speaker.textContent=item.voz;
 subtitleText.textContent=item.texto;
 source.textContent=item.fuente?'SIN REMEDIO · '+item.fuente:'REINTERPRETACIÓN CONTEMPORÁNEA';
 classToggle(subtitles,'active',true);subtitles.setAttribute('aria-hidden','false');}
function showChoices(){if(!currentSite)return;const branch=DIALOGOS[currentSite.id].bifurcaciones;choices.replaceChildren();
 branch.forEach((b,i)=>{const button=document.createElement('button');button.type='button';const num=document.createElement('span');num.className='choice-num';num.textContent=String(i+1);
 const label=document.createElement('span');label.textContent=b.titulo;button.append(num,label);button.addEventListener('click',()=>choose(i));choices.append(button);});
 classToggle(decisions,'active',true);decisions.setAttribute('aria-hidden','false');
}
function hideChoices(){classToggle(decisions,'active',false);decisions.setAttribute('aria-hidden','true');choices.replaceChildren();}
function choose(i:number){if(phase!=='choice'||!currentSite)return;choiceIndex=i;phase='branch';stageTime=0;currentLine=-1;hideChoices();showCaption(null);}
function onScenePhase(next:Phase){phase=next;stageTime=0;currentLine=-1;
 if(next==='choice'){showCaption(null);showChoices();}
 if(next==='complete'){showCaption(null);hint.textContent='Retrocede hacia la salida o presiona ESC';classToggle(hint,'visible',true);}
}
function fadeTo(action:()=>void){if(lock)return;lock=true;mode='transition';classToggle(veil,'active',true);
 window.setTimeout(()=>{action();classToggle(veil,'active',false);window.setTimeout(()=>{lock=false},700);},690);
}
function enter(site:Site){if(lock||mode==='interior')return;
 fadeTo(()=>{
  currentSite=site;stage=makeStage(site.id);stage.root.name=`microrelato_${site.id}`;
  scene.add(stage.root);world.visible=false;world.remove(hero.root);scene.add(hero.root);
  hero.root.quaternion.identity();hero.root.rotation.y=Math.PI;hero.root.scale.setScalar(1.06);hero.root.position.copy(stage.heroStart);
  stage.actors.forEach((a,i)=>originalActorPos.set(a,a.root.position.clone()));
  labelFor(SITES.indexOf(site));classToggle(caption,'visible',true);
  orbit.enabled=false;orbit.autoRotate=false;camera.up.set(0,1,0);
  camera.position.set(1.0,3.4,10.7);camera.lookAt(0,1.5,-1.4);
  phase='arrival';stageTime=0;currentLine=-1;choiceIndex=-1;showCaption(null);hideChoices();classToggle(hint,'visible',false);
  mode='interior';
 });
}
function leave(){if(!stage||lock)return;
 fadeTo(()=>{
  scene.remove(stage!.root);stage=null;currentSite=null;scene.remove(hero.root);
  world.visible=true;world.add(hero.root);hero.root.scale.setScalar(.45);updateHero();
  mode='walk';ignoreEntryUntil=performance.now()+4000;showCaption(null);hideChoices();classToggle(hint,'visible',false);
  camera.position.copy(lastHeroPos).addScaledVector(lastNormal,2.2).addScaledVector(lastHeroDir,-5.0);
  camera.up.copy(lastNormal);camera.lookAt(lastHeroPos.clone().addScaledVector(lastNormal,.65));
 });
}
function updateInterior(dt:number,t:number){if(!stage||!currentSite)return;
 stageTime+=dt;
 const story=DIALOGOS[currentSite.id];
 if(phase==='arrival'){
   const step=T.MathUtils.smoothstep(stageTime,0,4.6);
   hero.root.position.z=T.MathUtils.lerp(stage.heroStart.z,1.6,step);
   hero.update(t,stageTime<4.1);
   if(stageTime>=4.6)onScenePhase('canonical');
 }else{
   hero.update(t,false);
   const f=(getKey('w','arrowup')?1:0)-(getKey('s','arrowdown')?1:0)+mobileForward;
   const s=(getKey('d','arrowright')?1:0)-(getKey('a','arrowleft')?1:0)+mobileSide;
   if(Math.abs(f)>.1||Math.abs(s)>.1){hero.root.position.z=T.MathUtils.clamp(hero.root.position.z-f*dt*2.0,-1.6,4.90);
     hero.root.position.x=T.MathUtils.clamp(hero.root.position.x+s*dt*1.9,-4.65,4.65);
     hero.update(t,true);
   }
   if(hero.root.position.z>4.65){leave();return;}
 }
 if(phase==='canonical'){
   const index=Math.floor(stageTime/4.8);
   if(index>=story.inicio.length)onScenePhase('choice');
   else if(index!==currentLine){currentLine=index;showCaption(story.inicio[index]);}
 }
 if(phase==='branch'&&choiceIndex>=0){
   const seq=story.bifurcaciones[choiceIndex].lineas;
   const index=Math.floor(stageTime/5.1);
   if(index>=seq.length)onScenePhase('complete');
   else if(index!==currentLine){currentLine=index;showCaption(seq[index]);}
 }
 stage.actors.forEach((actor,i)=>{
  const initial=originalActorPos.get(actor);
  if(initial){actor.root.position.copy(initial);
    actor.root.position.x+=Math.sin(t*.8+i*2.4)*.045;
    actor.root.rotation.y+=Math.sin(t*.21+i*3)*.002;
  }
  actor.update(t,false,(phase==='canonical'&&i===currentLine%stage!.actors.length)?1.35:1);
 });
}
function followCamera(dt:number,t:number){
 if(mode==='overview'){orbit.update();return;}
 if(mode==='walk'){
  const p=lastHeroPos.clone(),normal=lastNormal.clone();
  const desired=p.addScaledVector(normal,2.25).addScaledVector(lastHeroDir,-4.45);
  const gaze=lastHeroPos.clone().addScaledVector(normal,.75).addScaledVector(lastHeroDir,1.32);
  camera.position.lerp(desired,1-Math.exp(-dt*2.8));
  camera.up.lerp(normal,1-Math.exp(-dt*3.1)).normalize();camera.lookAt(gaze);
 }else if(mode==='interior'&&stage){
  const actor=stage.actors.length?stage.actors[Math.max(0,currentLine)%stage.actors.length]:null;
  const dramatic=phase==='canonical'||phase==='branch';
  const desiredX=dramatic&&actor?1.25+actor.root.position.x*.19:Math.sin(t*.24)*.95;
  const desired=new T.Vector3(desiredX,3.65+Math.sin(t*.31)*.06,dramatic?8.6:10.4);
  const aim=new T.Vector3(dramatic&&actor?actor.root.position.x*.38:0,1.62,-.9);
  camera.position.lerp(desired,1-Math.exp(-dt*1.75));camera.up.set(0,1,0);camera.lookAt(aim);
 }
}
function toOverview(){if(mode==='interior'){leave();return;}
 mode='overview';orbit.enabled=true;orbit.autoRotate=true;orbit.target.set(0,0,0);
 camera.up.set(0,1,0);camera.position.set(0,11.1,40.5);camera.lookAt(0,0,0);orbit.update();classToggle(caption,'visible',false);
}
function beginWalking(){if(mode!=='overview')return;mode='walk';orbit.enabled=false;orbit.autoRotate=false;
 camera.up.copy(lastNormal);classToggle(caption,'visible',false);
}
// Momento del día: un ciclo completo cada cinco minutos, sin controles que ensucien la pantalla.
function dayNight(dt:number){timeOfDay+=dt;const phase=(timeOfDay%300)/300;
 const altitude=Math.sin(phase*2*Math.PI+.1),daylight=T.MathUtils.smoothstep(altitude,-.25,.60);
 sun.position.set(Math.cos(phase*2*Math.PI)*29,30*altitude,Math.sin(phase*2*Math.PI)*29);
 sun.intensity=.27+3.0*daylight;
 sun.color.setRGB(1,.78+.20*daylight,.61+.34*daylight);
 sky.intensity=.25+1.34*daylight;bounce.intensity=.23+.52*daylight;
 starMat.opacity=Math.pow(1-daylight,2)*.83;
 const dayTop=new T.Color(0xdde9e3),nightTop=new T.Color(0x122439),dayBottom=new T.Color(0xf2e6d8),nightBottom=new T.Color(0x293646);
 const top=nightTop.lerp(dayTop,daylight),bottom=nightBottom.lerp(dayBottom,daylight);
 document.documentElement.style.setProperty('--sky-top','#'+top.getHexString());document.documentElement.style.setProperty('--sky-bottom','#'+bottom.getHexString());
 renderer.toneMappingExposure=.80+daylight*.30;
 document.body.classList.toggle('night',daylight<.25);
}
let last=performance.now();let elapsed=0;
function tick(now:number){requestAnimationFrame(tick);
 const dt=Math.min((now-last)/1000,.046);last=now;elapsed+=dt;
 if(!paused){dayNight(dt);
  if(mode==='walk')handleWalk(dt);
  else if(mode==='overview')hero.update(elapsed,false);
  else if(mode==='interior')updateInterior(dt,elapsed);
  followCamera(dt,elapsed);
 }
 renderer.render(scene,camera);
}
window.addEventListener('resize',()=>{
 camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.55));
});
window.addEventListener('keydown',(event)=>{
 const key=event.key.toLowerCase();if(keyset.includes(key))event.preventDefault();input.add(key);
 if(event.repeat)return;
 if(key==='escape'){if(about.classList.contains('open'))closeAbout();else if(mode==='interior')leave();else toOverview();}
 if(key==='n')timeOfDay+=75;
 if(mode==='overview'&&['w','arrowup','s','arrowdown'].includes(key))beginWalking();
 if(phase==='choice'&&mode==='interior'&&['1','2','3'].includes(key))choose(Number(key)-1);
});
window.addEventListener('keyup',e=>input.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>input.clear());
renderer.domElement.addEventListener('pointerdown',e=>{
 if(e.pointerType!=='touch'||mode==='transition'||paused)return;
 if(mode==='overview'&&e.detail>=2)beginWalking();
 if(mode==='walk'||mode==='interior'){touchStart={x:e.clientX,y:e.clientY};mobileForward=0;mobileSide=0;}
});
renderer.domElement.addEventListener('pointermove',e=>{
 if(!touchStart)return;mobileForward=T.MathUtils.clamp((touchStart.y-e.clientY)/85,-1,1);
 mobileSide=T.MathUtils.clamp((e.clientX-touchStart.x)/95,-1,1);
});
const release=()=>{touchStart=null;mobileForward=0;mobileSide=0};
renderer.domElement.addEventListener('pointerup',release);renderer.domElement.addEventListener('pointercancel',release);
el('center').addEventListener('click',toOverview);
function openAbout(){paused=true;about.classList.add('open');about.setAttribute('aria-hidden','false');}
function closeAbout(){paused=false;about.classList.remove('open');about.setAttribute('aria-hidden','true');}
el('moon').addEventListener('click',openAbout);el('about-close').addEventListener('click',closeAbout);
el('retry').addEventListener('click',()=>location.reload());
// Recurso de pruebas manuales: N acelera 1/4 de ciclo; espacio omite diálogos sin añadir interfaz.
window.addEventListener('keydown',e=>{if(e.code==='Space'&&mode==='interior'){
 e.preventDefault();if(phase==='arrival')onScenePhase('canonical');else if(phase==='canonical')stageTime+=4.9;
 else if(phase==='branch')stageTime+=5.2;
 }});
// API limitada para pruebas automáticas: evita acceder a objetos privados del motor.
Object.defineProperty(window,'__BOGOTA_TEST__',{value:{getState:()=>({mode,phase,site:currentSite?.id||null,route:route.index,progress:routeDistance,timeOfDay}),enterSite:(id:PlaceId)=>{const s=SITES.find(s=>s.id===id);if(s&&s.scene)enter(s)},walk:beginWalking,jumpDay:()=>{timeOfDay+=75}}});
window.setTimeout(()=>el('loader').classList.add('hidden'),650);
requestAnimationFrame(tick);
