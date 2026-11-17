// Isolated SOFTWARE_TEST records. Not mounted in production HTTP routes and
// never creates users, EXP01/EXP02 accounts, invitations or human attestations.
const crypto = require('node:crypto');
const { fail, digest, now, audit, verifyAudit } = require('./common');
const { specimenFields, ruleFields } = require('./validators');
const { verifySnapshot, frozenCharacters, loadFrozen } = require('./snapshot');
const { SIMULATION_PROFILES, SIMULATION_LABEL } = require('./provenance');
const { sealedData } = require('./service');
const formKey = (kind, subject, profile) => `${kind}:${subject}:${profile}`;
class SimulationService {
  constructor(store) { this.store = store; }
  async create(snapshot, fixtures, ruleIds, provenance) {
    verifySnapshot(snapshot);
    fail(fixtures.length > 0 && fixtures.every(f => f.dataCategory === 'SOFTWARE_TEST' && f.isPhysicalFossil === false), 'Only explicitly synthetic fixtures are permitted');
    const s = { id: `SIM_${crypto.randomUUID()}`, title: SIMULATION_LABEL, purpose: 'SOFTWARE_TEST', phase: 'PREPARATION', cohort: 'SOFTWARE_TEST',
      snapshot, ruleIds, reviewScope: 'SUBSET', selectionCriteria: 'Source-grounded technical review priorities; not a taxonomic validation sample',
      simulationProfiles: SIMULATION_PROFILES, provenance, provenanceVersion: 2, ruleReviewMode: 'INDEPENDENT', aiProposals: [],
      experts: {}, specimens: fixtures.map(f => ({ ...f, sourceId: f.fixtureId, clusterId: f.fixtureId, materialMode: 'synthetic-fixture', orientation: 'UNKNOWN', images: [] })),
      references: Object.fromEntries(fixtures.map(f => [f.id, { verified: false, independentVerification: false, exclusionReason: 'SOFTWARE_TEST fixture: no physical fossil or independently verified genus exists' }])),
      forms: {}, deviations: 'Synthetic schema/usability probes only; not the planned 8–10-case human pilot or 60-fossil confirmatory study.', adjudications: [], revisions: [], audit: [], createdAt: now() };
    audit(s, 'SOFTWARE_TEST_RUNNER', 'SIMULATION_CREATED', { snapshotHash: snapshot.hash, dataCategory: 'SOFTWARE_TEST' });
    await this.store.transaction(tx => tx.put('simulation', s.id, s)); return s.id;
  }
  async get(id) { return this.store.read(async tx => { const s = await tx.get('simulation', id); fail(s?.purpose === 'SOFTWARE_TEST' && s.simulationProfiles, 'Simulation record not found'); return s; }); }
  async save(id, kind, subject, profile, input) {
    fail(SIMULATION_PROFILES.includes(profile), 'Only AI_SIM_EXP01 and AI_SIM_EXP02 are simulation actors');
    return this.store.transaction(async tx => {
      const s = await tx.get('simulation', id); fail(s?.purpose === 'SOFTWARE_TEST', 'Simulation study required');
      fail(s.phase === (kind === 'specimens' ? 'SPECIMENS' : 'RULES'), 'Simulation phase is not open', 409);
      fail(kind === 'specimens' ? s.specimens.some(p => p.id === subject) : kind === 'rules' && s.ruleIds.includes(subject), 'Unknown simulation assignment');
      const key = formKey(kind, subject, profile), old = s.forms[key];
      fail(old?.status !== 'FINAL', 'Final simulation responses are immutable', 409);
      fail(input.revision === (old?.revision || 0), 'Stale simulation draft revision', 409);
      fail(input.provenance?.aiGenerated === true && input.provenance?.humanVerified === false && input.provenance?.dataCategory === 'SOFTWARE_TEST', 'Explicit AI-generated provenance required');
      fail(!input.data.declarations && !input.data.humanReview, 'Simulation cannot impersonate a human declaration or approval');
      const data = kind === 'specimens' ? specimenFields(input.data, frozenCharacters(s), input.submit === true) : ruleFields(input.data, input.submit === true);
      const f = { kind, subject, expertCode: profile, data, dataCategory: 'SOFTWARE_TEST', status: input.submit === true ? 'FINAL' : 'DRAFT',
        revision: (old?.revision || 0) + 1, savedAt: now(), responseHash: digest(data), snapshotHash: s.snapshot.hash,
        schemaVersion: s.snapshot.manifest.schemaVersion, provenance: input.provenance, sourceReferences: input.sourceReferences,
        history: old ? [...old.history, { revision: old.revision, data: old.data, responseHash: old.responseHash, savedAt: old.savedAt }] : [],
        timer: { method: 'SIMULATED_TEST_CLOCK', simulated: true, activeMs: input.submit ? 1000 : 0, humanObservationDuration: null } };
      if (input.submit) { f.submittedAt = now(); f.signature = `${profile} / AI GENERATED / NO HUMAN SIGNATURE`; }
      s.forms[key] = f;
      audit(s, profile, input.submit ? 'SIMULATION_FORM_SUBMITTED' : 'SIMULATION_DRAFT_SAVED', { kind, subject, revision: f.revision, responseHash: f.responseHash });
      await tx.put('simulation', id, s); return f;
    });
  }
  async advance(id) {
    return this.store.transaction(async tx => {
      const s = await tx.get('simulation', id); fail(s?.purpose === 'SOFTWARE_TEST', 'Simulation study required');
      const from = s.phase;
      const done = (kind, subjects) => subjects.every(subject => SIMULATION_PROFILES.every(code => s.forms[formKey(kind, subject, code)]?.status === 'FINAL'));
      if (from === 'PREPARATION') s.phase = 'SPECIMENS';
      else if (from === 'SPECIMENS') { fail(done('specimens', s.specimens.map(p => p.id)), 'Complete both simulated Form B datasets first'); s.phase = 'RULES'; }
      else if (from === 'RULES') {
        fail(done('rules', s.ruleIds), 'Complete both simulated Form A datasets first');
        s.phase = 'LOCKED'; s.lockedAt = now(); s.sealedAuditHead = s.audit.at(-1).hash; s.seal = digest(sealedData(s));
      } else fail(false, 'Simulation data are locked', 409);
      audit(s, 'SOFTWARE_TEST_RUNNER', 'PHASE_ADVANCED', { from, to: s.phase, seal: s.seal || null });
      await tx.put('simulation', id, s); return s.phase;
    });
  }
  async report(id) {
    const s = await this.get(id); fail(s.phase === 'LOCKED', 'Lock simulation data before analysis');
    verifySnapshot(s.snapshot); verifyAudit(s); fail(digest(sealedData(s)) === s.seal, 'Simulation seal integrity failed');
    return loadFrozen(s.snapshot, 'api/src/validation/analysis.js').analyze(s, loadFrozen(s.snapshot, 'api/src/services/scoring.js'));
  }
}
module.exports = { SimulationService };
