const test=require('node:test'),assert=require('node:assert/strict');
const {normalizeObservations}=require('../src/services/observationNormalization');
const {buildH,evaluateRuleM,scoreGenera}=require('../src/services/scoring');
const {characters}=require('../data/characters.json');
test('Every controlled tentative value stays outside evidence for both neutral states',()=>{
 for(const c of characters) for(const value of c.values) for(const state of ['UNCERTAIN','NOT_OBSERVABLE']){
  const obs=normalizeObservations({[c.id]:{value,state,reason:'visual ambiguity'}});
  assert.equal(obs[c.id].state,state);assert.deepEqual(buildH(obs),{});
 }
});
test('Invalid state or invalid absence never supplies positive evidence',()=>{
 assert.equal(normalizeObservations({CHR_02:{value:'GLOBULAR',state:'BAD'}}).CHR_02.state,'NOT_OBSERVABLE');
 assert.equal(normalizeObservations({CHR_02:{value:'GLOBULAR',state:'ABSENT'}}).CHR_02.state,'UNCERTAIN');
});
test('Partitions OR pillars: an unobserved alternative cannot cause exclusion',()=>{
 const mappings=[{chrId:'CHR_13',value:'VERTICAL'},{chrId:'CHR_14',value:'PRESENT'}];
 assert.equal(evaluateRuleM({CHR_13:new Set(['ABSENT'])},mappings,'ANY').verdict,'NEUTRAL');
 assert.equal(evaluateRuleM({CHR_13:new Set(['ABSENT']),CHR_14:new Set(['PRESENT'])},mappings,'ANY').verdict,'MATCH');
 assert.equal(evaluateRuleM({CHR_13:new Set(['ABSENT']),CHR_14:new Set(['ABSENT'])},mappings,'ANY').verdict,'MISMATCH');
 assert.equal(evaluateRuleM({},mappings,'ANY').verdict,'NEUTRAL');
});
test('A compound contradiction requires both adult-ontogeny and coiling observations',()=>{
 const m=[{chrId:'CHR_06',value:'PLANISPIRAL'},{chrId:'CHR_09',value:'NONE'}];
 assert.equal(evaluateRuleM({CHR_06:new Set(['PLANISPIRAL'])},m,'ALL_OBSERVED').verdict,'NEUTRAL');
 assert.equal(evaluateRuleM({CHR_06:new Set(['PLANISPIRAL']),CHR_09:new Set(['NONE'])},m,'ALL_OBSERVED').verdict,'MATCH');
});
test('Oblique-section warning names affected rules without altering ranking',()=>{
 const g={A:{genus:'A',rules:[{rule_key:'A_D1',level:'DIAGNOSTIC',mappings:[{chrId:'CHR_17',value:'STRONG'}]}]}};
 const obs={CHR_17:{value:'STRONG',state:'PRESENT'}};
 const base=scoreGenera(obs,g),warn=scoreGenera({...obs,CHR_21:{value:'OBLIQUE',state:'PRESENT'}},g);
 assert.deepEqual(warn.ranking,base.ranking);assert.equal(base.sectionWarning,null);
 assert.equal(warn.sectionWarning.code,'SECTION_SENSITIVITY');assert.deepEqual(warn.sectionWarning.characters,['CHR_17']);
 assert.equal(warn.sectionWarning.rules[0].ruleKey,'A_D1');
 assert.equal(scoreGenera({...obs,CHR_21:{value:'TANGENTIAL',state:'UNCERTAIN'}},g).sectionWarning,null);
});
