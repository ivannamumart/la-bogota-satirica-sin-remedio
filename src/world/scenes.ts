import * as T from 'three';
import {block,paperBox,paint,solid,cylinder,sphere,cone,torus,pathStroke,sign,seeded,PALETTE} from './art';
import {tree,vehicle,lamp,bench,type PlaceId} from './architecture';
import {character,type Person,type PersonaStyle} from './people';
export interface Stage {root:T.Group;actors:Person[];heroStart:T.Vector3;exitZ:number;name:string;}
const rng=seeded(1968),ink=solid(PALETTE.ink);
function planks(g:T.Group,w=12,d=11){
 for(let i=0;i<24;i++){
  const z=-d/2+i*d/24;
  block(g,w,.009,.019,paint('wood',0x968069),0,.065,z);
  for(let j=0;j<6;j++){
   const x=-w/2+j*(w/6);
   block(g,.012,.012,d/24,paint('cedar',0x9f8c72),x,.071,z);
  }
 }
}
function room(g:T.Group,wall='stucco',floor='wood',w=12,d=11,h=4.9){
 block(g,w,.22,d,paint(floor),0,-.11,0);
 block(g,w,h,.27,paint(wall),0,h/2,-d/2);
 for(let side of [-1,1]){
   block(g,.25,h,d,paint(wall),side*w/2,h/2,0);
   for(let y of [.18,h-.24])block(g,.11,.11,d+.1,paint('stone'),side*w/2,y,0);
 }
 for(let y of [.12,h-.22])block(g,w+.10,.11,.09,paint('stone'),0,y,-d/2+.15);
 for(let x of [-w*.39,-w*.16,w*.17,w*.40]){
   block(g,.14,h*.90,.08,paint('stone'),x,h*.48,-d/2+.14);
   block(g,.32,.20,.17,paint('stone'),x,h*.92,-d/2+.20);
 }
 // Ventanas altas con marcos dobles, escotaduras y divisiones.
 for(let x of [-3.7,3.7]){
   block(g,1.8,2.15,.11,paint('cedar'),x,2.7,-d/2+.24);
   block(g,1.60,1.93,.12,new T.MeshPhysicalMaterial({color:0x8ea9aa,transparent:true,opacity:.50,depthWrite:false}),x,2.73,-d/2+.35);
   block(g,.06,1.94,.16,paint('stone'),x,2.73,-d/2+.39);
   block(g,1.73,.055,.16,paint('stone'),x,2.73,-d/2+.4);
 }
 if(floor==='wood'||floor==='cedar')planks(g,w,d);
}
function rug(g:T.Group,x:number,z:number,w=3,d=2,style:'dark'|'warm'|'purple'='warm'){
 const col=style==='dark'?'bluegray':style==='purple'?'purple':'ochre';block(g,w,.023,d,paint(col),x,.08,z);
 block(g,w*.93,.024,d*.89,paint('paper',style==='dark'?0x8d958f:style==='purple'?0xc2a3ae:0xd1bba3),x,.096,z);
 for(let i=0;i<3;i++){const pts:T.Vector3[]=[];for(let j=0;j<=38;j++){let xx=(j/38-.5)*w*.85;pts.push(new T.Vector3(x+xx,.112,z+Math.sin(xx*3+i*.45)*.11+(i-1)*d*.23))}pathStroke(g,pts,0x755d54,.008,.55);}
}
function lowTable(g:T.Group,x:number,z:number,w=1.3,d=.9,h=.71){block(g,w,.12,d,paint('cedar'),x,h,z);for(let sx of [-1,1])for(let sz of [-1,1]){block(g,.10,h,.10,paint('wood'),x+sx*w*.4,h/2,z+sz*d*.4)}}
function chair(g:T.Group,x:number,z:number,color='cedar',angle=0){const c=new T.Group();c.position.set(x,0,z);c.rotation.y=angle;g.add(c);
 block(c,.68,.095,.63,paint(color),0,.52,0);block(c,.68,.72,.085,paint(color),0,.94,-.30);
 for(let sx of [-1,1])for(let sz of [-1,1])block(c,.08,.54,.08,paint('wood'),sx*.26,.27,sz*.23);
 return c;
}
function sofa(g:T.Group,x:number,z:number,w=2.35,tex='olive',angle=0){const s=new T.Group();s.position.set(x,0,z);s.rotation.y=angle;g.add(s);
 block(s,w,.48,.89,paint(tex),0,.40);block(s,w,.83,.25,paint(tex),0,.80,-.37);
 for(let sx of [-1,1])block(s,.21,.60,.87,paint(tex),sx*w*.46,.62,.02);
 for(let i=0;i<3;i++){const p=sphere(s,.29,paint('plaster',i===1?0xc7b6ad:0xd9d2bf),-w*.27+i*w*.27,.72,.04,1);p.scale.set(.8,.30,.71)}
 return s;
}
function frame(g:T.Group,x:number,y:number,z:number,w=1.05,h=.92,kind=0){
 block(g,w,h,.095,paint('cedar'),x,y,z);block(g,w*.88,h*.88,.104,paint(['olive','plaster','purple','bluegray'][kind%4]),x,y,z+.07);
 const pts=[];for(let j=0;j<=24;j++){const xx=(j/24-.5)*w*.78;pts.push(new T.Vector3(x+xx,y+Math.sin(j*.37+kind)*h*.21,z+.132))}pathStroke(g,pts,PALETTE.ink,.011);
}
function bookcase(g:T.Group,x:number,z:number,w=1.25,h=2.7){
 block(g,w,h,.36,paint('cedar'),x,h/2,z);
 block(g,w-.16,h-.20,.41,paint('charcoal'),x,h/2+.04,z+.07);
 for(let k=0;k<5;k++){
  let y=.30+k*.51;block(g,w-.13,.065,.48,paint('wood'),x,y,z+.05);
  for(let j=0;j<11;j++){
   const colors=['ochre','slate','paper','terracotta','olive'];const ww=.06+(j%3)*.007,hh=.29+(j%4)*.03;
   const b=block(g,ww,hh,.23,paint(colors[(j+k)%5]),x-w*.41+j*w*.08,y+hh*.54,z+.13);b.rotation.z=(j%4===0)?.08:0;
  }
 }
}
function desk(g:T.Group,x:number,z:number){lowTable(g,x,z,1.78,.89,.84);
 // Máquina de escribir, papel, cinta y teclado de pequeñas teclas redondas.
 block(g,.64,.22,.42,paint('charcoal'),x,.99,z-.06);
 for(let i=0;i<4;i++)for(let j=0;j<9;j++)sphere(g,.020,paint('plaster'),x-.26+j*.064,1.106,z+.04-i*.072,0);
 cylinder(g,.034,.72,paint('charcoal'),x-.33,1.18,z-.22,8).rotation.z=Math.PI/2;
 const page=block(g,.41,.40,.012,paint('plaster'),x,1.35,z-.20);page.rotation.x=-.32;
 for(let i=0;i<5;i++)block(g,.26,.008,.013,paint('slate'),x,1.23+i*.055,z-.167-i*.018);
}
function lampPendant(g:T.Group,x:number,z:number,h=4){
 cylinder(g,.025,.68,paint('charcoal'),x,h-.35,z,8);
 const cap=cone(g,.43,.45,paint('charcoal'),x,h-.77,z,18);cap.rotation.z=Math.PI;
 sphere(g,.15,paint('gold'),x,h-.94,z,1);
 const light=new T.PointLight(0xfad7a0,3.4,7,2);light.position.set(x,h-.94,z);g.add(light);
}
function fireplace(g:T.Group,x:number,z:number){
 block(g,1.65,1.48,.45,paint('ochre'),x,.74,z);
 block(g,1.20,.95,.16,paint('charcoal'),x,.50,z+.28);
 for(let j=0;j<5;j++){
  const flame=cone(g,.11+j*.015,.38+j*.045,paint(j%2?'terracotta':'gold'),x+(j-2)*.21,.35,z+.42,5);flame.rotation.z=.14*Math.sin(j);
 }
 block(g,1.92,.14,.62,paint('wood'),x,1.50,z+.12);
}
function poster(g:T.Group,label:string,x:number,y:number,z:number,w=1.3){sign(g,label,w,.43,x,y,z,'#2b3430','#d2c9ac')}
function benchPew(g:T.Group,x:number,z:number,angle=0){const b=new T.Group();b.position.set(x,0,z);b.rotation.y=angle;g.add(b);
 block(b,2.0,.13,.65,paint('cedar'),0,.50,0);
 block(b,2.0,.81,.13,paint('wood'),0,.87,-.33);
 for(let xx of [-.83,.83])block(b,.11,.52,.45,paint('wood'),xx,.28,-.18);
}
function actor(stage:Stage,style:PersonaStyle,x:number,z:number,rot=0,scale=1){const p=character(style,scale);p.root.position.set(x,0,z);p.root.rotation.y=rot;stage.root.add(p.root);stage.actors.push(p);return p;}
function decorTrees(g:T.Group,count=11){for(let i=0;i<count;i++){const t=tree('leaf',1.25+rng()*.68);t.position.set((rng()-.5)*10,0,(rng()-.5)*8.5);g.add(t)}}
function baseStage(id:PlaceId):Stage{const root=new T.Group();root.name=`escena_${id}`;
 root.add(new T.HemisphereLight(0xe8ebdb,0x6c6f63,1.25));
 const key=new T.DirectionalLight(id==='unicornio'?0xd0bbef:id==='cementerio'?0xd4e2ed:0xffe0ba,2.7);key.position.set(-5,9,7);key.castShadow=false;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-11;key.shadow.camera.right=11;key.shadow.camera.top=10;key.shadow.camera.bottom=-10;root.add(key);
 const rim=new T.DirectionalLight(0x9eb9bf,1.15);rim.position.set(5,6,-6);root.add(rim);
 return {root,actors:[],heroStart:new T.Vector3(0,0,3.88),exitZ:4.50,name:id};}
export function makeStage(id:PlaceId):Stage{
 const s=baseStage(id),g=s.root;
 const interior=['apartamento','taller','oasis','unicornio','jockey','porciuncula','casa_familiar','oficina'].includes(id);
 if(interior){
  const theme=id==='oasis'?'olive':id==='unicornio'?'slate':id==='jockey'||id==='casa_familiar'?'stone':id==='taller'?'stucco':'plaster';
  room(g,theme,id==='unicornio'?'charcoal':id==='porciuncula'?'stone':'wood',12,11,id==='porciuncula'?6.4:4.9);
  // La puerta queda fuera del encuadre cinematográfico; la salida física sigue
  // estando en z>4.70. El umbral no tapa al protagonista ni los microrelatos.
  block(g,2.25,.035,.34,paint('stone'),0,.035,4.60);

 }
 if(id==='apartamento'){
   rug(g,0,.30,4.4,3.35,'purple');bookcase(g,-4.7,-4.75,1.20,3.05);
   const bed=new T.Group();bed.position.set(2.15,0,-1.85);g.add(bed);
   block(bed,2.78,.51,3.20,paint('cedar'),0,.32);block(bed,2.62,.26,3.04,paint('paper'),0,.65);
   const cloth=new T.Mesh(new T.PlaneGeometry(2.55,2.17,20,15),paint('purple',0xc9afc7,{double:true}));cloth.rotation.x=-Math.PI/2;cloth.position.set(0,.78,.43);
   const pos=cloth.geometry.getAttribute('position');for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);pos.setZ(i,.05*Math.sin(x*8+y*4)+.07*Math.sin(x*5-y*7));}pos.needsUpdate=true;cloth.geometry.computeVertexNormals();bed.add(cloth);
   for(let x of [-.58,.58])block(bed,1.00,.14,.65,paint('plaster'),x,.83,-1.04);
   sofa(g,-2.45,.10,2.46,'bluegray',.13);lowTable(g,-2.7,1.45,1.22,.66,.58);
   desk(g,-3.30,-2.08);frame(g,0,2.95,-5.31,1.64,1.17,0);
   // Ventana central excepcional, con la silueta de los cerros como cuadro vivo.
   block(g,2.8,1.66,.08,paint('wood'),0,2.74,-5.32);
   block(g,2.68,1.50,.081,paint('bluegray',0xb3c7c6),0,2.75,-5.25);
   for(let k=0;k<7;k++){const pts=[];for(let j=0;j<=28;j++){const x=-1.29+2.58*j/28;const y=2.23+k*.11+.17*Math.sin(j*.13+k*.7);pts.push(new T.Vector3(x,y,-5.17));}pathStroke(g,pts,k%2?0x62816a:0x365a4c,.018)}
   lampPendant(g,-2,1.2);actor(s,'fina',4.12,-1.65,-.85);
 }else if(id==='taller'){
   rug(g,0,-1,6.7,5,'warm');fireplace(g,0,-5.06);frame(g,0,3.20,-5.32,1.30,.96,1);
   for(let i=0;i<4;i++)frame(g,-4.2+i*2.7,2.55,-5.32,1.08,1.16,i);
   sofa(g,-3.65,-2.20,2.45,'olive',.2);sofa(g,3.65,-2.3,2.30,'terracotta',-.35);
   lowTable(g,-.30,-1.15,2.20,1.50,.68);
   // Tablero de ajedrez de 64 casillas y piezas.
   block(g,1.06,.075,1.06,paint('cedar'),-.30,.79,-1.15);
   for(let i=0;i<8;i++)for(let j=0;j<8;j++){
     block(g,.118,.007,.118,(i+j)%2?paint('charcoal'):paint('plaster'),-.72+j*.12,.837,-1.57+i*.12);
   }
   for(let j=0;j<16;j++)cylinder(g,.038,.18,j<8?paint('charcoal'):paint('plaster'),-.7+(j%8)*.12,.93,-1.52+(j<8?0:.85),8);
   desk(g,4.18,-1.5);bookcase(g,-4.92,-4.72);poster(g,'FORO CULTURAL',3.62,3.50,-5.34,1.80);
   actor(s,'diego',-.25,-2.1,.37);actor(s,'federico',-3.75,-1.40,.85);
   actor(s,'beatriz',2.95,-2.3,-.7);actor(s,'fina',1.4,-.3,2.1);
 }else if(id==='oasis'){
   rug(g,0,-.65,8,5,'dark');block(g,4.8,1.12,1.14,paint('wood'),.10,.58,-4.49);
   block(g,5.08,.16,1.48,paint('cedar'),.10,1.18,-4.5);
   for(let i=0;i<16;i++){const x=-2.1+i*.3;
     cylinder(g,.040,.23,paint(i%3===0?'olive':'terracotta'),x,1.37,-4.9,9);
     sphere(g,.048,paint('plaster'),x,1.53,-4.9,0);
   }
   sign(g,'MUSIC BAR · COMIDA Y DANCING',3.60,.48,0,3.62,-5.29,'#e7c18b','#674b3b');
   for(let x of [-3.8,-1.0,2.5]){lowTable(g,x,0,1.12,1.1,.78);for(let z of [-.7,.7])chair(g,x+.5,z,'cedar',Math.PI*.5)}
   block(g,3.5,.30,1.45,paint('cedar'),0,.18,-2.75);lampPendant(g,1.4,0);lampPendant(g,-2.0,-1);
   actor(s,'poeta',-2.7,-1.30,.45);actor(s,'poeta',-1.15,-1.5,-.1);
   actor(s,'poeta',1.1,-1.5,.60);actor(s,'poeta',2.0,-.95,-.5);
 }else if(id==='unicornio'){
   rug(g,0,-1.15,7.1,6,'purple');
   for(let i=0;i<11;i++){const x=-5+i*1.0;const w=block(g,.18,3.45,.08,paint(['purple','olive','bluegray'][i%3]),x,2.2,-5.35);w.rotation.z=Math.sin(i*.7)*.15;}
   for(let j=0;j<5;j++){const y=.17+j*.28;block(g,2.5,.20,.44,paint('stone'),-3.8,y,-1.4+j*.43)}
   block(g,4.2,.09,4.2,paint('charcoal'),1.2,.18,-1.18);
   for(let k=0;k<5;k++){const pts=[];for(let j=0;j<=40;j++)pts.push(new T.Vector3(-.8+j*.10,.22+k*.005,-2.4+Math.sin(j*.35+k*.9)*.29));pathStroke(g,pts,[0xcb719d,0x82cdc6,0xc3cb76,0xefba94,0xd7b3ce][k],.052)}
   for(let x of [-4.3,4.2]){lowTable(g,x,1.35,1.12,1.0,.81);chair(g,x,2.30)}
   const orb=sphere(g,.39,paint('slate',0xadb2bd),0,3.8,-1.0,2);for(let k=0;k<10;k++){const p=sphere(g,.043,paint('gold'),Math.cos(k)*.38,3.8+Math.sin(k*.6)*.24,-1+.22*Math.cos(k*.7),1);p.scale.x=2;}
   actor(s,'inga',1.05,-1.2,.9);actor(s,'federico',-2.2,-1.72,.4);actor(s,'poeta',3.8,-2.7,-.6);
 }else if(id==='jockey'){
   rug(g,0,-.4,7.0,7.4,'warm');
   for(let x of [-4.8,-2.8,-.8,.8,2.8,4.8]){
      cylinder(g,.20,3.8,paint('stone'),x,1.9,-3.5,14);
      block(g,.58,.19,.57,paint('gold'),x,3.75,-3.5);
   }
   for(let i=0;i<4;i++){const x=-3.8+i*2.5;
     lowTable(g,x,-1.45,1.7,1.05,.88);
     chair(g,x,-.72,'cedar');chair(g,x,-2.25,'cedar',Math.PI);
   }
   for(let i=0;i<3;i++){frame(g,-3.3+i*3.3,2.95,-5.31,1.4,1.6,i)}
   lampPendant(g,0,-.35);actor(s,'focion',-1.7,-2.1,.1);actor(s,'leonor',1.8,-1.9,-.25);actor(s,'alicia',3.1,-.50,.3);
 }else if(id==='porciuncula'){
   // Tres naves, arcos apuntados, vitral y bancos, inspirados en la Porciúncula histórica.
   rug(g,0,-1.1,5.9,8,'dark');
   for(let x of [-4.1,-2.05,2.05,4.1])for(let z of [-3.2,0,2.3]){
      cylinder(g,.26,5.65,paint('stone'),x,2.82,z,13);
      cone(g,.36,.36,paint('stone'),x,5.65,z,11);
   }
   for(let x of [-3.05,3.05])for(let z of [-2.3,.40,2.7])benchPew(g,x,z,x>0?-.04:.04);
   for(let z of [-2.3,.4,2.7])benchPew(g,0,z);
   block(g,3.10,1.10,1.25,paint('stone'),0,.58,-4.48);block(g,3.32,.14,1.4,paint('gold'),0,1.19,-4.45);
   cylinder(g,.06,1.55,paint('gold'),0,2.0,-4.65,10);block(g,.75,.09,.12,paint('gold'),0,2.28,-4.65);
   // Rosetón con gajos de color y tracería de tinta.
   torus(g,.81,.085,paint('stone'),0,4.64,-5.25);
   for(let i=0;i<12;i++){let a=i*2*Math.PI/12;const pane=new T.Mesh(new T.CircleGeometry(.22,5),paint(['olive','bluegray','purple','gold'][i%4]));pane.position.set(.57*Math.cos(a),4.64+.57*Math.sin(a),-5.19);g.add(pane);
   pathStroke(g,[new T.Vector3(0,4.64,-5.14),new T.Vector3(.80*Math.cos(a),4.64+.8*Math.sin(a),-5.14)],PALETTE.ink,.018)}
   actor(s,'monseñor',0,-3.15,0);actor(s,'focion',2.7,.6,-1.0);
 }else if(id==='casa_familiar'){
   rug(g,0,-.35,8.8,6.7,'warm');fireplace(g,-4.65,-5.0);bookcase(g,4.85,-4.8,1.40,3.10);
   lowTable(g,0,-.62,5.45,1.74,.88);
   for(let x of [-2.3,-1.1,0,1.1,2.3]){chair(g,x,-2.0,'cedar',Math.PI);chair(g,x,.85,'cedar');}
   for(let i=0;i<3;i++)frame(g,-2.9+i*2.9,2.72,-5.32,1.05,1.45,i);
   for(let j=0;j<4;j++){const glass=cylinder(g,.085,.22,paint('plaster'),-2+j*1.2,1.09,-.6,12);glass.scale.y=.83;}
   actor(s,'focion',-2,-1.15,.45);actor(s,'leonor',1,-1.3,-.7);actor(s,'alicia',3.50,-1,.10);
   actor(s,'poeta',-3.6,-.6,.25);
 }else if(id==='oficina'){
   rug(g,0,0,8.8,6.8,'dark');
   for(let x of [-3.8,0,3.8]){desk(g,x,-1.3);chair(g,x,0,'wood');}
   for(let x of [-4.65,4.65]){
     block(g,1.00,2.1,.61,paint('slate'),x,1.05,-4.51);
     for(let y of [.45,.95,1.45,1.95])block(g,.88,.06,.65,paint('stone'),x,y,-4.20);
   }
   poster(g,'OFICINA — ARCHIVO',0,3.8,-5.29,2.7);
   actor(s,'urbano',-2.5,-1.2,.28);
 }else if(id==='cementerio'){
   block(g,12,.25,11,paint('slate',0xa7a8a3),0,-.13,0);decorTrees(g,9);
   for(let i=0;i<37;i++){
     const x=-5.1+(i%9)*1.18,z=-3.9+Math.floor(i/9)*1.63;const h=.64+rng()*.49;
     block(g,.53,h,.24,paint('stone'),x,h/2,z);
     sphere(g,.28,paint('stone'),x,h,z,1).scale.z=.47;
     block(g,.37,.026,.030,paint('slate'),x,h*.56,z+.145);
   }
   block(g,1.2,1.65,1.2,paint('stone'),3.9,.82,-4.4);
   cone(g,.80,.67,paint('slate'),3.9,1.96,-4.4,4).rotation.y=Math.PI/4;
   actor(s,'focion',-1.1,0,.30);
 }else if(id==='parque'){
   block(g,12,.25,11,paint('grass'),0,-.13,0);decorTrees(g,14);
   for(let i=0;i<3;i++){
     const pts=[];for(let j=0;j<40;j++){const x=-5+j*10/39;pts.push(new T.Vector3(x,.10,(i-1)*1.17+Math.sin(j*.22+i)*.50))}pathStroke(g,pts,0xc6b49a,.27,.95);
   }
   cylinder(g,1.20,.34,paint('stone'),0,.21,-1.4,22);cylinder(g,.93,.04,new T.MeshPhysicalMaterial({color:0x7faab6,transparent:true,opacity:.8}),0,.40,-1.4,22);
   cylinder(g,.24,.89,paint('stone'),0,.8,-1.4);sphere(g,.28,paint('stone'),0,1.39,-1.4,1);
   for(let x of [-3.3,3.3]){const b=bench();b.position.set(x,0,.50);b.rotation.y=x>0?-.45:.45;g.add(b);}
   actor(s,'fina',-2.7,-1.30,.30);actor(s,'urbano',3.5,-.8,-.32);
 }else if(id==='septima'){
   block(g,12,.23,11,paint('slate',0x8c8c87),0,-.13,0);
   for(let x of [-5.2,5.2]){
     block(g,1.8,.18,11,paint('stone'),x,.02,0);
     for(let i=0;i<5;i++){const streetLamp=lamp(2.5);streetLamp.position.set(x>0?x-.65:x+.65,0,-4+i*2);g.add(streetLamp)}
     for(let i=0;i<4;i++){
       const z=-4.1+i*2.8;block(g,.9,2.3+(i%2)*.8,1.3,paint(i%2?'ochre':'bluegray'),x>0?5.3:-5.3,1.15+(i%2)*.4,z);
       block(g,.30,.58,.02,paint('charcoal'),x>0?4.82:-4.82,1.16,z+.68);
     }
   }
   for(let i=0;i<6;i++)block(g,.08,.010,.59,paint('plaster'),0,.028,-4.6+i*1.8);
   const bus=vehicle('bus','terracotta');bus.scale.setScalar(1.0);bus.position.set(2.6,0,-2.6);bus.rotation.y=.3;g.add(bus);
   const taxi=vehicle('taxi','ochre');taxi.position.set(-2.4,0,1.75);taxi.rotation.y=-.35;g.add(taxi);
   actor(s,'poeta',-2.5,-.95,.10);actor(s,'urbano',3.3,-1.75,-.2);
 }else if(id==='cerros'){
   block(g,12,.25,11,paint('grass'),0,-.13,0);decorTrees(g,14);actor(s,'escobar',0,-1.2);
 }
 return s;
}

