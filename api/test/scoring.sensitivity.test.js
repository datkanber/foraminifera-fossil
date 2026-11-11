const test=require('node:test');
const assert=require('node:assert/strict');
const {scoreGenera}=require('../src/services/scoring');
const obs={CHR_02:{value:'GLOBULAR',state:'PRESENT'}};
const genera={A:{genus:'A',rules:[{level:'MANDATORY',text:'shape',mappings:[{chrId:'CHR_02',value:'GLOBULAR'}]}]}};

test('sensitivity options preserve default and do not mutate observations',()=>{
 const before=JSON.stringify(obs);
 assert.deepEqual(scoreGenera(obs,genera),scoreGenera(obs,genera,{weights:{MANDATORY:3,DIAGNOSTIC:5,SUPPORTING:1,CONTRADICTORY:-5},tauObs:2,tauNoMatch:3,delta:1}));
 assert.equal(JSON.stringify(obs),before);
});
test('tauObs affects output state while preserving the ranking',()=>{
 const a=scoreGenera(obs,genera,{tauObs:1}),b=scoreGenera(obs,genera,{tauObs:2});
 assert.equal(a.status,'PROBABLE_GENUS');assert.equal(b.status,'INDETERMINATE');assert.deepEqual(a.ranking,b.ranking);
});
test('tauNoMatch is applied only when no active candidate remains',()=>{
 const wrong={CHR_02:{value:'TUBULAR',state:'PRESENT'},CHR_03:{value:'PRESENT',state:'PRESENT'}};
 assert.equal(scoreGenera(wrong,genera,{tauNoMatch:2}).status,'NO_MATCH_WITHIN_CORE_TAXA');
 assert.equal(scoreGenera(wrong,genera,{tauNoMatch:3}).status,'INDETERMINATE');
});
test('weight sign and threshold validation catches invalid experiment settings',()=>{
 for(const options of [{weights:{CONTRADICTORY:5}},{weights:{MANDATORY:-1}},{tauObs:0},{tauNoMatch:1.5},{delta:-1}])assert.throws(()=>scoreGenera(obs,genera,options),RangeError);
 assert.doesNotThrow(()=>scoreGenera(obs,genera,{weights:{SUPPORTING:0}}));
});
