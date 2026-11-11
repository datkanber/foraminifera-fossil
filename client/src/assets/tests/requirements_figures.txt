const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const originalLog=console.log;console.log=()=>{};
const {configs,genera,credit}=require('./internal_evaluation.cjs');console.log=originalLog;
const ev=path.resolve(__dirname,'../evaluation');const out=path.resolve(__dirname,'../supplementary/S6_internal_evaluation');
const manifest=JSON.parse(fs.readFileSync(path.join(ev,'panel_manifest.json')));const records=[];
for(const row of manifest){
 const raw=JSON.parse(fs.readFileSync(path.join(ev,'raw',row.image_id+'.json')));assert(raw.success);
 const observations=raw.response.observation.observations;const mod=raw.score.module;
 for(const[configuration,e]of Object.entries(configs)){
  const selected=Object.fromEntries(Object.entries(genera).filter(([,g])=>!mod||g.module===mod).map(([k,g])=>[k,configuration==='A3'?{...g,rules:g.rules.filter(r=>r.level!=='CONTRADICTORY')}:g]));
  const res=e.scoreGenera(observations,selected);const abstain=['INDETERMINATE','NO_MATCH_WITHIN_CORE_TAXA'].includes(res.status);
  if(configuration==='FULL'){assert.equal(res.status,raw.score.status);assert.equal(res.identification,raw.score.identification);}
  records.push({configuration,image_id:row.image_id,reference_genus:row.reference_genus,module:row.module,cohort:row.cohort,
   status:res.status,predicted_genus:res.identification,acc1:abstain?0:credit(res.ranking,row.reference_genus,1),acc3:abstain?0:credit(res.ranking,row.reference_genus,3),
   reference_excluded:res.excluded.some(r=>r.genus===row.reference_genus)});
 }
}
const summary=[];
for(const configuration of Object.keys(configs))for(const cohort of ['ALL','Additional articles','KB reference book (overlap)']){
 const rows=records.filter(r=>r.configuration===configuration&&(cohort==='ALL'||r.cohort===cohort));
 summary.push({configuration,cohort,n:rows.length,acc1:rows.reduce((s,r)=>s+r.acc1,0)/rows.length,acc3:rows.reduce((s,r)=>s+r.acc3,0)/rows.length,
  false_exclusion_rate:rows.filter(r=>r.reference_excluded).length/rows.length,confirmed:rows.filter(r=>r.status==='CONFIRMED_GENUS').length});
}
function csv(name,rows){const keys=Object.keys(rows[0]);const q=v=>'"'+String(v??'').replaceAll('"','""')+'"';fs.writeFileSync(path.join(out,name),keys.join(',')+'\n'+rows.map(r=>keys.map(k=>q(r[k])).join(',')).join('\n')+'\n');}
csv('S6_VLM_sheet_ablations.csv',records);csv('S6_VLM_sheet_ablation_summary.csv',summary);
fs.writeFileSync(path.join(out,'S6_VLM_sheet_ablation_summary.json'),JSON.stringify(summary,null,2));
console.log('150 actual normalized VLM sheets evaluated with FULL and seven prespecified counterfactuals; no additional API calls.');
