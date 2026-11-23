/** Esfera de cemento + Bogotá concentrada en su corona superior. 
 * Plano compartido con la lámina V04. La geometría es escenográfica, NO cartografía métrica. */
import * as T from 'three';
import {paint,solid,pathStroke,seeded,block,cylinder} from './art';
import {PLACES,NODES,EDGES,DECOR,R,CAP_R,SPREAD,type PlaceId} from '../data/layout';
import {buildLandmark,decorativeLandmark,tree,eraVehicle} from './city';
export {R};
export type Site={id:PlaceId;name:string;area:string;scene:boolean;x:number;z:number;scale:number;lat:number;lon:number};
export const SITES:Site[]=PLACES.map(p=>({...p,lat:0,lon:0}));
export type Track={index:number;from:number;to:number;points:T.Vector3[];lengths:number[];total:number;kind:string;group:T.Group;startDir:T.Vector3;endDir:T.Vector3};
export function dir(lat:number,lon:number){const a=lat*Math.PI/180,b=lon*Math.PI/180;return new T.Vector3(Math.cos(a)*Math.sin(b),Math.sin(a),Math.cos(a)*Math.cos(b));}
const pi=Math.PI;
function smooth(a:number,b:number,x:number){const t=T.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)}
/** V08: explanada urbana continua; inclinación controlada hacia el borde.
 * La esfera gris conserva su radio y sigue siendo completamente tridimensional.
 * Ninguna construcción se apoya en una tangente aislada del planeta.
 */
function baseHeight(x:number,z:number){
 const r=Math.hypot(x,z);
 const sphere=Math.sqrt(Math.max(.6,R*R-r*r));
 const plateau=14.42+.055*Math.sin(z*.25)+.032*Math.sin(x*.43);
 // Corona plana hasta r=6.05; la caída se absorbe progresivamente.
 return T.MathUtils.lerp(plateau,sphere,smooth(7.75,CAP_R,r));
}
function mountain(x:number,z:number){
 // Sierra continua al oriente. Se integra en la misma malla del terreno.
 const orient=smooth(6.05,10.2,x);
 const radius=Math.hypot(x,z),falloff=1-smooth(12.9,13.9,radius);
 const ridge=3.70+.68*Math.sin(z*.63+.38)+.22*Math.sin(z*1.57+1.22);
 const mon=4.6*Math.exp(-(((z+2.95)/1.50)**2));
 const gua=3.35*Math.exp(-(((z-2.05)/1.60)**2));
 return Math.max(0,(ridge+mon+gua+.12*Math.sin(z*3.3+x*.55)**2)*orient*falloff);
}
export function terrainY(x:number,z:number){
 const r=Math.hypot(x,z);
 const local=.018*Math.sin(x*1.35+z*.3)*Math.cos(z*1.20)+.010*Math.sin(x*2.4-z*1.8);
 let height=baseHeight(x,z)+local*(1-smooth(8.2,13.8,r));
 // La ladera se transforma en montaña sin montajes superpuestos.
 height+=mountain(x,z);
 // Explanadas orgánicas en cada hito: edificaciones enteramente apoyadas.
 for(const p of PLACES){
  if(!p.scene)continue;
  const d=Math.hypot(x-p.x,z-p.z);
  if(d>=2.45)continue;
  const factor=1-smooth(1.0,2.45,d);
  // No modificar la elevación de la ladera de los Cerros.
  const grade=baseHeight(p.x,p.z)+.018*Math.sin(p.x*1.35+p.z*.3)*Math.cos(p.z*1.2);
  height=T.MathUtils.lerp(height,grade,factor*.94);
 }
 return height;
}
export function terrain(x:number,z:number,extra=0){return new T.Vector3(x,terrainY(x,z)+extra,z)}
const nodeIndex=new Map(NODES.map((n,i)=>[n.id,i]));
function texturedGraySphere(){
 const g=new T.SphereGeometry(R,128,94),a=g.getAttribute('position'),c:number[]=[];
 for(let i=0;i<a.count;i++){
   const p=new T.Vector3().fromBufferAttribute(a,i);const v=Math.sin(p.x*4.2+p.y*2.9)*.012+Math.sin(p.z*7+p.x*6)*.008;
   const col=new T.Color(0xbcbcb6).multiplyScalar(1+v*0.7);c.push(col.r,col.g,col.b)
 }
 g.setAttribute('color',new T.Float32BufferAttribute(c,3));
 const m=new T.MeshStandardMaterial({map:paint('stone').map!,vertexColors:true,roughness:1});const mesh=new T.Mesh(g,m);mesh.receiveShadow=true;return mesh;
}
function cap(){const segments=196,rings=90,vertices:number[]=[],colors:number[]=[],indices:number[]=[];
 const green=new T.Color(0xb4bfb0),turf=new T.Color(0xd0d4c2),ridge=new T.Color(0x738c7b),warm=new T.Color(0xc7c5b8);
 for(let r=0;r<=rings;r++){
  const rad=CAP_R*r/rings;
  for(let i=0;i<=segments;i++){
   const a=i/segments*pi*2,x=rad*Math.cos(a),z=rad*Math.sin(a),h=terrainY(x,z);
   vertices.push(x,h+.024,z);
   const clim=mountain(x,z),v=.975+.012*Math.sin(x*5.1+z*3.7)+.010*Math.sin(x*12-z*8);
   const col=green.clone().lerp(ridge,smooth(.20,2.5,clim)*.64).lerp(turf,(Math.sin(x*.36+z*.32)+1)*.13);
   // Cemento mezclado visualmente en el borde, sin materialización de otro hemisferio urbano.
   col.lerp(warm,smooth(12.4,13.8,rad)*.26);
   col.multiplyScalar(v);colors.push(col.r,col.g,col.b);
   if(r<rings&&i<segments){const k=r*(segments+1)+i;indices.push(k,k+1,k+segments+1,k+1,k+segments+2,k+segments+1)}
  }
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();
 const m=new T.MeshStandardMaterial({vertexColors:true,map:paint('grass').map!,roughness:1,side:T.DoubleSide});const mesh=new T.Mesh(g,m);mesh.receiveShadow=true;return mesh;
}
// Topographic isolines restricted to the mountain band; elevation measured above sphere.
function contourSegments(parent:T.Group){const vertices:number[]=[],xs=7.1,xe=13.8,zs=-9.6,ze=9.6,sz=.18;
 for(const lvl of [.42,.80,1.15,1.55,2.04,2.54,3.14,3.72,4.32,5.02,5.62]){
  for(let x=xs;x<xe;x+=sz)for(let z=zs;z<ze;z+=sz){
   if(Math.hypot(x,z)>13.75)continue;
   const a=[[x,z],[x+sz,z],[x+sz,z+sz],[x,z+sz]] as [number,number][];
   const h=a.map(([xx,zz])=>mountain(xx,zz));const hits:[number,number][]=[];
   for(let j=0;j<4;j++){
    const k=(j+1)%4,delta=(h[j]-lvl)*(h[k]-lvl);if(delta>0||h[k]===h[j])continue;
    const t=(lvl-h[j])/(h[k]-h[j]);if(t<0||t>1)continue;
    hits.push([a[j][0]+(a[k][0]-a[j][0])*t,a[j][1]+(a[k][1]-a[j][1])*t]);
   }
   for(let j=0;j+1<hits.length;j+=2){for(const [xx,zz] of [hits[j],hits[j+1]])vertices.push(xx,terrainY(xx,zz)+.07,zz)}
  }
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));parent.add(new T.LineSegments(g,new T.LineBasicMaterial({color:0x486858,transparent:true,opacity:.66,depthWrite:false})))
}
/** Trazos topográficos de baja intensidad en la corona libre; dialogan con el papel acuarelado. */
function crownContours(parent:T.Group){
 for(let band=0;band<6;band++){
   const radius=8.3+band*.85,points:T.Vector3[]=[];
   for(let j=0;j<=288;j++){
      const a=j/288*Math.PI*2;
      const rr=radius*(1+.018*Math.sin(a*5.0+band*.24)+.009*Math.sin(a*11.0+band));
      const x=rr*Math.cos(a),z=rr*Math.sin(a);
      points.push(terrain(x,z,.061));
   }
   const geo=new T.BufferGeometry().setFromPoints(points);
   parent.add(new T.Line(geo,new T.LineBasicMaterial({color:0x657a68,transparent:true,opacity:.14,depthWrite:false})));
 }
}
function roadPath(edge:typeof EDGES[number]){
 const s=NODES[nodeIndex.get(edge.from)!],t=NODES[nodeIndex.get(edge.to)!];
 const all:[[number,number],...[number,number][]]=[[s.x,s.z],...(edge.control??[]).map(([x,z])=>[x*SPREAD,z*SPREAD] as [number,number]),[t.x,t.z]];
 const curve=new T.CatmullRomCurve3(all.map(([x,z])=>new T.Vector3(x,0,z)),false,'centripetal',.26);
 const count=Math.max(24,Math.ceil(curve.getLength()*13)),pts:T.Vector3[]=[];
 for(let i=0;i<=count;i++){const p=curve.getPoint(i/count);pts.push(terrain(p.x,p.z,.105))}
 return pts;
}
function ribbon(group:T.Group,pts:T.Vector3[],w:number,mat:T.Material,lift=0){
 const vertices:number[]=[],indices:number[]=[];
 for(let i=0;i<pts.length;i++){
  const p=pts[i],prev=pts[Math.max(0,i-1)],next=pts[Math.min(pts.length-1,i+1)];const t=next.clone().sub(prev).setY(0).normalize();const side=new T.Vector3(-t.z,0,t.x).normalize();
  for(const s of [-1,1]){const x=p.x+side.x*s*w*.5,z=p.z+side.z*s*w*.5;vertices.push(x,terrainY(x,z)+.112+lift,z)}
  if(i<pts.length-1){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2)}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();group.add(new T.Mesh(g,new T.MeshStandardMaterial({map:(mat as T.MeshStandardMaterial).map,color:(mat as T.MeshStandardMaterial).color,side:T.DoubleSide,roughness:1})));
}
function road(edge:typeof EDGES[number],index:number):Track{
 const pts=roadPath(edge),lengths:number[]=[0];let total=0;
 for(let i=1;i<pts.length;i++){total+=pts[i].distanceTo(pts[i-1]);lengths.push(total)}
 const g=new T.Group(),main=edge.kind==='septima'||edge.kind==='veintiseis',w=edge.kind==='sendero'?.29:main?.69:.49;
 // borde de andén bajo una calzada real, no camino de color beige.
 ribbon(g,pts,w+.24,paint('stone',0xd8d3c5));ribbon(g,pts,w,paint('slate',main?0x586063:0x757873),.013);
 if(main){const marks:T.Vector3[][]=[];for(let d=.5;d<total-.23;d+=1.15){const a=interpolatePolyline(pts,lengths,d),b=interpolatePolyline(pts,lengths,Math.min(total-.07,d+.29));marks.push([a.clone().add(new T.Vector3(0,.035,0)),b.clone().add(new T.Vector3(0,.035,0))])}
 const lines=new T.BufferGeometry().setFromPoints(marks.flat());g.add(new T.LineSegments(lines,new T.LineBasicMaterial({color:0xd6d1c4,transparent:true,opacity:.61})))
 }
 const from=nodeIndex.get(edge.from)!,to=nodeIndex.get(edge.to)!;
 const startDir=pts[1].clone().sub(pts[0]).normalize(),endDir=pts[pts.length-1].clone().sub(pts[pts.length-2]).normalize();
 return {index,from,to,points:pts,lengths,total,kind:edge.kind,group:g,startDir,endDir};
}
function interpolatePolyline(pts:T.Vector3[],lengths:number[],distance:number){const d=T.MathUtils.clamp(distance,0,lengths[lengths.length-1]);let lo=0,hi=lengths.length-1;
 while(hi-lo>1){const mid=(lo+hi)>>1;if(lengths[mid]<d)lo=mid;else hi=mid}const t=(d-lengths[lo])/Math.max(.0001,lengths[hi]-lengths[lo]);return pts[lo].clone().lerp(pts[hi],t);
}
export function interpolateTrack(route:Track,distance:number){const pos=interpolatePolyline(route.points,route.lengths,distance);
 const a=interpolatePolyline(route.points,route.lengths,Math.max(0,distance-.09)),b=interpolatePolyline(route.points,route.lengths,Math.min(route.total,distance+.09));
 return {pos,normal:new T.Vector3(0,1,0),tangent:b.sub(a).normalize()};
}
function vegetation(world:T.Group){const rand=seeded(1972),spots:[number,number,number][]=[
 [-8.15,-.55,1.25],[-6.9,-2.85,1.2],[-5.1,-6.55,1.28],[-6.15,2.25,1.2],
 [-3.55,2.85,1.1],[-2.3,-3.1,1.2],[-1.15,-.2,1.25],[1.55,-2.95,1.22],
 [3.25,-6.35,1.32],[2.9,6.15,1.15],[-2.95,6.35,1.25],[4.9,5.75,1.12]
 ];
 for(const [x,z,s] of spots){const t=tree('urban',s);t.position.copy(terrain(x*SPREAD,z*SPREAD,.08));world.add(t)}
 // Vegetación andina sobre los cerros, sin pinos: follaje irregular, no bosque navideño.
 for(let i=0;i<42;i++){
  const x=7.8+rand()*4.3,z=-8.2+rand()*16.4;if(Math.hypot(x,z)>13.0||PLACES.some(p=>p.scene&&Math.hypot(x-p.x,z-p.z)<2.0))continue;
  const s=.43+rand()*.74,t=tree('cerro',s);t.position.copy(terrain(x,z,.07));world.add(t)
 }
}
function chapel(world:T.Group,x:number,z:number,scale:number){const g=new T.Group();g.position.copy(terrain(x,z,.12));g.scale.setScalar(scale);
 const wall=paint('plaster',0xe9e3d5),stone=paint('stone',0x8c8177);
 block(g,.63,.52,.61,wall,0,.26);const roof=new T.Mesh(new T.ConeGeometry(.52,.57,4),stone);roof.position.y=.79;roof.rotation.y=Math.PI/4;g.add(roof);
 block(g,.18,.31,.04,paint('charcoal'),0,.17,.332);block(g,.05,.42,.04,stone,0,1.28,0);block(g,.21,.055,.055,stone,0,1.40,0);world.add(g)
}
function vehicles(world:T.Group){
 const points:[number,number,'bus'|'taxi',number][]=[[-4.95,5.14,'bus',.07],[-1.85,5.18,'taxi',.15],[2.45,5.15,'taxi',-.12],[1.30,-3.85,'bus',Math.PI/2]];
 points.forEach(([x,z,type,angle])=>{const v=eraVehicle(type);v.position.copy(terrain(x*SPREAD,z*SPREAD,.18));v.rotation.y=angle;v.scale.setScalar(type==='bus'?.88:.88);v.name='vehiculo_'+type+'_'+x+'_'+z;world.add(v)})
}
export function createPlanet(){
 const world=new T.Group();world.name='bogota_satira_corona_superior';world.add(texturedGraySphere());world.add(cap());contourSegments(world);crownContours(world);
 const routes=EDGES.map((e,i)=>road(e,i));routes.forEach(r=>world.add(r.group));
 // Plintos orgánicos bajos, sin plataformas geométricas que parezcan piezas pegadas.
 const buildings=new Map<PlaceId,T.Group>();
 for(const p of PLACES){if(p.id==='cerros')continue;
  const g=buildLandmark(p.id),entry=NODES.find(n=>n.entry===p.id);
  g.position.copy(terrain(p.x,p.z,.02));const dx=(entry?.x??p.x)-(p.x),dz=(entry?.z??p.z)-(p.z);g.rotation.y=Math.atan2(dx,dz);g.scale.setScalar(p.scale*.94);
  // La capilla, el club y las viviendas tienen materialidad de región, no zócalos enormes.
  world.add(g);buildings.set(p.id,g);
 }
 for(const d of DECOR){const g=decorativeLandmark(d.id);g.position.copy(terrain(d.x,d.z,.05));g.scale.setScalar(d.id==='plaza_toros'?.62:d.id==='torres_parque'?.59:.58);world.add(g)}
 // Hitos de cima: Monserrate y Guadalupe, observados de lejos.
 chapel(world,10.35,-2.95,1.15);chapel(world,10.65,2.15,.93);
 vegetation(world);vehicles(world);
 return {world,routes,buildings,sites:SITES,nodes:NODES};
}
