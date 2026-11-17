const { fail, str, choice } = require('./common');
const STATES = ['PRESENT', 'ABSENT', 'NOT_OBSERVABLE', 'UNCERTAIN'];
const NEUTRAL = ['NOT_OBSERVABLE', 'UNCERTAIN'];
const B_DECLARATIONS = ['reference_label_hidden', 'other_observer_hidden', 'system_outputs_hidden', 'independent_completion'];
const A_DECLARATIONS = ['other_observer_hidden', 'version_recorded', 'scientific_judgment'];
function declarations(input, keys, final) {
  const result = Object.fromEntries(keys.map(key => [key, input?.[key] === true]));
  if (final) fail(keys.every(key => result[key]), 'Complete all independence declarations');
  return result;
}
function observations(input, characters, final) {
  fail(input && typeof input === 'object' && !Array.isArray(input), 'observations: expected object');
  fail(Object.keys(input).every(key => characters.some(c => c.id === key)), 'Unknown character ID');
  const result = {};
  for (const c of characters) {
    const o = input[c.id];
    if (!o) { fail(!final, `${c.id}: missing observation`); continue; }
    const state = o.state || null, value = o.value === '' || o.value == null ? null : o.value;
    fail(!state || STATES.includes(state), `${c.id}: invalid state`);
    fail(value === null || c.values.includes(value), `${c.id}: invalid controlled value`);
    // Neutral observations retain tentative values exactly and never become evidence.
    if (state && !NEUTRAL.includes(state)) {
      fail(value !== null && !['NOT_OBSERVABLE', 'UNCERTAIN'].includes(value), `${c.id}: select an observed value`);
      fail(value !== 'UNKNOWN' || c.id === 'CHR_21', `${c.id}: UNKNOWN is context only`);
      if (state === 'ABSENT') fail(['ABSENT', 'NONE'].includes(value), `${c.id}: ABSENT state requires ABSENT/NONE value`);
    }
    if (final) fail(state, `${c.id}: select an observation state`);
    result[c.id] = { value, state, comment: str(o.comment, `${c.id}.comment`, 2000) };
  }
  return result;
}
function specimenFields(input, characters, final) {
  const obs = observations(input.observations || {}, characters, final);
  const genus = str(input.independentGenus, 'independentGenus', 100);
  const alternatives = str(input.alternativeGenera, 'alternativeGenera', 300);
  if (genus || alternatives || input.subjectiveConfidence || input.unidentified) observations(input.observations, characters, true);
  const quality = input.quality || '';
  if (quality || final) choice(quality, ['GOOD', 'MODERATE', 'LOW'], 'quality');
  const confidence = input.subjectiveConfidence || '';
  if (confidence) choice(confidence, ['HIGH', 'MODERATE', 'LOW'], 'subjectiveConfidence');
  return { observations: obs, quality, qualityNote: str(input.qualityNote, 'qualityNote'),
    materialMode: choice(input.materialMode || 'digital', ['digital', 'physical'], 'materialMode'),
    independentGenus: genus, alternativeGenera: alternatives, subjectiveConfidence: confidence, unidentified: input.unidentified === true,
    feedback: str(input.feedback, 'feedback'), timezone: str(input.timezone, 'timezone', 80) };
}
function formB(input, characters, final) {
  return { ...specimenFields(input, characters, final), declarations: declarations(input.declarations, B_DECLARATIONS, final) };
}
function ruleFields(input, final) {
  const enums = { decision: ['APPROVE', 'CORRECT', 'REJECT', 'UNABLE'], evidence: ['APPROPRIATE', 'CHANGE'],
    mapping: ['CORRECT', 'INCORRECT', 'MISSING'], problemType: ['TAXONOMY', 'EVIDENCE', 'MISSING_CHARACTER', 'MAPPING', 'AMBIGUOUS', 'OTHER'],
    expectedEffect: ['KEEP', 'CHANGE_SCORING', 'HINT_ONLY', 'NEW_CHARACTER', 'INVESTIGATE'], literatureStrength: ['STRONG', 'PARTIAL', 'MISSING'],
    proposedLevel: ['M', 'D', 'S', 'C'] };
  const result = {};
  for (const [key, values] of Object.entries(enums)) {
    result[key] = input[key] || '';
    if (result[key] || (final && ['decision', 'evidence', 'mapping', 'literatureStrength'].includes(key))) choice(result[key], values, key);
  }
  for (const key of ['correction', 'reference', 'pagePlateFigure', 'observations', 'visibilityCondition', 'proposedMapping']) result[key] = str(input[key], key);
  if (final && (['CORRECT', 'REJECT'].includes(result.decision) || result.evidence === 'CHANGE' || ['INCORRECT', 'MISSING'].includes(result.mapping))) {
    for (const key of ['correction', 'reference', 'pagePlateFigure', 'problemType', 'expectedEffect']) fail(result[key], `${key}: required for a correction/rejection`);
  }
  if (final && result.evidence === 'CHANGE') fail(result.proposedLevel, 'Select the proposed evidence level');
  return result;
}
function formA(input, final) {
  return { ...ruleFields(input, final), declarations: declarations(input.declarations, A_DECLARATIONS, final) };
}
function ruleSummary(input, final) {
  const result = {};
  for (const key of ['institution', 'expertise', 'developmentRelationship', 'sourcesUsed', 'criticalRuleIds', 'vocabularyOpinion', 'evidenceOpinion', 'coverageOpinion', 'revisionPriorities']) {
    result[key] = str(input[key], key, 8000, final && ['institution', 'expertise', 'developmentRelationship', 'sourcesUsed'].includes(key));
  }
  result.declarations = declarations(input.declarations, A_DECLARATIONS, final);
  return result;
}
module.exports = { observations, specimenFields, ruleFields, formB, formA, ruleSummary, B_DECLARATIONS, A_DECLARATIONS };
