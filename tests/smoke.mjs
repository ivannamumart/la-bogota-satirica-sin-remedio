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
  await page.keyboard.press('Space');
  for(let i=0;i<4;i++){await page.keyboard.press('Space');await page.waitForTimeout(150)}
  await page.waitForFunction(()=>window.__BOGOTA_TEST__.getState().phase==='choice',{timeout:12000});
  await page.screenshot({path:'docs/qa/03b-alternativas.png'});
  await page.keyboard.press('1');await page.waitForTimeout(350);
  if((await page.evaluate(()=>window.__BOGOTA_TEST__.getState().phase))!=='branch')throw Error('La elección no inicia una rama narrativa');
  result.steps.push({step:'interior',state:await page.evaluate(()=>window.__BOGOTA_TEST__.getState())});
  await page.click('#moon');await page.waitForTimeout(1100);
  if(!(await page.locator('#about').evaluate(e=>e.classList.contains('open'))))throw Error('La luna no abrió Sobre el proyecto');
  const aboutOnTop=await page.evaluate(()=>!!document.elementFromPoint(window.innerWidth/2,window.innerHeight/2)?.closest('#about'));
  if(!aboutOnTop)throw Error('El panel blanco y negro no ocupa realmente la pantalla');
  await page.screenshot({path:'docs/qa/04-sobre.png'});
  await page.click('#about-close');
  await page.waitForTimeout(1000);
  await page.evaluate(()=>window.__BOGOTA_TEST__.jumpDay());
  await page.waitForTimeout(700);
  await page.screenshot({path:'docs/qa/05-tarde.png'});
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>window.__BOGOTA_TEST__.getState().mode==='walk',{timeout:15000});
  await page.click('#center');await page.waitForTimeout(1200);
  await page.evaluate(()=>window.__BOGOTA_TEST__.jumpDay());
  await page.waitForTimeout(800);
  await page.screenshot({path:'docs/qa/06-noche.png'});
  result.steps.push({step:'ciclo',state:await page.evaluate(()=>window.__BOGOTA_TEST__.getState())});
  for(const [id,shot] of [['unicornio','07-unicornio.png'],['porciuncula','08-porciuncula.png'],['cementerio','09-cementerio.png']]){
    await page.evaluate(id=>window.__BOGOTA_TEST__.enterSite(id),id);
    await page.waitForFunction(()=>window.__BOGOTA_TEST__.getState().mode==='interior',{timeout:15000});
    await page.waitForTimeout(1600);
    await page.screenshot({path:'docs/qa/'+shot});
    result.steps.push({step:id,state:await page.evaluate(()=>window.__BOGOTA_TEST__.getState())});
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>window.__BOGOTA_TEST__.getState().mode==='walk',{timeout:15000});
    await page.waitForTimeout(750);
  }
  if(errors.length)throw Error(errors.join('\n'));
  result.success=true;
} catch(e){result.errors=[...errors,String(e)];await page.screenshot({path:'docs/qa/ERROR.png'}).catch(()=>{})}
finally{writeFileSync('docs/qa/result.json',JSON.stringify(result,null,2));await browser.close()}
console.log(JSON.stringify(result,null,2));
if(!result.success)process.exit(1);
