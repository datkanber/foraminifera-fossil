const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const repo=path.resolve(__dirname,'../../../../..');const out=path.resolve(__dirname,'../supplementary/S2_competency_queries');fs.mkdirSync(out,{recursive:true});
require(path.join(repo,'api/node_modules/dotenv')).config({path:path.join(repo,'api/.env'),quiet:true});
const {driver}=require(path.join(repo,'api/src/db/neo4j'));
const data=n=>JSON.parse(fs.readFileSync(path.join(repo,'api/data',n)));
const rules=data('rule_chr_mapping.json');const levels={M:'MANDATORY',D:'DIAGNOSTIC',S:'SUPPORTING',C:'CONTRADICTORY'};
const defs=[
 ['CQ1','Rules and expected states defining module m',{m:'AGGLUTINATED'},`MATCH (g:Genus)-[:BELONGS_TO]->(:Module {name:$m}) MATCH (g)-[h:HAS_RULE]->(r) OPTIONAL MATCH (r)-[x:REFERS_TO]->(c:Character) RETURN g.name AS genus, h.level AS level, c.id AS character, x.suggestedValue AS state`],
 ['CQ2','Mandatory rules of genus g referring to character c',{g:'Ammodiscus',c:'CHR_03'},`MATCH (:Genus {name:$g})-[:HAS_RULE {level:'MANDATORY'}]->(r)-[x:REFERS_TO]->(:Character {id:$c}) RETURN r.text AS text, x.suggestedValue AS state`],
 ['CQ3','Genera sharing a diagnostic state with g',{g:'Ammodiscus'},`MATCH (a:Genus {name:$g})-[:HAS_RULE {level:'DIAGNOSTIC'}]->()-[x:REFERS_TO]->(c)<-[y:REFERS_TO]-()<-[:HAS_RULE {level:'DIAGNOSTIC'}]-(b:Genus) WHERE a<>b AND x.suggestedValue=y.suggestedValue RETURN b.name AS genus, c.id AS character`],
 ['CQ4','States allowed for character c',{c:'CHR_03'},`MATCH (:Character {id:$c})-[:ALLOWS]->(v:Value) RETURN v.code AS state`],
 ['CQ5','Genera reachable from question q',{q:'AGG_Q1'},`MATCH (:Question {id:$q})-[:ANSWER*1..11]->(g:Genus) RETURN DISTINCT g.name AS genus`],
 ['CQ6','Characters never asked in the tree of module m',{m:'AGGLUTINATED'},`MATCH (c:Character) WHERE NOT EXISTS {MATCH (:Question {module:$m})-[:ASKS_ABOUT]->(c)} RETURN c.id AS character`],
 ['CQ7','Rules without a scoring character-state pair',{},`MATCH (r:RuleItem) WHERE NOT EXISTS {MATCH (r)-[x:REFERS_TO]->() WHERE x.suggestedValue IS NOT NULL} RETURN r.key AS rule_key`],
 ['CQ8','Contradictory rules repeating a positive rule of g',{g:'Ammodiscus'},`MATCH (g:Genus {name:$g})-[:HAS_RULE {level:'CONTRADICTORY'}]->()-[x:REFERS_TO]->(c)<-[y:REFERS_TO]-()<-[h:HAS_RULE]-(g) WHERE h.level<>'CONTRADICTORY' AND x.suggestedValue=y.suggestedValue RETURN g.name AS genus, c.id AS character`],
 ['CQ9','Genera marked for taxonomic review',{},`MATCH (g:Genus {taxonomicReviewRequired:true}) RETURN g.name AS genus`],
 ['CQ10','Environmental or reference-species profiles linked to g',{g:'Alveolina'},`MATCH (:Genus {name:$g})-[:HAS_REFERENCE_SPECIES|HAS_ENVIRONMENT_PROFILE]->(t:TaxonProfile) RETURN t.scientificName AS scientificName`],
];
const canonical=rows=>JSON.stringify(rows.map(r=>Object.fromEntries(Object.entries(r).sort())).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))));
function expected(id,params){
 if(id==='CQ1')return rules.filter(r=>r.module===params.m).flatMap(r=>(r.mappings.length?r.mappings:[{}]).map(m=>({genus:r.genus,level:levels[r.level],character:m.chr_id||null,state:m.value||null})));
 if(id==='CQ2')return rules.filter(r=>r.genus===params.g&&r.level==='M').flatMap(r=>r.mappings.filter(m=>m.chr_id===params.c).map(m=>({text:r.text,state:m.value||null})));
 if(id==='CQ3'){
  const result=[];
  for(const a of rules.filter(r=>r.genus===params.g&&r.level==='D'))for(const x of a.mappings.filter(m=>m.value))
   for(const b of rules.filter(r=>r.genus!==params.g&&r.level==='D'))for(const y of b.mappings.filter(m=>m.value))
    if(x.chr_id===y.chr_id&&x.value===y.value)result.push({genus:b.genus,character:x.chr_id});
  return result;
 }
 if(id==='CQ4')return data('characters.json').characters.find(c=>c.id===params.c).values.map(state=>({state}));
 if(id==='CQ5'){
  const tree=data('decision_tree_agglutinated.json');const nodes=Object.fromEntries(tree.nodes.map(n=>[n.id,n]));const names=new Set();
  function walk(id){for(const a of nodes[id].answers)if(a.next.startsWith('GENUS:'))names.add(a.next.slice(6));else if(nodes[a.next])walk(a.next);}
  walk(params.q);return [...names].map(genus=>({genus}));
 }
 if(id==='CQ6'){
  const asked=new Set(data('decision_tree_'+params.m.toLowerCase()+'.json').nodes.map(n=>n.chr_id).filter(Boolean));
  return data('characters.json').characters.filter(c=>!asked.has(c.id)).map(c=>({character:c.id}));
 }
 if(id==='CQ7')return rules.filter(r=>!r.mappings.some(m=>m.value)).map(r=>({rule_key:r.rule_key}));
 if(id==='CQ8'){
  const result=[];
  for(const a of rules.filter(r=>r.genus===params.g&&r.level==='C'))for(const x of a.mappings.filter(m=>m.value))
   for(const b of rules.filter(r=>r.genus===params.g&&r.level!=='C'))for(const y of b.mappings.filter(m=>m.value))
    if(x.chr_id===y.chr_id&&x.value===y.value)result.push({genus:params.g,character:x.chr_id});
  return result;
 }
 if(id==='CQ9')return ['agglutinated','porcelaneous','hyaline'].flatMap(m=>data('genera_'+m+'.json').genera).filter(g=>g.taxonomicReviewRequired||(g.system_flags||[]).some(s=>/taxonomicReviewRequired\s*=\s*TRUE/i.test(s))).map(g=>({genus:g.genus}));
 if(id==='CQ10')return data('taxon_environment.json').filter(p=>p.parentGenus===params.g).map(p=>({scientificName:p.scientificName}));
 return null;
}
(async()=>{
 const session=driver.session({defaultAccessMode:'READ'});const results=[];
 try{
  await driver.verifyConnectivity();
  for(const[id,question,params,query]of defs){
   const started=Date.now();
   try{
    const res=await session.run(query,params);const rows=res.records.map(r=>r.toObject());const exp=expected(id,params);
    results.push({id,question,parameters:params,query,returned:rows,row_count:rows.length,expected:exp,
      expected_basis:exp?'Independent master JSON':'No independently specified expected answer; successful execution only',
      matches_expected:exp?canonical(rows)===canonical(exp):null,elapsed_ms:Date.now()-started});
   }catch(e){results.push({id,question,parameters:params,query,error:e.message,matches_expected:false});}
  }
 }finally{await session.close();await driver.close();}
 fs.writeFileSync(path.join(out,'S2_query_results.json'),JSON.stringify({executedAt:new Date().toISOString(),mutations:false,results},null,2));
 fs.writeFileSync(path.join(out,'S2_queries.cypher'),defs.map(([id,q,p,s])=>`// ${id}: ${q}\n// Parameters: ${JSON.stringify(p)}\n${s};\n`).join('\n'));
 console.log(JSON.stringify(results.map(r=>({id:r.id,rows:r.row_count,matches_expected:r.matches_expected,error:r.error})),null,2));
 if(results.some(r=>r.error))process.exitCode=1;
})();
