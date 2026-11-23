/** Arquitecturas escénicas V04: edificios estilizados con volumen y detalles de Bogotá 1972.
 * No son reconstrucciones patrimoniales exactas. Las puertas se orientan hacia las vías.
 */
import * as T from 'three';
import {paint,block,cylinder,sphere,pathStroke,sign,solid,seeded,cone,torus} from './art';
import {type PlaceId} from '../data/layout';
const I=paint('charcoal',0x29302f),BR=paint('brick',0x9e5d46),CREAM=paint('plaster',0xf1e8d7),DARK=paint('charcoal',0x313b40),BLUE=paint('bluegray',0x677c80),WINDOW=paint('slate',0x7f9a9d),STONE=paint('stone',0xd9ccb5),TILE=paint('terracotta',0x934e3c),WOOD=paint('wood',0x846046),GOLD=paint('gold',0xbb9358);
function cub(g:T.Group,w:number,h:number,d:number,m:T.Material,x=0,y=h/2,z=0){return block(g,w,h,d,m,x,y,z)}
function line(g:T.Group,p:T.Vector3[],col=0x363e3b,r=.015){return pathStroke(g,p,col,r,.8)}
function beam(g:T.Group,x1:number,y1:number,z1:number,x2:number,y2:number,z2:number,rad=.025,mat:T.Material=WOOD){const a=new T.Vector3(x1,y1,z1),b=new T.Vector3(x2,y2,z2);const axis=b.clone().sub(a);const q=new T.Mesh(new T.CylinderGeometry(rad,rad,axis.length(),8),mat);q.position.copy(a.add(b).multiplyScalar(.5));q.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),axis.normalize());g.add(q);return q;}
function roof(g:T.Group,w:number,d:number,h:number,kind:'tile'|'slate'|'flat'|'mansard'='tile'){
 const m=kind==='slate'?DARK:kind==='flat'?STONE:TILE;const z=-.3;
 if(kind==='flat'){cub(g,w+.18,.16,d+.18,m,0,h+.06,z);cub(g,w+.22,.055,d+.25,STONE,0,h+.17,z);return}
 const geo=new T.BufferGeometry();const x=w/2+.20,k=d/2+.17;const peak=kind==='mansard'?.72:.52;
 const v=[-x,h,-k,0,h+peak,-k,x,h,-k,-x,h,k,0,h+peak,k,x,h,k];geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setIndex([0,3,1,1,3,4,1,4,2,2,4,5]);geo.computeVertexNormals();const mesh=new T.Mesh(geo,new T.MeshStandardMaterial({map:(m as T.MeshStandardMaterial).map,color:0xffffff,side:T.DoubleSide,roughness:1}));mesh.receiveShadow=true;g.add(mesh);
 for(let j=0;j<6;j++){const z0=-k+j*(d+.34)/5;beam(g,-x,h,z0,0,h+peak,z0,.009,STONE);beam(g,0,h+peak,z0,x,h,z0,.009,STONE)}
}
function window(g:T.Group,x:number,y:number,z:number,w=.48,h=.60,arch=false,bar=true){
 cub(g,w+.12,h+.12,.075,STONE,x,y,z+.011);
 cub(g,w,h,.035,DARK,x,y,z+.060);
 cub(g,w-.09,h-.1,.036,WINDOW,x,y,z+.083);
 cub(g,.026,h+.04,.046,WOOD,x,y,z+.113);
 cub(g,w+.13,.044,.16,STONE,x,y-h/2-.05,z+.084);
 if(bar){for(let i=-1;i<=1;i++){cub(g,w-.08,.009,.022,STONE,x,y+i*h*.22,z+.12)}}
 if(arch){const archLine:T.Vector3[]=[];for(let i=0;i<=14;i++){const a=Math.PI*i/14;archLine.push(new T.Vector3(x+Math.cos(a)*w*.53,y+h*.42+Math.sin(a)*.16,z+.13))}line(g,archLine,0x6c594a,.022)}
}
function doorway(g:T.Group,z:number,w=.80,h=1.38,blue=false){
 cub(g,w+.23,h+.20,.105,STONE,0,h*.51,z+.02);cub(g,w,h,.058,DARK,0,h/2,z+.10);
 cub(g,w*.83,h*.87,.065,blue?paint('bluegray',0x4b6e77):WOOD,0,h*.50,z+.15);
 cub(g,.025,h*.80,.023,STONE,0,h*.53,z+.19);sphere(g,.035,GOLD,.19,h*.47,z+.21,1);
 for(let side of [-1,1]){cub(g,.055,h+.22,.115,CREAM,side*(w/2+.08),h/2,z+.08)}
 // puerta real tridimensional: umbral, escalón y pequeño dintel
 cub(g,w+.49,.13,.48,STONE,0,.065,z+.28);cub(g,w+.22,.095,.24,STONE,0,.155,z+.43);
}
function lamp(g:T.Group,x:number,z:number,h=2.8){cylinder(g,.035,h,paint('charcoal'),x,h/2,z,9);beam(g,x,h,z,x+.33,h+.10,z,.028,I);sphere(g,.15,paint('gold',0xe9d6a6),x+.36,h+.05,z,1)}
export function tree(kind:'urban'|'garden'|'cerro'='urban',height=1.7){const g=new T.Group();const trunk=paint('cedar',0x756449),leaf=kind==='cerro'?paint('olive',0x4a7255):paint('olive',0x6d8769);
 const h=height;cylinder(g,.075*h/1.8,h*.62,trunk,0,h*.31,0,8,.05*h/1.8);
 for(const [x,y,z,r] of [[0,.85,0,.28],[.25,.76,.08,.23],[-.23,.73,0,.25],[.05,.95,-.18,.27],[.02,.64,.23,.20]]){const v=sphere(g,r*h/1.8,leaf,x*h/1.8,y*h/1.8,z*h/1.8,2);v.scale.set(1.08,.80,.96)}return g;}
function trees(g:T.Group,pts:[number,number,number][],kind:'urban'|'garden'|'cerro'='urban'){pts.forEach(([x,z,s])=>{const t=tree(kind,s);t.position.set(x,0,z);g.add(t)})}
function residence(g:T.Group,w:number,d:number,h:number,kind:'brick'|'stucco'|'mansion'|'workshop'='brick'){
 const wall=kind==='stucco'?CREAM:kind==='mansion'?paint('stone',0xcbb29b):kind==='workshop'?paint('ochre',0xae8266):BR;
 const z=d/2-.04;
 cub(g,w,h,d,wall,0,h/2,0);
 // Zócalo, pilastras, molduras y cornisa con relieve real
 cub(g,w+.04,.30,d+.06,STONE,0,.15,0);
 for(let y of [h*.48,h-.11])cub(g,w+.13,.105,d+.12,kind==='mansion'?STONE:CREAM,0,y,0);
 for(let x of [-w*.47,w*.47])cub(g,.12,h,.12,kind==='mansion'?STONE:CREAM,x,h/2,z+.02);
 doorway(g,z,.74,1.35,kind==='workshop');
 for(const floor of [0,1])for(let i=0;i<3;i++){const x=(i-1)*w*.287;if(floor===0&&i===1)continue;
   window(g,x,floor?2.13:1.0,z,.48,.56,kind==='mansion',true);
   if(floor===1&&kind!=='workshop'){
     cub(g,.67,.045,.30,STONE,x,1.81,z+.18);
     for(let j=-2;j<=2;j++)beam(g,x+j*.12,1.82,z+.30,x+j*.12,2.09,z+.30,.011,I);
   }
 }
 roof(g,w,d,h,kind==='mansion'?'mansard':'tile');
 // Costados con ventanería reconocible en vistas de cámara oblicua
 for(const x of [-w/2-.01,w/2+.01])for(const y of [1.16,2.14]){
   const m=cub(g,.015,.49,.49,DARK,x,y,-.34);
   cub(g,.024,.43,.43,WINDOW,x+Math.sign(x)*.02,y,-.34);
 }
}
function church(g:T.Group){const w=3.55,d=3.18,z=d/2+.03;
 cub(g,w,2.9,d,CREAM,0,1.45);cub(g,2.45,1.33,3.24,CREAM,0,3.45);
 // frontón de nave central y arbotantes estilizados
 roof(g,w,d,4.09,'slate');
 for(let s of [-1,1]){
  const x=s*1.42;cub(g,.73,4.55,.92,CREAM,x,2.27,z-.25);
  for(let y of [1.0,2.07,3.23])window(g,x,y,z+.24,.23,.51,true);
  const steeple=cone(g,.51,1.40,DARK,x,5.23,z-.25,6);steeple.rotation.y=Math.PI/6;
  beam(g,x,5.91,z-.25,x,6.38,z-.25,.034,GOLD);beam(g,x-.16,6.19,z-.25,x+.16,6.19,z-.25,.035,GOLD);
 }
 doorway(g,z+.17,1.03,1.83);window(g,0,3.10,z+.14,.75,1.05,true);
 torus(g,.43,.066,GOLD,0,3.23,z+.25);const glass=sphere(g,.40,paint('bluegray',0x6690a1),0,3.23,z+.28,2);glass.scale.z=.12;
 for(let i=0;i<10;i++){const a=i*Math.PI/5;beam(g,0,3.23,z+.41,Math.cos(a)*.39,3.23+Math.sin(a)*.39,z+.42,.020,GOLD)}
 for(let i=0;i<6;i++)cub(g,2.70-i*.20,.09,.33,STONE,0,.03+i*.10,z+.55+i*.28);
 trees(g,[[-2.45,1.45,1.8],[2.4,1.4,1.8]],'garden');
}
function neoclassical(g:T.Group){residence(g,3.8,2.3,3.02,'mansion');const z=1.27;
 // orden clásico: 5 columnas con basa, fuste, capitel
 for(let i=-2;i<=2;i++){const x=i*.74;cylinder(g,.115,1.80,STONE,x,1.06,z,16);cub(g,.27,.12,.30,CREAM,x,1.99,z);cub(g,.27,.10,.32,STONE,x,.16,z)}
 cub(g,4.07,.17,.48,STONE,0,2.10,z);
 const sh=new T.Shape();sh.moveTo(-2.02,0);sh.lineTo(0,.78);sh.lineTo(2.02,0);sh.closePath();const mesh=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.23,bevelEnabled:true,bevelSize:.015,bevelThickness:.015,bevelSegments:1}),STONE);mesh.position.set(0,3.02,1.20);g.add(mesh);
 trees(g,[[-2.4,1.1,1.4],[2.4,1.0,1.4]],'garden');
}
function modern(g:T.Group,w=2.5,h=4.35){cub(g,w,h,2.00,STONE,0,h/2);for(let y=.62;y<h-.45;y+=.67){for(let x=-w*.33;x<=w*.36;x+=.57){window(g,x,y,1.05,.44,.43,false,false)}}
 cub(g,w+.2,.18,2.18,CREAM,0,h+.04);doorway(g,1.05,.72,1.38,true);
 cub(g,2.00,.35,.49,STONE,0,1.37,1.26);
}
function nightclub(g:T.Group){const front=1.41;
 cub(g,4.25,2.86,2.82,paint('bluegray',0x68717d),0,1.43);
 cub(g,4.38,.23,2.94,paint('purple',0x826a84),0,2.81);
 for(let x of [-1.41,-.75,.75,1.41]){window(g,x,1.60,front,.53,.79,false,false)}
 doorway(g,front,.92,1.55);cub(g,3.4,.20,.70,paint('purple',0xc18b9d),0,2.18,front+.38);
 for(let i=0;i<6;i++){cub(g,.31,.28,.08,paint(i%2?'olive':'purple',i%2?0xb9c98a:0xb968a4),-1.22+i*.48,2.23,front+.46)}
 sign(g,'EL UNICORNIO',3.25,.56,0,3.09,front+.22,'#282d33','#e6bdd1');
 cub(g,4.50,.12,.52,paint('olive',0xb0c78f),0,3.08,front+.15);
 for(let x of [-2.2,2.2]){lamp(g,x,1.72,2.85)}
 trees(g,[[-2.7,-.7,1.25],[2.8,-.65,1.2]],'garden');
}
function bar(g:T.Group){const z=1.35;cub(g,3.35,2.50,2.62,paint('ochre',0x947960),0,1.25);
 for(let i=0;i<4;i++){window(g,-1.2+i*.8,1.41,z,.48,.7,false,false)}
 doorway(g,z,.82,1.40);cub(g,3.55,.14,.66,TILE,0,1.94,z+.21);sign(g,'MUSIC BAR · EL OASIS',3.03,.35,0,2.30,z+.12,'#eedab4','#4c5c4f');
 cub(g,3.3,.09,.42,CREAM,0,.24,z+.42);
 const t=tree('urban',1.66);t.position.set(2.35,0,.3);g.add(t);
}
function studio(g:T.Group){residence(g,3.45,2.77,2.90,'workshop');const z=1.42;
 const sky=cub(g,2.5,.06,1.22,paint('bluegray',0x95b4b8),0,3.24,-.35);sky.rotation.x=-.42;
 for(let i=0;i<3;i++){const x=-1.22+i*1.13;beam(g,x,.10,z+.62,x,1.55,z+.50,.041,WOOD);beam(g,x,1.55,z+.50,x+.25,.16,z+.73,.039,WOOD);cub(g,.58,.61,.07,paint('paper',0xe9ded0),x+.15,1.15,z+.53)}
 sign(g,'DIEGO LEÓN',1.35,.23,0,2.49,z+.07);
}
function cemetery(g:T.Group){cub(g,3.75,.13,2.33,STONE,0,.07);for(let i=0;i<16;i++){const x=-1.51+(i%5)*.72,z=-.75+Math.floor(i/5)*.63;const h=.30+(i%4)*.10;cub(g,.32,h,.16,paint('stone',i%3===0?0xb4b0a6:0xd7d3c8),x,h/2+.10,z);const crest=sphere(g,.15,STONE,x,h+.10,z,1);crest.scale.y=.5}
 cub(g,.76,1.15,.73,CREAM,.83,.58,-.7);roof(g,.78,.75,1.15,'slate');
 for(let x of [-1.88,1.88]){const t=tree('garden',1.12);t.position.set(x,0,-.5);g.add(t)}
}
function park(g:T.Group){const fountain=cylinder(g,.83,.15,STONE,0,.075,-.30,36);cylinder(g,.71,.018,paint('bluegray',0x98a6a0),0,.17,-.30,36);cylinder(g,.23,.67,STONE,0,.48,-.30,16);sphere(g,.21,CREAM,0,.93,-.3,2);
 trees(g,[[-2.0,-.9,1.75],[2.1,-.9,1.68],[-1.9,1.1,1.5],[1.8,1.3,1.48],[-.7,-1.9,1.32],[.6,-1.85,1.43]],'urban');
 cub(g,1.5,.10,.32,WOOD,1.22,.52,1.22);for(let x of [.7,1.7])cub(g,.08,.50,.08,I,x,.27,1.21);
}
function street(g:T.Group){const q1=new T.Group();q1.position.set(-1.37,0,-.60);g.add(q1);residence(q1,1.79,1.70,2.50,'brick');const q2=new T.Group();q2.position.set(1.45,0,-.55);g.add(q2);modern(q2,1.80,3.30);
 cub(g,3.25,.06,.62,paint('slate',0x646d70),0,.10,1.44);
 for(let x of [-2.05,2.02])lamp(g,x,1.8,2.6);
}
export function buildLandmark(id:PlaceId):T.Group{const g=new T.Group();g.name='edificio_'+id;
 switch(id){
  case'apartamento':residence(g,3.40,2.35,2.97,'brick');trees(g,[[-2.2,1.0,1.3],[2.3,1.1,1.4]],'urban');cub(g,3.7,.07,.60,STONE,0,.045,1.46);break;
  case'casa_familiar':residence(g,4.33,3.42,3.25,'mansion');trees(g,[[-2.8,1.9,1.9],[2.87,1.8,1.75]],'garden');for(let i=0;i<4;i++)cub(g,3.9-i*.25,.07,.31,STONE,0,.06+i*.07,2.02+i*.26);break;
  case'taller':studio(g);break;
  case'oasis':bar(g);break;
  case'unicornio':nightclub(g);break;
  case'jockey':neoclassical(g);break;
  case'porciuncula':church(g);break;
  case'parque':park(g);break;
  case'oficina':modern(g,2.60,3.95);break;
  case'cementerio':cemetery(g);break;
  case'septima':street(g);break;
  case'cerros':break;
 }
 return g;
}
export function decorativeLandmark(id:string){const g=new T.Group();g.name='hito_no_jugable_'+id;
 if(id==='plaza_toros'){
  // anillo abierto real, arquerías repetidas y tendidos: icono reconocible de La Santamaría.
  const outer=new T.Mesh(new T.CylinderGeometry(1.35,1.45,1.18,48,1,true),BR);outer.position.y=.62;outer.material.side=T.DoubleSide;g.add(outer);
  const inner=new T.Mesh(new T.CylinderGeometry(1.09,1.12,1.10,48,1,true),CREAM);inner.position.y=.62;inner.material.side=T.DoubleSide;g.add(inner);
  const sand=new T.Mesh(new T.CircleGeometry(1.1,48),paint('ochre',0xc4a777));sand.rotation.x=-Math.PI/2;sand.position.y=.10;g.add(sand);
  for(let j=0;j<24;j++){const a=j*Math.PI/12;const x=Math.cos(a)*1.43,z=Math.sin(a)*1.43;
   const p=cub(g,.19,.34,.058,DARK,x,.44,z);p.rotation.y=-a;
   cylinder(g,.038,.27,STONE,Math.cos(a)*1.42,.17,Math.sin(a)*1.42,6);
  }
  torus(g,1.36,.07,STONE,0,1.24,0,'x');
 }else if(id==='torres_parque'){
  for(let j=0;j<3;j++){
   const h=[3.9,4.9,3.4][j],x=[-1.05,.15,1.20][j];
   const t=cub(g,.95,h,.84,BR,x,h/2,0);t.rotation.y=(j-1)*.31;
   for(let y=.4;y<h-.22;y+=.43){cub(g,.96,.045,.92,STONE,x,y,0);for(let a of [-.25,.25])cub(g,.18,.18,.06,DARK,x+a,y+.21,.46)}
   for(let k=0;k<4;k++){const side=cub(g,.095,h*.60,.43,BR,x+(.49*(k%2?1:-1)),h*.46,-.24+k*.16);side.rotation.y=j*.2;}
  }
 }else if(id==='tequendama'){modern(g,2.1,4.15);}
 else if(id==='museo_nacional'){residence(g,2.25,1.9,2.25,'stucco');}
 return g;
}
export function eraVehicle(type:'bus'|'taxi'='bus'){const g=new T.Group();if(type==='bus'){
  cub(g,1.52,.62,.60,paint('terracotta',0xa84e43),0,.55);cub(g,1.52,.38,.60,CREAM,0,.93);
  for(let i=-2;i<=2;i++)for(const s of [-1,1]){cub(g,.20,.23,.012,WINDOW,i*.26,.94,s*.308)}
  cub(g,.38,.32,.013,DARK,.75,.94,.02);cub(g,.44,.16,.043,CREAM,.80,.53,.02);
  for(let x of [-.52,.53]){for(const z of [-.315,.315]){const m=new T.Mesh(new T.CylinderGeometry(.14,.14,.08,16),DARK);m.rotation.x=Math.PI/2;m.position.set(x,.36,z);g.add(m)}}
  sign(g,'CENTRO',.47,.12,.49,1.18,.308,'#3c4948','#e3d7a9');
 }else{cub(g,.92,.32,.52,paint('ochre',0xd5b044),0,.43);cub(g,.55,.26,.46,paint('ochre',0xd2ab40),0,.69);cub(g,.36,.16,.01,WINDOW,0,.70,.25);for(let x of [-.31,.31])for(let z of [-.28,.28]){const wheel=new T.Mesh(new T.CylinderGeometry(.12,.12,.07,16),DARK);wheel.rotation.x=Math.PI/2;wheel.position.set(x,.28,z);g.add(wheel)}}return g;
}
