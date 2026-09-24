const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { scoreGenera } = require('../src/services/scoring');

const pathsDataPath = path.join(__dirname, '../../eval/results/paths.json');
const charsPath = path.join(__dirname, '../../api/data/characters.json');
const rulesPath = path.join(__dirname, '../../api/data/rule_chr_mapping.json');

const pathsData = JSON.parse(fs.readFileSync(pathsDataPath, 'utf-8'));
const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));

const generaMap = {};
for (const r of rulesData) {
  const gName = r.genus;
  if (!generaMap[gName]) {
    generaMap[gName] = {
      genus: gName,
      module: r.module,
      rules: []
    };
  }
  
  if (r.mappings) {
    r.level = { M: 'MANDATORY', D: 'DIAGNOSTIC', S: 'SUPPORTING', C: 'CONTRADICTORY' }[r.level] || r.level;
    r.mappings = r.mappings.map(m => ({
      chrId: m.chrId || m.chr_id,
      value: m.value
    }));
  }
  
  generaMap[gName].rules.push(r);
}

test('consistency.test.js - Check 104 paths against Engine M', (t) => {
  let totals = {
    CONFIRMED_GENUS: 0,
    CANDIDATE_GENUS: 0,
    PROBABLE_GENUS: 0,
    INDETERMINATE: 0,
    NO_MATCH_WITHIN_CORE_TAXA: 0,
    conf_correct: 0,
    leaf_excluded: 0,
    rank1_unique: 0,
    rank1_tied: 0,
    top3: 0
  };

  const parseObservations = (obsStr) => {
    const obs = {};
    if (!obsStr) return obs;
    for (const part of obsStr.split('; ')) {
      const [k, v] = part.split('=');
      obs[k] = { value: v, state: 'PRESENT' };
    }
    return obs;
  };

  for (const p of pathsData) {
    const obs = parseObservations(p.observations);
    // Filter genera to only those in the module
    const modGeneraMap = {};
    for (const [k, v] of Object.entries(generaMap)) {
      if (v.module === p.module.toUpperCase()) modGeneraMap[k] = v;
    }

    const res = scoreGenera(obs, modGeneraMap);
    
    // Convert status to v18 format for matching string in output
    let st = res.status.replace('_GENUS', '').replace('_WITHIN_CORE_TAXA', '');
    
    totals[res.status]++;
    
    if (res.status === 'CONFIRMED_GENUS' && res.identification === p.leaf_genus) {
      totals.conf_correct++;
    }
    
    const leafIndex = res.ranking.findIndex(r => r.genus === p.leaf_genus);
    const leafExcIndex = res.excluded.findIndex(r => r.genus === p.leaf_genus);
    
    if (leafExcIndex !== -1 || leafIndex === -1) {
      totals.leaf_excluded++;
    } else {
      const leafRank0 = leafIndex; // 0-based index in ranking
      const leafScore = res.ranking[leafRank0].score;
      const tieCount = res.ranking.filter(r => r.score === leafScore).length;
      
      const realRank = 1 + res.ranking.filter(r => r.score > leafScore).length;
      
      if (realRank === 1 && tieCount === 1) totals.rank1_unique++;
      if (realRank === 1 && tieCount > 1) totals.rank1_tied++;
      if (realRank <= 3) totals.top3++;
    }
  }

  assert.strictEqual(totals.CONFIRMED_GENUS, 48);
  assert.strictEqual(totals.conf_correct, 14);
  assert.strictEqual(totals.CANDIDATE_GENUS, 45);
  assert.strictEqual(totals.INDETERMINATE, 11);
  assert.strictEqual(totals.PROBABLE_GENUS, 0);
  assert.strictEqual(totals.NO_MATCH_WITHIN_CORE_TAXA, 0);
  assert.strictEqual(totals.leaf_excluded, 17);
  assert.strictEqual(totals.rank1_unique, 24);
  assert.strictEqual(totals.rank1_tied, 10);
  assert.strictEqual(totals.top3, 64);
});
