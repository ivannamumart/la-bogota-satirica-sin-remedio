import * as THREE from 'three';
let seed=71072;
export function rnd(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}
export function resetSeed(s=71072){seed=s}
const cache=new Map<string,THREE.MeshStandardMaterial>();
const paper=(()=>{
 const c=document.createElement('canvas');c.width=c.height=256;
 const ctx=c.getContext('2d')!;const d=ctx.createImageData(256,256); let s=98301;
 for(let i=0;i<d.data.length;i+=4){s=(Math.imul(s,1664525)+1013904223)>>>0;const n=(s/4294967296-.5)*27;
  const v=Math.max(0,Math.min(255,238+n));d.data[i]=v+8;d.data[i+1]=v+7;d.data[i+2]=v+4;d.data[i+3]=255;}
 ctx.putImageData(d,0,0);
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1.5,1.5);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
})();
export const paperTexture = paper;
export function mat(color:number,extra?:{emissive?:number,transparent?:boolean,opacity?:number,side?:THREE.Side}){
 const key=[color,extra?.emissive??'',extra?.opacity??1,extra?.side??0].join(':');if(cache.has(key))return cache.get(key)!;
 const m=new THREE.MeshStandardMaterial({color,map:paper,roughness:.92,metalness:0,emissive:extra?.emissive??0x000000,emissiveIntensity:extra?.emissive ? .18 : 0,transparent:extra?.transparent??false,opacity:extra?.opacity??1,side:extra?.side??THREE.FrontSide});cache.set(key,m);return m;
}
export const PAL={cream:0xf1e8d6,stone:0xcdc2ad,ink:0x2d3434,wood:0x896c51,woodLight:0xb49673,moss:0x66886a,leaf:0x4d7761,olive:0x70816a,ochre:0xb88968,blue:0x667e91,red:0xb95d52,glass:0x9cbcc4,gold:0xc6a567,asphalt:0x68717b,night:0x182735,slate:0x566774};
export function mesh(geo:THREE.BufferGeometry,m:THREE.Material,x=0,y=0,z=0){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;return o}
export function box(w:number,h:number,d:number,c:number,x=0,y=h/2,z=0){return mesh(new THREE.BoxGeometry(w,h,d),mat(c),x,y,z)}
export function cyl(rt:number,rb:number,h:number,c:number,x=0,y=h/2,z=0,sides=12){return mesh(new THREE.CylinderGeometry(rt,rb,h,sides),mat(c),x,y,z)}
export function ball(r:number,c:number,x=0,y=0,z=0,seg=14){return mesh(new THREE.SphereGeometry(r,seg,10),mat(c),x,y,z)}
export function tube(points:THREE.Vector3[],r:number,c:number,closed=false){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points,closed,'centripetal'),Math.max(points.length*4,12),r,5,closed),mat(c))}
export function addOutline(g:THREE.Group,w:number,h:number,d:number,y:number){g.add(box(w+.025,.035,d+.035,PAL.ink,0,y,0));}
export function labelTexture(text:string,color='#f5ecd9',ink='#343632',width=400){const c=document.createElement('canvas');c.width=width;c.height=110;const ctx=c.getContext('2d')!;
 ctx.fillStyle=color;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=ink;ctx.font='bold 37px Georgia, serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,c.width/2,60,c.width-24);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
export function textPanel(title:string,w=1.4,h=.33,front=.2){const g=new THREE.Group();const tex=labelTexture(title);const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:false,side:THREE.DoubleSide}));p.position.z=front;g.add(p);return g;}
