import * as THREE from 'three';
import {box,cyl,ball,mat,mesh,tube,PAL,rnd,textPanel} from './materials';
import type {Lugar} from '../story/places';
const dark=PAL.ink;
const roof=(g:THREE.Group,w:number,d:number,y:number,color=PAL.wood)=>{
 const r=mesh(new THREE.ConeGeometry(1,1,4),mat(color));r.scale.set(w*.7,.36,d*.7);r.rotation.y=Math.PI/4;r.position.y=y+.1;g.add(r);
};
function windows(g:THREE.Group,w:number,h:number,z:number,cols=3,rows=2,arched=false){for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
 const x=-w*.38+(cols===1?0:col*w*.76/(cols-1));const y=.45+row*(h-.7)/Math.max(rows-1,1);
 let win=box(w*.14,.34,.055,PAL.blue,x,y,z);g.add(win);
 g.add(box(w*.16,.028,.075,dark,x,y+.18,z+.01));g.add(box(w*.16,.028,.075,dark,x,y-.18,z+.01));
 if(arched) {const top=cyl(w*.08,w*.08,.03,PAL.stone,x,y+.18,z+.02,12);top.rotation.x=Math.PI/2;g.add(top)}
 g.add(box(.025,.35,.074,PAL.cream,x,y,z+.01));
 }}
function doorway(g:THREE.Group,z:number,color=0x534637){g.add(box(.36,.72,.065,color,0,.36,z));g.add(box(.46,.045,.13,PAL.stone,0,.75,z+.01));g.add(ball(.025,PAL.gold,.12,.40,z+.06,8));}
function building(w:number,h:number,d:number,facade:number,style:'residential'|'republican'|'modern'|'shop'='residential'){
 const g=new THREE.Group();g.add(box(w,h,d,facade));
 g.add(box(w+.13,.13,d+.12,style==='modern'?PAL.slate:PAL.cream,0,h+.025));
 if(style==='republican'){g.add(box(w+.07,.1,d+.07,PAL.gold,0,h-.2));for(let i=0;i<4;i++)g.add(cyl(.045,.055,h*.72,PAL.cream,-w*.39+i*w*.26,h*.36,d*.52,10));}
 windows(g,w,h,d/2+.047,Math.max(2,Math.floor(w/.33)),h>1.4?3:2,style==='republican');
 doorway(g,d/2+.08);
 if(style==='residential'){for(let i=0;i<2;i++){
 const x=(i-.5)*w*.6;g.add(box(w*.25,.07,.22,PAL.woodLight,x,h*.52,d/2+.18));g.add(box(w*.24,.17,.025,dark,x,h*.62,d/2+.28));}}
 if(style==='shop'){g.add(box(w*.68,.31,.12,PAL.glass,0,.49,d/2+.08));g.add(box(w*.83,.12,.23,PAL.woodLight,0,.83,d/2+.12));}
 return g;
}
function pine(height=.65){const g=new THREE.Group();g.add(cyl(.045,.055,height*.42,0x6f6753,0,height*.21));
 for(let j=0;j<3;j++){const c=mesh(new THREE.ConeGeometry(height*(.25-.04*j),height*.48,7),mat([0x456951,0x577e62,0x6f8d6b][j]));c.position.y=height*(.43+.17*j);g.add(c)}return g;}
export function broadleaf(height=.8){const g=new THREE.Group();g.add(cyl(.036,.052,height*.62,0x786a53,0,height*.31,7));const crown=mesh(new THREE.IcosahedronGeometry(height*.36,1),mat([0x668b70,0x638267,0x87a37d][Math.floor(rnd()*3)]));crown.scale.set(1.0,.86,.9);crown.position.y=height*.81;g.add(crown);return g;}
function lamp(){const g=new THREE.Group();g.add(cyl(.016,.025,.9,dark,0,.45,0,8));g.add(box(.24,.035,.08,dark,.10,.88,0));g.add(ball(.072,0xf6d4a4,.20,.83,0,10));return g;}
function bench(){const g=new THREE.Group();g.add(box(.58,.055,.22,PAL.wood,0,.30));g.add(box(.58,.26,.04,PAL.wood,0,.48,-.1));for(let x of [-.23,.23])g.add(box(.035,.30,.04,dark,x,.15,-.04));return g;}
function grave(){const g=new THREE.Group();g.add(box(.3,.36,.10,0xb7b9ad,0,.18,0));g.add(ball(.15,0xb7b9ad,0,.36,0));return g;}
function car(bus=false,color=0xc4a363){const g=new THREE.Group();const length=bus?1.28:.55;const width=bus?.44:.32;const height=bus?.47:.28;
 const body=mesh(new THREE.CapsuleGeometry(width/2,length-width,4,10),mat(color));body.rotation.z=Math.PI/2;body.scale.set(1,.83,1);body.position.y=.28;g.add(body);
 g.add(box(length*.84,height*.45,width*.92,0xf0dfba,0,.39));
 for(let j=0;j<(bus?7:2);j++){let x=-length*.33+j*length*.66/Math.max(1,(bus?6:1));g.add(box(length*.075,.14,width*.49,PAL.glass,x,.49,width*.25));}
 for(let x of [-length*.32,length*.32])for(let z of [-width*.43,width*.43]){const wh=cyl(.095,.095,.052,dark,x,.14,z,12);wh.rotation.x=Math.PI/2;g.add(wh);}
 if(bus){g.add(box(length*.8,.11,width*1.015,0xa74e4a,0,.23));g.add(box(length*.6,.055,width*1.03,0xdec58d,0,.41));}
 return g;
}
export function human(height=1.68,jacket=0x505e66,skin=0xbd9177,skirt=false){const g=new THREE.Group();let m=height/1.68;
 g.add(box(.31*m,.62*m,.19*m,jacket,0,.94*m));
 const neck=cyl(.055*m,.055*m,.12*m,skin,0,1.32*m);g.add(neck);
 const head=mesh(new THREE.SphereGeometry(.145*m,14,11),mat(skin));head.scale.set(.86,1.15,.82);head.position.y=1.5*m;g.add(head);
 const hair=ball(.13*m,0x403936,0,1.625*m,.001,12);hair.scale.y=.58;g.add(hair);
 if(skirt){const cloth=cyl(.26*m,.13*m,.42*m,jacket,0,.52*m,0,10);g.add(cloth)}
 else for(let x of [-.088,.088])g.add(box(.125*m,.52*m,.13*m,0x555450,x,.37*m));
 for(let x of [-.23,.23]) {const arm=box(.105*m,.51*m,.11*m,jacket,x,.94*m);arm.rotation.z=x>0?.13:-.13;g.add(arm);}
 for(let x of [-.088,.088])g.add(box(.135*m,.085*m,.22*m,0x433c39,x,.045*m,.035*m));
 g.add(box(.12*m,.15*m,.02*m,0xeee8d7,0,1.15*m,.11*m));
 return g;}
function fountain(){const g=new THREE.Group();g.add(cyl(.65,.7,.14,PAL.stone,0,.08,0,20));g.add(cyl(.55,.55,.025,0x82aeb1,0,.16,0,20));g.add(cyl(.11,.13,.4,PAL.stone,0,.4));g.add(ball(.13,PAL.cream,0,.64));return g;}
function cross(g:THREE.Group,x=0,y=1,z=0,s=.2){g.add(box(.04*s,.35*s,.05*s,0xc9c6ba,x,y,z));g.add(box(.22*s,.04*s,.055*s,0xc9c6ba,x,y+.09*s,z));}
function towers(g:THREE.Group,w=2){for(let x of [-w*.35,w*.35]){
 g.add(box(.33,1.3,.35,PAL.cream,x,1.15));g.add(box(.35,.055,.37,PAL.gold,x,1.86));
 const spire=mesh(new THREE.ConeGeometry(.23,.55,4),mat(0x6c7880),x,2.16,0);spire.rotation.y=Math.PI/4;g.add(spire);cross(g,x,2.55,0,1);
 }}
function stairs(g:THREE.Group,w=.9){for(let i=0;i<4;i++)g.add(box(w+i*.2,.065,.24,PAL.stone,0,.025+i*.06,.62+i*.16));}
function gothicChurch(){const g=new THREE.Group();g.add(box(1.9,1.38,1.32,0xe2d5bd));const roof1=mesh(new THREE.ConeGeometry(1.1,.68,4),mat(0x697681),0,1.74,0);roof1.rotation.y=Math.PI/4;roof1.scale.z=.7;g.add(roof1);towers(g,2);doorway(g,.73);stairs(g,1.1);
 const rose=mesh(new THREE.TorusGeometry(.22,.045,8,16),mat(PAL.gold),0,1.12,.68);g.add(rose);g.add(ball(.16,0x7da9a4,0,1.12,.70));
 for(let i of [-.65,.65])g.add(box(.13,.52,.04,PAL.glass,i,.87,.7));return g;}
function monument(){const g=new THREE.Group();g.add(cyl(.25,.38,.55,PAL.stone,0,.28));g.add(cyl(.075,.11,.5,0x9c967e,0,.78));g.add(ball(.12,0x9c967e,0,1.1));return g;}
function swirlGarden(g:THREE.Group){for(let j=0;j<3;j++){const points=[];for(let i=0;i<=72;i++){let a=i/72*Math.PI*2;points.push(new THREE.Vector3(Math.cos(a)*(.62+j*.22),.012,Math.sin(a)*(.62+j*.22)));}g.add(tube(points,.008,[0x7b856f,0x9b9f79,0xc3ae86][j],true));}}
/** Arquitectura, vegetación y objetos exclusivos de cada nodo. Escala miniatura. */
export function createLandmark(p:Lugar){const g=new THREE.Group();const id=p.id;
 const add=(o:THREE.Object3D,x=0,y=0,z=0,s=1)=>{o.position.set(x,y,z);o.scale.multiplyScalar(s);g.add(o);return o};
 if(id==='apartamento'){
  const a=building(1.5,1.7,.9,0xc5ad94,'residential');add(a);
  add(building(.64,1.2,.65,0xd2bd9f,'residential'),-1.14,0,-.17,.87);add(building(.67,1.35,.58,0xbba28d,'residential'),1.10,0,-.2,.85);
  for(let x of [-1.6,1.5])add(broadleaf(.66),x,0,.52);g.add(box(1.7,.1,.32,0xa4aa89,0,.05,.65));
 }else if(id==='taller'){
  add(building(1.8,1.48,1,0xb88866,'residential'));add(box(1.85,.12,.55,0x98816b,0,1.49,-.2));
  add(cyl(.12,.13,.55,0x9c7065,.55,1.68,-.25));add(box(.55,.48,.07,PAL.glass,-.45,.93,.53));add(broadleaf(.68),1.13,0,.21);
 }else if(id==='oasis'){
  add(building(2,1.25,1.10,0x826c60,'shop'));const sign=textPanel('EL OASIS',1.36,.32,.02);add(sign,0,1.13,.64);
  const awning=box(1.7,.06,.48,0xa86a4b,0,1.02,.77);g.add(awning);for(let x of [-1.3,1.3])add(lamp(),x,0,.35,.7);
 }else if(id==='unicornio'){
  add(building(2.05,1.65,1.1,0xa3aaa0,'modern'));
  for(let j=0;j<8;j++){const x=-.71+j*.2;g.add(box(.11,.6,.05,[0xcf759c,0x78b9b6,0xc4bd75][j%3],x,.84,.66));}
  const sign=textPanel('UNICORNIO',1.35,.3,.02);add(sign,0,1.53,.62);add(box(1.6,.07,.45,PAL.gold,0,1.21,.78));
 }else if(id==='jockey'){
  add(building(2.35,1.68,1.17,0xddd2b8,'republican'));
  const ped=mesh(new THREE.ConeGeometry(.95,.37,3),mat(PAL.stone),0,1.93,.64);ped.rotation.y=Math.PI/2;g.add(ped);
  stairs(g,1.35);for(let x of [-1.45,1.45])add(broadleaf(.55),x,0,.6);
 }else if(id==='porciuncula'){
  g.add(gothicChurch());for(let x of [-1.35,1.35])add(broadleaf(.6),x,0,.35);
  for(let i=0;i<4;i++)g.add(box(2.4-i*.25,.025,.17,0xd7cec0,0,.014,.95+i*.18));
 }else if(id==='parque'){
  const path=mesh(new THREE.TorusGeometry(1.19,.04,6,64),mat(0xc0aa86));path.rotation.x=Math.PI/2;path.position.y=.045;g.add(path);g.add(fountain());
  for(let i=0;i<9;i++){const a=i*2.4;add(broadleaf(.5+rnd()*.42),Math.cos(a)*1.5,0,Math.sin(a)*1.2);}
  add(bench(),-1,.0,.95);add(bench(),.8,0,-1.25);
 }else if(id==='casa_familiar'){
  add(building(2.2,1.5,1.3,0xd7c0a2,'republican'));roof(g,2.35,1.45,1.59,0x765e55);stairs(g,1.25);
  for(let i=0;i<4;i++)add(cyl(.07,.085,1.05,PAL.cream,-.88+i*.6,.55,.74,10));
  for(let x of [-1.6,1.6])add(broadleaf(1.08),x,0,.12);
 }else if(id==='oficina'){
  add(building(1.7,2.07,1,0xa7adad,'modern'));for(let r=0;r<5;r++)g.add(box(1.83,.065,1.05,0x717f88,0,.33+r*.39));
  add(lamp(),1.21,0,.75,.8);
 }else if(id==='cementerio'){
  g.add(box(2.8,.09,2.1,0x808079,0,.01));for(let i=0;i<13;i++){
   const x=-1.1+(i%5)*.56,z=-.72+Math.floor(i/5)*.6;add(grave(),x,.06,z,.45+rnd()*.18);}
  for(let i of [-1.45,1.45])add(pine(1.25),i,0,0);
  g.add(box(.85,.9,.65,0xbcbab2,1.1,.45,-.6));cross(g,1.1,1.11,-.6,1.2);
 }else if(id==='septima'){
  g.add(box(2.7,.025,.68,0x737e86,0,.02));for(let x of [-1.35,1.35]){add(building(.92,1.3,.82,x<0?0x9aabb5:0xd4b7a1,x<0?'republican':'shop'),x,0,-.42);}
  add(car(true,0xc75d4c),0,.07,.33,.65);for(let x of [-1.7,1.7])add(lamp(),x,0,.6,.85);
 }else if(id==='cerros'){
  for(let i of [-1,0,1]){const h=[.7,1.7,1.15][i+1];const t=mesh(new THREE.ConeGeometry(.95,h,7),mat([0x496c56,0x61826a,0x729075][i+1]));t.position.set(i*.82,h*.46,-.4);g.add(t);}
  for(let i=0;i<8;i++)add(pine(.5+rnd()*.35),-1.2+rnd()*2.4,0,-.3+rnd()*1.15);
  const chapel=building(.36,.34,.37,0xe3d8c6,'republican');chapel.position.set(0,1.5,-.26);chapel.scale.setScalar(.65);g.add(chapel);
 }
 g.userData.door=new THREE.Vector3(0,0,id==='cerros'?1.6:id==='parque'?1.15:id==='cementerio'?1.25:1.12);
 return g;
}
export function makeTree(kind:'pine'|'leaf'='leaf',h=.6){return kind==='pine'?pine(h):broadleaf(h)}
export function makeVehicle(bus=true,c=0xbd5f53){return car(bus,c)}
export function makeLamp(){return lamp()}
export function makeBench(){return bench()}
