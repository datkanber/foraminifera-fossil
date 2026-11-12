const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'client/src/assets/scs/revision_v32');
const chars=require('../api/data/characters.json').characters;
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const context=await browser.newContext({viewport:{width:1480,height:1050},deviceScaleFactor:3});
  await context.addInitScript(()=>localStorage.setItem('foram_lang','en'));
  await context.route(/^https?:/,r=>/^https?:\/\/(127\.0\.0\.1|localhost)(:|\/)/.test(r.request().url())?r.continue():r.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:13000/tani');await page.locator('.mode-card').nth(1).click();assert.equal(await page.locator('.chr-block').count(),21);
  async function choose(cid,value){const c=chars.find(c=>c.id===cid),label=c.value_labels_en?.[value]||value;await page.locator('.chr-block').filter({has:page.getByText(cid,{exact:true})}).getByRole('button',{name:label,exact:true}).click();}
  const observations={CHR_01:'AGGLUTINATED',CHR_03:'ABSENT',CHR_04:'UNDIVIDED',CHR_06:'PLANISPIRAL',CHR_07:'SINGLE_PLANE'};
  for(const [c,v]of Object.entries(observations))await choose(c,v);
  const response=page.waitForResponse(r=>r.url().endsWith('/api/diagnose/score')&&r.request().method()==='POST');
  await page.locator('.diagnose-button').click();const reply=await response,result=await reply.json();assert.equal(reply.status(),200);assert.equal(result.identification,'Ammodiscus');assert.equal(result.ranking[0].score,19);
  await page.locator('.score-status-banner').waitFor();await page.waitForTimeout(4000);
  await page.locator('.ranking-section').screenshot({path:path.join(out,'Figure_3_Repaired_Ranking.png')});
  await page.locator('.excluded-section summary').click();assert.equal(await page.locator('.excluded-list li').count(),result.excluded.length);
  await page.locator('.excluded-section').screenshot({path:path.join(out,'Figure_4_Repaired_Exclusions.png')});
  fs.writeFileSync(path.join(out,'Figure_3_4_Scoring_Receipt.json'),JSON.stringify({scenario:'Table XI / historical Table XIII, scenario A',input:observations,response:result,source:'Actual browser POST to local API backed by isolated current-master Neo4j'},null,2));
  await choose('CHR_21','OBLIQUE');const warningResponse=page.waitForResponse(r=>r.url().endsWith('/api/diagnose/score'));await page.locator('.diagnose-button').click();const warned=await (await warningResponse).json();assert.equal(warned.sectionWarning.code,'SECTION_SENSITIVITY');await page.locator('.score-result .section-warning').waitFor();assert.deepEqual(warned.ranking,result.ranking);
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(root,'eval/results/v32/browser_verification.json'),JSON.stringify({story:'21-character UI to actual HTTP API to isolated current-master Neo4j to scoring response and rendered evidence/exclusions',passed:true,character_rows:21,HTTP_status:reply.status(),identification:result.identification,score:19,excluded_count:result.excluded.length,section_warning_rendered:true,section_warning_changes_ranking:false,page_errors:errors,device_scale_factor:3,production_modified:false},null,2));
  console.log(JSON.stringify({passed:true,identification:result.identification,score:19,excluded:result.excluded.length,characters:21}));await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
