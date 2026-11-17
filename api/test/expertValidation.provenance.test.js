// Isolated software assertions. Synthetic approval events below exist only in
// memory to test the boundary; they are never research submissions or exports.
const test = require('node:test'), assert = require('node:assert/strict');
const { MemoryStore } = require('./support/validationMemoryStore');
const { SimulationService } = require('../src/validation/simulation');
const { ValidationService } = require('../src/validation/service');
const { createSnapshot, loadFrozen } = require('../src/validation/snapshot');
const { SIMULATION_PROFILES, categoryFor } = require('../src/validation/provenance');
const { FIXTURES, formAPlan, formBPlan, MODEL_CONFIGURATION } = require('../src/validation/simulationProfiles');
const { digest } = require('../src/validation/common');
const { B_DECLARATIONS, A_DECLARATIONS } = require('../src/validation/validators');
const all = keys => Object.fromEntries(keys.map(k => [k, true]));
const admin = { id: 'test-coordinator', code: 'COORDINATOR', role: 'COORDINATOR' };
const provenance = () => ({ dataCategory: 'SOFTWARE_TEST', aiGenerated: true, humanVerified: false, generatedAt: new Date().toISOString(), modelConfiguration: JSON.stringify(MODEL_CONFIGURATION) });
test('AI simulations use separate records and actors, strict shared validators and immutable finals without human declarations', async () => {
  const store = new MemoryStore(), service = new SimulationService(store), snapshot = createSnapshot();
  const characters = JSON.parse(snapshot.files['api/data/characters.json']).characters;
  const id = await service.create(snapshot, FIXTURES.slice(0, 1), ['Borelis_M1'], provenance()); await service.advance(id);
  for (const profile of SIMULATION_PROFILES) {
    const b = formBPlan(profile, FIXTURES[0], characters);
    const draft = await service.save(id, 'specimens', 'P001', profile, { revision: 0, data: b, provenance: provenance() });
    assert.equal(draft.provenance.humanVerified, false); assert.equal(draft.data.declarations, undefined);
    assert.deepEqual((await new SimulationService(store).get(id)).forms[`specimens:P001:${profile}`].data, draft.data);
    const bad = structuredClone(b); bad.observations.CHR_03 = { value: 'PRESENT', state: 'ABSENT' };
    await assert.rejects(service.save(id, 'specimens', 'P001', profile, { revision: 1, data: bad, provenance: provenance() }), /ABSENT state/);
    await service.save(id, 'specimens', 'P001', profile, { revision: 1, submit: true, data: b, provenance: provenance() });
    await assert.rejects(service.save(id, 'specimens', 'P001', profile, { revision: 2, data: b, provenance: provenance() }), /immutable/);
  }
  await assert.rejects(service.save(id, 'specimens', 'P001', 'EXP01', {}), /Only AI_SIM/);
  await service.advance(id);
  const rule = JSON.parse(snapshot.files['api/data/rule_chr_mapping.json']).find(r => r.rule_key === 'Borelis_M1');
  for (const profile of SIMULATION_PROFILES) await service.save(id, 'rules', rule.rule_key, profile, { revision: 0, submit: true, data: formAPlan(profile, rule).data, provenance: provenance() });
  await service.advance(id);
  const report = await service.report(id);
  assert.deepEqual(JSON.parse(JSON.stringify(report.observerCodes)), SIMULATION_PROFILES);
  assert.equal(report.formA.dataCategory, 'SOFTWARE_TEST'); assert.equal(report.formB.dataCategory, 'SOFTWARE_TEST');
  assert.equal(report.humanParticipation.independentSpecimenObservation, 'NOT CONDUCTED'); assert.equal(report.formB.analyzableSpecimens, 0);
  assert.equal((await store.read(tx => tx.list('study'))).length, 0); assert.equal((await store.read(tx => tx.list('user'))).length, 0);
});
async function assistedFixture() {
  const store = new MemoryStore(); let clock = Date.now();
  // Explicitly synthetic dependency injection: no real research store is used.
  const snapshot = createSnapshot(); snapshot.manifest.sourceState = 'COMMITTED_CHECKOUT'; snapshot.hash = digest(snapshot.manifest);
  const service = new ValidationService(store, { snapshot: () => snapshot, clock: () => clock });
  const { id } = await service.create({ title: 'SYNTHETIC AUTHORIZATION TEST ONLY', purpose: 'RESEARCH', cohort: 'PILOT', ruleReviewMode: 'AI_ASSISTED', reviewScope: 'SUBSET', ruleIds: ['Borelis_M1'], selectionCriteria: 'test fixture only' }, admin);
  const actors = ['EXP01', 'EXP02'].map(code => ({ id: `synthetic-${code}`, code, studyId: id, role: 'EXPERT' }));
  await store.transaction(async tx => { const s = await tx.get('study', id); s.experts = Object.fromEntries(actors.map(a => [a.code, a.id])); await tx.put('study', id, s); });
  await service.addSpecimen(id, { id: 'P001', sourceId: 'SYNTHETIC-TEST-ONLY', clusterId: 'TEST', materialMode: 'physical', realMaterialConfirmed: true, independenceConfirmed: true, blindingConfirmed: true }, admin);
  const p = { ruleId: 'Borelis_M1', profileId: 'AI_SIM_EXP01', sourceSnapshotHash: snapshot.hash, assessment: { decision: 'UNABLE' }, reasoning: 'Software test draft', sources: 'Frozen rule Borelis_M1', limitations: 'Not human evidence', provenance: provenance() };
  await service.addProposal(id, p, admin);
  await assert.rejects(service.addProposal(id, p, actors[0]), /Coordinator/);
  await assert.rejects(service.addProposal(id, { ...p, sourceSnapshotHash: 'wrong-source' }, admin), /frozen configuration/);
  const before = await service.get(id, actors[0]); assert.deepEqual(before.aiProposals, []);
  await service.advance(id, { deviations: 'Synthetic test only' }, admin);
  const characters = JSON.parse(snapshot.files['api/data/characters.json']).characters;
  for (const actor of actors) {
    await service.timer(id, 'P001', 'start', actor); clock += 1000;
    const b = { ...formBPlan('AI_SIM_EXP01', FIXTURES[0], characters), materialMode: 'physical', declarations: all(B_DECLARATIONS) };
    await assert.rejects(service.save(id, 'specimens', 'P001', { revision: 0, data: { ...b, aiGenerated: true }, submit: true }, actor), /AI drafts/);
    await service.save(id, 'specimens', 'P001', { revision: 0, data: b, submit: true }, actor);
  }
  await service.advance(id, {}, admin);
  return { store, service, id, actors, snapshot };
}
test('AI drafts are withheld during Form B, remain immutable, and require per-rule human verification with distinct provenance', async () => {
  const f = await assistedFixture(); const actor = f.actors[0];
  const view = await f.service.get(f.id, actor); assert.equal(view.aiProposals.length, 1);
  const original = structuredClone(view.aiProposals[0]);
  await assert.rejects(f.service.addProposal(f.id, { ...original }, admin), /freeze/);
  const data = { decision: 'APPROVE', evidence: 'APPROPRIATE', mapping: 'CORRECT', literatureStrength: 'PARTIAL', reference: 'SYNTHETIC TEST SOURCE', pagePlateFigure: 'Test source locator', declarations: all(A_DECLARATIONS) };
  await assert.rejects(f.service.save(f.id, 'rules', 'Borelis_M1', { revision: 0, data, submit: true }, actor), /review action/);
  data.humanReview = { action: 'APPROVE', note: 'Synthetic verification boundary test, not a real human approval', completedByHuman: false };
  await assert.rejects(f.service.save(f.id, 'rules', 'Borelis_M1', { revision: 0, data, submit: true }, actor), /real human/);
  data.humanReview.completedByHuman = true;
  const record = await f.service.save(f.id, 'rules', 'Borelis_M1', { revision: 0, data, submit: true }, actor);
  assert.equal(record.dataCategory, 'AI_ASSISTED_REVIEW'); assert.equal(record.data.humanReview.reviewerCode, 'EXP01'); assert.ok(record.data.humanReview.approvedAt);
  assert.deepEqual(record.data.humanReview.originalDraftHashes, [original.draftHash]);
  assert.deepEqual((await f.service.get(f.id, actor)).aiProposals[0], original);
  assert.equal((await f.service.getForm(f.id, 'specimens', 'P001', actor)).dataCategory, 'INDEPENDENT_HUMAN_OBSERVATION');
});
test('mixed data categories are rejected by analysis and decision-tree/ontology sources are frozen', async () => {
  const snapshot = createSnapshot();
  for (const name of ['foram_ontology_v1.owl', 'api/data/decision_tree_agglutinated.json', 'api/data/decision_tree_hyaline.json', 'api/data/decision_tree_porcelaneous.json']) assert.ok(snapshot.manifest.files[name]);
  assert.equal(categoryFor({ purpose: 'SOFTWARE_TEST', ruleReviewMode: 'AI_ASSISTED' }, 'specimens'), 'SOFTWARE_TEST');
  const analysis = loadFrozen(snapshot, 'api/src/validation/analysis.js');
  assert.throws(() => analysis.analyze({ phase: 'LOCKED', purpose: 'RESEARCH', snapshot, forms: { bad: { status: 'FINAL', kind: 'specimens', dataCategory: 'SOFTWARE_TEST' } } }, {}), /software-test records/);
});
