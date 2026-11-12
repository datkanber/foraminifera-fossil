/* Offline UI software test. No real expert review, approval or study result. */
const fs=require('fs'),path=require('path'),assert=require('assert');
const {pathToFileURL}=require('url');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..');
const study=path.join(root,'client/src/assets/scs/llm_expert_review_v31');
const scope='SYNTHETIC SOFTWARE TEST ONLY: automated checkbox/signature interactions are not human approval and cannot be used as study data.';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--disable-background-networking']});
 try{
  const context=await browser.newContext({acceptDownloads:true});
  await context.route(/^https?:/,route=>route.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.join(study,'review_forms/pilot/EXP01/Review_Form.html')).href);
  assert.equal(await page.locator('#rows tr').count(),21);await page.selectOption('#specimen','P001');
  await page.click('#start');assert.equal(await page.evaluate(()=>started),null);
  await page.setInputFiles('#images',path.join(study,'public/pilot/materials/P002/view01.png'));
  await page.waitForFunction(()=>materials.length===1);assert.equal(await page.evaluate(()=>materialMatches()),false);
  await page.click('#start');assert.equal(await page.evaluate(()=>started),null);
  await page.setInputFiles('#images',path.join(study,'public/pilot/materials/P001/view01.png'));
  await page.waitForFunction(()=>materialMatches());await page.click('#start');assert(await page.evaluate(()=>started));
  await page.click('#export');assert((await page.textContent('#message')).startsWith('CHR_01:'));
  await page.evaluate(()=>{for(const c of characters)$(c.id+'_action').value='APPROVE';});
  await page.click('#export');assert.equal(await page.evaluate(()=>finished),false);
  for(const id of ['reference_label_hidden','other_observer_hidden','system_outputs_hidden','independent_completion'])await page.check('#'+id);
  await page.fill('#signature','EXP01');await page.click('#export');assert.equal(await page.evaluate(()=>finished),false);
  // Explicitly synthetic interactions below; discard the untagged download.
  await page.check('#human_approval');const dl=page.waitForEvent('download');await page.click('#export');const download=await dl;
  const payload=JSON.parse(fs.readFileSync(await download.path(),'utf8'));await download.delete();
  assert.equal(payload.status,'EXPERT_VERIFIED');assert.equal(payload.phase,'pilot');
  const raw=JSON.parse(fs.readFileSync(path.join(study,'llm_drafts/pilot/P001/draft.json'),'utf8'));
  for(const [c,o]of Object.entries(raw.observations)){
   assert.deepEqual({value:payload.observations[c].value,state:payload.observations[c].state,reason:payload.observations[c].reason},o);
   assert.equal(payload.observations[c].review_action,'APPROVE');
  }
  assert(payload.timing.active_seconds>0);assert.equal(errors.length,0);
  // Persist only test evidence, never the simulated approval form.
  const evidence={passed:true,scope,checks:['21 character rows','wrong image and missing image blocked','per-row decisions mandatory','blinding attestations mandatory','explicit human declaration mandatory','unchanged draft values and neutral states preserved','JSON download binding','no page errors'],real_expert_submissions_created:0};
  fs.writeFileSync(path.join(study,'evidence/browser_review_form_test.json'),JSON.stringify(evidence,null,2)+'\n');
  console.log(JSON.stringify(evidence));await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
