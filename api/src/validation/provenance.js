const { fail, str, choice, digest } = require('./common');
const CATEGORIES = ['SOFTWARE_TEST', 'AI_ASSISTED_REVIEW', 'INDEPENDENT_HUMAN_OBSERVATION'];
const SIMULATION_PROFILES = ['AI_SIM_EXP01', 'AI_SIM_EXP02'];
const SIMULATION_LABEL = 'AI-GENERATED SOFTWARE TEST — NOT INDEPENDENT HUMAN VALIDATION';
function categoryFor(study, kind) {
  if (study.purpose === 'SOFTWARE_TEST') return 'SOFTWARE_TEST';
  return kind !== 'specimens' && study.ruleReviewMode === 'AI_ASSISTED' ? 'AI_ASSISTED_REVIEW' : 'INDEPENDENT_HUMAN_OBSERVATION';
}
function validateProposal(input, study) {
  fail(study.ruleReviewMode === 'AI_ASSISTED', 'AI proposals require a separately declared AI-assisted rule-review study');
  fail(study.ruleIds.includes(input.ruleId), 'Proposal rule is not assigned');
  fail(input.sourceSnapshotHash === study.snapshot.hash, 'Proposal source does not match this study’s frozen configuration');
  fail(input.provenance?.aiGenerated === true && input.provenance?.humanVerified === false && input.provenance?.dataCategory === 'SOFTWARE_TEST', 'Original AI proposals must be explicitly unverified SOFTWARE_TEST records');
  const generatedAt = str(input.provenance.generatedAt, 'AI generation timestamp', 80, true);
  fail(Number.isFinite(Date.parse(generatedAt)) && /Z$|[+-]\d\d:\d\d$/.test(generatedAt), 'AI timestamp requires a timezone');
  fail(input.assessment && typeof input.assessment === 'object' && !Array.isArray(input.assessment), 'Original AI assessment is required');
  fail(JSON.stringify(input).length <= 32000, 'Proposal is too large');
  const draft = { ruleId: input.ruleId, profileId: str(input.profileId, 'AI profile ID', 100, true),
    sourceSnapshotHash: input.sourceSnapshotHash, assessment: structuredClone(input.assessment),
    reasoning: str(input.reasoning, 'AI reasoning summary', 8000, true),
    sources: str(input.sources, 'AI source references', 8000, true), limitations: str(input.limitations, 'AI limitations', 8000, true),
    provenance: { dataCategory: 'SOFTWARE_TEST', aiGenerated: true, humanVerified: false, generatedAt,
      modelConfiguration: str(input.provenance.modelConfiguration, 'AI model configuration', 2000, true) } };
  return { ...draft, draftHash: digest(draft) };
}
function humanRuleReview(input, proposals, final) {
  const action = input?.action || '';
  if (action || final) choice(action, ['APPROVE', 'REJECT', 'CORRECT', 'INDEPENDENT_ALTERNATIVE'], 'human AI-proposal review action');
  if (final) fail(input?.completedByHuman === true, 'A real human must explicitly verify this individual rule');
  const note = str(input?.note, 'human review rationale', 8000, final);
  if (final) fail(proposals.length > 0, 'Original AI proposals must be registered before reviewing this rule');
  return { action, note, completedByHuman: input?.completedByHuman === true, proposalIds: proposals.map(p => p.id),
    originalDraftHashes: proposals.map(p => p.draftHash) };
}
module.exports = { CATEGORIES, SIMULATION_PROFILES, SIMULATION_LABEL, categoryFor, validateProposal, humanRuleReview };
