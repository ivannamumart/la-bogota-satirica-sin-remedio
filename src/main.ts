/** LA BOGOTÁ SATÍRICA DE SIN REMEDIO · V04
 * Cartografía especulativa de Bogotá, 1972. Modelo de esfera con ciudad únicamente arriba.
 * Navegación por red vial, entrada automática al alcanzar el umbral; microescenas 3D.
 */
import * as T from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {createPlanet,interpolateTrack,SITES,R,type Site,type Track} from './world/planet';
import {NODES,type PlaceId} from './data/layout';
import {character,type Person} from './world/people';
import {makeStage,type Stage} from './world/scenes';
import {DIALOGOS,type Linea} from './story/dialogues';
import './ui/styles.css';
const el=<E extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as E;
const mount=el('world'),subtitles=el('subtitles'),speaker=el('speaker'),subtitleText=el('subtitle-text'),source=el('source'),decisions=el('decisions'),choices=el('choices'),caption=el('place-caption'),hint=el('scene-hint'),veil=el('fade'),about=el('about'),roadHint=el('road-hint');
const scene=new T.Scene(),camera=new T.PerspectiveCamera(37,window.innerWidth/window.innerHeight,.10,260);
const targetOverview=new T.Vector3(0,4.5,0);
camera.position.set(0,36,46);camera.lookAt(targetOverview);
const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setSize(window.innerWidth,window.innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.35));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.13;renderer.shadowMap.enabled=false;mount.appendChild(renderer.domElement);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.target.copy(targetOverview);orbit.enablePan=false;orbit.enableDamping=true;orbit.dampingFactor=.065;orbit.minDistance=25;orbit.maxDistance=64;orbit.maxPolarAngle=Math.PI*.67;orbit.minPolarAngle=.11;orbit.rotateSpeed=.46;orbit.autoRotate=true;orbit.autoRotateSpeed=.20;
const sky=new T.HemisphereLight(0xe9f3ee,0x686b6a,2.05);scene.add(sky);
const sun=new T.DirectionalLight(0xffedcf,3.6);sun.position.set(-20,35,25);scene.add(sun);
const fill=new T.DirectionalLight(0x95b4b3,1.0);fill.position.set(15,8,-18);scene.add(fill);
const starPos:number[]=[];let seed=1729;for(let i=0;i<550;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=seed/4294967296*2-1;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const a=seed/4294967296*Math.PI*2;starPos.push(105*Math.sqrt(1-y*y)*Math.cos(a),105*y,105*Math.sqrt(1-y*y)*Math.sin(a))}
const starGeo=new T.BufferGeometry();starGeo.setAttribute('position',new T.Float32BufferAttribute(starPos,3));const starMat=new T.PointsMaterial({color:0xf6f6e8,size:.55,opacity:0,transparent:true,depthWrite:false});scene.add(new T.Points(starGeo,starMat));
const {world,routes}=createPlanet();scene.add(world);
const hero=character('escobar',.50);world.add(hero.root);
type Mode='overview'|'walk'|'interior'|'transition';type Phase='arrival'|'canonical'|'choice'|'branch'|'complete';
let mode:Mode='overview',phase:Phase='arrival',stage:Stage|null=null,currentSite:Site|null=null,lock=false,paused=false;
let track:Track=routes.find(r=>NODES[r.from].id==='s1'&&NODES[r.to].id==='s2')??routes[0],distance=1.6,direction:1|-1=1;
let selection=0,choiceIndex=-1,stageTime=0,currentLine=-1,timeOfDay=55,ignoreEntryUntil=0;
let lastHeroPos=new T.Vector3(),lastHeroDir=new T.Vector3(0,0,1);
const keys=new Set<string>(),mobile={forward:0,turn:0},originalActorPos=new WeakMap<Person,T.Vector3>(),originalActorRot=new WeakMap<Person,number>();
const getKey=(...keys0:string[])=>keys0.some(k=>keys.has(k));
const classToggle=(node:HTMLElement,name:string,on:boolean)=>node.classList.toggle(name,on);
const routeAt=(track:Track,d:number,dir:1|-1)=>{const s=interpolateTrack(track,d);const f=s.tangent.multiplyScalar(dir).setY(0).normalize();return {pos:s.pos,forward:f}};
function positionHero(){const s=routeAt(track,distance,direction);hero.root.position.copy(s.pos).add(new T.Vector3(0,.09,0));hero.root.rotation.set(0,Math.atan2(s.forward.x,s.forward.z),0);lastHeroPos.copy(hero.root.position);lastHeroDir.copy(s.forward)}
positionHero();
const outgoing=(node:number,exclude=-1)=>routes.filter(e=>(e.from===node||e.to===node)&&e.index!==exclude);
const outward=(e:Track,node:number)=>e.from===node?e.startDir.clone():e.endDir.clone().multiplyScalar(-1);
function optionsAt(node:number,inbound:T.Vector3,previousIndex:number){return outgoing(node,previousIndex).sort((a,b)=>{
  // Mantener la continuidad de marcha por defecto; las teclas A/D permiten desviarse.
  const score=(e:Track)=>inbound.clone().dot(outward(e,node));return score(b)-score(a);
})}
function upcoming(){return direction>0?track.to:track.from}
function nearCrossroads(){return direction>0?track.total-distance<1.35:distance<1.35}
function showRoadHint(){if(mode!=='walk'||!nearCrossroads()){roadHint.classList.remove('visible');return}
 const node=upcoming(),others=optionsAt(node,lastHeroDir,track.index);if(!others.length){roadHint.classList.remove('visible');return}
 const chosen=others[selection%others.length];const target=NODES[chosen.from===node?chosen.to:chosen.from];
 roadHint.textContent=`A / D  ·  ${target.label||target.entry?.replaceAll('_',' ')||'DESVÍO'}  ·  W AVANZAR`;
 roadHint.classList.add('visible')}
function continueFrom(node:number,inbound:T.Vector3){const candidates=optionsAt(node,inbound,track.index);
 if(!candidates.length){direction=direction===1?-1:1;distance=direction===1?0:track.total;return}
 const chosen=candidates[selection%candidates.length];track=chosen;direction=track.from===node?1:-1;distance=direction===1?.09:track.total-.09;selection=0;
}
function handleWalk(dt:number,t:number){const forward=(getKey('w','arrowup')?1:0)-(getKey('s','arrowdown')?1:0)+mobile.forward;
 if(Math.abs(forward)<.12){hero.update(t,false);showRoadHint();return}
 const step=Math.sign(forward),fast=getKey('shift')?6.3:4.15;
 const next=distance+step*direction*Math.min(.16,dt*fast);distance=T.MathUtils.clamp(next,0,track.total);
 const atNode=step*direction>0?distance>=track.total-.01:distance<=.01;
 if(atNode){const node=step*direction>0?track.to:track.from,n=NODES[node];
   if(n.entry&&performance.now()>ignoreEntryUntil){const site=SITES.find(s=>s.id===n.entry);if(site&&site.scene){positionHero();enter(site);return}}
   // Reverse con S; marcha hacia delante W conserva continuidad viaria.
   const incoming=outward(track,node).multiplyScalar(-1);
   continueFrom(node,incoming);selection=0;
 }
 positionHero();hero.update(t,true);showRoadHint();
}
function turn(delta:number){if(mode!=='walk')return;const candidates=optionsAt(upcoming(),lastHeroDir,track.index);if(candidates.length>1)selection=(selection+delta+candidates.length)%candidates.length;showRoadHint()}
function showCaption(item:Linea|null){if(!item){subtitles.classList.remove('active');subtitles.setAttribute('aria-hidden','true');return}speaker.textContent=item.voz;subtitleText.textContent=item.texto;source.textContent=item.fuente?'SIN REMEDIO · '+item.fuente:'ESCENA INTERPRETATIVA';subtitles.classList.add('active');subtitles.setAttribute('aria-hidden','false')}
function showChoices(){if(!currentSite)return;choices.replaceChildren();DIALOGOS[currentSite.id].bifurcaciones.forEach((b,i)=>{const button=document.createElement('button');button.type='button';const num=document.createElement('span');num.className='choice-num';num.textContent=String(i+1);const label=document.createElement('span');label.textContent=b.titulo;button.append(num,label);button.addEventListener('click',()=>choose(i));choices.append(button)});decisions.classList.add('active');decisions.setAttribute('aria-hidden','false')}
function hideChoices(){decisions.classList.remove('active');decisions.setAttribute('aria-hidden','true');choices.replaceChildren()}
function choose(i:number){if(phase!=='choice'||!currentSite)return;choiceIndex=i;phase='branch';stageTime=0;currentLine=-1;hideChoices();showCaption(null)}
function changePhase(next:Phase){phase=next;stageTime=0;currentLine=-1;if(next==='choice'){showCaption(null);showChoices()}if(next==='complete'){showCaption(null);hint.textContent='RETROCEDE HACIA LA PUERTA O PULSA ESC';hint.classList.add('visible')}}
function fadeTo(action:()=>void){if(lock)return;lock=true;mode='transition';veil.classList.add('active');window.setTimeout(()=>{action();veil.classList.remove('active');window.setTimeout(()=>{lock=false},680)},650)}
function showSiteCaption(s:Site){el('place-number').textContent=String(SITES.indexOf(s)+1).padStart(2,'0')+' / 12';el('place-name').textContent=s.name;caption.classList.add('visible')}
function enter(site:Site){if(lock||mode==='interior')return;roadHint.classList.remove('visible');fadeTo(()=>{
 currentSite=site;stage=makeStage(site.id);scene.add(stage.root);world.visible=false;world.remove(hero.root);scene.add(hero.root);
 hero.root.quaternion.identity();hero.root.rotation.y=Math.PI;hero.root.scale.setScalar(1.08);hero.root.position.copy(stage.heroStart);
 stage.actors.forEach(a=>{originalActorPos.set(a,a.root.position.clone());originalActorRot.set(a,a.root.rotation.y)});
 showSiteCaption(site);orbit.enabled=false;orbit.autoRotate=false;camera.up.set(0,1,0);camera.position.set(1.0,3.5,10.5);camera.lookAt(0,1.5,-1.4);
 phase='arrival';stageTime=0;currentLine=-1;choiceIndex=-1;showCaption(null);hideChoices();hint.classList.remove('visible');mode='interior';
 })}
function leave(){if(!stage||lock)return;fadeTo(()=>{
 scene.remove(stage!.root);stage=null;currentSite=null;scene.remove(hero.root);world.visible=true;world.add(hero.root);hero.root.scale.setScalar(.50);
 const node=direction===1?track.to:track.from;distance=direction===1?Math.max(0,track.total-.7):Math.min(track.total,.7);
 // Al salir, caminar hacia atrás permite alejarse de la puerta antes del próximo ingreso.
 direction=direction===1?-1:1;positionHero();mode='walk';ignoreEntryUntil=performance.now()+2500;
 showCaption(null);hideChoices();hint.classList.remove('visible');camera.position.copy(lastHeroPos).add(new T.Vector3(0,3.9,5.4));camera.up.set(0,1,0);camera.lookAt(lastHeroPos.clone().add(new T.Vector3(0,1,0)));
 })}
function updateInterior(dt:number,t:number,wallDt:number){if(!stage||!currentSite)return;stageTime+=wallDt;
 const story=DIALOGOS[currentSite.id];if(phase==='arrival'){
  const step=T.MathUtils.smoothstep(stageTime,0,4.3);hero.root.position.z=T.MathUtils.lerp(stage.heroStart.z,1.6,step);hero.update(t,stageTime<4);if(stageTime>=4.3)changePhase('canonical');
 }else{
  hero.update(t,false);
  const f=(getKey('w','arrowup')?1:0)-(getKey('s','arrowdown')?1:0)+mobile.forward;
  const s=(getKey('d','arrowright')?1:0)-(getKey('a','arrowleft')?1:0)+mobile.turn;
  if(Math.abs(f)>.08||Math.abs(s)>.08){hero.root.position.z=T.MathUtils.clamp(hero.root.position.z-f*dt*1.9,-1.8,4.94);hero.root.position.x=T.MathUtils.clamp(hero.root.position.x+s*dt*1.5,-4.5,4.5);hero.update(t,true)}
  if(hero.root.position.z>4.70){leave();return}
 }
 if(phase==='canonical'){const i=Math.floor(stageTime/4.6);if(i>=story.inicio.length)changePhase('choice');else if(i!==currentLine){currentLine=i;showCaption(story.inicio[i])}}
 if(phase==='branch'&&choiceIndex>=0){const lines=story.bifurcaciones[choiceIndex].lineas,i=Math.floor(stageTime/5.0);if(i>=lines.length)changePhase('complete');else if(i!==currentLine){currentLine=i;showCaption(lines[i])}}
 // Expresiones y microcoreografías, visibles incluso sin subtítulos.
 stage.actors.forEach((actor,i)=>{
  const pos=originalActorPos.get(actor);if(!pos)return;actor.root.position.copy(pos);let move=false,angle=originalActorRot.get(actor)??0;
  if(currentSite?.id==='apartamento'&&i===0){actor.root.position.x+=Math.sin(t*.64)*.66;angle=-Math.sin(t*.64)*.45;move=true}
  if(currentSite?.id==='unicornio'&&i===0){actor.root.position.x+=Math.sin(t*.93)*.85;actor.root.position.z+=Math.cos(t*.93)*.33;angle=Math.sin(t*.93)*1.0;move=true}
  if(currentSite?.id==='taller'&&i===0){angle+=.28*Math.sin(t*.70)}
  if(currentSite?.id==='parque'&&i===0){actor.root.position.x+=Math.sin(t*.55)*.65;move=true}
  if(currentSite?.id==='oasis'&&i===1){actor.root.position.z+=Math.sin(t*.49)*.25}
  if(currentSite?.id==='septima'){actor.root.position.z+=Math.sin(t*.48+i)*.69;move=true}
  actor.root.rotation.y=angle;actor.update(t,move,1.2)
 });
}
function followCamera(dt:number,t:number){if(mode==='overview'){orbit.update();return}
 if(mode==='walk'){
  const desired=lastHeroPos.clone().addScaledVector(lastHeroDir,-3.8).add(new T.Vector3(0,5.2,0));
  const focus=lastHeroPos.clone().addScaledVector(lastHeroDir,1.45).add(new T.Vector3(0,1.05,0));
  camera.position.lerp(desired,1-Math.exp(-dt*2.25));camera.up.lerp(new T.Vector3(0,1,0),1-Math.exp(-dt*3.5)).normalize();camera.lookAt(focus);
 }else if(mode==='interior'&&stage){
  const actor=stage.actors.length?stage.actors[Math.max(0,currentLine)%stage.actors.length]:null;const cinematic=phase==='canonical'||phase==='branch';
  const desired=new T.Vector3(cinematic&&actor?1.20+actor.root.position.x*.23:Math.sin(t*.22)*.85,3.48+Math.sin(t*.30)*.08,cinematic?8.70:10.45);
  const aim=new T.Vector3(cinematic&&actor?actor.root.position.x*.32:0,1.62,-.80);
  camera.position.lerp(desired,1-Math.exp(-dt*1.7));camera.up.set(0,1,0);camera.lookAt(aim)
 }
}
function toOverview(){if(mode==='interior'){leave();return}mode='overview';orbit.enabled=true;orbit.autoRotate=true;orbit.target.copy(targetOverview);camera.position.set(0,36,46);camera.up.set(0,1,0);camera.lookAt(targetOverview);orbit.update();caption.classList.remove('visible');roadHint.classList.remove('visible')}
function beginWalking(){if(mode!=='overview')return;mode='walk';orbit.enabled=false;orbit.autoRotate=false;camera.position.copy(lastHeroPos).addScaledVector(lastHeroDir,-3.8).add(new T.Vector3(0,5.2,0));camera.up.set(0,1,0);camera.lookAt(lastHeroPos);caption.classList.remove('visible')}
function dayNight(dt:number){timeOfDay+=dt;const p=(timeOfDay%300)/300;const alt=Math.sin(p*2*Math.PI+.45),daylight=T.MathUtils.smoothstep(alt,-.20,.65),golden=Math.pow(1-Math.abs(alt-.08),4);
 sun.position.set(31*Math.cos(p*2*Math.PI),25*alt,28*Math.sin(p*2*Math.PI));sun.intensity=.48+3.0*daylight;sun.color.setRGB(1,.75+.21*daylight,.61+.34*daylight);
 sky.intensity=.68+1.25*daylight;fill.intensity=.40+.54*daylight;starMat.opacity=Math.pow(1-daylight,2)*.80;
 const top=new T.Color(0x27364b).lerp(new T.Color(0xdce9e5),daylight),bot=new T.Color(0x37475a).lerp(new T.Color(0xf2e7dc),daylight);top.lerp(new T.Color(0xd0b5a7),golden*.1);bot.lerp(new T.Color(0xe5c2a0),golden*.2);
 document.documentElement.style.setProperty('--sky-top','#'+top.getHexString());document.documentElement.style.setProperty('--sky-bottom','#'+bot.getHexString());renderer.toneMappingExposure=.95+daylight*.16;document.body.classList.toggle('night',daylight<.24)
}
let last=performance.now(),elapsed=0;function tick(now:number){requestAnimationFrame(tick);const wall=Math.min((now-last)/1000,2.5),dt=Math.min(wall,.050);last=now;elapsed+=wall;
 if(!paused){dayNight(wall);if(mode==='walk')handleWalk(dt,elapsed);else if(mode==='overview')hero.update(elapsed,false);else if(mode==='interior')updateInterior(dt,elapsed,wall);followCamera(dt,elapsed)}
 renderer.render(scene,camera)
}
window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.35))});
window.addEventListener('keydown',e=>{
 const key=e.key.toLowerCase();if(['w','s','a','d','arrowup','arrowdown','arrowleft','arrowright','shift','escape','1','2','3','n',' '].includes(key))e.preventDefault();keys.add(key);if(e.repeat)return;
 if(key==='escape'){if(about.classList.contains('open'))closeAbout();else if(mode==='interior')leave();else toOverview()}
 if(key==='n')timeOfDay+=75;
 if(mode==='overview'&&['w','s','arrowup','arrowdown'].includes(key))beginWalking();
 if(mode==='walk'&&['a','arrowleft'].includes(key))turn(-1);if(mode==='walk'&&['d','arrowright'].includes(key))turn(1);
 if(phase==='choice'&&mode==='interior'&&['1','2','3'].includes(key))choose(Number(key)-1);
 if(e.code==='Space'&&mode==='interior'){if(phase==='arrival')changePhase('canonical');else if(phase==='canonical')stageTime+=4.75;else if(phase==='branch')stageTime+=5.1}
});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
let touchStart:{x:number;y:number}|null=null;renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||paused)return;if(mode==='overview'&&e.detail>=2)beginWalking();if(mode==='walk'||mode==='interior')touchStart={x:e.clientX,y:e.clientY}});
renderer.domElement.addEventListener('pointermove',e=>{if(!touchStart)return;mobile.forward=T.MathUtils.clamp((touchStart.y-e.clientY)/90,-1,1);mobile.turn=T.MathUtils.clamp((e.clientX-touchStart.x)/90,-1,1)});
const release=()=>{touchStart=null;mobile.forward=mobile.turn=0};renderer.domElement.addEventListener('pointerup',release);renderer.domElement.addEventListener('pointercancel',release);
el('center').addEventListener('click',toOverview);function openAbout(){paused=true;about.classList.add('open');about.setAttribute('aria-hidden','false')}function closeAbout(){paused=false;about.classList.remove('open');about.setAttribute('aria-hidden','true')}
el('moon').addEventListener('click',openAbout);el('about-close').addEventListener('click',closeAbout);el('retry').addEventListener('click',()=>location.reload());
Object.defineProperty(window,'__BOGOTA_TEST__',{
 value:{
   getState:()=>({mode,phase,site:currentSite?.id||null,route:track.index,distance,timeOfDay,worldObjects:world.children.length}),
   enterSite:(id:PlaceId)=>{const s=SITES.find(s=>s.id===id);if(s?.scene)enter(s);},
   walk:beginWalking,
   jumpDay:()=>{timeOfDay+=75;},
   setRoad:(id:string)=>{const node=NODES.findIndex(n=>n.id===id);const r=routes.find(r=>r.from===node||r.to===node);if(r){track=r;direction=r.from===node?1:-1;distance=direction===1?.1:r.total-.1;positionHero();}}
 }
});
window.setTimeout(()=>el('loader').classList.add('hidden'),1050);requestAnimationFrame(tick);
