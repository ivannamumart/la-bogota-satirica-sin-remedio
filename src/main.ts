import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {createWorld,surface,R,type Landmark} from './world/planet';
import {human} from './world/architecture';
import {makeInterior,type Interior} from './world/interiors';
import {LUGARES,dir} from './story/places';
import {DIALOGOS,type Linea} from './story/dialogues';
import './ui/styles.css';
const $=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const mount=$<HTMLDivElement>('world');const dialogue=$<HTMLDivElement>('dialogue');const source=$<HTMLSpanElement>('source');const speaker=$<HTMLSpanElement>('speaker');const line=$<HTMLParagraphElement>('line');
const choices=$<HTMLDivElement>('choices'),progress=$<HTMLSpanElement>('progress'),kind=$<HTMLSpanElement>('dialogue-kind');
const LOC=$<HTMLDivElement>('location');const veil=$<HTMLDivElement>('scene-veil');
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(39,window.innerWidth/window.innerHeight,.1,250);
camera.position.set(0,10.3,35.5);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setSize(window.innerWidth,window.innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.8));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.17;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;mount.appendChild(renderer.domElement);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.dampingFactor=.065;orbit.enablePan=false;orbit.minDistance=17;orbit.maxDistance=52;orbit.minPolarAngle=.22;orbit.maxPolarAngle=Math.PI-.20;orbit.rotateSpeed=.48;
const amb=new THREE.HemisphereLight(0xe8f2f2,0x78836d,2.1);scene.add(amb);
const sun=new THREE.DirectionalLight(0xffe4bf,3.5);sun.position.set(23,20,16);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=sun.shadow.camera.bottom=-26;sun.shadow.camera.right=sun.shadow.camera.top=26;sun.shadow.camera.near=.4;sun.shadow.camera.far=85;sun.shadow.bias=-.0004;scene.add(sun);
const fill=new THREE.DirectionalLight(0x8db2b6,.82);fill.position.set(-20,4,-12);scene.add(fill);
// Estrellas discretas sobre el cielo; visibles únicamente de noche.
const pts:number[]=[];let rng=29;for(let i=0;i<980;i++){rng=(Math.imul(rng,1664525)+1013904223)>>>0;const u=rng/4294967296;rng=(Math.imul(rng,1664525)+1013904223)>>>0;const v=rng/4294967296;const az=2*Math.PI*u,z=v*2-1,r=Math.sqrt(1-z*z);pts.push(90*r*Math.cos(az),90*z,90*r*Math.sin(az));}
const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));const starsMat=new THREE.PointsMaterial({color:0xe4eee9,size:.75,transparent:true,opacity:0,depthWrite:false,sizeAttenuation:true});scene.add(new THREE.Points(starGeo,starsMat));
const {world,markers}=createWorld();scene.add(world);
let mode:'overview'|'walk'|'interior'|'transition'='overview';let active:Landmark|null=null;let room:Interior|null=null;let transition=false;let academy=false;
const hero=human(1.70,0x5e6667,0xb9967f,false);hero.scale.setScalar(.42);world.add(hero);
const start=markers.find(m=>m.data.id==='apartamento')!;
let normal=start.normal.clone().add(new THREE.Vector3(.12,.12,.08)).normalize();let heading=start.normal.clone().sub(normal).addScaledVector(normal,-start.normal.clone().sub(normal).dot(normal)).normalize();
const playerP=new THREE.Vector3();const local=new THREE.Vector3(0,0,3.55);
let lastPlace='apartamento',ignoreUntil=0,walkingLast=performance.now(),dialogueKey='',selected=-1;
const keys=new Set<string>();const moveKeys=new Set(['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright']);
const isPressed=(...names:string[])=>names.some(n=>keys.has(n));
const touch={active:false,lastTap:0,startX:0,startY:0,x:0,f:0};
renderer.domElement.addEventListener('pointerdown',e=>{
 if(e.pointerType!=='touch'||academy)return;
 const now=performance.now();
 if(mode==='overview'&&now-touch.lastTap<390){switchToWalk();touch.active=true;}
 else if(mode==='walk'||mode==='interior'){touch.active=true;}
 touch.lastTap=now;touch.startX=e.clientX;touch.startY=e.clientY;
});
renderer.domElement.addEventListener('pointermove',e=>{
 if(e.pointerType!=='touch'||!touch.active)return;
 touch.x=THREE.MathUtils.clamp((e.clientX-touch.startX)/85,-1,1);
 touch.f=THREE.MathUtils.clamp((touch.startY-e.clientY)/85,-1,1);
});
const endTouch=()=>{touch.active=false;touch.x=touch.f=0;};
renderer.domElement.addEventListener('pointerup',endTouch);
renderer.domElement.addEventListener('pointercancel',endTouch);
function updateHeroGlobe(){const p=surface(normal,.055);hero.position.copy(p);hero.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),normal);
 const localHeading=heading.clone().addScaledVector(normal,-heading.dot(normal)).normalize();let dir2=new THREE.Vector3(0,0,1).applyQuaternion(hero.quaternion);const yaw=Math.atan2(localHeading.clone().dot(new THREE.Vector3(1,0,0).applyQuaternion(hero.quaternion)),localHeading.dot(dir2));hero.rotateY(yaw);return p;}
updateHeroGlobe();
function trackPlace(){if(mode==='interior'||mode==='transition')return;
 let best=markers[0],dist=Infinity;for(let m of markers){const d=normal.distanceTo(m.normal);if(d<dist){dist=d;best=m}}
 if(best.data.id===lastPlace)return;lastPlace=best.data.id;
 $('loc-name').textContent=best.data.short;$('loc-region').textContent=best.data.region;
 $('loc-index').textContent=String(LUGARES.indexOf(best.data)+1).padStart(2,'0')+' / 12';
}
function hideIntro(){$('intro').classList.add('is-hidden')}
function switchToWalk(){if(mode==='overview'){mode='walk';orbit.enabled=false;hideIntro();}}
function worldMovement(dt:number){const f=isPressed('w','arrowup')?1:isPressed('s','arrowdown')?-1:touch.f,side=isPressed('d','arrowright')?1:isPressed('a','arrowleft')?-1:touch.x;
 if(!f&&!side)return;
 const tangentForward=heading.clone().addScaledVector(normal,-heading.dot(normal)).normalize();const tangentRight=new THREE.Vector3().crossVectors(normal,tangentForward).normalize();const move=tangentForward.multiplyScalar(f).addScaledVector(tangentRight,side).normalize();
 const speed=isPressed('shift')?4.1:2.55;normal.addScaledVector(move,dt*speed/(R+0.5)).normalize();
 // Conservar la orientación durante la marcha hacia atrás.
 if(f>0||side!==0)heading=move.clone().addScaledVector(normal,-move.dot(normal)).normalize();
 updateHeroGlobe();trackPlace();
 if(performance.now()<ignoreUntil||transition)return;
 for(const m of markers){const angular=normal.angleTo(m.normal);if(angular<.073){enter(m);return;}}
}
function startFade(callback:()=>void){if(transition)return;transition=true;mode='transition';veil.classList.add('active');setTimeout(()=>{callback();veil.classList.remove('active');setTimeout(()=>{transition=false},650)},630)}
function enter(m:Landmark){hideIntro();startFade(()=>{
 active=m;lastPlace=m.data.id;room=makeInterior(m.data.id);scene.add(room.group);world.visible=false;
 world.remove(hero);scene.add(hero);hero.scale.setScalar(1);hero.quaternion.identity();hero.rotation.y=Math.PI;local.set(0,0,3.55);hero.position.copy(local);
 selected=-1;dialogueKey='';dialogue.classList.remove('active');dialogue.setAttribute('aria-hidden','true');
 mode='interior';orbit.enabled=false;camera.up.set(0,1,0);camera.position.set(0,2.95,8.1);
 camera.lookAt(0,1.25,0);$('loc-name').textContent=m.data.short;$('loc-region').textContent=m.data.region;
 $('loc-index').textContent=String(LUGARES.indexOf(m.data)+1).padStart(2,'0')+' / 12';
 });}
function exitInterior(){if(!active)return;const old=active;startFade(()=>{
 if(room){scene.remove(room.group);room=null;}
 scene.remove(hero);world.add(hero);world.visible=true;hero.scale.setScalar(.42);
 normal=old.normal.clone().addScaledVector(new THREE.Vector3(0,.08,.14),1).normalize();
 heading=old.normal.clone().sub(normal).addScaledVector(normal,-old.normal.clone().sub(normal).dot(normal)).normalize();
 updateHeroGlobe();mode='walk';ignoreUntil=performance.now()+2400;active=null;dialogue.classList.remove('active');dialogue.setAttribute('aria-hidden','true');selected=-1;
 });}
function interiorMovement(dt:number){if(!room)return;const f=isPressed('w','arrowup')?1:isPressed('s','arrowdown')?-1:touch.f,x=isPressed('d','arrowright')?1:isPressed('a','arrowleft')?-1:touch.x;if(!f&&!x)return;
 const speed=(isPressed('shift')?2.9:1.75)*dt;const v=new THREE.Vector3(x,0,-f);v.normalize();local.addScaledVector(v,speed);local.x=THREE.MathUtils.clamp(local.x,-3.35,3.35);local.z=THREE.MathUtils.clamp(local.z,-3.75,4.85);
 hero.position.copy(local);if(f||x){hero.rotation.y=Math.atan2(-v.x,-v.z)+Math.PI;}
 if(local.z>4.56&&f<0){exitInterior();return;}updateDialogue();}
function populateChoices(){if(!active)return;const story=DIALOGOS[active.data.id];choices.replaceChildren();story.bifurcaciones.forEach((b,i)=>{
 const but=document.createElement('button');but.textContent=b.titulo;but.classList.toggle('selected',i===selected);but.onclick=()=>{selected=i;dialogueKey='';updateDialogue();};choices.appendChild(but);
 });}
function updateDialogue(){if(!active||mode!=='interior')return;
 if(local.z>2.45){dialogue.classList.remove('active');dialogue.setAttribute('aria-hidden','true');dialogueKey='';selected=-1;return;}
 const story=DIALOGOS[active.data.id];const n=Math.max(0,Math.floor((2.35-local.z)/.90));const idx=Math.min(story.inicio.length-1,n);const ending=local.z<= -.85;
 if(!ending&&selected!==-1){selected=-1;dialogueKey='';}
 let item:Linea=story.inicio[idx],step=idx;let complete=false;
 if(ending&&selected!==-1){const lines=story.bifurcaciones[selected].lineas;step=Math.min(lines.length-1,Math.floor((-.85-local.z)/.95));item=lines[step];complete=true;}
 const key=[active.data.id,selected,step,ending,item.texto].join('|');if(key===dialogueKey)return;dialogueKey=key;
 dialogue.classList.add('active');dialogue.setAttribute('aria-hidden','false');speaker.textContent=item.voz;
 line.textContent=item.texto;source.textContent=item.fuente??'LECTURA INTERPRETATIVA';kind.textContent=item.interpretativa?'BIFURCACIÓN / TEXTO PROPUESTO':'FRAGMENTO DEL CORPUS';
 progress.textContent=complete?`${step+1} / ${story.bifurcaciones[selected].lineas.length}`:`${idx+1} / ${story.inicio.length}`;
 if(ending){populateChoices();}else choices.replaceChildren();
}
function returnOverview(){if(mode==='transition')return;if(mode==='interior'){exitInterior();return;}mode='overview';orbit.enabled=true;orbit.target.set(0,0,0);camera.up.set(0,1,0);camera.position.set(0,9.7,34.8);orbit.update();}
$('center').addEventListener('click',returnOverview);
$('moon').addEventListener('click',()=>{academy=true;keys.clear();$('academic').classList.add('open');$('academic').setAttribute('aria-hidden','false');hideIntro();});
$('academic-close').addEventListener('click',()=>{academy=false;$('academic').classList.remove('open');$('academic').setAttribute('aria-hidden','true');});
const articles:Record<string,string>={
 argumento:`<h3>Argumento central</h3><p>Esta visualización propone leer la Bogotá de <em>Sin remedio</em> como una construcción literaria cuya geografía articula tensiones de clase, afectos y formas de la sátira. El territorio navegable reúne doce espacios recurrentes en una cartografía <strong>interpretativa</strong>: caminarla es comparar el imaginario urbano de Antonio Caballero con las huellas de la ciudad histórica.</p><p>Las distancias y posiciones del globo responden a decisiones de diseño narrativo. No constituyen un plano histórico de Bogotá.</p>`,
 objetivos:`<h3>Objetivos de la investigación</h3><ol><li>Preparar el corpus de <em>Sin remedio</em> mediante normalización, segmentación y extracción validada de entidades espaciales.</li><li>Construir un archivo cartográfico que vincule las referencias narrativas con la cartografía histórica de Bogotá durante los años setenta.</li><li>Analizar tensiones entre imaginario literario y materialidad urbana, articulando análisis semántico, afectivo e historiográfico.</li><li>Diseñar una visualización geoespacial interactiva que traduzca esos hallazgos a una experiencia de exploración crítica.</li><li>Proyectar una instalación híbrida que dialogue con la Bogotá narrativa, la histórica y la actual.</li></ol><p>Esta web desarrolla un prototipo del cuarto objetivo. Las demás capas permanecen documentadas en el proyecto de tesis.</p>`,
 metodo:`<h3>Humano-en-la-Jugada</h3><p>La investigación trabaja con un protocolo propuesto por la autora: <strong>Humano-en-la-Jugada</strong> (<em>Human-in-the-Play</em>). Cada decisión asistida por IA debe poder explicarse, rastrearse y someterse a contraste humano.</p><h4>Principios de trabajo</h4><ol><li>Documentación de los insumos, versiones y decisiones de cada etapa.</li><li>Validación humana sistemática de la extracción y clasificación espacial.</li><li>Separación visible entre evidencia del corpus e interpretación creativa.</li><li>Reconocimiento de límites de modelos propietarios y de su opacidad metodológica.</li></ol><p>En la web, los fragmentos de la novela muestran referencias P- del corpus. Las alternativas contemporáneas aparecen marcadas como textos interpretativos propuestos.</p>`,
 caja:`<h3>La Segunda Caja Negra</h3><p>La categoría de la <strong>Segunda Caja Negra</strong> forma parte de la investigación metodológica de la autora sobre la interpretación asistida por inteligencia artificial. Aquí se presenta como problema abierto: cómo seguir el rastro de las decisiones que transforman datos textuales, decisiones analíticas y operaciones de visualización en una lectura del territorio.</p><p>La documentación completa de esta categoría se integrará después de contrastarla con la versión revisada del texto académico. El prototipo evita atribuir al modelo explicaciones que no han sido verificadas.</p><h4>Decisión de diseño</h4><p>La trama narrativa y los materiales derivados del corpus conservan etiquetas de procedencia. Las bifurcaciones de sátira contemporánea se declaran como recreaciones para impedir que la interfaz las confunda con la escritura de Caballero.</p>`,
 teoria:`<h3>El marco de lectura</h3><h4>Johanna Drucker · capta y dato</h4><p>La noción de <em>capta</em> recuerda que las observaciones humanísticas son seleccionadas y construidas desde procedimientos de lectura. Estas doce localizaciones son parte de una operación interpretativa, incluso cuando se apoyan en referencias espaciales verificadas.</p><h4>Bertrand Westphal · geocrítica</h4><p>La geocrítica permite pensar el espacio literario desde perspectivas múltiples, temporalidades y relaciones entre territorio representado y territorio material. El mundo de esta web hace visible esa lectura multifocal.</p><h4>Mijaíl Bajtín · sátira menipea</h4><p>El modo menipeo abre una discusión sobre las ideas y sus portavoces, sobre la mezcla de registros y las situaciones extremas que revelan contradicciones ideológicas. Las alternativas contemporáneas son hipótesis creativas para extender esas operaciones satíricas.</p>`,
 referencias:`<h3>Referencias y materiales</h3><p>Caballero, Antonio. (1984). <em>Sin remedio</em>. Planeta.</p><p>Drucker, Johanna. (2011). Humanities approaches to graphical display. <em>Digital Humanities Quarterly, 5</em>(1).</p><p>Westphal, Bertrand. (2011). <em>Geocriticism: Real and Fictional Spaces</em>. Palgrave Macmillan.</p><p>Bajtín, Mijaíl. (1986). <em>Problemas de la poética de Dostoievski</em>. Fondo de Cultura Económica.</p><p>Muñoz Martínez, Ivanna. <em>The Black Box Within the Black Box: Human-in-the-Play as a Practice of Transparency in the Face of Methodological Opacity in AI-Assisted Humanities Research</em>. Manuscrito de investigación en evaluación, según documentación del proyecto.</p><p>La consulta histórica de transporte se apoyó, entre otras referencias, en el Archivo de Bogotá. Las formas 3D son reconstrucciones estilizadas y requieren contraste histórico individual antes de considerarse representaciones documentales.</p>`};
for(const button of document.querySelectorAll<HTMLButtonElement>('.academic-nav button'))button.addEventListener('click',()=>{document.querySelector('.academic-nav .active')?.classList.remove('active');button.classList.add('active');$('article').innerHTML=articles[button.dataset.article??'argumento'];});
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(!academy&&(moveKeys.has(k)||k===' '))e.preventDefault();if(k==='escape'&&academy){$('academic-close').click();return;}if(academy)return;if(k==='escape'){returnOverview();return;}keys.add(k);if(moveKeys.has(k))switchToWalk();});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));});
let elapsed=0;let prev=performance.now();let stride=0;
function dayNight(dt:number){elapsed+=dt;const phase=(elapsed%300)/300;const angle=phase*2*Math.PI;
 // Una vuelta de 300 segundos: mañana, atardecer, noche y nuevo amanecer.
 const daylight=.5+.5*Math.cos(angle);const warm=Math.pow(Math.max(0,Math.sin(angle)),2.5);
 sun.position.set(26*Math.cos(angle),9+27*Math.sin(angle),22*Math.sin(angle+.9));sun.intensity=.65+3.6*daylight;sun.color.setRGB(1,.94-warm*.14,.82-warm*.23);
 amb.intensity=.55+1.7*daylight;fill.intensity=.4+.65*daylight;starsMat.opacity=Math.pow(1-daylight,3)*.82;
 const top=new THREE.Color(0x122238).lerp(new THREE.Color(0xc5dce3),daylight);const bot=new THREE.Color(0x223349).lerp(new THREE.Color(0xf0e1ca),daylight);
 if(warm>.12){bot.lerp(new THREE.Color(0xe5b59a),warm*.56)}
 const root=document.documentElement;root.style.setProperty('--sky-top','#'+top.getHexString());root.style.setProperty('--sky-bottom','#'+bot.getHexString());
}
function tick(){requestAnimationFrame(tick);const now=performance.now();const dt=Math.min(.055,(now-prev)/1000);prev=now;
 dayNight(dt);
 const moving=(isPressed('w','arrowup','s','arrowdown','a','arrowleft','d','arrowright')||Math.abs(touch.f)+Math.abs(touch.x)>.15)&&(mode==='walk'||mode==='interior');
 if(moving)stride+=dt*8;
 const legA=hero.children[4],legB=hero.children[5],armA=hero.children[6],armB=hero.children[7];
 const amount=moving?.28:0;
 if(legA)legA.rotation.x=THREE.MathUtils.lerp(legA.rotation.x,Math.sin(stride)*amount,.20);
 if(legB)legB.rotation.x=THREE.MathUtils.lerp(legB.rotation.x,-Math.sin(stride)*amount,.20);
 if(armA)armA.rotation.x=THREE.MathUtils.lerp(armA.rotation.x,-Math.sin(stride)*amount*.58,.20);
 if(armB)armB.rotation.x=THREE.MathUtils.lerp(armB.rotation.x, Math.sin(stride)*amount*.58,.20);
 if(!academy&&!transition){if(mode==='walk')worldMovement(dt);else if(mode==='interior')interiorMovement(dt);}
 if(mode==='overview'&&orbit.enabled){orbit.update();}
 else if(mode==='walk'||(mode==='transition'&&!active)){
 const p=surface(normal,.20);const f=heading.clone().addScaledVector(normal,-heading.dot(normal)).normalize();
 const cp=p.clone().addScaledVector(normal,2.35).addScaledVector(f,-4.45);const target=p.clone().addScaledVector(normal,.68).addScaledVector(f,.70);
 const lerp=1-Math.exp(-dt*4.3);camera.position.lerp(cp,lerp);camera.up.lerp(normal,lerp).normalize();camera.lookAt(target);
 }else if(mode==='interior'){
 const desired=new THREE.Vector3(local.x*.48,2.9,local.z+4.3),target=new THREE.Vector3(local.x,.96,local.z-1.6);const lerp=1-Math.exp(-dt*4.7);camera.position.lerp(desired,lerp);camera.up.set(0,1,0);camera.lookAt(target);
 if(room){for(let i=0;i<room.characters.length;i++){room.characters[i].rotation.y=Math.PI+Math.sin(elapsed*.8+i*3)*.035;}}
 }
 renderer.render(scene,camera);
}
$('intro').addEventListener('click',hideIntro);setTimeout(hideIntro,11500);tick();
