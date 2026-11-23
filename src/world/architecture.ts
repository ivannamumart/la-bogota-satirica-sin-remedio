/** Arquitectura especulativa de Bogotá, ca. 1972. Paisajes teatralizados, no restituciones métricas. */
import * as T from 'three';
import {paint,solid,block,paperBox,cylinder,cone,sphere,torus,pathStroke,sign,seeded,PALETTE} from './art';
export type PlaceId='apartamento'|'taller'|'oasis'|'unicornio'|'jockey'|'porciuncula'|'parque'|'casa_familiar'|'oficina'|'cementerio'|'septima'|'cerros';
const rnd=seeded(1977);const ink=solid(PALETTE.ink),glass=new T.MeshPhysicalMaterial({color:0x8aaab0,transparent:true,opacity:.68,roughness:.28,metalness:.08,depthWrite:false});
const warmglass=new T.MeshStandardMaterial({color:0xe1bf78,emissive:0xc39a66,emissiveIntensity:.42,roughness:1});
function railed(g:T.Group,x:number,y:number,z:number,w:number){block(g,w,.065,.18,paint('cedar'),x,y,z);for(let n=0;n<5;n++)cylinder(g,.018,.35,ink,x-w*.46+n*w*.23,y+.21,z+.06,8)}
export function tree(kind:'pine'|'leaf'|'cypress'|'palm'='leaf',h=1){const g=new T.Group();g.name=`arbol_${kind}`;
 cylinder(g,.06*h,.61*h,paint('cedar'),0,.31*h,0,7);
 if(kind==='pine'||kind==='cypress'){
  for(let i=0;i<4;i++){const r=h*(kind==='cypress'?.18:.33)*(1-i*.18);const cl=cone(g,r,h*.44,paint(i%2?'pine':'moss'),0,h*(.46+i*.16),0,7);cl.rotation.y=.4*i}
 }else if(kind==='palm'){
  for(let k=0;k<7;k++){const a=k*Math.PI*2/7;const pts=[];for(let j=0;j<=9;j++){const q=j/9;pts.push(new T.Vector3(Math.cos(a)*q*h*.48,h*(.92+Math.sin(q*Math.PI)*.13-q*.20),Math.sin(a)*q*h*.48))}pathStroke(g,pts,0x536d49,.07*h)}
 }else{
  for(let k=0;k<5;k++){const a=k*Math.PI*2/5;const leaf=sphere(g,.31*h,paint(k%2?'olive':'moss'),Math.cos(a)*.19*h,.72*h+Math.sin(k)*.14*h,Math.sin(a)*.21*h,1);leaf.scale.set(1.05,.80,.95)}
 }
 return g;
}
export function lamp(h=1.8){const g=new T.Group();cylinder(g,.033,h,paint('charcoal'),0,h/2,0,9);sphere(g,.07,paint('charcoal'),0,h,0,1);
 const pts=[new T.Vector3(0,h-.08,0),new T.Vector3(.15,h+.06,0),new T.Vector3(.35,h-.04,0)];pathStroke(g,pts,0x222e2f,.028);
 const cap=sphere(g,.19,paint('charcoal'),.38,h-.07,0,1);cap.scale.set(1,.3,.8);
 const light=sphere(g,.105,warmglass,.38,h-.14,0,1);light.scale.y=.55;return g;}
export function bench(){const g=new T.Group();for(let y of [.47,.57,.68])block(g,.90,.055,.16,paint('cedar'),0,y,-.06);
 for(let y of [.80,.92])block(g,.90,.06,.06,paint('wood'),0,y,-.32);
 for(let x of [-.34,.34]){cylinder(g,.048,.49,paint('charcoal'),x,.28,-.20,8);cylinder(g,.048,.49,paint('charcoal'),x,.28,.12,8);}return g;}
export function vehicle(type:'bus'|'taxi'|'car'='bus',paintColor='terracotta'){
 const g=new T.Group();const bus=type==='bus';const w=bus?.81:.60,d=bus?1.90:type==='taxi'?1.05:1.17,h=bus?.88:.49;
 // Carrocería con extremos suavizados, ventanillas individualizadas y una parrilla real.
 const b=paperBox(g,w,h*.75,d,paintColor,0,.45,0);b.scale.y=1;
 const cab=paperBox(g,w*.94,h*.50,d*.88,bus?'plaster':'ochre',0,.45+h*.55,0);
 const roof=sphere(g,w*.54,paint(bus?'plaster':paintColor),0,.49+h*.87,0,1);roof.scale.set(.90,.15,bus?2.02:1.48);
 for(let side of [-1,1]){
  const count=bus?6:2;
  for(let j=0;j<count;j++){
   let z=-d*.36+j*(d*.72/Math.max(1,count-1));
   block(g,.012,h*.30,bus?.20:.19,glass,side*w*.49,.65+h*.35,z);
   block(g,.022,h*.32,.019,ink,side*w*.50,.65+h*.34,z+(bus?.12:.11));
  }
  for(let z of [-d*.32,d*.31]){
   const wh=cylinder(g,bus?.16:.13,.08,paint('charcoal'),side*w*.49,.22,z,14);wh.rotation.z=Math.PI/2;
   cylinder(g,.078,.081,paint('slate'),side*w*.54,.22,z,12).rotation.z=Math.PI/2;
  }
  block(g,.016,.12,d*.75,paint('gold'),side*w*.505,.39,0);
 }
 block(g,w*.70,h*.37,.012,glass,0,.59+h*.30,d*.49);
 block(g,w*.70,h*.24,.014,paint('charcoal'),0,.36,d*.501);
 for(let x of [-w*.31,w*.31])sphere(g,.063,warmglass,x,.40,d*.53,1);
 block(g,w*.85,.045,.10,paint('slate'),0,.21,d*.56);
 if(bus)sign(g,'BOGOTÁ — CENTRO',.64,.11,0,.88,d*.52);
 if(type==='taxi')sign(g,'TAXI',.27,.11,0,1.01,0);
 return g;
}
function window(g:T.Group,x:number,y:number,z:number,w=.55,h=.70,arch=false,withBalcony=false){
 block(g,w+.13,h+.13,.045,paint('stone'),x,y,z);
 block(g,w,h,.045,glass,x,y,z+.029);
 block(g,.028,h,.056,paint('charcoal'),x,y,z+.067);
 block(g,w,.022,.055,paint('charcoal'),x,y,z+.068);
 if(arch){torus(g,w*.48,.036,paint('stone'),x,y+h*.49,z+.075);}
 if(withBalcony){block(g,w+.28,.07,.29,paint('stone'),x,y-h*.55,z+.20);railed(g,x,y-h*.41,z+.37,w+.20);}
}
function realDoor(g:T.Group,z:number,h=1.25,w=.72){
 // Hueco practicable representado con jambas en profundidad; la hoja gira visualmente al entrar.
 block(g,w+.30,h+.19,.11,paint('stone'),0,h*.5,z);
 block(g,w+.12,h+.04,.13,paint('charcoal'),0,h*.5,z+.066);
 block(g,w*.84,h*.94,.05,paint('cedar'),-.055,h*.51,z+.125);
 for(let s of [-1,1]){
  block(g,.035,h*.83,.045,paint('wood'),s*w*.28,h*.51,z+.161);
 }
 sphere(g,.035,paint('gold'),w*.27,h*.49,z+.19,1);
 block(g,w+.22,.08,.44,paint('stone'),0,.045,z+.22);
}
function roof(g:T.Group,w:number,d:number,h:number,style:'tiled'|'flat'|'mansard'|'gothic'){
 if(style==='flat'){
  block(g,w+.24,.20,d+.25,paint('stone'),0,h+.06,0);
  for(let x of [-w*.42,w*.42])block(g,.055,.27,d+.19,paint('stone'),x,h+.24,0);
 } else if(style==='tiled'){
  const shape=new T.Shape();shape.moveTo(-w*.55,0);shape.lineTo(0,.65);shape.lineTo(w*.55,0);shape.lineTo(-w*.55,0);
  const geo=new T.ExtrudeGeometry(shape,{depth:d+.22,bevelEnabled:false});
  const obj=new T.Mesh(geo,paint('terracotta',0xa27f68));obj.position.set(0,h,-d*.52-.12);obj.castShadow=true;g.add(obj);
  for(let i=0;i<8;i++){
   const z=-d*.47+i*d/7;
   pathStroke(g,[new T.Vector3(-w*.54,h+.04,z),new T.Vector3(0,h+.66,z),new T.Vector3(w*.54,h+.04,z)],0x715a4d,.011,.72);
  }
 }else{
  const r=cone(g,Math.max(w,d)*.64,style==='gothic'?.84:.48,paint(style==='gothic'?'slate':'charcoal'),0,h+.32,0,4);r.rotation.y=Math.PI/4;r.scale.z=d/w;
 }
}
function residence(g:T.Group,w=2.8,h=2.40,d=1.9,kind:'soledad'|'elite'|'modern'|'bohemia'='soledad'){
 const wall=kind==='modern'?'slate':kind==='elite'?'stone':kind==='bohemia'?'ochre':'brick';
 const material=paint(wall,kind==='soledad'?0xe2cbb9:undefined);
 block(g,w,h,d,material,0,h/2,-.73);
 block(g,w+.09,.14,d+.08,paint('stone'),0,.06,-.73);
 const frontZ=-.73+d/2+.032;
 // Abertura oscura, umbral y hoja tridimensional.
 realDoor(g,frontZ+.09,kind==='elite'?1.33:1.17,.68);
 const n=kind==='modern'?4:3,rows=kind==='modern'?3:2;
 for(let i=0;i<n;i++)for(let r=0;r<rows;r++){
  const x=(i-(n-1)/2)*(w-.45)/n*1.10;
  if(r===0&&Math.abs(x)<.45)continue;
  const y=.71+r*(h-.68)/(Math.max(1,rows));
  window(g,x,y,frontZ,.42,.53,kind==='elite',r>0&&kind==='soledad');
 }
 if(kind==='elite'){
   for(let x of [-w*.41,w*.41]){
     cylinder(g,.12,h*.85,paint('stone'),x,h*.44,frontZ+.16,12);
     block(g,.36,.12,.34,paint('gold'),x,h*.92,frontZ+.18);
   }
   for(let y of [h-.15,.16])block(g,w+.28,.10,d+.24,paint('stone'),0,y,-.73);
 }
 if(kind==='bohemia'){for(let i=0;i<4;i++)block(g,.10,.13,.045,paint('plaster'),-w*.36+i*w*.24,h-.30,frontZ+.02);}
 roof(g,w,d,h,kind==='modern'?'flat':kind==='elite'?'mansard':'tiled');
 return frontZ;
}
function gothic(g:T.Group){
 const white=paint('stone',0xe8dfce),darkslate=paint('slate',0x69767a),gold=paint('gold');
 block(g,2.30,2.50,2.4,white,0,1.25,-.9);const z=.35;
 for(let side of [-1,1]){
   let x=side*1.12;
   block(g,.66,3.15,.78,white,x,1.575,.12);
   for(let i=0;i<3;i++)window(g,x,.88+i*.63,.545,.19,.35,true);
   cone(g,.56,1.22,darkslate,x,3.75,.12,4).rotation.y=Math.PI/4;
   cylinder(g,.022,.30,gold,x,4.52,.12,8);
   block(g,.17,.025,.05,gold,x,4.56,.12);
 }
 roof(g,2.29,2.45,2.48,'gothic');
 realDoor(g,z+.23,1.34,.84);
 torus(g,.40,.075,paint('gold'),0,2.10,z+.16);
 sphere(g,.31,new T.MeshBasicMaterial({color:0x76a7a6}),0,2.10,z+.17,2);
 for(let a=0;a<9;a++){
   const ang=a*2*Math.PI/9;
   pathStroke(g,[new T.Vector3(0,2.10,z+.45),new T.Vector3(Math.sin(ang)*.31,2.10+Math.cos(ang)*.31,z+.46)],0xdbb979,.020);
 }
 for(let i=0;i<4;i++){block(g,2.6-i*.15,.075,.32,paint('stone'),0,.03+i*.065,.85+i*.26);}
 for(let x of [-1.6,1.6]){const t=tree('cypress',1.45);t.position.set(x,0,.65);g.add(t)}
}
function jockey(g:T.Group){
 residence(g,3.60,2.45,2.1,'elite');
 // Frontón neoclásico en volumen: una cornisa y tres columnas de piedra.
 const shp=new T.Shape();shp.moveTo(-1.86,0);shp.lineTo(0,.66);shp.lineTo(1.86,0);shp.closePath();
 const m=new T.Mesh(new T.ExtrudeGeometry(shp,{depth:.22,bevelEnabled:false}),paint('stone'));m.position.set(0,2.63,.43);g.add(m);
 block(g,3.90,.13,.53,paint('gold'),0,2.53,.50);
 for(let x of [-1.35,-.45,.45,1.35]){
   cylinder(g,.13,1.63,paint('stone'),x,1.12,.58,14);
   block(g,.36,.13,.38,paint('gold'),x,1.97,.60);
 }
 for(let i=0;i<5;i++)block(g,3.7-i*.25,.075,.27,paint('stone'),0,.04+i*.072,.93+i*.26);
}
function houseSign(g:T.Group,title:string,z=1.05,color='#e7d5b6'){sign(g,title,1.40,.30,0,1.85,z,'#342b24',color)}
function kiosk(){const g=new T.Group();block(g,.75,1.10,.55,paint('cedar'),0,.56);roof(g,.85,.62,1.11,'tiled');for(let i=0;i<5;i++)block(g,.18,.28,.016,paint(i%2?'plaster':'paper'),-.24+i*.12,.78,.295);sign(g,'PRENSA',.63,.17,0,1.2,.32);return g;}
export function makeLandmark(id:PlaceId){
 const root=new T.Group();root.name=`lugar_${id}`;
 // El volumen del edificio se integra en un pequeño basamento de curvas suaves.
 const base=paint('grass',id==='cementerio'?0xa2a4a0:id==='jockey'?0xcfc3a7:0xe5e6d5);
 const soil=cylinder(root,2.00,.16,base,0,-.12,-.25,48);soil.scale.z=.87;
 for(let r=0;r<3;r++){
   const pts=[];for(let i=0;i<=64;i++){const a=i/64*Math.PI*2;const f=1+Math.sin(a*3+r*.8)*.08;pts.push(new T.Vector3(Math.cos(a)*(1.4+r*.23)*f,-.02+r*.004,Math.sin(a)*(1.12+r*.20)*f-.25));}
   pathStroke(root,pts,0x697467,.011,.35);
 }
 const g=new T.Group();g.position.z=-.66;root.add(g);
 switch(id){
 case 'apartamento':{
   residence(g,2.75,2.4,1.85,'soledad');
   for(let x of [-1.64,1.64]){const t=tree('leaf',1.55);t.position.set(x,0,.35);g.add(t)}
   block(g,3.3,.06,.31,paint('stone'),0,.04,1.06);
   for(let x of [-1.39,1.39])block(g,.042,.82,.045,paint('charcoal'),x,.45,1.07);
   break;}
 case 'taller':{
   residence(g,3.1,2.18,1.8,'bohemia');
   for(let i=0;i<3;i++){const easel=new T.Group();easel.position.set(-1.8+i*.8,.02,1.15);block(easel,.046,.89,.055,paint('cedar'),0,.45);block(easel,.42,.57,.05,paint('plaster'),0,.74,.03);easel.rotation.y=i*.3;g.add(easel)}
   const t=tree('leaf',1.30);t.position.set(1.77,0,.33);g.add(t);break;}
 case 'oasis':{
   residence(g,3.2,2.0,1.8,'bohemia');houseSign(g,'EL OASIS',.47,'#a6634d');
   for(let x of [-1.5,1.5]){const l=lamp(1.85);l.position.set(x,0,1.17);g.add(l)}
   block(g,2.9,.07,.59,paint('terracotta'),0,1.46,.75);
   break;}
 case 'unicornio':{
   residence(g,3.25,2.35,1.9,'modern');
   for(let i=0;i<8;i++){const stripe=block(g,.14,1.38,.04,paint(['purple','olive','bluegray'][i%3]),-1.07+i*.305,1.20,.35);stripe.rotation.z=.045*Math.sin(i*2)}
   sign(g,'EL UNICORNIO',1.8,.30,0,2.35,.50,'#4d3d55','#dfc1d1');
   for(let x of [-1.78,1.78]){const t=tree('palm',1.37);t.position.set(x,0,.35);g.add(t)}break;}
 case 'jockey':{
   jockey(g);for(let x of [-2.0,2.0]){const t=tree('leaf',1.15);t.position.set(x,0,.51);g.add(t)}break;}
 case 'porciuncula':{gothic(g);break;}
 case 'parque':{
   const ring=new T.Mesh(new T.RingGeometry(.80,.98,48),paint('stone')); // override below
   ring.material=paint('stone');ring.rotation.x=-Math.PI/2;ring.position.y=.03;g.add(ring);
   cylinder(g,.49,.10,paint('stone'),0,.05,0,22);
   cylinder(g,.40,.025,new T.MeshPhysicalMaterial({color:0x88b9bd,transparent:true,opacity:.6}),0,.115,0,22);
   cylinder(g,.11,.58,paint('stone'),0,.43,0,14);
   sphere(g,.15,paint('paper'),0,.79,0,1);
   for(let i=0;i<11;i++){const a=i/11*Math.PI*2;const t=tree(i%2?'leaf':'pine',.9+(i%3)*.19);t.position.set(Math.cos(a)*1.67,0,Math.sin(a)*1.34);g.add(t)}
   const b=bench();b.position.set(1.07,0,1.16);b.rotation.y=.42;g.add(b);break;}
 case 'casa_familiar':{
   residence(g,3.5,2.35,2.1,'elite');
   for(let x of [-2,2]){const t=tree('palm',1.52);t.position.set(x,0,.18);g.add(t)}
   for(let i=0;i<4;i++)block(g,2.7-i*.19,.075,.30,paint('stone'),0,i*.075,.83+i*.24);break;}
 case 'oficina':{
   residence(g,3.0,3.12,2.08,'modern');
   for(let y of [1.07,1.85,2.63])block(g,3.13,.08,2.21,paint('stone'),0,y,-.73);
   const k=kiosk();k.position.set(-1.8,0,.45);g.add(k);break;}
 case 'cementerio':{
   // Cementerio de piedra: retícula irregular de tumbas, cipreses y mausoleo central.
   for(let i=0;i<18;i++){
     const x=-1.48+(i%6)*.52,z=-1.13+Math.floor(i/6)*.65;
     const s=block(g,.31,.43+(i%4)*.08,.19,paint('stone',i%3?0xe0ded7:0xb7b7b5),x,.26,z);s.rotation.y=(i%3-1)*.10;
     torus(g,.14,.02,paint('stone'),x,.52,z+.112);
   }
   block(g,.73,1.4,.75,paint('stone'),1.03,.7,-1.18);
   cone(g,.55,.62,paint('slate'),1.03,1.70,-1.18,4).rotation.y=Math.PI/4;
   for(let x of [-1.8,1.9]){let t=tree('cypress',2.1);t.position.set(x,0,.10);g.add(t)}break;}
 case 'septima':{
   for(let side of [-1,1]){
     const b=new T.Group();b.position.set(side*1.38,0,-.72);b.rotation.y=side===-1?.17:-.14;g.add(b);
     residence(b,1.75,side===1?2.65:2.1,1.55,side<0?'soledad':'modern');
   }
   block(g,3.13,.04,.8,paint('charcoal'),0,.055,.84);
   let bus=vehicle('bus','terracotta');bus.scale.setScalar(.77);bus.position.set(.42,.06,.97);bus.rotation.y=.15;g.add(bus);
   for(let x of [-2.12,2.12]){const l=lamp(1.9);l.position.set(x,0,1.0);g.add(l)}break;}
 case 'cerros':{
   // No se puede caminar sobre ellos: están esculpidos como relieve del globo.
   // Aquí se ubican las ermitas como hitos de la silueta de la montaña.
   const mon=new T.Group();g.add(mon);mon.position.set(-.75,1.10,-.45);
   block(mon,.60,.53,.48,paint('plaster'),0,.27);roof(mon,.7,.54,.53,'tiled');realDoor(mon,.27,.35,.24);
   cylinder(mon,.045,.24,paint('stone'),0,1.06);block(mon,.22,.035,.09,paint('stone'),0,1.13);
   const gua=new T.Group();gua.position.set(1.25,.72,-.55);g.add(gua);block(gua,.45,.45,.43,paint('plaster'),0,.23);cone(gua,.35,.45,paint('slate'),0,.66,0,5);cylinder(gua,.025,.19,paint('stone'),0,1.01);block(gua,.17,.028,.06,paint('stone'),0,1.09);
   for(let i=0;i<11;i++){let t=tree('pine',.65+(i%4)*.2);t.position.set(-1.8+rnd()*3.6,.05,-.35+rnd()*1.15);g.add(t)}break;}
 }
 return root;
}
