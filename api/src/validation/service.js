const crypto = require('node:crypto');
const { now, digest, fail, str, choice, id, audit, verifyAudit } = require('./common');
const { createSnapshot, verifySnapshot, loadFrozen, frozenCharacters, frozenRules } = require('./snapshot');
const { formB, formA, ruleSummary } = require('./validators');
const { token } = require('./auth');
const { categoryFor, validateProposal, humanRuleReview } = require('./provenance');
const CODES = ['EXP01', 'EXP02'];
const key = (kind, subject, code) => `${kind}:${subject}:${code}`;
const final = (s, kind, subject, code) => s.forms[key(kind, subject, code)]?.status === 'FINAL';
const completeB = s => s.specimens.length > 0 && s.specimens.every(p => CODES.every(c => final(s, 'specimens', p.id, c)));
const completeA = s => s.ruleIds.every(r => CODES.every(c => final(s, 'rules', r, c))) && CODES.every(c => final(s, 'summary', 'review', c));
function sealedData(s) {
  const result = { studyId: s.id, title: s.title, purpose: s.purpose, cohort: s.cohort, snapshotHash: s.snapshot.hash, ruleIds: s.ruleIds,
    reviewScope: s.reviewScope, selectionCriteria: s.selectionCriteria, specimens: s.specimens, references: s.references,
    forms: s.forms, deviations: s.deviations, adjudications: s.adjudications, revisions: s.revisions,
    experts: s.experts, preparationConfirmation: s.preparationConfirmation, createdAt: s.createdAt, sealedAuditHead: s.sealedAuditHead };
  // Older sealed records must retain their original v1 hashing contract.
  if (s.provenanceVersion) Object.assign(result, { provenanceVersion: s.provenanceVersion, ruleReviewMode: s.ruleReviewMode, aiProposals: s.aiProposals });
  if (s.simulationProfiles) Object.assign(result, { simulationProfiles: s.simulationProfiles, simulationProvenance: s.provenance });
  return result;
}
function requireCoordinator(actor) { fail(actor.role === 'COORDINATOR', 'Coordinator access required', 403); }
function access(s, actor) {
  fail(s, 'Study not found', 404);
  fail(actor.role === 'COORDINATOR' || (actor.studyId === s.id && s.experts[actor.code] === actor.id), 'Study not found', 404);
}
function settleTimer(timer, time) {
  if (timer.runningAt != null) { timer.activeMs += Math.max(0, Math.min(90_000, time - timer.runningAt)); timer.runningAt = time; }
}
function ruleCards(s) {
  return frozenRules(s).filter(r => s.ruleIds.includes(r.rule_key)).map(r => ({ ...r,
    priority: ['Borelis', 'Alveolina', 'Pseudolacazina', 'Psammosphaera'].includes(r.genus) || (r.level === 'M' && !r.mappings.length) || Boolean(r.audit_flags?.length) }));
}
class ValidationService {
  constructor(store, options = {}) { this.store = store; this.clock = options.clock || Date.now; this.snapshot = options.snapshot || createSnapshot; }
  async list(actor) {
    return this.store.read(async tx => (await tx.list('study')).filter(s => actor.role === 'COORDINATOR' || s.experts[actor.code] === actor.id)
      .map(s => ({ id: s.id, title: s.title, phase: s.phase, cohort: s.cohort, purpose: s.purpose, createdAt: s.createdAt })));
  }
  async get(studyId, actor) {
    return this.store.read(async tx => {
      const s = await tx.get('study', id(studyId)); access(s, actor);
      const base = { id: s.id, title: s.title, phase: s.phase, cohort: s.cohort, purpose: s.purpose, ruleReviewMode: s.ruleReviewMode || 'INDEPENDENT',
        version: s.snapshot.manifest, snapshotHash: s.snapshot.hash,
        specimens: s.specimens.map(p => ({ id: p.id, orientation: p.orientation, materialMode: p.materialMode,
          images: p.images.map(({ id: imageId, sha256, width, height }) => ({ id: imageId, sha256, width, height })),
          status: actor.role === 'EXPERT' ? (s.forms[key('specimens', p.id, actor.code)]?.status || 'EMPTY') :
            Object.fromEntries(CODES.map(c => [c, s.forms[key('specimens', p.id, c)]?.status || 'EMPTY'])) })),
        bComplete: completeB(s), lockedAt: s.lockedAt || null };
      if (actor.role === 'COORDINATOR') return { ...base, reviewScope: s.reviewScope, selectionCriteria: s.selectionCriteria, experts: Object.fromEntries(CODES.map(c => [c, Boolean(s.experts[c])])),
        privateSpecimens: s.specimens, references: s.references, rules: ruleCards(s), deviations: s.deviations,
        finalForms: Object.values(s.forms).filter(f => f.status === 'FINAL').map(({ history, ...f }) => f),
        progress: { expectedB: s.specimens.length * 2, finalB: Object.values(s.forms).filter(f => f.kind === 'specimens' && f.status === 'FINAL').length,
          expectedA: s.ruleIds.length * 2, finalA: Object.values(s.forms).filter(f => f.kind === 'rules' && f.status === 'FINAL').length,
          summaries: CODES.filter(c => final(s, 'summary', 'review', c)).length },
        adjudications: s.adjudications, revisions: s.revisions, audit: s.audit, seal: s.seal || null, aiProposals: s.aiProposals || [] };
      return { ...base, ...(['RULES', 'LOCKED'].includes(s.phase) ? { reviewScope: s.reviewScope, selectionCriteria: s.selectionCriteria } : {}), characters: frozenCharacters(s),
        rules: ['RULES', 'LOCKED'].includes(s.phase) && completeB(s) ? ruleCards(s) : [],
        aiProposals: completeB(s) && ['RULES', 'LOCKED'].includes(s.phase) && s.ruleReviewMode === 'AI_ASSISTED' ? s.aiProposals : [],
        ownForms: Object.values(s.forms).filter(f => f.expertCode === actor.code).map(({ history, ...f }) => f) };
    });
  }
  async create(input, actor) {
    requireCoordinator(actor);
    const snapshot = this.snapshot();
    if ((input.purpose || 'RESEARCH') === 'RESEARCH') fail(!['UNCOMMITTED_WORKTREE', 'SOURCE_STATE_UNVERIFIED'].includes(snapshot.manifest.sourceState),
      'Commit the evaluated source before creating a research study, or supply the verified deployment commit. Use SOFTWARE_TEST for local verification.');
    const allRules = JSON.parse(snapshot.files['api/data/rule_chr_mapping.json']);
    const scope = choice(input.reviewScope, ['ALL', 'SUBSET'], 'reviewScope');
    const ruleIds = scope === 'ALL' ? allRules.map(r => r.rule_key) : input.ruleIds;
    fail(Array.isArray(ruleIds) && ruleIds.length > 0 && ruleIds.length <= 708 && new Set(ruleIds).size === ruleIds.length && ruleIds.every(k => allRules.some(r => r.rule_key === k)), 'Choose a nonempty set of real rule cards');
    const s = { id: crypto.randomUUID(), title: str(input.title, 'title', 200, true), phase: 'PREPARATION',
      cohort: choice(input.cohort, ['PILOT', 'CONFIRMATORY'], 'cohort'), purpose: choice(input.purpose || 'RESEARCH', ['RESEARCH', 'SOFTWARE_TEST'], 'purpose'),
      provenanceVersion: 2, ruleReviewMode: choice(input.ruleReviewMode || 'INDEPENDENT', ['INDEPENDENT', 'AI_ASSISTED'], 'ruleReviewMode'), aiProposals: [],
      snapshot, ruleIds, reviewScope: scope, selectionCriteria: str(input.selectionCriteria, 'selectionCriteria', 4000, true),
      experts: {}, invites: {}, specimens: [], references: {}, forms: {}, deviations: '', adjudications: [], revisions: [], audit: [], createdAt: now() };
    audit(s, actor.code, 'STUDY_CREATED', { snapshotHash: snapshot.hash, ruleCount: ruleIds.length, purpose: s.purpose });
    await this.store.transaction(tx => tx.put('study', s.id, s));
    return { id: s.id };
  }
  async invite(studyId, code, actor) {
    requireCoordinator(actor); choice(code, CODES, 'expert code');
    const raw = token();
    return this.store.transaction(async tx => {
      const s = await tx.get('study', id(studyId)); access(s, actor);
      fail(s.phase !== 'LOCKED', 'Study is locked', 409);
      const hashed = digest(raw);
      await tx.put('invite', hashed, { studyId: s.id, code, expiresAt: this.clock() + 48 * 60 * 60 * 1000, createdAt: now() });
      s.invites[code] = hashed;
      audit(s, actor.code, 'INVITE_CREATED', { code }); await tx.put('study', s.id, s);
      return { token: raw, code, expiresInHours: 48 };
    });
  }
  async addSpecimen(studyId, input, actor) {
    requireCoordinator(actor);
    return this.store.transaction(async tx => {
      const s = await tx.get('study', id(studyId)); access(s, actor);
      fail(s.phase === 'PREPARATION', 'Assignments are frozen after observations open', 409);
      const specimenId = str(input.id, 'specimen ID', 4, true);
      const pattern = s.cohort === 'PILOT' ? /^P00[1-9]$|^P010$/ : /^F0[0-5][0-9]$|^F060$/;
      fail(pattern.test(specimenId) && specimenId !== 'F000', 'Use P001–P010 or F001–F060 for the selected cohort');
      fail(!s.specimens.some(p => p.id === specimenId), 'Specimen ID already assigned', 409);
      const sourceId = str(input.sourceId, 'private unique physical fossil/source ID', 200, true);
      for (const other of await tx.list('study')) fail(!other.specimens.some(p => p.sourceId.toLowerCase() === sourceId.toLowerCase()), 'This physical fossil was already registered in a study', 409);
      fail(input.independenceConfirmed === true && input.blindingConfirmed === true && input.realMaterialConfirmed === true, 'Confirm real material, specimen independence and visual blinding');
      s.specimens.push({ id: specimenId, sourceId, clusterId: str(input.clusterId, 'private source cluster ID', 200, true),
        materialMode: choice(input.materialMode || 'digital', ['digital', 'physical'], 'materialMode'),
        orientation: choice(input.orientation || 'UNKNOWN', ['AXIAL', 'EQUATORIAL', 'OBLIQUE', 'TANGENTIAL', 'UNKNOWN'], 'orientation'),
        independenceConfirmed: true, blindingConfirmed: true, realMaterialConfirmed: true, images: [] });
      audit(s, actor.code, 'SPECIMEN_REGISTERED', { specimenId }); await tx.put('study', s.id, s);
      return { id: specimenId };
    });
  }
  async upload(studyId, specimenId, image, actor) {
    requireCoordinator(actor);
    return this.store.transaction(async tx => {
      const s = await tx.get('study', id(studyId)); access(s, actor);
      fail(s.phase === 'PREPARATION', 'Material is frozen', 409);
      const p = s.specimens.find(p => p.id === specimenId); fail(p, 'Specimen not found', 404);
      fail(p.images.length < 12, 'At most twelve views per specimen');
      // Prevent a photograph being reused under a different anonymous fossil ID.
      for (const other of await tx.list('study')) for (const material of other.specimens) {
        fail(!material.images.some(i => i.sha256 === image.sha256 && (other.id !== s.id || material.id !== p.id)), 'This view belongs to a previously registered fossil', 409);
      }
      fail(!p.images.some(i => i.sha256 === image.sha256), 'Duplicate view', 409);
      const imageId = crypto.randomUUID();
      await tx.put('image', imageId, { ...image, id: imageId, studyId: s.id, specimenId: p.id });
      const { data, mime, ...metadata } = image;
      p.images.push({ ...metadata, id: imageId });
      audit(s, actor.code, 'IMAGE_REGISTERED', { specimenId: p.id, imageId, sha256: image.sha256 });
      await tx.put('study', s.id, s); return { id: imageId, sha256: image.sha256 };
    });
  }
  async image(studyId, specimenId, imageId, actor) {
    return this.store.read(async tx => {
      const s = await tx.get('study', id(studyId)); access(s, actor);
      fail(actor.role === 'COORDINATOR' || s.phase !== 'PREPARATION', 'Observations have not opened', 403);
      const p = s.specimens.find(p => p.id === specimenId);
      fail(p?.images.some(i => i.id === imageId), 'View not found', 404);
      const image = await tx.get('image', id(imageId));
      fail(image && image.studyId === s.id && image.specimenId === specimenId && digest(Buffer.from(image.data, 'base64')) === p.images.find(i => i.id === imageId).sha256, 'Image integrity check failed', 409);
      return image;
    });
  }
  async reference(studyId, specimenId, input, actor) {
    requireCoordinator(actor);
    return this.store.transaction(async tx => {
      const s = await tx.get('study', id(studyId)); access(s, actor);
      fail(s.phase !== 'LOCKED', 'Reference labels are locked', 409);
      fail(s.specimens.some(p => p.id === specimenId), 'Specimen not found', 404);
      const genus = str(input.genus, 'reference genus', 100);
      const exclusionReason = str(input.exclusionReason, 'reference exclusion reason', 4000);
      const verified = input.verified === true;
      const verifierCode = str(input.verifierCode, 'independent verifier code', 80, true);
      fail(!CODES.includes(verifierCode.toUpperCase()) && input.independentVerification === true, 'Reference verification must be independent of EXP01/EXP02');
      const evidence = str(input.evidence, 'independent reference evidence', 8000, true);
      if (verified) fail(frozenRules(s).some(r => r.genus === genus), 'Verified genus must belong to frozen in-scope genera; otherwise record an exclusion');
      else fail(exclusionReason, 'An unverified/out-of-scope reference requires an explicit exclusion reason');
      const old = s.references[specimenId];
      s.references[specimenId] = { genus, verified, verifierCode, evidence, exclusionReason, verifiedAt: now(), independentVerification: true,
        history: old ? [...(old.history || []), { ...old, history: undefined }] : [] };
      audit(s, actor.code, 'REFERENCE_RECORDED', { specimenId, verified }); await tx.put('study', s.id, s);
      return { saved: true };
    });
  }
  async advance(studyId, input, actor) {
    requireCoordinator(actor);
    return this.store.transaction(async tx => {
      const s = await tx.get('study', id(studyId)); access(s, actor); verifySnapshot(s.snapshot);
      const from = s.phase;
      if (from === 'PREPARATION') {
        fail(CODES.every(c => s.experts[c]), 'Both EXP01 and EXP02 must accept their invitations');
        fail(s.specimens.length && s.specimens.every(p => p.materialMode === 'physical' || p.images.length), 'Register real specimens and their coded views');
        const belowTarget = s.cohort === 'PILOT' ? s.specimens.length < 8 : s.specimens.length < 60;
        s.deviations = str(input.deviations, 'protocol deviations', 8000, belowTarget);
        if (s.cohort === 'CONFIRMATORY') fail(input.pilotReviewed === true && input.protocolFinalized === true, 'Confirm that the pilot was reviewed and the protocol finalized');
        s.preparationConfirmation = { protocolFinalized: input.protocolFinalized === true, pilotReviewed: input.pilotReviewed === true, at: now() };
        s.phase = 'SPECIMENS';
      } else if (from === 'SPECIMENS') {
        fail(completeB(s), 'Both experts must submit every Form B before Form A opens', 409);
        if (s.ruleReviewMode === 'AI_ASSISTED') fail(s.ruleIds.every(ruleId => s.aiProposals.some(p => p.ruleId === ruleId)), 'Register original AI proposals for every assigned rule before opening assisted review', 409);
        s.phase = 'RULES';
      } else if (from === 'RULES') {
        fail(completeB(s) && completeA(s), 'Complete every Form A, Form B and both review summaries', 409);
        fail(s.specimens.every(p => s.references[p.id]?.independentVerification && (s.references[p.id].verified || s.references[p.id].exclusionReason)), 'Record independently verified references or explicit reference exclusions', 409);
        s.phase = 'LOCKED'; s.lockedAt = now(); s.sealedAuditHead = s.audit.at(-1).hash; s.seal = digest(sealedData(s));
      } else fail(false, 'Study is already locked', 409);
      audit(s, actor.code, 'PHASE_ADVANCED', { from, to: s.phase, seal: s.seal || null }); await tx.put('study', s.id, s);
      return { phase: s.phase };
    });
  }
  checkFormAccess(s, kind, subject, actor, write) {
    access(s, actor);
    fail(actor.role === 'EXPERT', 'Only the assigned expert can complete a form', 403);
    choice(kind, ['specimens', 'rules', 'summary'], 'form type');
    fail(kind === 'specimens' ? s.specimens.some(p => p.id === subject) : kind === 'rules' ? s.ruleIds.includes(subject) : subject === 'review', 'Assignment not found', 404);
    const phase = kind === 'specimens' ? 'SPECIMENS' : 'RULES';
    if (write) fail(s.phase === phase, phase === 'RULES' ? 'Form A opens after both experts complete Form B' : 'Specimen observations are not open', 409);
    else fail(s.phase !== 'PREPARATION' && (kind === 'specimens' || (completeB(s) && ['RULES', 'LOCKED'].includes(s.phase))), 'Form is not open', 403);
  }
  async getForm(studyId, kind, subject, actor) {
    return this.store.read(async tx => {
      const s = await tx.get('study', id(studyId)); this.checkFormAccess(s, kind, subject, actor, false);
      const f = s.forms[key(kind, subject, actor.code)];
      if (!f) return { kind, subject, expertCode: actor.code, status: 'DRAFT', revision: 0, data: {}, timer: { activeMs: 0, runningAt: null, startedAt: null } };
      const { history, ...result } = f; return result;
    });
  }
  async save(studyId, kind, subject, input, actor) {
    return this.store.transaction(async tx => {
      const s = await tx.get('study', id(studyId)); this.checkFormAccess(s, kind, subject, actor, true);
      const formKey = key(kind, subject, actor.code);
      const f = s.forms[formKey] || { kind, subject, expertCode: actor.code, status: 'DRAFT', revision: 0, data: {}, history: [],
        timer: { activeMs: 0, runningAt: null, startedAt: null } };
      fail(f.status !== 'FINAL', 'Final submissions are immutable', 409);
      fail(Number.isInteger(input.revision) && input.revision === f.revision, 'A newer draft exists. Reload before saving.', 409);
      fail(input.data && typeof input.data === 'object' && !Array.isArray(input.data), 'Invalid form data');
      fail(!input.data.status && !input.data.sourceDraft && !input.data.aiGenerated, 'AI drafts and imported generated observations are not accepted');
      const submitting = input.submit === true;
      const data = kind === 'specimens' ? formB(input.data, frozenCharacters(s), submitting) : kind === 'rules' ? formA(input.data, submitting) : ruleSummary(input.data, submitting);
      const dataCategory = categoryFor(s, kind);
      if (kind === 'rules' && s.ruleReviewMode === 'AI_ASSISTED') {
        data.humanReview = humanRuleReview(input.data.humanReview, (s.aiProposals || []).filter(p => p.ruleId === subject), submitting);
        if (submitting) fail(data.reference && data.pagePlateFigure, 'Each AI-assisted human decision requires its own supporting evidence and source locator');
        if (submitting && ['CORRECT', 'INDEPENDENT_ALTERNATIVE'].includes(data.humanReview.action)) fail(data.correction, 'Record your own correction or independent alternative');
        if (s.purpose === 'SOFTWARE_TEST' && submitting) fail(false, 'Human verification cannot be simulated through the production assisted-review submission pipeline');
      }
      if (submitting && kind === 'summary') fail(s.ruleIds.every(r => final(s, 'rules', r, actor.code)), 'Submit all assigned rule cards before the review summary');
      settleTimer(f.timer, this.clock());
      if (submitting && kind === 'specimens') fail(f.timer.startedAt && f.timer.activeMs > 0, 'Start the observation timer before submitting');
      if (f.revision) f.history.push({ revision: f.revision, data: f.data, savedAt: f.savedAt, sha256: f.responseHash });
      f.data = data; f.revision++; f.savedAt = now(); f.responseHash = digest(data);
      f.dataCategory = dataCategory;
      if (submitting) {
        f.status = 'FINAL'; f.submittedAt = now(); f.timer.runningAt = null;
        f.signature = actor.code; f.schemaVersion = s.snapshot.manifest.schemaVersion; f.snapshotHash = s.snapshot.hash;
        if (data.humanReview) Object.assign(data.humanReview, { reviewerCode: actor.code, approvedAt: f.submittedAt, dataCategory: 'AI_ASSISTED_REVIEW' });
        f.responseHash = digest(data);
        if (kind === 'specimens') {
          const specimen = s.specimens.find(p => p.id === subject);
          fail(data.materialMode === specimen.materialMode, 'Material mode differs from assigned material');
          f.materials = specimen.images.map(i => ({ viewId: i.id, sha256: i.sha256 }));
        }
      }
      s.forms[formKey] = f;
      audit(s, actor.code, submitting ? 'FORM_SUBMITTED' : 'DRAFT_SAVED', { kind, subject, revision: f.revision, responseHash: f.responseHash });
      await tx.put('study', s.id, s); const { history, ...result } = f; return result;
    });
  }
  async timer(studyId, subject, action, actor) {
    choice(action, ['start', 'pause', 'resume', 'heartbeat'], 'timer action');
    return this.store.transaction(async tx => {
      const s = await tx.get('study', id(studyId)); this.checkFormAccess(s, 'specimens', subject, actor, true);
      const formKey = key('specimens', subject, actor.code);
      const f = s.forms[formKey] || { kind: 'specimens', subject, expertCode: actor.code, status: 'DRAFT', revision: 0, data: {}, history: [], timer: { activeMs: 0, runningAt: null, startedAt: null } };
      fail(f.status !== 'FINAL', 'Final submissions are immutable', 409);
      const time = this.clock(); settleTimer(f.timer, time);
      if (['start', 'resume'].includes(action)) {
        f.timer.startedAt ||= new Date(time).toISOString(); f.timer.runningAt = time;
      }
      if (action === 'pause') f.timer.runningAt = null;
      s.forms[formKey] = f;
      if (action !== 'heartbeat') audit(s, actor.code, 'TIMER', { subject, action });
      await tx.put('study', s.id, s); return f.timer;
    });
  }
  async adjudicate(studyId, input, actor) {
    requireCoordinator(actor);
    return this.store.transaction(async tx => {
      const s = await tx.get('study', id(studyId)); access(s, actor);
      fail(s.phase === 'RULES', 'Record adjudication before data lock; original responses remain unchanged', 409);
      const kind = choice(input.kind, ['rules', 'specimens'], 'kind');
      const subject = str(input.subject, 'subject', 100, true);
      fail(kind === 'rules' ? s.ruleIds.includes(subject) : s.specimens.some(p => p.id === subject), 'Unknown assignment');
      fail(CODES.every(c => final(s, kind, subject, c)), 'Both original forms must be submitted first');
      const record = { id: crypto.randomUUID(), kind, subject, resolution: choice(input.resolution, ['RESOLVED', 'UNRESOLVED', 'APPROVED_PROPOSAL', 'REJECTED_PROPOSAL'], 'resolution'),
        note: str(input.note, 'adjudication evidence/note', 8000, true), actor: actor.code, at: now() };
      s.adjudications.push(record); audit(s, actor.code, 'ADJUDICATION_RECORDED', { id: record.id, subject }); await tx.put('study', s.id, s);
      return record;
    });
  }
  async addProposal(studyId, input, actor) {
    requireCoordinator(actor);
    return this.store.transaction(async tx => {
      const s = await tx.get('study', id(studyId)); access(s, actor);
      fail(['PREPARATION', 'SPECIMENS'].includes(s.phase), 'Original AI drafts freeze before Form A opens', 409);
      const draft = validateProposal(input, s);
      fail(!s.aiProposals.some(p => p.draftHash === draft.draftHash), 'This AI draft is already registered', 409);
      const proposal = { ...draft, id: crypto.randomUUID(), registeredAt: now() };
      s.aiProposals.push(proposal); audit(s, actor.code, 'AI_PROPOSAL_REGISTERED', { proposalId: proposal.id, draftHash: proposal.draftHash, ruleId: proposal.ruleId });
      await tx.put('study', s.id, s); return { id: proposal.id, draftHash: proposal.draftHash };
    });
  }
  async revision(studyId, input, actor) {
    requireCoordinator(actor);
    return this.store.transaction(async tx => {
      const s = await tx.get('study', id(studyId)); access(s, actor);
      fail(s.phase !== 'LOCKED', 'Locked studies cannot be amended; create a new study version', 409);
      const kind = choice(input.kind, ['rules', 'specimens', 'summary'], 'kind'), code = choice(input.expertCode, CODES, 'expertCode');
      const original = s.forms[key(kind, input.subject, code)]; fail(original?.status === 'FINAL', 'Original final form required');
      const amendedData = kind === 'rules' ? formA(input.data, true) : kind === 'specimens' ? formB(input.data, frozenCharacters(s), true) : ruleSummary(input.data, true);
      const record = { id: crypto.randomUUID(), kind, subject: original.subject, expertCode: code, originalHash: original.responseHash,
        amendedData, reason: str(input.reason, 'correction reason and expert authorization evidence', 8000, true), actor: actor.code, at: now(), includedInPrimaryAnalysis: false };
      s.revisions.push(record); audit(s, actor.code, 'CORRECTION_APPENDED', { id: record.id, originalHash: record.originalHash }); await tx.put('study', s.id, s);
      return record;
    });
  }
  async locked(studyId, actor) {
    requireCoordinator(actor);
    const s = await this.store.read(async tx => { const s = await tx.get('study', id(studyId)); access(s, actor); return s; });
    fail(s.phase === 'LOCKED', 'Analysis and research exports are available only after data lock', 409);
    verifySnapshot(s.snapshot); verifyAudit(s); fail(digest(sealedData(s)) === s.seal, 'Locked study integrity check failed', 409);
    return s;
  }
  async report(studyId, actor) {
    const s = await this.locked(studyId, actor);
    const engine = loadFrozen(s.snapshot, 'api/src/services/scoring.js');
    const analysis = loadFrozen(s.snapshot, 'api/src/validation/analysis.js');
    return analysis.analyze(s, engine);
  }
}
module.exports = { ValidationService, sealedData, completeB, completeA, requireCoordinator };
