import * as T from 'three';
import {block,cylinder,sphere,cone,torus,paint,solid,pathStroke,PALETTE} from './art';
export type PersonaStyle='escobar'|'fina'|'diego'|'federico'|'inga'|'focion'|'monseñor'|'poeta'|'urbano'|'beatriz'|'leonor'|'alicia'|'policia'|'npc';
export interface Person {root:T.Group;head:T.Group;leftArm:T.Group;rightArm:T.Group;leftLeg:T.Group;rightLeg:T.Group;style:PersonaStyle;update:(t:number,moving?:boolean,express?:number)=>void}
const haircolor=solid(0x302d2d),eye=solid(0x343333),white=paint('plaster'),dark=paint('charcoal');
export function character(style:PersonaStyle='npc',scale=1):Person{
 const root=new T.Group();root.name=`persona_${style}`;root.scale.setScalar(scale);
 const woman=['fina','inga','beatriz','leonor','alicia'].includes(style);
 const older=['focion','leonor','monseñor'].includes(style);
 const skin=paint('paper',older?0xb79d86:style==='inga'?0xf1d9bd:0xd0ad91);
 const cloth=style==='escobar'?paint('bluegray',0x8b9596):style==='fina'?paint('terracotta',0x9c8f82):style==='diego'?paint('plaster',0xd2c1ac):style==='federico'?paint('charcoal',0x777674):style==='inga'?paint('paper',0xd6c8a9):style==='focion'?paint('charcoal',0x4a535a):style==='monseñor'?dark:style==='poeta'?paint('ochre',0xb9ad94):style==='urbano'?paint('bluegray',0x8997a0):style==='beatriz'?paint('olive',0xb7b2a1):style==='alicia'?paint('terracotta',0xc4b5aa):style==='leonor'?paint('slate',0xb0aaa3):paint('slate',0x929795);
 const pant=style==='escobar'?paint('charcoal',0x92938c):paint('charcoal',0x74695f);
 const body=new T.Group();root.add(body);
 // Sobrecapas y cintura para una silueta humana reconocible desde la cámara de tercera persona.
 const torso=sphere(body,.43,cloth,0,1.12,0,2);torso.scale.set(.64,1.03,.46);
 const waist=sphere(body,.29,cloth,0,.86,0,1);waist.scale.set(1,.55,.75);
 if(woman&&style!=='beatriz'){const skirt=cone(body,.37,.69,cloth,0,.67,0,16);skirt.scale.set(1,1,.8);
  const pleats=paint('charcoal',0x685952);for(let j=0;j<8;j++){const a=(j+.5)*Math.PI/5,xx=Math.sin(a)*.276,zz=Math.cos(a)*.220;const seam=block(body,.012,.40,.012,pleats,xx,.59,zz);seam.rotation.z=-xx*.24;}
  if(style==='leonor'){const scarf=paint('terracotta',0x9f775f);const s=block(body,.37,.10,.09,scarf,0,1.40,.18);s.rotation.z=-.08;}
 }
 else {const shirt=block(body,.11,.36,.07,white,0,1.18,.22);shirt.rotation.z=.01;block(body,.04,.15,.075,style==='escobar'?solid(0x493d37):solid(0x695f58),0,1.24,.28)}
 if(style==='escobar'){
   for(const sx of [-1,1]){
     const seam=block(body,.018,.43,.022,paint('slate',0x878f88),sx*.20,1.0,.19);
     seam.rotation.z=sx*.08;
     block(body,.12,.022,.025,paint('plaster',0xd6d1bd),sx*.16,1.02,.235);
   }
   for(let i=0;i<3;i++)sphere(body,.012,paint('charcoal'),.06,1.07+i*.095,.260,0);
 }
 if(style==='escobar'||style==='focion'||style==='federico'){
   const lapelA=block(body,.17,.36,.05,style==='federico'?dark:cloth,-.13,1.23,.23);lapelA.rotation.z=-.32;
   const lapelB=block(body,.17,.36,.05,style==='federico'?dark:cloth,.13,1.23,.23);lapelB.rotation.z=.32;
   if(style==='escobar'){block(body,.56,.095,.04,paint('stone'),0,.88,.24)}
 }
 // Brazos segmentados: pivote verdadero para gestos, caminar, escribir o bailar.
 const mkArm=(side:number)=>{const a=new T.Group();a.position.set(side*.32,1.35,0);root.add(a);
 const sleeve=new T.Mesh(new T.CylinderGeometry(.085,.105,.49,12),cloth);sleeve.position.set(0,-.28,0);a.add(sleeve);
  const shoulder=sphere(a,.112,cloth,0,-.035,0,2);shoulder.scale.set(.90,.84,.93);
 const cuff=cylinder(a,.095,.20,cloth,0,-.53,.005,9);
 sphere(a,.087,skin,0,-.68,.012,1);return a;};
 const leftArm=mkArm(-1),rightArm=mkArm(1);
 const mkLeg=(side:number)=>{const a=new T.Group();a.position.set(side*.15,.80,0);root.add(a);
 const l=sphere(a,.17,pant,0,-.30,0,1);l.scale.set(.69,2.15,.71);
 const calf=cylinder(a,.105,.31,pant,0,-.60,0,10);
 const shoe=sphere(a,.14,style==='inga'?skin:dark,0,-.76,.08,1);shoe.scale.set(.85,.44,1.40);return a;};
 const leftLeg=mkLeg(-1),rightLeg=mkLeg(1);
 const neck=cylinder(root,.108,.16,skin,0,1.52,.01,11);
 const head=new T.Group();head.position.set(0,1.58,0);head.scale.setScalar(.80);root.add(head);
 const face=sphere(head,.222,skin,0,.06,0,2);face.scale.set(.84,1.03,.83);
 sphere(head,.041,skin,0,-.017,.205,2).scale.set(.72,1.24,1.1); // nariz
 for(const s of [-1,1]){
   sphere(head,.017,eye,s*.098,.083,.206,2);
   const brow=block(head,.078,.013,.017,haircolor,s*.100,.146,.218);brow.rotation.z=s*.10;
   sphere(head,.060,skin,s*.207,.026,0,1).scale.set(.3,1,.56);
 }
 // Boca discreta, sin sonrisa rígida de muñeco.
 pathStroke(head,[new T.Vector3(-.061,-.104,.184),new T.Vector3(0,-.11,.202),new T.Vector3(.061,-.104,.184)],0x64413c,.008);
 const hair=style==='inga'?paint('ochre',0xc5af7b):older?paint('slate',0xc3c3b2):style==='fina'?paint('cedar',0x66504a):haircolor;
 const cap=sphere(head,.216,hair,0,.249,-.026,2);cap.scale.set(.91,.47,.90);
 for(let i=0;i<5;i++){
   const t=i/4,off=-.16+t*.32;
   sphere(head,.072,hair,off,.225+.017*Math.sin(t*8),.136,1).scale.set(1,.45,1.05);
 }
 if(woman){for(const s of [-1,1]){const lock=sphere(head,.103,hair,s*.18,-.14,-.02,1);lock.scale.set(.70,2.0,.75)}}
 if(style==='federico'||style==='diego'||style==='poeta'){
   const beard=sphere(head,.17,paint('charcoal',0x6f5a50),0,-.12,.06,1);beard.scale.set(.75,.42,.9);
 }
 if(style==='monseñor'){
   for(let i=0;i<6;i++)sphere(body,.022,paint('purple',0x7f619c),0,.95+i*.085,.269,1);
   block(body,.11,.04,.10,paint('plaster'),0,1.38,.25);
 }
 if(style==='focion'){
   block(body,.095,.06,.04,paint('gold'),-.18,1.16,.24);
   const moustache=block(head,.17,.022,.02,paint('slate'),0,-.048,.20);moustache.rotation.z=.03;
 }
 if(style==='alicia'){sphere(body,.073,paint('bluegray',0x679ab5),.20,1.13,.25,1)}
 if(style==='escobar'){
   const moustache=paint('charcoal',0x655950);
   const left=sphere(head,.068,moustache,-.060,-.040,.202,1);left.scale.set(1,.29,.37);left.rotation.z=-.14;
   const right=sphere(head,.068,moustache,.060,-.040,.202,1);right.scale.set(1,.29,.37);right.rotation.z=.14;
   const sidepart=pathStroke(head,[new T.Vector3(-.075,.27,.135),new T.Vector3(-.036,.35,.07),new T.Vector3(.02,.37,.025)],0x403631,.008,.86);
   for(let k=0;k<3;k++)block(body,.012,.21,.019,paint('slate',0x88857e),-.16+k*.16,.93,.22);
 }
 if(style==='focion'||style==='diego'){
   for(const sx of [-1,1]){
     torus(head,.088,.009,paint('gold',0xa3a096),sx*.102,.078,.205);
     block(head,.070,.015,.013,paint('gold',0xa3a096),sx*.2,.08,.124);
   }
   block(head,.064,.012,.017,paint('gold',0xa3a096),0,.083,.222);
 }
 if(style==='fina'||style==='leonor'){
   for(const sx of [-1,1])sphere(head,.027,paint('gold',0xc9a38a),sx*.203,-.095,.046,1);
 }

 if(style==='diego'){for(let i=0;i<13;i++)sphere(body,.021,paint(['terracotta','olive','bluegray'][i%3]),Math.sin(i*13)*.22,1+i*.026%(.55),.265,0)}
 // Estructura común de animación: respiración y gestos contextuales de cada figura.
 const update=(t:number,moving=false,express=1)=>{
   const breath=Math.sin(t*2.1)*.012;
   body.position.y=breath;
   head.rotation.y=Math.sin(t*.72+style.length)*.095*express;
   head.rotation.z=Math.sin(t*.6+style.length)*.025*express;
   if(moving){leftLeg.rotation.x=Math.sin(t*9)*.41;rightLeg.rotation.x=-Math.sin(t*9)*.41;
     leftArm.rotation.x=-Math.sin(t*9)*.31;rightArm.rotation.x=Math.sin(t*9)*.31;body.rotation.z=Math.sin(t*9)*.025;}
   else{
     leftLeg.rotation.x=.015*Math.sin(t*1.6);rightLeg.rotation.x=.013*Math.cos(t*1.4);
     leftArm.rotation.x=Math.sin(t*.72+1)*.05;rightArm.rotation.x=Math.cos(t*.8)*.07;
     if(style==='diego')rightArm.rotation.x=-.55+.28*Math.sin(t*2.6);
     if(style==='federico')rightArm.rotation.z=-.24-.15*Math.sin(t*1.5);
     if(style==='inga'){leftArm.rotation.z=.35+.35*Math.sin(t*2);rightArm.rotation.z=-.38-.32*Math.cos(t*2);head.rotation.y+=Math.sin(t*1.6)*.2;}
     if(style==='monseñor')rightArm.rotation.x=-.22-.15*Math.sin(t*1.0);
     if(style==='poeta')rightArm.rotation.x=-.3+Math.sin(t*.9)*.20;
   }
 };
 return {root,head,leftArm,rightArm,leftLeg,rightLeg,style,update};
}
