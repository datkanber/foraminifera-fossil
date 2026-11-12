/* Loads and queries only the isolated local v32 test database. */
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),cp=require('child_process');
const root=path.resolve(__dirname,'..'),neo4j=require('../api/node_modules/neo4j-driver');
const out=path.join(root,'eval/results/v32');
const read=n=>JSON.parse(fs.readFileSync(path.join(root,'api/data',n),'utf8'));
const rules=read('rule_chr_mapping.json'),characters=read('characters.json').characters;
const levels={M:'MANDATORY',D:'DIAGNOSTIC',S:'SUPPORTING',C:'CONTRADICTORY'};
const uri='bolt://127.0.0.1:17687';
function normalize(rows){return [...new Set(rows.map(x=>JSON.stringify(x,Object.keys(x).sort())))].sort();}
async function main(){
 assert(uri==='bolt://127.0.0.1:17687');
 const run=cp.spawnSync(process.execPath,['import_ontology.js'],{cwd:path.join(root,'api'),encoding:'utf8',env:{...process.env,NEO4J_URI:uri,NEO4J_USERNAME:'neo4j',NEO4J_PASSWORD:'v32-local-test',NEO4J_DATABASE:'neo4j'}});
 fs.writeFileSync(path.join(out,'isolated_graph_import.txt'),run.stdout+run.stderr);assert.equal(run.status,0,run.stderr);
 const driver=neo4j.driver(uri,neo4j.auth.basic('neo4j','v32-local-test')),session=driver.session({database:'neo4j'});
 try{
  const file=fs.readFileSync(path.join(root,'client/src/assets/scs/supplementary/S2_competency_queries/S2_queries.cypher'),'utf8');
  const blocks=file.split(/(?=\/\/ CQ\d+:)/).filter(x=>x.startsWith('// CQ'));
  assert.equal(blocks.length,10);const evidence=[];
  for(const block of blocks){
   const id=block.match(/CQ\d+/)[0],params=JSON.parse(block.match(/Parameters:\s*(\{[^\n]*\})/)[1]);
   const query=block.split('\n').filter(x=>!x.trim().startsWith('//')).join('\n').trim();
   const result=await session.run(query,params),rows=result.records.map(r=>r.toObject());let expected=null;
   if(id==='CQ1')expected=rules.filter(r=>r.module===params.m).flatMap(r=>r.mappings.length?r.mappings.map(m=>({genus:r.genus,level:levels[r.level],character:m.chr_id,state:m.value??null})):[{genus:r.genus,level:levels[r.level],character:null,state:null}]);
   if(id==='CQ2')expected=rules.filter(r=>r.genus===params.g&&r.level==='M').flatMap(r=>r.mappings.filter(m=>m.chr_id===params.c).map(m=>({text:r.text,state:m.value??null})));
   if(id==='CQ3'){
    const shared=rules.filter(r=>r.genus===params.g&&r.level==='D').flatMap(r=>r.mappings.filter(m=>m.value));
    expected=rules.filter(r=>r.genus!==params.g&&r.level==='D').flatMap(r=>r.mappings.filter(m=>m.value&&shared.some(a=>a.chr_id===m.chr_id&&a.value===m.value)).map(m=>({genus:r.genus,character:m.chr_id})));
   }
   if(id==='CQ4')expected=characters.find(c=>c.id===params.c).values.map(state=>({state}));
   if(id==='CQ5'){
    const tree=['agglutinated','porcelaneous','hyaline'].map(m=>read('decision_tree_'+m+'.json')).find(t=>t.nodes.some(n=>n.id===params.q)),nodes=Object.fromEntries(tree.nodes.map(n=>[n.id,n])),genera=new Set();
    const walk=id=>{for(const a of nodes[id].answers){if(a.next.startsWith('GENUS:'))genera.add(a.next.slice(6));else if(nodes[a.next])walk(a.next);}};walk(params.q);expected=[...genera].map(genus=>({genus}));
   }
   if(id==='CQ6'){
    const tree=read('decision_tree_'+params.m.toLowerCase()+'.json'),asked=new Set(tree.nodes.flatMap(n=>[n.chr_id,...n.answers.flatMap(a=>Object.keys(a.maps_to||{}))]).filter(Boolean));
    expected=characters.filter(c=>!asked.has(c.id)).map(c=>({character:c.id}));
   }
   if(id==='CQ7')expected=rules.filter(r=>!r.mappings.some(m=>m.value)).map(r=>({rule_key:r.rule_key}));
   if(id==='CQ8')expected=[];
   if(id==='CQ9')expected=['agglutinated','porcelaneous','hyaline'].flatMap(m=>read('genera_'+m+'.json').genera).filter(g=>(g.system_flags||[]).some(f=>f.includes('taxonomicReviewRequired = TRUE'))).map(g=>({genus:g.genus}));
   if(expected!==null)assert.deepEqual(normalize(rows),normalize(expected),id+' differs from master JSON');
   if(id==='CQ10')assert(rows.length>0,'CQ10 must retrieve actual linked profile data');
   evidence.push({id,query,parameters:params,rows,passed:true,expected_source:expected===null?'Actual stored TaxonProfile records':'Independent master-JSON projection'});
  }
  const components=(await session.run('CALL dbms.components() YIELD name,versions,edition RETURN name,versions,edition')).records.map(r=>r.toObject());
  fs.writeFileSync(path.join(out,'competency_queries.json'),JSON.stringify({database:uri,isolated_test_database:true,production_database_modified:false,components,checks:evidence},null,2)+'\n');
  console.log(JSON.stringify({passed:evidence.length,production_database_modified:false,components}));
 }finally{await session.close();await driver.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
