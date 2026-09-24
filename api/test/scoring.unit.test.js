const test = require('node:test');
const assert = require('node:assert');
const { evaluateRuleM, buildH, scoreGenera } = require('../src/services/scoring');

test('evaluateRuleM - single character unobserved -> NEUTRAL', (t) => {
  const h = buildH({ CHR_01: { value: "AGGLUTINATED", state: "PRESENT" } });
  const mappings = [{ chrId: "CHR_03", value: "PRESENT" }];
  const { verdict } = evaluateRuleM(h, mappings);
  assert.strictEqual(verdict, "NEUTRAL");
});

test('evaluateRuleM - two characters, one observed and matching, one unobserved -> MATCH', (t) => {
  const h = buildH({ CHR_01: { value: "AGGLUTINATED", state: "PRESENT" } });
  const mappings = [
    { chrId: "CHR_01", value: "AGGLUTINATED" },
    { chrId: "CHR_03", value: "ABSENT" } // not in H
  ];
  const { verdict } = evaluateRuleM(h, mappings);
  assert.strictEqual(verdict, "MATCH");
});

test('evaluateRuleM - two characters, one matching, one mismatching -> MISMATCH', (t) => {
  const h = buildH({
    CHR_01: { value: "AGGLUTINATED", state: "PRESENT" },
    CHR_03: { value: "PRESENT", state: "PRESENT" } // Rule wants ABSENT
  });
  const mappings = [
    { chrId: "CHR_01", value: "AGGLUTINATED" },
    { chrId: "CHR_03", value: "ABSENT" }
  ];
  const { verdict } = evaluateRuleM(h, mappings);
  assert.strictEqual(verdict, "MISMATCH");
});

test('evaluateRuleM - two alternative states, one observed -> MATCH', (t) => {
  const h = buildH({ CHR_06: { value: "PLANISPIRAL", state: "PRESENT" } });
  const mappings = [
    { chrId: "CHR_06", value: "PLANISPIRAL" },
    { chrId: "CHR_06", value: "TROCHOSPIRAL" }
  ];
  const { verdict } = evaluateRuleM(h, mappings);
  assert.strictEqual(verdict, "MATCH");
});

test('evaluateRuleM - implication CHR_17 STRONG implies PRESENT', (t) => {
  const h = buildH({ CHR_17: { value: "STRONG", state: "PRESENT" } });
  
  // Rule asking for PRESENT should match
  const mappingsPresent = [{ chrId: "CHR_17", value: "PRESENT" }];
  assert.strictEqual(evaluateRuleM(h, mappingsPresent).verdict, "MATCH");
  
  // Rule asking for WEAK should mismatch
  const mappingsWeak = [{ chrId: "CHR_17", value: "WEAK" }];
  assert.strictEqual(evaluateRuleM(h, mappingsWeak).verdict, "MISMATCH");
});

test('evaluateRuleM - NOT_OBSERVABLE and UNCERTAIN never mismatch', (t) => {
  const h = buildH({
    CHR_03: { value: "PRESENT", state: "NOT_OBSERVABLE" },
    CHR_04: { value: "MULTICHAMBERED", state: "UNCERTAIN" }
  });
  const mappings = [
    { chrId: "CHR_03", value: "ABSENT" },
    { chrId: "CHR_04", value: "UNDIVIDED" }
  ];
  // Since they are not in H, they are skipped -> NEUTRAL
  const { verdict } = evaluateRuleM(h, mappings);
  assert.strictEqual(verdict, "NEUTRAL");
});

test('scoreGenera - A=empty => NO_MATCH or INDETERMINATE', (t) => {
  const generaMap = {
    "FakeGenus": { genus: "FakeGenus", module: "AGGLUTINATED", rules: [
      { level: "MANDATORY", mappings: [{ chrId: "CHR_03", value: "ABSENT" }] }
    ]}
  };
  
  // nObserved < 3 => INDETERMINATE
  const obs1 = {
    CHR_03: { value: "PRESENT", state: "PRESENT" } // causes mismatch -> excluded
  };
  assert.strictEqual(scoreGenera(obs1, generaMap).status, "INDETERMINATE");
  
  // nObserved >= 3 => NO_MATCH_WITHIN_CORE_TAXA
  const obs2 = {
    CHR_03: { value: "PRESENT", state: "PRESENT" },
    CHR_04: { value: "UNDIVIDED", state: "PRESENT" },
    CHR_06: { value: "PLANISPIRAL", state: "PRESENT" }
  };
  assert.strictEqual(scoreGenera(obs2, generaMap).status, "NO_MATCH_WITHIN_CORE_TAXA");
});

test('scoreGenera - nObserved < 2 => INDETERMINATE', (t) => {
  const generaMap = {
    "FakeGenus": { genus: "FakeGenus", module: "AGGLUTINATED", rules: [
      { level: "MANDATORY", mappings: [{ chrId: "CHR_01", value: "AGGLUTINATED" }] },
      { level: "DIAGNOSTIC", mappings: [{ chrId: "CHR_03", value: "PRESENT" }] }
    ]}
  };
  
  const obs = {
    CHR_01: { value: "AGGLUTINATED", state: "PRESENT" } // only 1 rule matches, nObserved = 0 (CHR_01 doesn't count)
  };
  assert.strictEqual(scoreGenera(obs, generaMap).status, "INDETERMINATE");
});

test('scoreGenera - tie -> CANDIDATE_GENUS', (t) => {
  const generaMap = {
    "GenusA": { genus: "GenusA", module: "AGGLUTINATED", rules: [
      { level: "MANDATORY", mappings: [{ chrId: "CHR_03", value: "PRESENT" }] }
    ]},
    "GenusB": { genus: "GenusB", module: "AGGLUTINATED", rules: [
      { level: "MANDATORY", mappings: [{ chrId: "CHR_03", value: "PRESENT" }] }
    ]}
  };
  
  const obs = {
    CHR_03: { value: "PRESENT", state: "PRESENT" },
    CHR_04: { value: "UNDIVIDED", state: "PRESENT" }
  };
  
  const res = scoreGenera(obs, generaMap);
  assert.strictEqual(res.status, "CANDIDATE_GENUS");
  assert.strictEqual(res.ranking.length, 2);
});
