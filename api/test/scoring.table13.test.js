const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { scoreGenera } = require('../src/services/scoring');

// Load actual data
const charactersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../api/data/characters.json'), 'utf-8'));
const rulesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../api/data/rule_chr_mapping.json'), 'utf-8'));
const generaMap = {};

const AGG_GENERA = [
  "Ammodiscus", "Saccammina", "Glomospira", "Psammosphaera", "Rhabdammina", "Rhizammina"
];

for (const gName of AGG_GENERA) {
  const gRules = rulesData.filter(r => r.genus === gName);
  gRules.forEach(r => {
    if (r.mappings) {
      r.level = { M: 'MANDATORY', D: 'DIAGNOSTIC', S: 'SUPPORTING', C: 'CONTRADICTORY' }[r.level] || r.level;
    r.mappings = r.mappings.map(m => ({
        chrId: m.chrId || m.chr_id,
        value: m.value
      }));
    }
  });

  generaMap[gName] = {
    genus: gName,
    module: "AGGLUTINATED",
    rules: gRules
  };
}

test('scoring.table13.test.js - Tablo XIII A', (t) => {
  const obs = {
    CHR_01: { value: "AGGLUTINATED", state: "PRESENT" },
    CHR_03: { value: "ABSENT", state: "PRESENT" },
    CHR_04: { value: "UNDIVIDED", state: "PRESENT" },
    CHR_06: { value: "PLANISPIRAL", state: "PRESENT" },
    CHR_07: { value: "SINGLE_PLANE", state: "PRESENT" }
  };

  const result = scoreGenera(obs, generaMap);
  
  assert.strictEqual(result.status, "CONFIRMED_GENUS");
  assert.strictEqual(result.identification, "Ammodiscus");
  
  const ammodiscus = result.ranking.find(r => r.genus === "Ammodiscus");
  assert.strictEqual(ammodiscus.score, 19);
  
  const saccammina = result.ranking.find(r => r.genus === "Saccammina");
  assert.strictEqual(saccammina.score, 9);
  assert.strictEqual(result.ranking[1].genus, "Saccammina");
  
  const glomospira = result.ranking.find(r => r.genus === "Glomospira");
  assert.ok(glomospira !== undefined, "Glomospira should not be excluded");
  assert.strictEqual(glomospira.score, 4);
});

test('scoring.table13.test.js - Tablo XIII B', (t) => {
  const obs = {
    CHR_01: { value: "AGGLUTINATED", state: "PRESENT" },
    CHR_03: { value: "ABSENT", state: "PRESENT" },
    CHR_04: { value: "UNDIVIDED", state: "PRESENT" },
    CHR_06: { value: "PLANISPIRAL", state: "PRESENT" },
    CHR_07: { value: null, state: "NOT_OBSERVABLE" }
  };

  const result = scoreGenera(obs, generaMap);
  
  assert.strictEqual(result.status, "CONFIRMED_GENUS");
  const ammodiscus = result.ranking.find(r => r.genus === "Ammodiscus");
  assert.strictEqual(ammodiscus.score, 14);
  
  const saccammina = result.ranking.find(r => r.genus === "Saccammina");
  assert.strictEqual(saccammina.score, 9);
  
  const glomospira = result.ranking.find(r => r.genus === "Glomospira");
  assert.strictEqual(glomospira.score, 4);
});
