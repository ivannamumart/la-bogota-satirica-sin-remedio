/** Prueba de navegador real: geometría WebGL, movimiento, ingreso, ciclo día-noche, panel de luna. */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('docs/qa', {recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',e=>{if(e.type()==='error') errors.push('console: '+e.text().slice(0,300))});
page.on('requestfailed',r=>{if(!r.url().includes('fonts.googleapis.com')&&!r.url().includes('fonts.gstatic.com'))errors.push('request: '+r.url()+' '+r.failure()?.errorText)});
let result={success:false,steps:[],errors:[]};
try {
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__BOGOTA_TEST__?.getState() !== undefined,{timeout:20000});
  await page.waitForTimeout(3000);
  const hasCanvas=await page.locator('#world canvas').count();
  if(!hasCanvas)throw Error('No se creó canvas WebGL');
  const ctx=await page.evaluate(()=>!!document.querySelector('#world canvas')?.getContext('webgl2'));
  if(!ctx)throw Error('No se creó contexto WebGL2');
  await page.screenshot({path:'docs/qa/01-globo.png'});
  result.steps.push({step:'globo',state:await page.evaluate(()=>window.__BOGOTA_TEST__.getState())});
  await page.keyboard.press('w');await page.waitForTimeout(600);
  await page.keyboard.down('w');await page.waitForTimeout(1700);await page.keyboard.up('w');
  await page.screenshot({path:'docs/qa/02-caminar.png'});
  result.steps.push({step:'caminar',state:await page.evaluate(()=>window.__BOGOTA_TEST__.getState())});
  await page.evaluate(()=>window.__BOGOTA_TEST__.enterSite('apartamento'));
  await page.waitForFunction(()=>window.__BOGOTA_TEST__.getState().mode==='interior',{timeout:15000});
  await page.waitForTimeout(5500);
  await page.screenshot({path:'docs/qa/03-apartamento.png'});
  result.steps.push({step:'interior',state:await page.evaluate(()=>window.__BOGOTA_TEST__.getState())});
  await page.click('#moon');await page.waitForTimeout(1100);
  if(!(await page.locator('#about').evaluate(e=>e.classList.contains('open'))))throw Error('La luna no abrió Sobre el proyecto');
  await page.screenshot({path:'docs/qa/04-sobre.png'});
  await page.click('#about-close');
  await page.waitForTimeout(1000);
  await page.evaluate(()=>window.__BOGOTA_TEST__.jumpDay());
  await page.waitForTimeout(700);
  await page.screenshot({path:'docs/qa/05-tarde.png'});
  await page.keyboard.press('Escape');await page.waitForTimeout(1700);
  await page.evaluate(()=>window.__BOGOTA_TEST__.jumpDay());
  await page.waitForTimeout(800);
  await page.screenshot({path:'docs/qa/06-noche.png'});
  result.steps.push({step:'ciclo',state:await page.evaluate(()=>window.__BOGOTA_TEST__.getState())});
  if(errors.length)throw Error(errors.join('\n'));
  result.success=true;
} catch(e){result.errors=[...errors,String(e)];await page.screenshot({path:'docs/qa/ERROR.png'}).catch(()=>{})}
finally{writeFileSync('docs/qa/result.json',JSON.stringify(result,null,2));await browser.close()}
console.log(JSON.stringify(result,null,2));
if(!result.success)process.exit(1);
