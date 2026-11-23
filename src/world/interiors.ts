import * as THREE from 'three';
import {box,ball,cyl,mesh,mat,PAL,textPanel,tube} from './materials';
import {human,makeTree,makeBench,makeLamp,makeVehicle} from './architecture';
import {rnd} from './materials';
const inside=(id:string)=>id!=='parque'&&id!=='cerros'&&id!=='cementerio'&&id!=='septima';
function rug(g:THREE.Group,x=0,z=0,w=2,d=1.4,color=0x9f7d68){const r=box(w,.03,d,color,x,.03,z);g.add(r);g.add(box(w*.89,.032,d*.88,0xc3b49c,x,.052,z));}
function bookcase(g:THREE.Group,x:number,z:number){g.add(box(.8,1.8,.31,0x705947,x,.90,z));g.add(box(.71,1.64,.34,0x393a37,x,.96,z+.01));for(let j=0;j<4;j++){
 g.add(box(.74,.06,.36,0x9d7752,x,.24+j*.43,z+.025));for(let i=0;i<7;i++)g.add(box(.065,.22+rnd()*.12,.23,[0xbd9577,0x627787,0x93836b,0xb7b0a4,0x717659][(i+j)%5],x-.29+i*.095,.38+j*.43,z+.03));}}
function couch(g:THREE.Group,x:number,z:number,color=0x79686d){g.add(box(1.65,.35,.65,color,x,.29,z));g.add(box(1.65,.56,.18,color,x,.52,z-.33));for(let i of [-.75,.75])g.add(box(.16,.4,.67,color,x+i,.44,z));g.add(box(1.35,.13,.55,0xb1a192,x,.46,z+.03));}
function desk(g:THREE.Group,x:number,z:number){g.add(box(1.3,.1,.75,0x977459,x,.77,z));for(let dx of [-.55,.55])for(let dz of [-.25,.25])g.add(box(.08,.75,.08,0x765b49,x+dx,.37,z+dz));g.add(box(.44,.11,.32,0x30383b,x,.90,z));for(let j=0;j<4;j++)g.add(box(.035,.12,.025,0xb6b3a4,x-.15+j*.10,.98,z-.07));g.add(box(.36,.015,.28,0xe6e4dc,x,1.03,z-.13));}
function bed(g:THREE.Group,x:number,z:number){g.add(box(2.0,.3,2.1,0x65564e,x,.24,z));g.add(box(1.89,.22,1.97,0xd9c6ae,x,.50,z));g.add(box(1.8,.09,1.34,0xa899b1,x,.65,z+.32));g.add(box(1.86,.45,.12,0x886c57,x,.62,z-1.07));for(let dx of [-.45,.45])g.add(box(.66,.14,.36,0xe9ded1,x+dx,.68,z-.7));}
function chair(g:THREE.Group,x:number,z:number,color=0x755a4c){g.add(box(.43,.09,.44,color,x,.47,z));g.add(box(.43,.43,.08,color,x,.74,z-.2));for(let dx of [-.16,.16])for(let dz of [-.16,.16])g.add(box(.055,.43,.06,color,x+dx,.22,z+dz));}
function roundTable(g:THREE.Group,x:number,z:number){g.add(cyl(.62,.62,.10,0x755843,x,.74,z,20));g.add(cyl(.09,.11,.7,0x685441,x,.4,z,10));}
function painting(g:THREE.Group,x:number,y:number,z:number,kind=0){g.add(box(.95,.70,.065,0x69574a,x,y,z));g.add(box(.86,.61,.066,kind===0?0xa6b5a3:kind===1?0xc4a1a7:0x96a9aa,x,y,z+.035));
 const pts=[];for(let i=0;i<28;i++){const t=i/27;pts.push(new THREE.Vector3(x-.37+t*.74,y+Math.sin(t*8+kind)*.14,z+.08));}g.add(tube(pts,.009,PAL.ink));}
function chess(g:THREE.Group,x:number,z:number){g.add(box(.7,.08,.7,0x8d7258,x,.83,z));for(let i=0;i<8;i++)for(let j=0;j<8;j++)if((i+j)%2===0)g.add(box(.081,.005,.081,0xdbceb3,x-.285+j*.082,.88,z-.285+i*.082));for(let j=0;j<12;j++)g.add(cyl(.025,.035,.10,j%2?0x3b3b38:0xe6dec9,x-.28+(j%6)*.1,.95,z+(j<6?-.29:.29),7));}
function floorAndWalls(g:THREE.Group,id:string){const theme= id==='oasis'?{wall:0x647269,floor:0x79594c}:id==='jockey'||id==='casa_familiar'?{wall:0xcebe9e,floor:0x7a624f}:id==='unicornio'?{wall:0x535c65,floor:0x897b7c}:id==='porciuncula'?{wall:0xbcbab0,floor:0xa89c89}:id==='oficina'?{wall:0xc2c5bf,floor:0x929992}:id==='taller'?{wall:0xd4c5ac,floor:0xac805c}:{wall:0xe6dfd3,floor:0xa78a73};
 g.add(box(8,.20,9.2,theme.floor,0,-.12,.25));g.add(box(8,4,.18,theme.wall,0,1.95,-4.34));
 for(let side of [-1,1]){const w=box(.15,3.8,8.3,theme.wall,side*4,1.9,-.10);g.add(w);
  g.add(box(.17,.16,8.3,PAL.cream,side*4,.14,-.10));}
 g.add(box(8,.14,.4,0xeee2d2,0,3.85,-4.1));
 for(let j=0;j<10;j++){const z=-3.9+j*.86;g.add(box(7.85,.008,.014,0x826950,0,.007,z));}
 for(let x of [-2.4,2.4]){g.add(box(1.14,1.45,.04,PAL.wood,x,2.0,-4.21));g.add(box(1.05,1.3,.07,PAL.glass,x,2.01,-4.15));g.add(box(.045,1.35,.08,PAL.cream,x,2.01,-4.1));g.add(box(1.12,.04,.09,PAL.cream,x,2.03,-4.10));}
 const lamp=ball(.21,0xf0d8a8,0,3.45,-.30);g.add(lamp);g.add(cyl(.02,.02,.34,PAL.ink,0,3.76,-.3));
}
function stage(g:THREE.Group){g.add(box(2.8,.24,1.35,0x765e50,0,.13,-2.95));g.add(box(2.8,.08,.15,0xb58e6b,0,.30,-2.18));g.add(box(2.4,2.6,.07,0x6c685b,0,1.32,-4.19));}
function bar(g:THREE.Group){g.add(box(3.3,1.05,.6,0x75513c,0,.54,-2.8));g.add(box(3.55,.12,.78,0xae8b64,0,1.11,-2.80));
 for(let j=0;j<13;j++){const b=cyl(.045,.055,.22,[0x795b45,0x466f62,0x92715d][j%3],-1.44+j*.23,1.35,-3.12,9);g.add(b);}
 for(let j=0;j<3;j++)chair(g,-2+j*2,-1.8);}
function flames(g:THREE.Group){g.add(box(1.45,1.2,.35,0x9e8169,0,.59,-4.13));g.add(box(1.10,.77,.08,0x423731,0,.45,-3.87));for(let x of [-.18,0,.15]){const f=mesh(new THREE.ConeGeometry(.12,.44,6),mat([0xcf6550,0xe4a45e,0xf0be65][Math.round((x+.18)*4)%3]));f.position.set(x,.42,-3.78);g.add(f);}}
function gradientPanel(g:THREE.Group){for(let j=0;j<7;j++){const wavePts=[];for(let i=0;i<18;i++){let y=.4+i*.125;wavePts.push(new THREE.Vector3(-.9+j*.30+Math.sin(y*1.3+j)*.13,y,-4.03));}g.add(tube(wavePts,.065,[0xd0779d,0x76c3bf,0xbace7c,0xd4a0a6][j%4]));}}
function columns(g:THREE.Group){for(let x of [-2.65,-1.1,1.1,2.65]){g.add(cyl(.12,.15,3.20,0xe7dfd0,x,1.6,-2.4,12));g.add(box(.45,.14,.45,0xb8a78d,x,3.25,-2.4));g.add(box(.4,.11,.4,0xb8a78d,x,.11,-2.4));}}
function cemetery(g:THREE.Group){g.add(box(8,.2,9.2,0x90958c,0,-.13,0));for(let i=0;i<28;i++){const x=-3.5+(i%7)*1.15,z=-2.6+Math.floor(i/7)*1.5;const h=.55+rnd()*.5;g.add(box(.5,h,.22,0xb1b5a9,x,h/2,z));g.add(ball(.25,0xb1b5a9,x,h,z));}for(let i=0;i<6;i++){const t=makeTree('pine',2+rnd());t.position.set((i%2?3.6:-3.6),0,-3.7+i*1.55);g.add(t);}}
function park(g:THREE.Group){g.add(box(8,.2,9.2,0x86a17f,0,-.14,0));for(let i=0;i<12;i++){const t=makeTree('leaf',1.55+rnd());t.position.set((rnd()-.5)*7,0,(rnd()-.5)*8);g.add(t)}for(let i=0;i<4;i++)g.add(box(7,.03,.42,0xc1b69c,0,.01,-3+i*2));g.add(makeBench());g.children[g.children.length-1].position.set(1,0,-1.4);
 const dog=box(.62,.38,.24,0x675f53,-1,.40,-.5);g.add(dog);g.add(ball(.18,0x675f53,-1.40,.55,-.5));
 for(let dx of [-1.2,-.84])for(let dz of [-.56,-.39])g.add(box(.065,.32,.055,0x675f53,dx,.19,dz));}
function street(g:THREE.Group){g.add(box(8,.12,9.2,0x80868b,0,-.14,0));for(let i=0;i<5;i++)g.add(box(.12,.01,.7,0xe9e1cf,0,.012,-3.8+i*1.7));
 for(let x of [-3.4,3.4]){g.add(box(1,.13,9.2,0xc3b9a6,x,-.02,0));for(let i=0;i<4;i++){const t=makeLamp();t.position.set(x,0,-3+i*2);g.add(t)}}g.add(makeVehicle(true,0xbd615a));g.children[g.children.length-1].position.set(1.65,0,-2);}
export interface Interior {group:THREE.Group;characters:THREE.Group[];entry:THREE.Vector3}
export function makeInterior(id:string):Interior{
 const g=new THREE.Group();const chars:THREE.Group[]=[];
 if(inside(id))floorAndWalls(g,id);else if(id==='cementerio')cemetery(g);else if(id==='parque'||id==='cerros')park(g);else street(g);
 if(id==='apartamento'){
  rug(g,0,.4,3.5,2.4,0xb2a1ae);bed(g,1.65,-.7);bookcase(g,-3,-3.6);couch(g,-2,.75,0x7c8f91);painting(g,0,2.5,-4.04);
  g.add(box(1.4,1.1,.10,PAL.glass,-2,1.8,-4.09));
 }else if(id==='taller'){
  rug(g,0,-1.4,4.2,2.6,0xc0a18a);couch(g,-2.4,-2.7,0x758174);bookcase(g,3,-3.8);roundTable(g,.7,-1.8);chess(g,.7,-1.8);
  flames(g);for(let i=0;i<4;i++)painting(g,-2+i*1.3,1.9,-4.02,i%3);
  // Caballete con lienzo
  const easel=box(.07,1.7,.09,PAL.wood,2.0,.85,-.5);easel.rotation.z=.12;g.add(easel);painting(g,2.02,1.28,-.45);
 }else if(id==='oasis'){rug(g,0,-.8,4.5,3.5,0x5b685c);bar(g);roundTable(g,-2.1,0);roundTable(g,2,0);stage(g);const s=textPanel('MUSIC BAR',2,.42,.0);s.position.set(0,3.0,-4.02);g.add(s);
 }else if(id==='unicornio'){
  g.add(box(4,.08,3.8,0x8a7a8d,0,.08,-1.4));gradientPanel(g);for(let x of [-2.5,2.5]){
   const t=ball(.32,x<0?0xa3d9d0:0xe1a4bc,x,3.25,-2);g.add(t)}
  roundTable(g,-2.2,1.2);roundTable(g,2.2,1.2);stage(g);
 }else if(id==='jockey'){columns(g);rug(g,0,-1.3,4,4,0xb7a580);for(let i=0;i<3;i++){roundTable(g,-2.4+i*2.4,-1.1);chair(g,-2.4+i*2.4,-.4)}painting(g,0,2.3,-4.03,2);
 }else if(id==='porciuncula'){
  columns(g);g.add(box(2.1,.68,1.35,PAL.stone,0,.34,-3.1));g.add(box(1.8,.11,1.13,PAL.gold,0,.76,-3.1));
  for(let x of [-2.1,2.1])for(let z of [-.8,.5,1.7]){const b=makeBench();b.position.set(x,0,z);b.scale.set(1.3,1,1);g.add(b)}
  const vit=ball(.48,0x8eb9ae,0,2.6,-4.04,20);g.add(vit);g.add(box(.08,.7,.04,0xdbb984,0,2.6,-3.99));g.add(box(.7,.09,.04,0xdbb984,0,2.65,-3.99));
 }else if(id==='casa_familiar'){
  rug(g,0,-1.0,5.0,4.0,0xb9a38b);g.add(box(4,.10,1.2,0x8d6a4e,0,.78,-1.3));for(let x of [-1.7,-.9,0,.9,1.7])chair(g,x,-.3,0x827062);bookcase(g,-3.45,-3.65);flames(g);
 }else if(id==='oficina'){
  for(let x of [-2.35,0,2.35]){desk(g,x,-1.1);chair(g,x,0,0x626c68)}bookcase(g,3.1,-3.7);g.add(box(.8,1.1,.66,0x8b958e,-3,.55,-3));
 }else if(id==='cerros'){for(let i=0;i<20;i++){const t=makeTree('pine',.8+rnd()*2);t.position.set((rnd()-.5)*7,0,(rnd()-.5)*7);g.add(t)}g.add(box(.9,1.0,.7,0xe1d7c4,0,.5,-3.3));}
 // Un protagonista independiente permite animarlo sin alterar los personajes secundarios.
 const players:Record<string,[string,number,boolean][]>={apartamento:[['Fina',0xa69aa4,true]],taller:[['Diego León',0xd2c2a6,false],['Ana María',0x8c7974,true],['Federico',0x4d5557,false],['Beatriz',0x717d7d,true]],oasis:[['Edén',0x635b56,false],['Rubén',0x826e5b,false],['Ramón',0x826e5b,false],['Narciso',0x6c7770,false]],unicornio:[['Inga',0xd5c4b7,true],['Federico',0x4a4a48,false]],jockey:[['Tío Foción',0x55575a,false],['Prima',0xb88f8c,true]],porciuncula:[['Monseñor Boterito',0x3a3b3d,false],['Leonor',0x706579,true]],casa_familiar:[['Tío Foción',0x4c4e4d,false],['Tío Pablo',0x6b655c,false],['Prima Alicia',0x9d8a83,true],['Leonor',0x5a6266,true]],oficina:[['Oficinista',0x7f857b,false]],parque:[['Angela',0x9c9387,true],['Federico',0x535f55,false],['Beatriz',0x6f756a,true]],septima:[['Poeta urbano',0x817668,false],['Edén',0x655d54,false],['Narciso',0x68777b,false]],cerros:[],cementerio:[['Memoria',0xb1b9b6,false]]};
 const roster=players[id]??[];for(let j=0;j<roster.length;j++){const [name,jacket,skirt]=roster[j];const p=human(1.7,jacket,0xb9937f,skirt);const x=(j-(roster.length-1)/2)*Math.min(1.6,5.8/Math.max(1,roster.length-1));p.position.set(x,0,-1.45-(j%2)*.8);p.rotation.y=Math.PI;p.userData.name=name;
 if(name==='Inga'){for(const part of p.children){if(part instanceof THREE.Mesh && part.position.y<.12 && Math.abs(part.position.x)<.2){part.material=mat(0xc29c83);}}}
 g.add(p);chars.push(p);}
 // Puerta de retorno: detrás del usuario, por la misma vía de entrada (z positivo).
 const threshold=new THREE.Vector3(0,0,4.5);
 return {group:g,characters:chars,entry:threshold};
}
