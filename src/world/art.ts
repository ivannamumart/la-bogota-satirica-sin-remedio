/** Materiales, geometrías y acabados del universo de La Bogotá satírica.
 * Convención: metros locales, eje Y vertical, origen al nivel del suelo.
 * Las texturas son acuarelas originales procedurales, generadas para el proyecto.
 */
import * as T from 'three';
export const PALETTE={ink:0x263332,paper:0xf1e8d5,cream:0xe2d4b9,brick:0xa76550,blue:0x637f94,ochre:0xbc956c,forest:0x4a7059,leaf:0x71906d,stone:0xb9b1a1,wood:0x866747,gold:0xc8a56c,night:0x202a40};
const watercolor=new Map<string,T.Texture>();const materials=new Map<string,T.MeshStandardMaterial>();
export function paint(name:string,color=0xffffff,opts:{double?:boolean;emissive?:number;opacity?:number;roughness?:number}={}):T.MeshStandardMaterial{
 const key=[name,color,opts.double,opts.emissive,opts.opacity,opts.roughness].join('/');const cached=materials.get(key);if(cached)return cached;
 let texture=watercolor.get(name);
 if(!texture){
   const colorTable:Record<string,string>={paper:'#f1ead8',stone:'#ddd1bf',stucco:'#d8c6aa',ochre:'#b98c64',terracotta:'#a66e55',bluegray:'#728c9a',olive:'#869779',pine:'#567b65',cedar:'#946f51',wood:'#9e7859',slate:'#77868e',plaster:'#eae0cc',charcoal:'#555c60',brick:'#ab7559',moss:'#849779',gold:'#c5a36b',purple:'#ba96aa',grass:'#9fac8d'};
   const cv=document.createElement('canvas');cv.width=cv.height=256;const ctx=cv.getContext('2d')!;
   ctx.fillStyle=colorTable[name]??'#d9ccaf';ctx.fillRect(0,0,256,256);
   let hash=1972;for(let i=0;i<name.length;i++)hash=(Math.imul(hash,31)+name.charCodeAt(i))>>>0;
   const rand=()=>{hash=(Math.imul(hash,1664525)+1013904223)>>>0;return hash/4294967296};
   for(let i=0;i<150;i++){const x=rand()*256,y=rand()*256,r=3+rand()*49;
     ctx.fillStyle=rand()>.45?`rgba(246,244,225,${.012+rand()*.035})`:`rgba(26,46,35,${.008+rand()*.027})`;
     ctx.beginPath();ctx.ellipse(x,y,r,r*(.35+rand()),rand()*Math.PI,0,Math.PI*2);ctx.fill();}
   for(let i=0;i<3200;i++){const x=rand()*256,y=rand()*256;
     ctx.fillStyle=rand()>.48?'rgba(255,255,252,.16)':'rgba(25,38,34,.085)';ctx.fillRect(x,y,.4+rand()*.65,.4+rand()*.65);}
   if(name==='wood'||name==='cedar'){
     ctx.strokeStyle='rgba(51,42,36,.13)';ctx.lineWidth=1;
     for(let j=0;j<18;j++){ctx.beginPath();for(let x=0;x<256;x+=5){const y=j*15+Math.sin(x*.045+j)*3; if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
   }
   texture=new T.CanvasTexture(cv);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.anisotropy=4;watercolor.set(name,texture)
 }
 const mat=new T.MeshStandardMaterial({map:texture,color,roughness:opts.roughness??.97,metalness:0,transparent:opts.opacity!==undefined&&opts.opacity<1,opacity:opts.opacity??1,side:opts.double?T.DoubleSide:T.FrontSide,emissive:opts.emissive??0x000000,emissiveIntensity:.5});materials.set(key,mat);return mat;
}
export function solid(c:number,opacity=1){return new T.MeshStandardMaterial({color:c,roughness:.89,metalness:0,transparent:opacity<1,opacity,side:opacity<1?T.DoubleSide:T.FrontSide});}
export function block(parent:T.Group|T.Object3D,w:number,h:number,d:number,material:T.Material,x=0,y=h/2,z=0){let m=new T.Mesh(new T.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
export function cylinder(parent:T.Object3D,r:number,h:number,material:T.Material,x=0,y=h/2,z=0,radial=12,top=r){let m=new T.Mesh(new T.CylinderGeometry(top,r,h,radial),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
export function sphere(parent:T.Object3D,r:number,material:T.Material,x=0,y=r,z=0,detail=1){const m=new T.Mesh(new T.IcosahedronGeometry(r,detail),material);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
export function pathStroke(parent:T.Object3D,points:T.Vector3[],color=PALETTE.ink,width=.012,opacity=1){if(points.length<2)return;
 const curve=new T.CatmullRomCurve3(points);const geo=new T.TubeGeometry(curve,Math.max(8,points.length*4),width,4,false);
 const m=new T.Mesh(geo,new T.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthWrite:false}));parent.add(m);return m;
}
export function inkEdges(parent:T.Object3D,obj:T.Mesh,opacity=.38){const e=new T.LineSegments(new T.EdgesGeometry(obj.geometry,28),new T.LineBasicMaterial({color:PALETTE.ink,transparent:true,opacity,depthWrite:false}));e.position.copy(obj.position);e.quaternion.copy(obj.quaternion);e.scale.copy(obj.scale);parent.add(e);return e;}
export function paperBox(parent:T.Group,w:number,h:number,d:number,tex:string,x=0,y=h/2,z=0,lined=false){let m=block(parent,w,h,d,paint(tex),x,y,z);if(lined)inkEdges(parent,m,.32);return m;}
export function cone(parent:T.Object3D,rad:number,h:number,material:T.Material,x=0,y=h/2,z=0,segments=9){const m=new T.Mesh(new T.ConeGeometry(rad,h,segments),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
export function torus(parent:T.Object3D,r:number,thick:number,material:T.Material,x=0,y=0,z=0,axis:'x'|'y'|'z'='z'){const m=new T.Mesh(new T.TorusGeometry(r,thick,7,32),material);m.position.set(x,y,z);if(axis==='x')m.rotation.x=Math.PI/2;if(axis==='y')m.rotation.y=Math.PI/2;parent.add(m);return m;}
/** Cartel dibujado sobre papel, con tipografía integrada en la propia malla. */
export function sign(parent:T.Object3D,label:string,w:number,h:number,x:number,y:number,z:number,fg='#27332f',bg='#e9dfca'){
 const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);
 ctx.strokeStyle=fg;ctx.globalAlpha=.32;ctx.lineWidth=6;ctx.strokeRect(9,9,494,110);ctx.globalAlpha=1;
 ctx.fillStyle=fg;ctx.font=label.length>16?'600 35px Georgia':'600 47px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label.toUpperCase(),256,68,475);
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:t,transparent:false,side:T.DoubleSide}));m.position.set(x,y,z);parent.add(m);return m;
}
export function seeded(seed=1972){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296};}
export function sunlightMaterial(color:number){return new T.MeshStandardMaterial({color,roughness:1,emissive:color,emissiveIntensity:.25});}
