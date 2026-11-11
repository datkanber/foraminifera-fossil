// Reuses the application's VLM controller and scoring engine without changing either.
// One predeclared pass per image; resumable. Never sends reference labels or filenames.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { AsyncLocalStorage } = require('node:async_hooks');
const repo = path.resolve(__dirname, '../../../../..');
const out = path.resolve(__dirname, '../evaluation');
const rawDir = path.join(out, 'raw');
fs.mkdirSync(rawDir, { recursive: true });
require(path.join(repo, 'api/node_modules/dotenv')).config({ path: path.join(repo, 'api/.env'), quiet: true });
if (process.env.EVAL_MODEL) process.env.GEMINI_MODEL = process.env.EVAL_MODEL;
const vlm = require(path.join(repo, 'api/src/controllers/vlmController'));
const { driver } = require(path.join(repo, 'api/src/db/neo4j'));
const { scoreGenera } = require(path.join(repo, 'api/src/services/scoring'));
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const read = p => fs.readFileSync(path.join(repo,p));
const manifestBytes = fs.readFileSync(path.join(out, 'panel_manifest.json'));
const manifest = JSON.parse(manifestBytes);
const config = {
  manifestSha256: hash(manifestBytes), model: process.env.GEMINI_MODEL,
  providerHost: new URL(process.env.GEMINI_BASE_URL).host,
  scoringSha256: hash(read('api/src/services/scoring.js')),
  controllerSha256: hash(read('api/src/controllers/vlmController.js')),
  promptSha256: hash(read('api/src/prompts/visionObserver.js')),
  rulesSha256: hash(read('api/data/rule_chr_mapping.json')),
  runsPerImage: 1, concurrency: 3, minimumStartIntervalMs: Number(process.env.EVAL_INTERVAL_MS || 4500),
  observationSource: 'Uncorrected, application-normalized VLM observations',
  referenceLabelsSentToModel: false, useReferenceModuleForScoring: false,
};
const configHash = hash(JSON.stringify(config));
const configPath = path.join(out, 'execution_config.json');
if (fs.existsSync(configPath)) {
  if (JSON.parse(fs.readFileSync(configPath)).configHash !== configHash) throw new Error('Frozen experiment config changed. Do not mix runs.');
} else fs.writeFileSync(configPath, JSON.stringify({ ...config, configHash, startedAt: new Date().toISOString() }, null, 2));

const genera = {};
const levels = { M: 'MANDATORY', D: 'DIAGNOSTIC', S: 'SUPPORTING', C: 'CONTRADICTORY' };
for (const r of JSON.parse(read('api/data/rule_chr_mapping.json'))) {
  if (!genera[r.genus]) genera[r.genus] = { genus:r.genus, module:r.module, rules:[] };
  genera[r.genus].rules.push({level:levels[r.level],text:r.text,mappings:(r.mappings||[]).map(m=>({chrId:m.chr_id||m.chrId,value:m.value})).filter(m=>m.chrId && m.value)});
}

const local = new AsyncLocalStorage();
const fetchOriginal = global.fetch;
global.fetch = async (url, options = {}) => {
  const ctx = local.getStore();
  if (ctx) {
    const body = JSON.parse(options.body);
    ctx.request = { model:config.model, generationConfig:body.generationConfig,
      text:body.contents?.[0]?.parts?.filter(p=>p.text).map(p=>p.text).join('\n') || body.messages?.[0]?.content?.find(p=>p.type==='text')?.text,
      imageSha256:ctx.imageSha256, mimeType:'image/png' };
  }
  const response = await fetchOriginal(url, { ...options, signal:AbortSignal.timeout(90000) });
  if (ctx) {
    ctx.providerStatus = response.status;
    ctx.providerResponse = await response.clone().json().catch(()=>null);
    ctx.retryAfter = response.headers.get('retry-after');
  }
  return response;
};

const delay = ms => new Promise(r=>setTimeout(r,ms));
let lastStart = 0;
let startChain = Promise.resolve();
function rateSlot() {
  const slot = startChain.then(async()=>{
    await delay(Math.max(0,lastStart + config.minimumStartIntervalMs - Date.now()));
    lastStart = Date.now();
  });
  startChain = slot.catch(()=>{});
  return slot;
}
let stopReason = null;
let finished = 0;
let cursor = 0;
const all = [];
function progress() {
  const result = { planned:manifest.length, completed:all.filter(r=>r.success).length,
    failed:all.filter(r=>!r.success).length, pending:manifest.length-all.length,
    stopReason, updatedAt:new Date().toISOString() };
  fs.writeFileSync(path.join(out,'progress.json'),JSON.stringify(result,null,2));
  return result;
}
async function evaluate(row) {
  const dest = path.join(rawDir,row.image_id+'.json');
  let historicalAttempts = [];
  if (fs.existsSync(dest)) {
    const prior = JSON.parse(fs.readFileSync(dest));
    if (prior.configHash !== configHash || prior.imageSha256 !== row.sha256) throw new Error('Cached result provenance mismatch: '+row.image_id);
    if (prior.success) { all.push(prior); finished++; progress(); return; }
    historicalAttempts = prior.attempts || [];
  }
  const image = fs.readFileSync(path.join(out,row.file));
  if (hash(image)!==row.sha256) throw new Error('Image changed after freeze: '+row.image_id);
  const attempts = [...historicalAttempts];
  let returned;
  const started = Date.now();
  for (let attempt=1;attempt<=3;attempt++) {
    if (stopReason) return;
    await rateSlot();
    const ctx = {imageSha256:row.sha256};
    let code=200;
    await local.run(ctx,async()=>{
      await vlm.observe({body:{imageBase64:image.toString('base64'),mimeType:'image/png',runScore:false}}, {
        status(n){code=n;return this;},json(data){returned=data;return this;},
      });
    });
    attempts.push({attempt,at:new Date().toISOString(),httpStatus:code,...ctx});
    if (returned?.success) break;
    const errorText = JSON.stringify(ctx.providerResponse || returned || {});
    if (code===429 && /PerDay|per.day|daily|requests_per_day/i.test(errorText)) {
      stopReason='Provider daily quota reached; pending images have no inferred result.'; break;
    }
    if (![429,500,502,503,504].includes(code)) break;
    const retryDetail = ctx.providerResponse?.error?.details?.find(x=>x.retryDelay)?.retryDelay;
    const seconds = Number(String(retryDetail || ctx.retryAfter || '').replace('s','')) || 20*attempt;
    await delay(Math.min(55000,Math.max(5000,seconds*1000)));
  }
  const result = { imageId:row.image_id, imageSha256:row.sha256, configHash,
    success:!!returned?.success, elapsedMs:Date.now()-started, attempts,
    response:returned || null, score:null };
  if (result.success) {
    const observations=returned.observation.observations;
    const composition=observations.CHR_01;
    const moduleName=composition && !['NOT_OBSERVABLE','UNCERTAIN'].includes(composition.state) && ['AGGLUTINATED','PORCELANEOUS','HYALINE'].includes(composition.value) ? composition.value : null;
    const selected=Object.fromEntries(Object.entries(genera).filter(([,g])=>!moduleName || g.module===moduleName));
    result.score={module:moduleName,...scoreGenera(observations,selected)};
  }
  fs.writeFileSync(dest,JSON.stringify(result,null,2));
  all.push(result); finished++;
  const p=progress();
  console.log(`${row.image_id}: ${result.success ? result.score.status : 'API_FAILURE'} (${p.completed}/${p.planned} completed, ${p.failed} failed)`);
}

(async()=>{
  try {
    const worker=async()=>{
      while (!stopReason) {
        const index=cursor++;
        if(index>=manifest.length) return;
        await evaluate(manifest[index]);
      }
    };
    await Promise.all([worker(),worker(),worker()]);
    console.log(JSON.stringify(progress()));
    if(all.length!==manifest.length || all.some(x=>!x.success)) process.exitCode=2;
  } finally { await driver.close(); }
})().catch(e=>{console.error(e.message);progress();process.exitCode=1;});
