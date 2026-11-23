import * as THREE from 'three';
import {LUGARES,dir,DEG,Lugar} from '../story/places';
import {mat,box,ball,mesh,PAL,rnd,resetSeed,tube,paperTexture} from './materials';
import {createLandmark,makeTree,makeVehicle,makeLamp,human} from './architecture';
export const R=10.5;
const V=(lat:number,lon:number)=>new THREE.Vector3(...dir(lat,lon));
const peakA=V(61,2),peakB=V(52,-10),peakC=V(60,17);
function bump(n:THREE.Vector3,p:THREE.Vector3,width:number){return Math.exp(-Math.pow(Math.acos(THREE.MathUtils.clamp(n.dot(p),-1,1))/width,2));}
export function height(n:THREE.Vector3){return .08*Math.sin(n.x*19+n.z*8)*Math.sin(n.y*17-n.z*11)+.07*Math.sin(n.z*32+n.y*15)+
  2.0*bump(n,peakA,.26)+1.25*bump(n,peakB,.29)+.84*bump(n,peakC,.20)+.22*Math.sin(n.x*8+n.z*14)*bump(n,peakA,.55);}
export function surface(n:THREE.Vector3,extra=0){return n.clone().normalize().multiplyScalar(R+height(n)+extra)}
export type Landmark={data:Lugar;point:THREE.Vector3;entry:THREE.Vector3;group:THREE.Group;normal:THREE.Vector3};
function blend(a:number,b:number,t:number){return a+(b-a)*t}
function colorFor(n:THREE.Vector3){
 const col=new THREE.Color(0x80927c);const h=height(n);
 if(h>.24)col.set(0x658568);if(h>.80)col.set(0x53765f);if(h>1.35)col.set(0x637961);
 const urban=LUGARES.filter(p=>p.id!=='cerros'&&p.id!=='parque'&&p.id!=='cementerio');
 for(const p of urban){const d=n.distanceTo(V(p.lat,p.lon));const t=Math.max(0,1-d/.33);if(t>0)col.lerp(new THREE.Color(p.mood==='bohemia'?0xa39b80:p.mood==='poder'?0xb4ae92:0x92978c),t*.7);}
 const cemetery=V(-42,337);col.lerp(new THREE.Color(0x8d968f),Math.max(0,1-n.distanceTo(cemetery)/.22)*.62);
 const noise=.96+Math.sin(n.x*87+n.y*41+n.z*73)*.026+Math.sin(n.z*190-n.y*122)*.019;
 col.multiplyScalar(noise);return col;
}
function globeMesh(){const geo=new THREE.SphereGeometry(R,160,96);const pos=geo.attributes.position, colors=[];
 for(let i=0;i<pos.count;i++){const n=new THREE.Vector3().fromBufferAttribute(pos,i).normalize();const p=surface(n);pos.setXYZ(i,p.x,p.y,p.z);const c=colorFor(n);colors.push(c.r,c.g,c.b)}
 geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.computeVertexNormals();
 const m=new THREE.MeshStandardMaterial({vertexColors:true,map:paperTexture,roughness:1,flatShading:false,metalness:0});const o=new THREE.Mesh(geo,m);o.castShadow=true;o.receiveShadow=true;return o;}
function geoArc(a:THREE.Vector3,b:THREE.Vector3,t:number){let angle=Math.acos(THREE.MathUtils.clamp(a.dot(b),-1,1));if(angle<.00001)return a.clone();const den=Math.sin(angle);return a.clone().multiplyScalar(Math.sin((1-t)*angle)/den).addScaledVector(b,Math.sin(t*angle)/den).normalize();}
function pathBetween(a:THREE.Vector3,b:THREE.Vector3,width=.16,shade=0xd3bf9e){const count=Math.max(20,Math.floor(a.angleTo(b)*80));const positions:number[]=[],idx:number[]=[];
 for(let i=0;i<=count;i++){const t=i/count,n=geoArc(a,b,t),p=surface(n,.042),tang=geoArc(a,b,Math.min(1,t+1/count)).sub(geoArc(a,b,Math.max(0,t-1/count))).normalize();let side=new THREE.Vector3().crossVectors(n,tang).normalize();
 const wiggle=Math.sin(t*11.5)*.012;const q=p.addScaledVector(side,wiggle);for(const sign of [-1,1]){const v=q.clone().addScaledVector(side,sign*width/2);positions.push(v.x,v.y,v.z);}
 if(i<count){const j=i*2;idx.push(j,j+2,j+1,j+1,j+2,j+3)} }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(idx);g.computeVertexNormals();return mesh(g,new THREE.MeshStandardMaterial({color:shade,side:THREE.DoubleSide,roughness:1}));}
function contour(n0:THREE.Vector3,rad:number,ink:number){const axes1=new THREE.Vector3(0,1,0).cross(n0).normalize();if(axes1.length()<.1)axes1.set(1,0,0);const axes2=new THREE.Vector3().crossVectors(n0,axes1).normalize();const points:THREE.Vector3[]=[];
 for(let i=0;i<=135;i++){const a=i/135*Math.PI*2;const r=rad*(1+Math.sin(a*4+.7)*.06+Math.sin(a*9)*.025);const d=n0.clone().addScaledVector(axes1,Math.cos(a)*r).addScaledVector(axes2,Math.sin(a)*r*.80).normalize();points.push(surface(d,.039))}
 const g=new THREE.Group();g.add(tube(points,.017,ink));return g;}
function addGlobalContours(parent:THREE.Group){
 for(let i=0;i<12;i++){const lat=-63+i*11.5;const pts:THREE.Vector3[]=[];for(let j=0;j<=220;j++){const lon=j/220*360;const la=lat+Math.sin(lon*DEG*2+i)*2.3+Math.sin(lon*DEG*5)*.8;const n=V(la,lon);pts.push(surface(n,.024));}const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x354e47,transparent:true,opacity:.16}));parent.add(l)}
 for(let i=0;i<13;i++)parent.add(contour(peakA,.13+i*.075,i%3===0?0x35473e:0x5f705f));
}
function oriented(g:THREE.Object3D,n:THREE.Vector3,at:number){g.position.copy(surface(n,at));g.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),n);return g;}
function flowers(g:THREE.Group){for(let i=0;i<12;i++){const a=i*.56,d=.6+rnd()*.35;g.add(ball(.025,[0xb47b69,0xe1b977,0xe6d9ad][i%3],Math.sin(a)*d,.04,Math.cos(a)*d,8));}}
function cityFurniture(world:THREE.Group){const centers=['oasis','septima','oficina','unicornio','apartamento'];const colors=[0xae674f,0xc8a56b,0xb18a6d,0xc95d53];
 for(const id of centers){const place=LUGARES.find(p=>p.id===id)!;const n=V(place.lat,place.lon);
  for(let j=0;j<3;j++){const off=new THREE.Vector3((rnd()-.5)*.24,0,(rnd()-.5)*.20);const here=n.clone().add(off).normalize();const p=oriented(makeVehicle(j===0,colors[(j+id.length)%colors.length]),here,.05);p.scale.setScalar(j===0?.9:.8);p.rotateY(rnd()*6);world.add(p);}
  for(let k=0;k<2;k++){const here=n.clone().add(new THREE.Vector3((rnd()-.5)*.3,0,(rnd()-.5)*.3)).normalize();const light=oriented(makeLamp(),here,.04);light.scale.setScalar(.7);world.add(light)}
 }
}
export function createWorld(){resetSeed();const world=new THREE.Group();world.add(globeMesh());addGlobalContours(world);
 const markers:Landmark[]=[];
 for(const p of LUGARES){const normal=V(p.lat,p.lon),g=createLandmark(p);oriented(g,normal,.06);
  // Transición suave de vegetación de cada lugar al entorno
  const area=new THREE.Group();for(let j=0;j<(p.id==='cerros'?26:p.id==='parque'?15:5);j++){const a=rnd()*Math.PI*2,rr=.75+rnd()*(p.id==='cerros'?1.7:1.2);const t=makeTree(p.id==='cerros'||p.id==='cementerio'?'pine':'leaf',.28+rnd()*.58);t.position.set(Math.cos(a)*rr,0,Math.sin(a)*rr);area.add(t)}
  g.add(area);world.add(g);
  const entry=normal.clone(); // llegada al núcleo del lugar; la puerta es transición sin icono
  markers.push({data:p,point:surface(normal,.08),normal,entry,group:g});
 }
 // Los caminos siguen la esfera y recorren todos los hemisferios.
 for(let i=0;i<LUGARES.length;i++){
 const a=V(LUGARES[i].lat,LUGARES[i].lon),b=V(LUGARES[(i+1)%LUGARES.length].lat,LUGARES[(i+1)%LUGARES.length].lon);
 world.add(pathBetween(a,b,i===2?.27:.18,i===2?0x858382:0xc7b497));
 }
 // Ramales alternativos conectan barrios contiguos y permiten distintos recorridos.
 const branches:[[number,number],[number,number],[number,number],[number,number]]=[[0,11],[1,9],[3,8],[5,6]];
 for(const [a,b] of branches)world.add(pathBetween(V(LUGARES[a].lat,LUGARES[a].lon),V(LUGARES[b].lat,LUGARES[b].lon),.11,0xbab194));
 // Árboles sobre la totalidad de la esfera, también en el hemisferio posterior.
 const treeGeo=new THREE.ConeGeometry(.12,.41,7),trunkGeo=new THREE.CylinderGeometry(.025,.035,.20,6);
 const leaves=new THREE.InstancedMesh(treeGeo,mat(0x63826b),350),trunks=new THREE.InstancedMesh(trunkGeo,mat(0x81715c),350);
 const tmp=new THREE.Object3D();let used=0;
 for(let j=0;j<950&&used<350;j++){const z=rnd()*2-1,a=rnd()*Math.PI*2,n=new THREE.Vector3(Math.sqrt(1-z*z)*Math.cos(a),z,Math.sqrt(1-z*z)*Math.sin(a));
 let near=false;for(const p of markers){if(n.distanceTo(p.normal)<.15){near=true;break}}
 if(near||rnd()>.48)continue;
 const sz=.72+rnd()*.75;tmp.position.copy(surface(n,.11+sz*.11));tmp.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),n);tmp.scale.setScalar(sz);tmp.updateMatrix();leaves.setMatrixAt(used,tmp.matrix);
 tmp.position.copy(surface(n,.045));tmp.updateMatrix();trunks.setMatrixAt(used,tmp.matrix);used++;}
 leaves.count=trunks.count=used;leaves.castShadow=true;trunks.castShadow=true;world.add(leaves,trunks);
 cityFurniture(world);
 // Pequeñas figuras, para que el planeta parezca habitado y no una vitrina inmóvil.
 for(let i=0;i<24;i++){const p=markers[i%markers.length];const base=p.normal.clone().add(new THREE.Vector3((rnd()-.5)*.2,(rnd()-.5)*.13,(rnd()-.5)*.2)).normalize();const npc=human(.66,[0x64645d,0x806e61,0x6e7984,0x80665c][i%4],0xb78e78,i%3===0);npc.scale.setScalar(.33);oriented(npc,base,.075);npc.rotateY(rnd()*6);world.add(npc);}
 // Halo de atmósfera sutil, sin capa de vidrio brillante.
 const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(R+1.6,56,40),new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.BackSide,uniforms:{uColor:{value:new THREE.Color(0x9fb9ac)}},vertexShader:`varying vec3 vNormal;varying vec3 vView;void main(){vec4 m=modelViewMatrix*vec4(position,1.);vNormal=normalize(normalMatrix*normal);vView=normalize(-m.xyz);gl_Position=projectionMatrix*m;}`,fragmentShader:`uniform vec3 uColor;varying vec3 vNormal;varying vec3 vView;void main(){float f=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),3.2);gl_FragColor=vec4(uColor,f*.22);}`}));world.add(atmosphere);
 return {world,markers};
}
