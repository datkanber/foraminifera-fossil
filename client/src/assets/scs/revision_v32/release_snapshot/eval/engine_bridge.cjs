// Offline bridge: all experiments call the actual application scorer.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const current=require('../api/src/services/scoring');
const levels={M:'MANDATORY',D:'DIAGNOSTIC',S:'SUPPORTING',C:'CONTRADICTORY'};
function masters(dir){
 const result={};
 for(const r of JSON.parse(fs.readFileSync(path.join(dir,'rule_chr_mapping.json'),'utf8'))){
  result[r.genus]||={genus:r.genus,module:r.module,rules:[]};
  result[r.genus].rules.push({level:levels[r.level],text:r.text,rule_key:r.rule_key,matchMode:r.match_mode,
   mappings:r.mappings.map(m=>({chrId:m.chr_id,value:m.value})).filter(m=>m.value)});
 }
 return result;
}
function b1(obs,genera,opts={}){
 const h=current.buildH(obs);
 const n=Object.entries(obs).filter(([c,o])=>!['CHR_01','CHR_21'].includes(c)&&o&&o.value&&!['UNCERTAIN','NOT_OBSERVABLE'].includes(o.state)).length;
 const ranking=[],excluded=[];
 for(const g of Object.values(genera)){
  const failures=g.rules.filter(r=>['MANDATORY','DIAGNOSTIC'].includes(r.level)&&current.evaluateRuleM(h,r.mappings,r.matchMode).verdict==='MISMATCH');
  (failures.length?excluded:ranking).push({genus:g.genus,score:0,violated:failures.map(r=>r.rule_key)});
 }
 ranking.sort((a,b)=>a.genus.localeCompare(b.genus));
 const abstain=n<(opts.tauObs??2)||!ranking.length;
 return {status:abstain?'INDETERMINATE':'CANDIDATE_GENUS',identification:abstain?null:ranking[0].genus,ranking,excluded};
}
function counterfactual(name){
 if(!name||name==='A0')return current;
 let code=fs.readFileSync(path.join(root,'api/src/services/scoring.js'),'utf8');
 const replace=(a,b)=>{if(code.split(a).length!==2)throw Error('Counterfactual source mismatch '+name);code=code.replace(a,b);};
 if(name==='A1')replace('for (const c of Object.keys(groups)) {',"for (const c of Object.keys(groups)) { if (!h[c]) return {verdict:'MISMATCH',held:new Set()};");
 if(name==='A2')replace('const implied = VALUE_IMPLIES[`${c}:${o.value}`] || [];','const implied = [];');
 if(name==='A4'){
  replace('let anyhold = false;','let anyhold = false; let missing = false;');
  replace('for (const c of Object.keys(groups)) {','for (const c of Object.keys(groups)) { if (!h[c]) missing = true;');
  replace("return anyhold ? { verdict: 'MATCH', held }", "return anyhold && !missing ? { verdict: 'MATCH', held }");
 }
 if(name==='A5')replace('} else if (g2 && g1.score === g2.score) {','} else if (g2 && g1.score === g2.score && !(noC && !hasD && g1._dnm)) {');
 if(name==='A6')replace('} else if (noC && !hasD && g1._dnm) {','} else if (noC && !hasD && g1._dnm && (g2 === null || g1.score-g2.score >= 3)) {');
 if(name==='A7')replace('score += weights.CONTRADICTORY * nc;',`score += weights.CONTRADICTORY * nc;
 const observedWeight=g.rules.reduce((s,r)=>s+(r.level!=='CONTRADICTORY'&&evaluateRuleM(h,r.mappings).verdict!=='NEUTRAL'?(weights[r.level]||0):0),0);
 if(observedWeight>0)score/=observedWeight;`);
 const ctx={module:{exports:{}}};vm.runInNewContext(code,ctx);return ctx.module.exports;
}
const input=JSON.parse(fs.readFileSync(0,'utf8'));
if(input.describe){process.stdout.write(JSON.stringify({weights:current.SCORES,implications:current.VALUE_IMPLIES}));process.exit(0);}
const all=masters(input.dataDir?path.resolve(input.dataDir):path.join(root,'api/data'));
let base=current;
if(input.frozen){const ctx={module:{exports:{}}};vm.runInNewContext(fs.readFileSync(path.join(root,'eval/archive/pre_audit_20261111/scoring.js'),'utf8'),ctx);base=ctx.module.exports;}
const output=[];
for(const cfg of input.configurations||[{id:'A0'}]){
 const eng=input.frozen?base:counterfactual(cfg.counterfactual);
 for(const c of input.cases){
  const genera=Object.fromEntries(Object.entries(all).filter(([,g])=>!c.module||g.module===c.module).map(([k,g])=>[k,cfg.counterfactual==='A3'?{...g,rules:g.rules.filter(r=>r.level!=='CONTRADICTORY')}:g]));
  const res=cfg.baseline==='B1'?b1(c.observations,genera,cfg.options):eng.scoreGenera(c.observations,genera,cfg.options);
  output.push({case_id:c.case_id,configuration:cfg.id,status:res.status,identification:res.identification,
   ranking:res.ranking.map(r=>({genus:r.genus,score:r.score})),excluded:res.excluded.map(r=>r.genus),sectionWarning:res.sectionWarning||null});
 }
}
process.stdout.write(JSON.stringify(output));
