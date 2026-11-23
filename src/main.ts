/** LA BOGOTÁ SATÍRICA DE SIN REMEDIO · V06
 * Cartografía especulativa de Bogotá, 1972. Modelo de esfera con ciudad únicamente arriba.
 * Navegación por red vial, entrada automática al alcanzar el umbral; microescenas 3D.
 */
import * as T from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {createPlanet,interpolateTrack,SITES,R,type Site,type Track} from './world/planet';
import {NODES,type PlaceId} from './data/layout';
import {character,type Person} from './world/people';
import {makeStage,type Stage} from './world/scenes';
import {DIALOGOS,CONTEXTOS} from './story/expanded';
import type {Linea} from './story/dialogues';
import './ui/styles.css';
const el=<E extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as E;
const mount=el('world'),subtitles=el('subtitles'),speaker=el('speaker'),subtitleText=el('subtitle-text'),source=el('source'),decisions=el('decisions'),choices=el('choices'),caption=el('place-caption'),hint=el('scene-hint'),veil=el('fade'),about=el('about'),roadHint=el('road-hint');
const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,window.innerWidth/window.innerHeight,.10,260);
const targetOverview=new T.Vector3(0,4.8,0);
camera.position.set(-10,43,40);camera.lookAt(targetOverview);
const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setSize(window.innerWidth,window.innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.35));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.10;renderer.shadowMap.enabled=false;mount.appendChild(renderer.domElement);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.target.copy(targetOverview);orbit.enablePan=false;orbit.enableDamping=true;orbit.dampingFactor=.065;orbit.minDistance=29;orbit.maxDistance=65;orbit.maxPolarAngle=Math.PI*.67;orbit.minPolarAngle=.11;orbit.rotateSpeed=.46;orbit.autoRotate=true;orbit.autoRotateSpeed=.20;
const sky=new T.HemisphereLight(0xe9f3ee,0x686b6a,2.05);scene.add(sky);
const sun=new T.DirectionalLight(0xffedcf,3.6);sun.position.set(-20,35,25);scene.add(sun);
const fill=new T.DirectionalLight(0x95b4b3,1.0);fill.position.set(15,8,-18);scene.add(fill);
const starPos:number[]=[];let seed=1729;for(let i=0;i<550;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=seed/4294967296*2-1;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const a=seed/4294967296*Math.PI*2;starPos.push(105*Math.sqrt(1-y*y)*Math.cos(a),105*y,105*Math.sqrt(1-y*y)*Math.sin(a))}
const starGeo=new T.BufferGeometry();starGeo.setAttribute('position',new T.Float32BufferAttribute(starPos,3));const starMat=new T.PointsMaterial({color:0xf6f6e8,size:.55,opacity:0,transparent:true,depthWrite:false});scene.add(new T.Points(starGeo,starMat));
const {world,routes,buildings}=createPlanet();scene.add(world);
// Volúmenes de fachadas y cubiertas para resolver oclusión de la cámara de tercera persona.
// Usamos cajas de cada malla estructural, evitando cajas globales que incluyen calles vacías.
world.updateMatrixWorld(true);
const cameraObstacles:T.Box3[]=[];
for(const site of [...buildings.values(),...world.children.filter(o=>o.name.startsWith('hito_no_jugable_'))]){
 site.traverse(o=>{const mesh=o as T.Mesh;if(!mesh.isMesh)return;
   const bounds=new T.Box3().setFromObject(mesh),size=bounds.getSize(new T.Vector3());
   if(size.y>.55 && (size.x>.65||size.z>.65))cameraObstacles.push(bounds);
 });
}
const cameraRay=new T.Ray(),cameraHit=new T.Vector3();
const occluderGroups=[...buildings.values(),...world.children.filter(o=>o.name.startsWith('hito_no_jugable_'))];
const cameraVolumes=occluderGroups.map(o=>new T.Box3().setFromObject(o));
function occlusionPenalty(from:T.Vector3,to:T.Vector3){
 const ray=new T.Ray(from,to.clone().sub(from).normalize()),dist=from.distanceTo(to);let hits=0;
 for(const box of cameraVolumes){
   if(box.containsPoint(from))continue;
   const hit=ray.intersectBox(box,new T.Vector3());if(hit&&from.distanceTo(hit)<dist-.25)hits++;
 }
 return hits;
}

function clearDistance(focus:T.Vector3,wanted:T.Vector3){
 const diff=wanted.clone().sub(focus),length=diff.length();if(length<.01)return 0;
 cameraRay.origin.copy(focus);cameraRay.direction.copy(diff).divideScalar(length);
 let available=length;
 for(const obstacle of cameraObstacles){
  if(obstacle.containsPoint(focus))continue;
  const hit=cameraRay.intersectBox(obstacle,cameraHit);
  if(hit){const d=focus.distanceTo(hit);if(d>.10)available=Math.min(available,Math.max(.75,d-.30));}
 }
 return available;
}
/** Encuadre elevado del camino: muestra a Escobar y la bifurcación sin colocar
 * la cámara entre fachadas de tamaño fantástico. Conserva la dirección de marcha.
 */
function walkingShot(){
 // Cámara de tercer persona a escala humana, nunca un vuelo sobre los tejados.
 const f=lastHeroDir.clone().setY(0).normalize();
 const side=new T.Vector3(-f.z,0,f.x);
 const focus=lastHeroPos.clone().addScaledVector(f,.35).add(new T.Vector3(0,1.05,0));
 const origin=lastHeroPos.clone().addScaledVector(f,-3.85).add(new T.Vector3(0,2.85,0));
 const options=[
  origin.clone().addScaledVector(side,1.45),
  origin.clone().addScaledVector(side,-1.45),
  origin.clone().addScaledVector(side,2.4),
  origin.clone().addScaledVector(side,-2.4),
  origin.clone()
 ];
 let chosen=options[0],lowest=Infinity;
 for(const candidate of options){const penalty=occlusionPenalty(focus,candidate)*10+Math.abs(candidate.x-lastHeroPos.x)*.03;
  if(penalty<lowest){chosen=candidate;lowest=penalty;}}
 // Evitamos acercarnos artificialmente a Ignacio dentro de una fachada;
 // los edificios que cruzan la línea de visión se ocultan durante el render.
 return {focus,wanted:chosen};
}

const hero=character('escobar',.76);world.add(hero.root);
// Sombra natural bajo los pies, sin marcadores de interfaz sobre el protagonista.
const footShade=new T.Mesh(new T.CircleGeometry(.34,24),new T.MeshBasicMaterial({color:0x314135,transparent:true,opacity:.20,depthWrite:false,side:T.DoubleSide}));
footShade.rotation.x=-Math.PI/2;footShade.position.y=.040;hero.root.add(footShade);
type Mode='overview'|'walk'|'interior'|'transition';type Phase='arrival'|'canonical'|'choice'|'branch'|'complete';
let mode:Mode='overview',phase:Phase='arrival',stage:Stage|null=null,currentSite:Site|null=null,lock=false,paused=false;
let track:Track=routes.find(r=>NODES[r.from].id==='s1'&&NODES[r.to].id==='s2')??routes[0],distance=1.6,direction:1|-1=1;
let selection=0,choiceIndex=-1,stageTime=0,currentLine=-1,timeOfDay=55,ignoreEntryUntil=0;
let lastHeroPos=new T.Vector3(),lastHeroDir=new T.Vector3(0,0,1);
const travelHistory:{route:number;heading:1|-1}[]=[];
let lateral=0, lateralTarget=0,walkVelocity=0,heroAngle=0,captionTimeout=0,dialogueIndex=-1;
let activeBubbleActor:T.Object3D|null=null;
let lastSceneInput=0;
const keys=new Set<string>(),mobile={forward:0,turn:0},originalActorPos=new WeakMap<Person,T.Vector3>(),originalActorRot=new WeakMap<Person,number>();
const getKey=(...keys0:string[])=>keys0.some(k=>keys.has(k));
const classToggle=(node:HTMLElement,name:string,on:boolean)=>node.classList.toggle(name,on);
const routeAt=(track:Track,d:number,dir:1|-1)=>{const s=interpolateTrack(track,d);const f=s.tangent.multiplyScalar(dir).setY(0).normalize();return {pos:s.pos,forward:f}};
function positionHero(dt=.016,motionSign=1){
 const s=routeAt(track,distance,direction);const sideways=new T.Vector3(-s.forward.z,0,s.forward.x);
 // Escobar camina por un lateral de la calzada, sin atravesar la fila de autobuses.
 const sideWalk=track.kind==='septima'||track.kind==='veintiseis'?.47:track.kind==='barrio'?.29:.055;
 lateral=T.MathUtils.damp(lateral,sideWalk+lateralTarget,8,dt);
 const base=s.pos.addScaledVector(sideways,lateral);base.y=interpolateTrack(track,distance).pos.y-.012;
 hero.root.position.copy(base);
 const facing=s.forward.clone().multiplyScalar(motionSign||1);
 const angle=Math.atan2(facing.x,facing.z);
 const angleDelta=Math.atan2(Math.sin(angle-heroAngle),Math.cos(angle-heroAngle));heroAngle+=angleDelta*Math.min(1,dt*9);
 hero.root.rotation.set(0,heroAngle,0);lastHeroPos.copy(hero.root.position);lastHeroDir.copy(facing);
}
positionHero();
const outgoing=(node:number,exclude=-1)=>routes.filter(e=>(e.from===node||e.to===node)&&e.index!==exclude);
const outward=(e:Track,node:number)=>e.from===node?e.startDir.clone():e.endDir.clone().multiplyScalar(-1);
function optionsAt(node:number,inbound:T.Vector3,previousIndex:number){return outgoing(node,previousIndex).sort((a,b)=>{
  // Mantener la continuidad de marcha por defecto; las teclas A/D permiten desviarse.
  const score=(e:Track)=>inbound.clone().dot(outward(e,node));return score(b)-score(a);
})}
function upcoming(){return walkVelocity<-.12?(direction>0?track.from:track.to):(direction>0?track.to:track.from)}
function nearCrossroads(){return (walkVelocity<-.12)===(direction>0)?distance<1.3:track.total-distance<1.3}
function showRoadHint(){if(mode!=='walk'||!nearCrossroads()){roadHint.classList.remove('visible');return}
 const node=upcoming(),others=optionsAt(node,lastHeroDir,track.index);if(!others.length){roadHint.classList.remove('visible');return}
 const chosen=others[selection%others.length];const target=NODES[chosen.from===node?chosen.to:chosen.from];
 roadHint.textContent=`A / D: ${target.label||target.entry?.replaceAll('_',' ')||'OTRO CAMINO'} · W AVANZA · S REGRESA`;
 roadHint.classList.add('visible')}
function continueFrom(node:number,inbound:T.Vector3,backwards=false){
 let next:Track|undefined;
 if(backwards&&travelHistory.length){
  const previous=travelHistory[travelHistory.length-1];
  const candidate=routes[previous.route];
  if(candidate&&(candidate.from===node||candidate.to===node)){travelHistory.pop();next=candidate;}
 }
 const candidates=optionsAt(node,inbound,track.index);
 if(!next)next=candidates[selection%candidates.length];
 if(!next){ // En un extremo de la red se detiene, sin teleportar al otro extremo del tramo.
   distance=direction===1?.045:track.total-.045;walkVelocity=0;selection=0;return;
 }
 if(!backwards)travelHistory.push({route:track.index,heading:direction});
 track=next;direction=track.from===node?1:-1;
 if(backwards){direction=direction===1?-1:1;}
 distance=direction===1?.045:track.total-.045;selection=0;
}
function handleWalk(dt:number,t:number){
 const axis=(getKey('w','arrowup')?1:0)-(getKey('s','arrowdown')?1:0)+mobile.forward;
 const targetVelocity=T.MathUtils.clamp(axis,-1,1)*(getKey('shift')?6.1:3.5);
 walkVelocity=T.MathUtils.damp(walkVelocity,targetVelocity,7,dt);
 if(Math.abs(walkVelocity)<.035){hero.update(t,false);showRoadHint();return;}
 const step=Math.sign(walkVelocity),delta=Math.min(.20,Math.abs(walkVelocity)*dt);
 const beforeDistance=distance;
 distance=T.MathUtils.clamp(distance+step*direction*delta,0,track.total);
 // Colisiones simples y seguras con vehículos; nunca se camina a través de la buseta.
 const predicted=interpolateTrack(track,distance).pos;
 const former=interpolateTrack(track,beforeDistance).pos;
 const vehicles=world.children.filter(o=>o.name.startsWith('vehiculo_'));
 const blocked=vehicles.some(vehicle=>{
   const d=Math.hypot(predicted.x-vehicle.position.x,predicted.z-vehicle.position.z);
   const oldD=Math.hypot(former.x-vehicle.position.x,former.z-vehicle.position.z);
   return d<.75&&d<oldD;
 });
 if(blocked){distance=beforeDistance;walkVelocity=0;positionHero(dt,step);hero.update(t,false);return;}

 const atNode=step*direction>0?distance>=track.total-.002:distance<=.002;
 if(atNode){
   const node=step*direction>0?track.to:track.from,n=NODES[node];
   if(step>0&&n.entry&&performance.now()>ignoreEntryUntil){
     const site=SITES.find(s=>s.id===n.entry);
     if(site?.scene){positionHero(dt,step);enter(site);return;}
   }
   const incoming=outward(track,node).multiplyScalar(-1);
   continueFrom(node,incoming,step<0);lateral=0;
 }
 positionHero(dt,step);hero.update(t,true);showRoadHint();
}
function turn(delta:number){
 if(mode!=='walk')return;
 const candidates=optionsAt(upcoming(),lastHeroDir,track.index);
 if(candidates.length>0){selection=(selection+delta+candidates.length)%candidates.length;showRoadHint();}
 lateralTarget=T.MathUtils.clamp(lateralTarget+delta*.065,-.12,.12);
}
const VOICE_STYLES:Record<string,string>={
 'Escobar':'escobar','Ignacio':'escobar','Fina':'fina','Diego León':'diego','Federico':'federico',
 'Inga':'inga','Foción':'focion','Tío Pablo':'focion','Jefe':'focion','Monseñor':'monseñor',
 'Madre':'leonor','Alicia':'alicia','Prima Alicia':'alicia','Prima adolescente':'alicia',
 'Edén':'poeta','Narciso':'poeta','Poeta':'poeta','Ángela':'fina','Beatriz':'beatriz',
 'Ana María':'fina','Douglas':'federico'
};
const speech=document.getElementById('subtitles')!;
function showCaption(item:Linea|null){
 if(!item){speech.classList.remove('active');speech.setAttribute('aria-hidden','true');activeBubbleActor=null;return;}
 const voice=VOICE_STYLES[item.voz];
 activeBubbleActor=voice==='escobar'?hero.root:stage?.actors.find(p=>p.style===voice)?.root ?? stage?.actors[0]?.root ??hero.root;
 speaker.textContent=item.voz==='Narrador'?'':item.voz;
 subtitleText.textContent=item.texto;
 speech.classList.toggle('ambient',item.voz==='Narrador');
 source.textContent='';
 speech.classList.add('active');speech.setAttribute('aria-hidden','false');
}
function locateSpeech(){
 if(mode!=='interior'||!activeBubbleActor||!speech.classList.contains('active'))return;
 const point=activeBubbleActor.getWorldPosition(new T.Vector3()).add(new T.Vector3(0,2.13,0));
 point.project(camera);
 const vw=window.innerWidth,vh=window.innerHeight;
 const x=T.MathUtils.clamp((point.x*.5+.5)*vw, vw<720?108:155,vw-(vw<720?108:175));
 const y=T.MathUtils.clamp((-.5*point.y+.5)*vh,vw<720?178:158,vh-(vw<720?260:195));
 speech.style.left=x+'px';speech.style.top=y+'px';
}
function showChoices(){
 if(!currentSite)return;
 choices.replaceChildren();const story=DIALOGOS[currentSite.id];
 story.bifurcaciones.forEach((b,i)=>{
  const button=document.createElement('button');button.type='button';
  button.className='choice-option';
  const num=document.createElement('span');num.className='choice-num';num.textContent=String(i+1);
  const copy=document.createElement('span');copy.className='choice-text';
  const title=document.createElement('strong');title.textContent=b.titulo;
  const description=document.createElement('small');description.textContent=CONTEXTOS[currentSite!.id]?.[i]??'Una variación contemporánea de esta escena';
  copy.append(title,description);button.append(num,copy);
  button.addEventListener('click',()=>choose(i));choices.append(button);
 });
 decisions.classList.add('active');decisions.setAttribute('aria-hidden','false');
}
function hideChoices(){decisions.classList.remove('active');decisions.setAttribute('aria-hidden','true');choices.replaceChildren()}
function choose(i:number){if(phase!=='choice'||!currentSite)return;choiceIndex=i;hideChoices();changePhase('branch')}
function changePhase(next:Phase){
 phase=next;stageTime=0;dialogueIndex=0;currentLine=-1;
 if(next==='canonical'||next==='branch'){
  hideChoices();hint.classList.add('visible');hint.textContent='← / ↓ ANTERIOR   ·   SIGUIENTE ↑ / →';
  const lines=next==='canonical'?DIALOGOS[currentSite!.id].inicio:DIALOGOS[currentSite!.id].bifurcaciones[choiceIndex].lineas;
  showCaption(lines[0]??null);currentLine=0;
 }
 if(next==='choice'){
  showCaption(null);showChoices();hint.classList.remove('visible');
 }
 if(next==='complete'){
  showCaption(null);hideChoices();hint.textContent='ESC PARA VOLVER AL GLOBO · ← PARA RELEER';hint.classList.add('visible');
 }
}
function sceneStep(delta:number){
 if(mode!=='interior'||lock||!currentSite)return;
 if(phase==='arrival'){
   if(delta>0){hero.root.position.z=1.6;changePhase('canonical');}
   return;
 }
 if(phase==='choice'){
   if(delta<0){phase='canonical';dialogueIndex=DIALOGOS[currentSite.id].inicio.length-1;showCaption(DIALOGOS[currentSite.id].inicio[dialogueIndex]);hint.classList.add('visible');hideChoices();}
   return;
 }
 if(phase==='complete'){
  if(delta<0&&choiceIndex>=0){phase='branch';dialogueIndex=DIALOGOS[currentSite.id].bifurcaciones[choiceIndex].lineas.length-1;showCaption(DIALOGOS[currentSite.id].bifurcaciones[choiceIndex].lineas[dialogueIndex]);hint.textContent='← / ↓ ANTERIOR   ·   SIGUIENTE ↑ / →';}
  return;
 }
 const lines=phase==='canonical'?DIALOGOS[currentSite.id].inicio:DIALOGOS[currentSite.id].bifurcaciones[choiceIndex].lineas;
 const next=dialogueIndex+delta;
 if(next<0){dialogueIndex=0;return;}
 if(next>=lines.length){changePhase(phase==='canonical'?'choice':'complete');return;}
 dialogueIndex=next;currentLine=next;showCaption(lines[next]);
}
function fadeTo(action:()=>void){if(lock)return;lock=true;mode='transition';veil.classList.add('active');window.setTimeout(()=>{action();veil.classList.remove('active');window.setTimeout(()=>{lock=false},430)},490)}
function showSiteCaption(s:Site){el('place-number').textContent='';el('place-name').textContent=s.name;caption.classList.add('visible');window.clearTimeout(captionTimeout);captionTimeout=window.setTimeout(()=>caption.classList.remove('visible'),3100)}
function enter(site:Site){if(lock||mode==='interior')return;roadHint.classList.remove('visible');fadeTo(()=>{
 currentSite=site;stage=makeStage(site.id);scene.add(stage.root);world.visible=false;world.remove(hero.root);scene.add(hero.root);
 hero.root.quaternion.identity();hero.root.rotation.y=Math.PI;hero.root.scale.setScalar(1.08);hero.root.position.copy(stage.heroStart);
 stage.actors.forEach(a=>{originalActorPos.set(a,a.root.position.clone());originalActorRot.set(a,a.root.rotation.y)});
 showSiteCaption(site);orbit.enabled=false;orbit.autoRotate=false;camera.up.set(0,1,0);camera.fov=52;camera.updateProjectionMatrix();camera.position.set(1.15,3.0,4.36);camera.lookAt(0,1.48,-.85);
 phase='arrival';stageTime=0;currentLine=-1;choiceIndex=-1;showCaption(null);hideChoices();hint.classList.remove('visible');mode='interior';refreshMobile();
 })}
function leave(){if(!stage||lock)return;fadeTo(()=>{
 scene.remove(stage!.root);stage=null;currentSite=null;scene.remove(hero.root);world.visible=true;world.add(hero.root);hero.root.scale.setScalar(.76);
 const node=direction===1?track.to:track.from;distance=direction===1?Math.max(0,track.total-.7):Math.min(track.total,.7);
 // Al salir, caminar hacia atrás permite alejarse de la puerta antes del próximo ingreso.
 direction=direction===1?-1:1;positionHero();mode='walk';ignoreEntryUntil=performance.now()+2500;refreshMobile();
 showCaption(null);hideChoices();hint.classList.remove('visible');camera.fov=47;camera.updateProjectionMatrix();const {focus,wanted}=walkingShot();camera.position.copy(wanted);camera.up.set(0,1,0);camera.lookAt(focus);
 })}
function updateInterior(dt:number,t:number,wallDt:number){if(!stage||!currentSite)return;stageTime+=wallDt;
 const story=DIALOGOS[currentSite.id];if(phase==='arrival'){
  const step=T.MathUtils.smoothstep(stageTime,0,2.7);hero.root.position.z=T.MathUtils.lerp(stage.heroStart.z,1.6,step);hero.update(t,stageTime<4);if(stageTime>=2.7)changePhase('canonical');
 }else{
  hero.update(t,false);
  // Durante la escena las flechas recorren el relato, no atraviesan muebles ni actores.
  if(phase==='complete'){
   const f=(getKey('w','arrowup')?1:0)-(getKey('s','arrowdown')?1:0)+mobile.forward;
   const side=(getKey('d','arrowright')?1:0)-(getKey('a','arrowleft')?1:0)+mobile.turn;
   const nextX=T.MathUtils.clamp(hero.root.position.x+side*dt*1.15,-4.8,4.8);
   const nextZ=T.MathUtils.clamp(hero.root.position.z-f*dt*1.55,-2.5,4.94);
   const clear=stage.actors.every(a=>Math.hypot(a.root.position.x-nextX,a.root.position.z-nextZ)>.82);
   if(clear){hero.root.position.x=nextX;hero.root.position.z=nextZ;hero.update(t,Math.abs(f)+Math.abs(side)>.12);}
   if(hero.root.position.z>4.72){leave();return;}
  }
 }
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
  const {focus,wanted}=walkingShot();
  camera.position.lerp(wanted,1-Math.exp(-dt*5.4));
  camera.up.set(0,1,0);camera.lookAt(focus);
 }else if(mode==='interior'&&stage){
  const actor=activeBubbleActor;const cinematic=phase==='canonical'||phase==='branch';
  const targetActor=actor?.getWorldPosition(new T.Vector3());
  const desired=new T.Vector3(cinematic&&targetActor?1.1+targetActor.x*.10:1.2,3.15+Math.sin(t*.25)*.07,4.55);
  const aim=new T.Vector3(cinematic&&targetActor?targetActor.x*.24:0,1.53,-1.05);
  camera.position.lerp(desired,1-Math.exp(-dt*1.6));camera.up.set(0,1,0);camera.lookAt(aim);locateSpeech()
 }
}
function toOverview(){if(mode==='interior'){leave();return}camera.fov=35;camera.updateProjectionMatrix();mode='overview';refreshMobile();orbit.enabled=true;orbit.autoRotate=true;orbit.target.copy(targetOverview);camera.position.set(-10,43,40);camera.up.set(0,1,0);camera.lookAt(targetOverview);orbit.update();caption.classList.remove('visible');roadHint.classList.remove('visible')}
function beginWalking(){if(mode!=='overview')return;camera.fov=50;camera.updateProjectionMatrix();mode='walk';refreshMobile();orbit.enabled=false;orbit.autoRotate=false;const {focus,wanted}=walkingShot();camera.position.copy(wanted);camera.up.set(0,1,0);camera.lookAt(focus);caption.classList.remove('visible')}
function dayNight(dt:number){timeOfDay+=dt;const p=(timeOfDay%300)/300;const alt=Math.sin(p*2*Math.PI+.45),daylight=T.MathUtils.smoothstep(alt,-.20,.65),golden=Math.pow(1-Math.abs(alt-.08),4);
 sun.position.set(31*Math.cos(p*2*Math.PI),25*alt,28*Math.sin(p*2*Math.PI));sun.intensity=(.48+3.0*daylight)*(mode==='interior'?.26:1);sun.color.setRGB(1,.75+.21*daylight,.61+.34*daylight);
 sky.intensity=(.68+1.25*daylight)*(mode==='interior'?.52:1);fill.intensity=(.40+.54*daylight)*(mode==='interior'?.38:1);starMat.opacity=Math.pow(1-daylight,2)*.80;
 const top=new T.Color(0x27364b).lerp(new T.Color(0xdce9e5),daylight),bot=new T.Color(0x37475a).lerp(new T.Color(0xf2e7dc),daylight);top.lerp(new T.Color(0xd0b5a7),golden*.1);bot.lerp(new T.Color(0xe5c2a0),golden*.2);
 document.documentElement.style.setProperty('--sky-top','#'+top.getHexString());document.documentElement.style.setProperty('--sky-bottom','#'+bot.getHexString());renderer.toneMappingExposure=.95+daylight*.16;document.body.classList.toggle('night',daylight<.24)
}
let last=performance.now(),elapsed=0;function tick(now:number){requestAnimationFrame(tick);const wall=Math.min((now-last)/1000,2.5),dt=Math.min(wall,.050);last=now;elapsed+=wall;
 if(!paused){dayNight(wall);if(mode==='walk')handleWalk(dt,elapsed);else if(mode==='overview')hero.update(elapsed,false);else if(mode==='interior')updateInterior(dt,elapsed,wall);followCamera(dt,elapsed)}
 // Oclusión dinámica: si un edificio se interpone entre la cámara y
 // Escobar, solo durante ESTE fotograma se retira visualmente esa fachada.
 // No altera el mundo, las colisiones ni la llegada a las escenas.
 const hidden:T.Object3D[]=[];
 if(mode==='walk'){
  const target=lastHeroPos.clone().add(new T.Vector3(0,1.03,0));
  const toHero=target.sub(camera.position),dist=toHero.length();
  if(dist>.01){
   const ray=new T.Ray(camera.position.clone(),toHero.normalize());
   for(let i=0;i<occluderGroups.length;i++){
    const group=occluderGroups[i],box=cameraVolumes[i];
    if(!group.visible)continue;
    const hit=ray.intersectBox(box,new T.Vector3());
    if(box.containsPoint(camera.position)||(hit&&camera.position.distanceTo(hit)<dist-.15)){
      group.visible=false;hidden.push(group);
    }
   }
  }
 }
 renderer.render(scene,camera);
 for(const group of hidden)group.visible=true;
}
window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.35))});
window.addEventListener('keydown',e=>{
 const key=e.key.toLowerCase();if(['w','s','a','d','arrowup','arrowdown','arrowleft','arrowright','shift','escape','1','2','3','n',' '].includes(key))e.preventDefault();keys.add(key);if(e.repeat)return;
 if(key==='escape'){if(about.classList.contains('open'))closeAbout();else if(mode==='interior')leave();else toOverview()}
 if(key==='n')timeOfDay+=75;
 if(mode==='overview'&&['w','s','arrowup','arrowdown'].includes(key))beginWalking();
 if(mode==='interior'&&['w','arrowup','s','arrowdown'].includes(key)&&phase!=='complete')sceneStep(['w','arrowup'].includes(key)?1:-1);
 if(mode==='walk'&&['a','arrowleft'].includes(key))turn(-1);if(mode==='walk'&&['d','arrowright'].includes(key))turn(1);
 if(phase==='choice'&&mode==='interior'&&['1','2','3'].includes(key))choose(Number(key)-1);
 if(e.code==='Space'&&mode==='interior')sceneStep(1);
});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
// En móvil la esfera se puede girar libremente; doble toque cambia a recorrer.
let previousTap=0;
renderer.domElement.addEventListener('pointerup',e=>{
 if(mode!=='overview')return;
 if(e.pointerType==='touch'){
  const now=performance.now();if(now-previousTap<340){beginWalking();previousTap=0;}else previousTap=now;
 }
});
renderer.domElement.addEventListener('dblclick',()=>{if(mode==='overview')beginWalking()});
// La rotación táctil del globo la gestiona OrbitControls; caminar usa controles independientes.
const mobilePad=document.getElementById('mobile-pad')!;
function refreshMobile(){mobilePad.classList.toggle('visible',mode==='walk'||mode==='interior');}
for(const button of Array.from(mobilePad.querySelectorAll<HTMLButtonElement>('button[data-key]'))){
 const key=button.dataset.key!;
 const release=()=>{keys.delete(key);button.classList.remove('pressed')};
 button.addEventListener('pointerdown',e=>{
  e.preventDefault();try{button.setPointerCapture(e.pointerId)}catch{}button.classList.add('pressed');
  if(mode==='interior'&&phase!=='complete'&&(key==='w'||key==='s')){sceneStep(key==='w'?1:-1);return;}
  if(mode==='walk'&&(key==='a'||key==='d')){turn(key==='a'?-1:1);return;}
  keys.add(key);
 });
 button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);
 button.addEventListener('lostpointercapture',release);
}
el('center').addEventListener('click',toOverview);function openAbout(){paused=true;about.classList.add('open');about.setAttribute('aria-hidden','false')}function closeAbout(){paused=false;about.classList.remove('open');about.setAttribute('aria-hidden','true')}
el('moon').addEventListener('click',openAbout);el('about-close').addEventListener('click',closeAbout);el('retry').addEventListener('click',()=>location.reload());
Object.defineProperty(window,'__BOGOTA_TEST__',{
 value:{
   getState:()=>({mode,phase,site:currentSite?.id||null,route:track.index,distance,timeOfDay,dialogueIndex,dialogueTotal:currentSite?(phase==='branch'?DIALOGOS[currentSite.id].bifurcaciones[choiceIndex].lineas.length:DIALOGOS[currentSite.id].inicio.length):0,hero:{x:hero.root.position.x,y:hero.root.position.y,z:hero.root.position.z},worldObjects:world.children.length}),
   enterSite:(id:PlaceId)=>{const s=SITES.find(s=>s.id===id);if(s?.scene)enter(s);},
   walk:beginWalking,
   jumpDay:()=>{timeOfDay+=75;},
   setRoad:(id:string)=>{const node=NODES.findIndex(n=>n.id===id);const r=routes.find(r=>r.from===node||r.to===node);if(r){track=r;direction=r.from===node?1:-1;distance=direction===1?.1:r.total-.1;positionHero();}}
 }
});
window.setTimeout(()=>el('loader').classList.add('hidden'),1050);requestAnimationFrame(tick);
