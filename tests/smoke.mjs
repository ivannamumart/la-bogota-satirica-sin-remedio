/** Prueba de juego: teclado, retroceso, escenas sin avance por reloj, móvil y WebGL. */
import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
mkdirSync('docs/qa',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const errors=[],steps=[];let page;
async function state(p=page){return p.evaluate(()=>window.__BOGOTA_TEST__.getState())}
async function shot(p,n){await p.screenshot({path:'docs/qa/'+n+'.png'})}
async function pressHold(p,key,ms){await p.keyboard.down(key);await p.waitForTimeout(ms);await p.keyboard.up(key);await p.waitForTimeout(250)}
const trackErrors=p=>{p.on('pageerror',e=>errors.push(e.message));p.on('console',e=>{if(e.type()==='error'&&!e.text().includes('favicon'))errors.push(e.text().slice(0,350))})};
let passed=false;
try{
 page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});trackErrors(page);
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>window.__BOGOTA_TEST__?.getState()!==undefined,{timeout:25000});await page.waitForTimeout(2000);
 if(!await page.locator('#world canvas').count())throw Error('Falta el canvas WebGL');
 if(!await page.evaluate(()=>!!document.querySelector('#world canvas')?.getContext('webgl2')))throw Error('Sin contexto WebGL2');
 await shot(page,'01-globo');steps.push({item:'globo',state:await state()});
 await page.evaluate(()=>window.__BOGOTA_TEST__.walk());await page.waitForTimeout(300);
 const a=await state();await pressHold(page,'w',550);const b=await state();
 if(a.distance===b.distance)throw Error('W no hace avanzar al protagonista');
 await pressHold(page,'s',950);const c=await state();
 if(c.mode!=='walk'||Math.abs(c.distance-b.distance)<.035)throw Error('S no mueve al protagonista hacia atrás: '+JSON.stringify({a,b,c}));
 await shot(page,'02-caminar');steps.push({item:'avance y retroceso',a:a.distance,b:b.distance,c:c.distance});
 await page.evaluate(()=>window.__BOGOTA_TEST__.enterSite('apartamento'));
 await page.waitForFunction(()=>window.__BOGOTA_TEST__.getState().phase==='canonical',{timeout:15000});
 const d=await state();await page.waitForTimeout(2100);const e=await state();
 if(d.dialogueIndex!==e.dialogueIndex)throw Error('El diálogo avanza sin intervención del usuario');
 await page.keyboard.press('ArrowUp');await page.waitForTimeout(170);const f=await state();
 if(f.dialogueIndex!==d.dialogueIndex+1)throw Error('No se avanza el diálogo con flecha ↑');
 await page.keyboard.press('ArrowDown');await page.waitForTimeout(170);const g=await state();
 if(g.dialogueIndex!==d.dialogueIndex)throw Error('No se retrocede el diálogo con flecha ↓');
 if(await page.locator('#speaker').textContent()==='Narrador')throw Error('Rótulo Narrador visible');
 await shot(page,'03-escena_dialogo');steps.push({item:'diálogo manual',antes:d.dialogueIndex,despues:f.dialogueIndex,reversa:g.dialogueIndex});
 if(!await page.locator('#stage-aside').evaluate(e=>e.classList.contains('active')))throw Error('Las acotaciones escénicas deben ser distintas de los parlamentos');
 if(await page.locator('#subtitles').evaluate(e=>e.classList.contains('active')))throw Error('Una acotación apareció como globo de diálogo');
 for(let i=0;i<22;i++){if((await state()).phase==='choice')break;await page.keyboard.press('ArrowUp');await page.waitForTimeout(75)}
 if((await state()).phase!=='choice')throw Error('No aparecieron las decisiones');
 if(await page.locator('.choice-option').count()!==3)throw Error('Faltan opciones');
 await shot(page,'04-decisiones');await page.locator('.choice-option').first().click();
 if((await state()).phase!=='branch')throw Error('No entra a una rama narrativa');
 const branch0=await state();await page.keyboard.press('ArrowUp');await page.waitForTimeout(100);
 const branch1=await state();if(branch1.dialogueIndex<=branch0.dialogueIndex)throw Error('La rama no continúa');
 await page.keyboard.press('ArrowDown');await page.waitForTimeout(100);
 const branch2=await state();if(branch2.dialogueIndex!==branch0.dialogueIndex)throw Error('La rama no retrocede');
 steps.push({item:'rama',inicio:branch0.dialogueIndex,avance:branch1.dialogueIndex,retroceso:branch2.dialogueIndex});
 await page.click('#moon');if(!await page.locator('#about').evaluate(e=>e.classList.contains('open')))throw Error('La luna no abre el proyecto');
 await shot(page,'05-sobre');await page.click('#about-close');await page.keyboard.press('Escape');
 await page.waitForFunction(()=>window.__BOGOTA_TEST__.getState().mode==='walk',{timeout:15000});
 await page.click('#center');await page.evaluate(()=>window.__BOGOTA_TEST__.jumpDay());await page.waitForTimeout(1100);await shot(page,'06-dia_noche');
 // Libera el contexto WebGL de escritorio antes de abrir uno táctil en GPU software.
 await page.close();page=null;
 const phone=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});trackErrors(phone);
 await phone.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:35000});
 await phone.waitForFunction(()=>window.__BOGOTA_TEST__?.getState()!==undefined,{timeout:45000});await phone.waitForTimeout(1300);
 await shot(phone,'07-movil_globo');
 await phone.evaluate(()=>window.__BOGOTA_TEST__.walk());await phone.waitForTimeout(300);
 if(!await phone.locator('#mobile-pad').evaluate(e=>e.classList.contains('visible')))throw Error('Pad táctil no visible');
 const before=await state(phone);
 const btn=phone.locator('[data-key="w"]');await btn.dispatchEvent('pointerdown',{pointerId:1,pointerType:'touch'});await phone.waitForTimeout(550);await btn.dispatchEvent('pointerup',{pointerId:1,pointerType:'touch'});await phone.waitForTimeout(250);
 const after=await state(phone);if(before.distance===after.distance)throw Error('Control ↑ móvil no permite caminar');
 await shot(phone,'08-movil_caminar');
 await phone.evaluate(()=>window.__BOGOTA_TEST__.enterSite('apartamento'));
 await phone.waitForFunction(()=>window.__BOGOTA_TEST__.getState().phase==='canonical',{timeout:15000});
 await shot(phone,'09-movil_dialogo');
 const overflow=await phone.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
 if(overflow)throw Error('Desbordamiento horizontal en móvil');
 steps.push({item:'móvil',before:before.distance,after:after.distance,overflow});
 await phone.close();if(errors.length)throw Error(errors.join('\n'));passed=true;
}catch(e){errors.push(String(e));if(page)await shot(page,'ERROR').catch(()=>{})}
finally{writeFileSync('docs/qa/result.json',JSON.stringify({passed,steps,errors},null,2));await browser.close()}
console.log(JSON.stringify({passed,steps,errors},null,2));if(!passed)process.exit(1);
