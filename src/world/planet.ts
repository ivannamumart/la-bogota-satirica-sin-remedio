import * as T from 'three';
import {paint,solid,pathStroke,seeded,PALETTE} from './art';
import {tree,lamp,makeLandmark,vehicle,type PlaceId} from './architecture';
export const R=11.8, DEG=Math.PI/180;
export interface Site{ id:PlaceId; name:string; area:string; lat:number; lon:number; scene:boolean; scale:number;}
/** Distribución dramática por toda la esfera, distinta a las coordenadas reales. */
export const SITES:Site[]=[
 {id:'apartamento',name:'La Soledad',area:'El apartamento de Escobar y Fina',lat:6,lon:0,scene:true,scale:1.04},
 {id:'taller',name:'El taller',area:'Diego León y los compañeros',lat:18,lon:32,scene:true,scale:1.04},
 {id:'oasis',name:'El Oasis',area:'La noche bohemia',lat:-3,lon:65,scene:true,scale:1.05},
 {id:'septima',name:'Carrera Séptima',area:'La ciudad bajo la lluvia',lat:-15,lon:98,scene:true,scale:1.12},
 {id:'parque',name:'Parque Nacional',area:'Deriva y afectos',lat:13,lon:130,scene:true,scale:1.18},
 {id:'porciuncula',name:'La Porciúncula',area:'El ritual y la élite',lat:19,lon:163,scene:true,scale:1.08},
 {id:'jockey',name:'Jockey Club',area:'La ceremonia de la clase',lat:9,lon:195,scene:true,scale:1.10},
 {id:'casa_familiar',name:'Casa familiar',area:'El linaje político',lat:-15,lon:225,scene:true,scale:1.09},
 {id:'oficina',name:'La oficina',area:'La postergación',lat:-18,lon:256,scene:true,scale:1.07},
 {id:'unicornio',name:'El Unicornio',area:'La noche del norte',lat:16,lon:290,scene:true,scale:1.12},
 {id:'cementerio',name:'Cementerio Central',area:'La muerte y la memoria',lat:-19,lon:324,scene:true,scale:1.08},
 {id:'cerros',name:'Cerros Orientales',area:'El horizonte de Bogotá',lat:61,lon:8,scene:false,scale:1.32},
];
export function dir(lat:number,lon:number){const a=lat*DEG,b=lon*DEG;return new T.Vector3(Math.cos(a)*Math.sin(b),Math.sin(a),Math.cos(a)*Math.cos(b));}
const PEAKS=[{n:dir(58,5),h:3.30,w:.29},{n:dir(64,-17),h:2.75,w:.26},{n:dir(51,27),h:2.15,w:.27},{n:dir(61,49),h:1.55,w:.27},{n:dir(54,-42),h:1.24,w:.33}];
function angular(a:T.Vector3,b:T.Vector3){return Math.acos(T.MathUtils.clamp(a.dot(b),-1,1));}
export function relief(n:T.Vector3){let h=.085*Math.sin(n.x*19+n.z*23)*Math.cos(n.y*11) +.05*Math.sin(n.z*42+n.y*37);
 for(const p of PEAKS){const d=angular(n,p.n);h+=p.h*Math.exp(-Math.pow(d/p.w,2))*(1+.045*Math.sin(d*91+n.x*30));}
 // Cadena de crestas menores: relieve articulado y no montañas cónicas independientes.
 const lat=Math.asin(n.y)/DEG;const lon=Math.atan2(n.x,n.z)/DEG;
 const ridgeLat=51+8*Math.sin(lon*DEG*2.1)+3*Math.sin(lon*DEG*6.3);
 const longDecay=Math.exp(-Math.pow(Math.min(Math.abs(lon),Math.abs(360-Math.abs(lon)))/88,2));
 h+=.70*Math.exp(-Math.pow((lat-ridgeLat)/12,2))*longDecay;
 return Math.max(-.11,h);
}
export function ground(n:T.Vector3,delta=0){const normal=n.clone().normalize();return normal.multiplyScalar(R+relief(normal)+delta);}
export interface Track{index:number;from:number;to:number;points:T.Vector3[];lengths:number[];total:number;group:T.Group;}
function slerp(a:T.Vector3,b:T.Vector3,t:number){const angle=angular(a,b);if(angle<.0001)return a.clone();return a.clone().multiplyScalar(Math.sin((1-t)*angle)/Math.sin(angle)).addScaledVector(b,Math.sin(t*angle)/Math.sin(angle)).normalize();}
function curveNormals(a:T.Vector3,b:T.Vector3,count:number){const list:T.Vector3[]=[];
 for(let j=0;j<=count;j++){
  const t=j/count,n=slerp(a,b,t);const forward=slerp(a,b,Math.min(1,t+.001)).sub(slerp(a,b,Math.max(0,t-.001))).normalize();
  const side=new T.Vector3().crossVectors(n,forward).normalize();const wiggle=.014*Math.sin(t*23+1.7)+.012*Math.sin(t*13);
  list.push(n.addScaledVector(side,wiggle).normalize());}
 return list;
}
function makeTrack(from:number,to:number,index:number){const a=dir(SITES[from].lat,SITES[from].lon),b=dir(SITES[to].lat,SITES[to].lon);
 const count=Math.max(60,Math.ceil(angular(a,b)*110)),normals=curveNormals(a,b,count);const points=normals.map(n=>ground(n,.115));
 const verts:number[]=[],tri:number[]=[];const widths:number[]=[];const lengths=[0];let total=0;
 const sand=paint('stone',0xd2c6af,{double:true});
 for(let i=0;i<points.length;i++){
  if(i>0){total+=points[i].distanceTo(points[i-1]);lengths.push(total)}
  const f=points[Math.min(i+1,points.length-1)].clone().sub(points[Math.max(0,i-1)]).normalize();const side=new T.Vector3().crossVectors(normals[i],f).normalize();
  const w=(.30+.025*Math.sin(i*.16))*(from===3?.97:1);widths.push(w);
  for(let k of [-1,1]){const p=points[i].clone().addScaledVector(side,w*k*.5);verts.push(p.x,p.y,p.z)}
  if(i<points.length-1){const t=i*2;tri.push(t,t+2,t+1,t+1,t+2,t+3)}
 }
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setIndex(tri);geo.computeVertexNormals();
 const g=new T.Group();const m=new T.Mesh(geo,sand);m.receiveShadow=true;g.add(m);
 const outlineA:T.Vector3[]=[],outlineB:T.Vector3[]=[];
 for(let i=0;i<points.length;i+=3){const n=normals[i],f=points[Math.min(i+1,points.length-1)].clone().sub(points[Math.max(0,i-1)]).normalize();const side=new T.Vector3().crossVectors(n,f).normalize();outlineA.push(points[i].clone().addScaledVector(side,widths[i]*.56).addScaledVector(n,.016));outlineB.push(points[i].clone().addScaledVector(side,-widths[i]*.56).addScaledVector(n,.016))}
 pathStroke(g,outlineA,0x667363,.013,.62);pathStroke(g,outlineB,0x667363,.013,.62);
 return {index,from,to,points,lengths,total,group:g};
}
function globeMesh(){const geo=new T.SphereGeometry(R,224,136);const a=geo.getAttribute('position'),cs:number[]=[];
 for(let i=0;i<a.count;i++){
  const n=new T.Vector3().fromBufferAttribute(a,i).normalize(),h=relief(n),pt=ground(n);
  a.setXYZ(i,pt.x,pt.y,pt.z);
  const col=new T.Color(h>1.72?0x687d61:h>.85?0x5f8063:h>.25?0x759477:0x9aa58b);
  const v=Math.sin(n.x*103+n.y*81+n.z*140)*.018 + Math.sin(n.y*42+n.x*27)*.029;
  const nearTown=Math.min(...SITES.filter(s=>s.scene).map(s=>angular(n,dir(s.lat,s.lon))));
  col.lerp(new T.Color(nearTown<.13?0xb7ae98:0xa4a997),Math.max(0,.38-nearTown)*1.6);
  col.multiplyScalar(1+v);cs.push(col.r,col.g,col.b);
 }
 geo.setAttribute('color',new T.Float32BufferAttribute(cs,3));geo.computeVertexNormals();
 const m=new T.MeshStandardMaterial({map:paint('paper').map!,vertexColors:true,roughness:.95,metalness:0});const mesh=new T.Mesh(geo,m);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
}
function addContourLines(world:T.Group){const linesMat=new T.LineBasicMaterial({color:0x345645,transparent:true,opacity:.32,depthWrite:false});
 for(let lat=-72;lat<=74;lat+=12){const pts:T.Vector3[]=[];
  for(let i=0;i<=360;i++){const lon=i;const wLat=lat+Math.sin(lon*DEG*3+lat)*1.5+Math.sin(lon*DEG*9)*.38;pts.push(ground(dir(wLat,lon),.045));}
  world.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),linesMat));
 }
 // Topografía levantada en torno a cada cresta oriental.
 for(let pi=0;pi<4;pi++){
  const center=PEAKS[pi].n;const east=new T.Vector3().crossVectors(center,new T.Vector3(0,1,0)).normalize();const north=new T.Vector3().crossVectors(center,east).normalize();
  for(let i=0;i<8;i++){
    const rad=.065+i*.048,pts:T.Vector3[]=[];
    for(let j=0;j<=110;j++){
      const a=j/110*Math.PI*2,r=rad*(1+.09*Math.sin(3*a+i)+.04*Math.cos(7*a));const n=center.clone().addScaledVector(east,Math.cos(a)*r).addScaledVector(north,Math.sin(a)*r*.75).normalize();
      pts.push(ground(n,.064));}
    pathStroke(world,pts,i%3===0?0x2c5547:0x4f6850,.018,.76);
  }
 }
}
function scatterVegetation(world:T.Group){const rng=seeded(826);const foliage=new T.Group();
 // Estratificación: bosques densos sobre los cerros y arbolado pequeño en los corredores.
 for(let i=0;i<235;i++){
  const zz=rng()*2-1,aa=rng()*Math.PI*2,n=new T.Vector3(Math.sqrt(1-zz*zz)*Math.sin(aa),zz,Math.sqrt(1-zz*zz)*Math.cos(aa));
  const mountain=PEAKS.some(p=>angular(n,p.n)<.45),nearTown=SITES.filter(s=>s.scene).some(s=>angular(n,dir(s.lat,s.lon))<.16);
  if(nearTown||(!mountain&&rng()<.64))continue;
  const height=mountain?.47+rng()*.72:.23+rng()*.27;
  const group=tree(mountain?'pine':rng()>.55?'leaf':'cypress',height);
  group.position.copy(ground(n,.015));group.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n);
  foliage.add(group);
 }
 world.add(foliage);
}
export interface WorldData{world:T.Group;routes:Track[];buildings:Map<PlaceId,T.Group>;sites:Site[];}
export function createPlanet():WorldData{
 const world=new T.Group();world.name='bogota_satirica_esfera';world.add(globeMesh());addContourLines(world);
 const buildings=new Map<PlaceId,T.Group>();
 for(const site of SITES){let n=dir(site.lat,site.lon);let g=makeLandmark(site.id);g.scale.setScalar(site.scale);
  g.position.copy(ground(n,.02));g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n);
  // La puerta mira al sendero. Los complejos más grandes resaltan sobre el territorio.
  world.add(g);buildings.set(site.id,g);
  if(site.scene){for(let j=0;j<3;j++){const a=j*2.48+site.lon*.02,d=.20+.10*j;
    const n2=n.clone().add(new T.Vector3(Math.cos(a)*d,Math.sin(a)*d*.15,Math.sin(a)*d)).normalize();
    const t=tree(site.id==='cementerio'?'cypress':site.id==='parque'?'leaf':'leaf',.72+.13*j);
    t.position.copy(ground(n2,.015));t.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n2);world.add(t)}
   if(['septima','oasis','oficina','jockey'].includes(site.id)){
     const v=vehicle(site.id==='septima'?'bus':'taxi',site.id==='oasis'?'ochre':'terracotta');v.scale.setScalar(.48);
     const n3=n.clone().add(new T.Vector3(.10,-.04,.06)).normalize();v.position.copy(ground(n3,.08));v.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n3);world.add(v);
   }
  }
 }
 const routes:Track[]=[];const N=11;
 for(let i=0;i<N;i++){const route=makeTrack(i,(i+1)%N,routes.length);world.add(route.group);routes.push(route)}
 // Dos atajos reales, recorribles: conectan espacios narrativamente relacionados.
 for(const [a,b] of [[1,4],[6,9]] as [number,number][]){const t=makeTrack(a,b,routes.length);world.add(t.group);routes.push(t);}
 scatterVegetation(world);
 return {world,routes,sites:SITES,buildings};
}
export function interpolateTrack(track:Track,dist:number){dist=T.MathUtils.clamp(dist,0,track.total);
 let lo=0,hi=track.lengths.length-1;while(lo+1<hi){const mid=(lo+hi)>>1;if(track.lengths[mid]<dist)lo=mid;else hi=mid}
 const a=track.lengths[lo],b=track.lengths[hi];const t=(dist-a)/Math.max(1e-6,b-a);
 const pos=track.points[lo].clone().lerp(track.points[hi],t);
 const tangent=track.points[hi].clone().sub(track.points[lo]).normalize();return {pos,normal:pos.clone().normalize(),tangent};
}
