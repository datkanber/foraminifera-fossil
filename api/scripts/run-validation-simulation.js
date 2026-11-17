#!/usr/bin/env node
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const neo4j = require('neo4j-driver');
const { Neo4jValidationStore } = require('../src/validation/store');
const { SimulationService } = require('../src/validation/simulation');
const { createSnapshot, frozenCharacters, frozenRules, loadFrozen } = require('../src/validation/snapshot');
const { SIMULATION_PROFILES, SIMULATION_LABEL } = require('../src/validation/provenance');
const { MODEL_CONFIGURATION, FIXTURES, RULE_IDS, formAPlan, formBPlan } = require('../src/validation/simulationProfiles');
const { writeArtifacts } = require('../src/validation/simulationArtifacts');
const { digest, fail, now, verifyAudit } = require('../src/validation/common');
const { sealedData } = require('../src/validation/service');
async function run(store, output, playwrightModule) {
  const snapshot = createSnapshot(), generatedAt = now();
  const provenance = { dataCategory: 'SOFTWARE_TEST', aiGenerated: true, humanVerified: false, generatedAt,
    modelConfiguration: JSON.stringify(MODEL_CONFIGURATION), label: SIMULATION_LABEL, simulatedTiming: true };
  const service = new SimulationService(store);
  const id = await service.create(snapshot, FIXTURES, RULE_IDS, provenance);
  await service.advance(id);
  const rules = JSON.parse(snapshot.files['api/data/rule_chr_mapping.json']);
  const characters = JSON.parse(snapshot.files['api/data/characters.json']).characters;
  const checks = [], datasets = {}, proposals = [];
  for (const profile of SIMULATION_PROFILES) {
    datasets[profile] = { profileId: profile, profile: profile === 'AI_SIM_EXP01' ? 'Morphological taxonomy reviewer' : 'Ontology and rule-consistency reviewer',
      dataCategory: 'SOFTWARE_TEST', label: SIMULATION_LABEL, provenance, snapshotHash: snapshot.hash, sourceDocuments: snapshot.manifest.files, formB: [], formA: [] };
    for (const fixture of FIXTURES) {
      const data = formBPlan(profile, fixture, characters);
      const sourceReferences = { fixtureId: fixture.fixtureId, sourceFile: 'Synthetic_Fixtures.json', noPhysicalFossil: true,
        perCharacter: Object.fromEntries(characters.map(c => [c.id, { fixtureId: fixture.fixtureId, reason: data.observations[c.id].comment }])) };
      const draft = await service.save(id, 'specimens', fixture.id, profile, { revision: 0, data, provenance, sourceReferences });
      const resumed = await new SimulationService(store).get(id);
      assert.deepEqual(resumed.forms[`specimens:${fixture.id}:${profile}`].data, draft.data);
      const invalid = structuredClone(data); invalid.observations.CHR_03 = { value: 'PRESENT', state: 'ABSENT' };
      await assert.rejects(service.save(id, 'specimens', fixture.id, profile, { revision: draft.revision, data: invalid, provenance }), /ABSENT state requires/);
      const final = await service.save(id, 'specimens', fixture.id, profile, { revision: draft.revision, submit: true, data, provenance, sourceReferences });
      await assert.rejects(service.save(id, 'specimens', fixture.id, profile, { revision: final.revision, data, provenance }), /immutable/);
      datasets[profile].formB.push(final);
    }
  }
  checks.push({ check: 'draft persistence, resume, negative-state validation and immutable Form B', passed: true });
  await service.advance(id);
  for (const profile of SIMULATION_PROFILES) for (const ruleId of RULE_IDS) {
    const rule = rules.find(r => r.rule_key === ruleId); assert.ok(rule, `Actual frozen rule missing: ${ruleId}`);
    const plan = formAPlan(profile, rule);
    const draft = await service.save(id, 'rules', ruleId, profile, { revision: 0, data: plan.data, provenance, sourceReferences: plan.sources });
    const final = await service.save(id, 'rules', ruleId, profile, { revision: draft.revision, submit: true, data: plan.data, provenance, sourceReferences: plan.sources });
    datasets[profile].formA.push({ ...final, originalRule: rule, reasoningSummary: plan.reasoning, limitations: plan.limitations });
    proposals.push({ ruleId, profileId: profile, sourceSnapshotHash: snapshot.hash, assessment: plan.data, reasoning: plan.reasoning,
      sources: plan.sources.join('; '), limitations: plan.limitations, provenance });
  }
  checks.push({ check: 'Form A opens only after both simulation Form B sets are final', passed: true });
  await service.advance(id); const study = await service.get(id); const report = await service.report(id);
  verifyAudit(study); assert.equal(digest(sealedData(study)), study.seal);
  const engine = loadFrozen(snapshot, 'api/src/services/scoring.js');
  const neutralProbe = study.forms['specimens:P002:AI_SIM_EXP02'].data.observations;
  assert.equal(engine.buildH(neutralProbe).CHR_14, undefined);
  assert.equal(report.humanParticipation.independentSpecimenObservation, 'NOT CONDUCTED');
  assert.equal(report.formB.analyzableSpecimens, 0);
  assert.equal((await store.read(tx => tx.list('user'))).some(u => SIMULATION_PROFILES.includes(u.code)), false);
  checks.push({ check: 'neutral tentative evidence is not scored; no simulated users or human participation', passed: true });
  const integrity = { label: SIMULATION_LABEL, dataCategory: 'SOFTWARE_TEST', generatedAt, simulationId: id, snapshotHash: snapshot.hash, seal: study.seal,
    checks, physicalFossils: 0, syntheticFixtures: FIXTURES.length, simulatedFormB: FIXTURES.length * 2, simulatedFormA: RULE_IDS.length * 2,
    actualHumanSubmissions: 0, verifiedReferenceGenera: 0, independentValidation: 'NOT CONDUCTED', modelConfiguration: MODEL_CONFIGURATION };
  await writeArtifacts(output, study, report, integrity, datasets, proposals, playwrightModule);
  fs.writeFileSync(path.join(output, 'Private_Simulation_Reproduction.json'), JSON.stringify({ format: 'GEOKNOW-PRIVATE-REPRODUCTION-1', study }, null, 2));
  return { output, simulationId: id, checks: checks.length, fixtures: FIXTURES.length, reviewedRulesPerProfile: RULE_IDS.length,
    actualHumanSubmissions: 0, independentHumanValidation: 'NOT CONDUCTED', snapshotHash: snapshot.hash };
}
async function main() {
  const uri = process.env.VALIDATION_STAGING_NEO4J_URI;
  fail(uri === 'bolt://127.0.0.1:18689', 'Simulation persistence requires the dedicated loopback staging database on port 18689; production is not allowed');
  const output = path.resolve(process.argv[2] || path.join(__dirname, '../../deliverables/expert-validation', new Date().toISOString().replace(/[:.]/g, '-')));
  fail(!fs.existsSync(output), 'Choose a new output directory to preserve previous artifacts');
  const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', process.env.VALIDATION_STAGING_NEO4J_PASSWORD || require('node:crypto').randomBytes(32).toString('hex')));
  try { console.log(JSON.stringify(await run(new Neo4jValidationStore(driver), output, process.env.PLAYWRIGHT_MODULE))); }
  finally { await driver.close(); }
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { run };
