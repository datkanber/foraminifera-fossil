// Internal consistency and prespecified counterfactuals on all tree paths.
// Counterfactual engine code runs only in VM contexts; application files are untouched.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const repo=path.resolve(__dirname,'../../../../..');
const out=path.resolve(__dirname,'../supplementary/S6_internal_evaluation');
fs.mkdirSync(out,{recursive:true});
const load=n=>JSON.parse(fs.readFileSync(path.join(repo,'api/data',n)));
const original=fs.readFileSync(path.join(repo,'api/src/services/scoring.js'),'utf8');
const characters=Object.fromEntries(load('characters.json').characters.map(c=>[c.id,c.values]));
const levels={M:'MANDATORY',D:'DIAGNOSTIC',S:'SUPPORTING',C:'CONTRADICTORY'};
const genera={};
for(const r of load('rule_chr_mapping.json')){
  genera[r.genus]||={genus:r.genus,module:r.module,rules:[]};
  genera[r.genus].rules.push({level:levels[r.level],text:r.text,mappings:r.mappings.map(m=>({chrId:m.chr_id,value:m.value})).filter(m=>m.value)});
}
const paths=[];
for(const mod of ['agglutinated','porcelaneous','hyaline']){
  const t=load('decision_tree_'+mod+'.json');const nodes=Object.fromEntries(t.nodes.map(n=>[n.id,n]));
  function walk(id,obs,trail){
    assert(!trail.includes(id),'Tree cycle');
    const n=nodes[id];
    for(const a of n.answers){
      const next={...obs};
      if(n.chr_id && a.value!=='*' && characters[n.chr_id]?.includes(a.value))next[n.chr_id]={value:a.value,state:'PRESENT'};
      for(const [c,v] of Object.entries(a.maps_to||{}))if(v!=='*')next[c]={value:v,state:'PRESENT'};
      for(const [c,v] of Object.entries(a.constraint||{}))if(!v.startsWith('!'))next[c]={value:v,state:'PRESENT'};
      if(a.next.startsWith('GENUS:'))paths.push({path_id:`PATH_${String(paths.length+1).padStart(3,'0')}`,module:mod.toUpperCase(),leaf_genus:a.next.slice(6),observations:next,trail:[...trail,id]});
      else if(!a.next.startsWith('INDETERMINATE:')&&!a.next.startsWith('REDIRECT:'))walk(a.next,next,[...trail,id]);
    }
  }
  walk(t.entry,{CHR_01:{value:mod.toUpperCase(),state:'PRESENT'}},[]);
}
assert.equal(paths.length,104);
function replaceOnce(source,from,to){assert.equal(source.split(from).length,2,'Unrecognized counterfactual patch');return source.replace(from,to);}
function engine(source){const context={module:{exports:{}},Set,Object};vm.runInNewContext(source,context);return context.module.exports;}
const baseline=engine(original);
let a1=original;
a1=replaceOnce(a1,'for (const c of Object.keys(groups)) {',`for (const c of Object.keys(groups)) {
    if (!h[c]) return { verdict: 'MISMATCH', held: new Set() };`);
let a2=replaceOnce(original,'const implied = VALUE_IMPLIES[`${c}:${o.value}`] || [];','const implied = [];');
let a4=replaceOnce(original,'let anyhold = false;','let anyhold = false; let missingGroup = false;');
a4=replaceOnce(a4,'for (const c of Object.keys(groups)) {','for (const c of Object.keys(groups)) { if (!h[c]) missingGroup = true;');
a4=replaceOnce(a4,"return anyhold ? { verdict: 'MATCH', held } : { verdict: 'NEUTRAL', held: new Set() };","return anyhold && !missingGroup ? { verdict: 'MATCH', held } : { verdict: 'NEUTRAL', held: new Set() };");
let a5=replaceOnce(original,'} else if (g2 && g1.score === g2.score) {','} else if (g2 && g1.score === g2.score && !(noC && !hasD && g1._dnm)) {');
let a6=replaceOnce(original,'} else if (noC && !hasD && g1._dnm) {','} else if (noC && !hasD && g1._dnm && (g2 === null || g1.score-g2.score >= 3)) {');
let a7=replaceOnce(original,'score -= 5 * nc;',`score -= 5 * nc;
    const observedWeight = g.rules.reduce((sum, r) => sum + (r.level !== 'CONTRADICTORY' && evaluateRuleM(h, r.mappings).verdict !== 'NEUTRAL' ? SCORES[r.level] || 0 : 0), 0);
    score = observedWeight > 0 ? score / observedWeight : score;`);
const configs={FULL:baseline,A1:engine(a1),A2:engine(a2),A3:baseline,A4:engine(a4),A5:engine(a5),A6:engine(a6),A7:engine(a7)};
function credit(ranking,truth,k){
  const target=ranking.find(r=>r.genus===truth);if(!target)return 0;
  const above=ranking.filter(r=>r.score>target.score).length;
  const ties=ranking.filter(r=>r.score===target.score).length;
  return Math.max(0,Math.min(1,(k-above)/ties));
}
assert.equal(credit([{genus:'a',score:2},{genus:'b',score:2}],'a',1),0.5);
assert.equal(credit([{genus:'a',score:2},{genus:'b',score:1},{genus:'c',score:1},{genus:'d',score:1}],'b',3),2/3);
const records=[];
for(const [configuration,e]of Object.entries(configs))for(const p of paths){
  const selected=Object.fromEntries(Object.entries(genera).filter(([,g])=>g.module===p.module).map(([k,g])=>[k,configuration==='A3'?{...g,rules:g.rules.filter(r=>r.level!=='CONTRADICTORY')}:g]));
  const res=e.scoreGenera(p.observations,selected);
  const abstain=['INDETERMINATE','NO_MATCH_WITHIN_CORE_TAXA'].includes(res.status);
  const leaf=res.ranking.find(r=>r.genus===p.leaf_genus);
  records.push({configuration,path_id:p.path_id,module:p.module,reference_genus:p.leaf_genus,status:res.status,predicted_genus:res.identification,
    acc1:abstain?0:credit(res.ranking,p.leaf_genus,1),acc3:abstain?0:credit(res.ranking,p.leaf_genus,3),
    leaf_excluded:res.excluded.some(r=>r.genus===p.leaf_genus),rank1_unique:!!leaf&&res.ranking.filter(r=>r.score>leaf.score).length===0&&res.ranking.filter(r=>r.score===leaf.score).length===1,
    rank1_tied:!!leaf&&res.ranking.filter(r=>r.score>leaf.score).length===0&&res.ranking.filter(r=>r.score===leaf.score).length>1,
    leaf_top3_shared_rank:!!leaf&&res.ranking.filter(r=>r.score>leaf.score).length<3,
    confirmed_correct:res.status==='CONFIRMED_GENUS'&&res.identification===p.leaf_genus,
    observations:p.observations});
}
const full=records.filter(r=>r.configuration==='FULL');
assert.equal(full.filter(r=>r.status==='CONFIRMED_GENUS').length,48);
assert.equal(full.filter(r=>r.confirmed_correct).length,14);
assert.equal(full.filter(r=>r.rank1_unique).length,24);
assert.equal(full.filter(r=>r.rank1_tied).length,10);
assert.equal(full.filter(r=>r.leaf_top3_shared_rank).length,64);
assert.equal(full.filter(r=>r.leaf_excluded).length,17);
const summary=[];
for(const configuration of Object.keys(configs))for(const module of ['ALL','AGGLUTINATED','PORCELANEOUS','HYALINE']){
  const rows=records.filter(r=>r.configuration===configuration&&(module==='ALL'||r.module===module));
  summary.push({configuration,module,n:rows.length,acc1:rows.reduce((s,r)=>s+r.acc1,0)/rows.length,acc3:rows.reduce((s,r)=>s+r.acc3,0)/rows.length,
    false_exclusion_rate:rows.filter(r=>r.leaf_excluded).length/rows.length,
    confirmed:rows.filter(r=>r.status==='CONFIRMED_GENUS').length,confirmed_correct:rows.filter(r=>r.confirmed_correct).length,
    rank1_unique:rows.filter(r=>r.rank1_unique).length,rank1_tied:rows.filter(r=>r.rank1_tied).length,top3_shared_rank:rows.filter(r=>r.leaf_top3_shared_rank).length});
}
function csv(file,rows){const keys=Object.keys(rows[0]);const q=v=>'"'+String(typeof v==='object'?JSON.stringify(v):v??'').replaceAll('"','""')+'"';fs.writeFileSync(path.join(out,file),keys.join(',')+'\n'+rows.map(r=>keys.map(k=>q(r[k])).join(',')).join('\n')+'\n');}
csv('S6_paths_and_ablations.csv',records);csv('S6_summary.csv',summary);
fs.writeFileSync(path.join(out,'S6_paths.json'),JSON.stringify(paths,null,2));
fs.writeFileSync(path.join(out,'S6_summary.json'),JSON.stringify(summary,null,2));
fs.writeFileSync(path.join(out,'S6_counterfactual_definitions.json'),JSON.stringify({
  engineSha256:crypto.createHash('sha256').update(original).digest('hex'),FULL:'Unmodified released scoring.js',
  A1:'All rule groups referring to unobserved characters become MISMATCH. This formalizes manuscript A1; it is not a claim that literal ABSENT is a valid state of every character. nObserved remains the actual observed count.',
  A2:'Disable the 13 implication mappings',A3:'Remove all contradictory rules',A4:'Strict conjunction: all mapped character groups must be observed and supported for MATCH; any observed mismatch still takes precedence',
  A5:'PROBABLE test precedes equal-score tie test',A6:'PROBABLE test additionally requires margin at least 3; no runner-up means infinite margin',
  A7:'Divide score by total positive rule weight with non-neutral verdict; preserve released confidence thresholds, which therefore change scale relative to normalized scores',
  evaluation:'104 paths from the same KB; internal consistency only. Acc@k uses expected uniform score-tie breaking; abstentions count as errors. Table XIV shared-rank counts are also supplied separately.'},null,2));
console.log(JSON.stringify(summary.filter(r=>r.module==='ALL'),null,2));
module.exports={configs,genera,credit};
