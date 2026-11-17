// Two separately authored role-conditioned AI plans, replayed deterministically.
// These are not two independent model samples or human scientific opinions.
const { SIMULATION_PROFILES, SIMULATION_LABEL } = require('./provenance');
const RULE_IDS = ['Borelis_M1', 'Borelis_D1', 'Borelis_D2', 'Borelis_C1', 'Alveolina_M1', 'Alveolina_D1', 'Alveolina_D2', 'Alveolina_D3', 'Alveolina_C4', 'Alveolina_S2',
  'Psammosphaera_M1', 'Psammosphaera_D1', 'Psammosphaera_D2', 'Psammosphaera_C2', 'Pseudolacazina_M4', 'Pseudolacazina_D1', 'Pseudolacazina_D2', 'Pseudolacazina_C1',
  'Ammodiscus_M4', 'Operculina_M3', 'Caudammina_C1', 'Karrerulina_C2', 'Nummulitoides_C2'];
const MODEL_CONFIGURATION = { provider: 'OpenAI', assistantEnvironment: 'Codex / GPT-6 family as declared by this session', exactDeploymentModelId: null,
  temperature: null, samplingSeed: null, independentModelCalls: false, method: 'Two distinct role-conditioned review plans authored by the assistant, then deterministic replay; no runtime LLM request and no independence claim.' };
const FIXTURES = [
  { id: 'P001', fixtureId: 'SYNTHETIC_NO_MATERIAL', dataCategory: 'SOFTWARE_TEST', isPhysicalFossil: false, description: 'No thin-section material supplied. Exercises an entirely unobservable form without inventing anatomy.' },
  { id: 'P002', fixtureId: 'SYNTHETIC_NEUTRAL_GUARD', dataCategory: 'SOFTWARE_TEST', isPhysicalFossil: false, description: 'Schema probe with a hypothetical STRONG value under UNCERTAIN; it must contribute no scoring evidence. This is not an image observation.' },
  { id: 'P003', fixtureId: 'SYNTHETIC_NEGATIVE_GUARD', dataCategory: 'SOFTWARE_TEST', isPhysicalFossil: false, description: 'Explicit hypothetical CHR_03=ABSENT validator fixture. Tests two equivalent permitted negative encodings; not a microscope observation.' }
];
function formBPlan(profileId, fixture, characters) {
  const morphology = profileId === SIMULATION_PROFILES[0];
  const observations = Object.fromEntries(characters.map(c => [c.id, { value: null, state: 'NOT_OBSERVABLE',
    comment: morphology ? 'No actual thin-section material is supplied; no anatomical observation can be made.' : 'A schema fixture supplies no independently observed anatomy; preserve missing evidence as neutral.' }]));
  observations.CHR_21 = { value: 'UNKNOWN', state: 'UNCERTAIN', comment: 'No actual section exists; UNKNOWN is non-scoring context.' };
  if (fixture.id === 'P002') observations.CHR_14 = { value: morphology ? null : 'STRONG', state: 'UNCERTAIN', comment: morphology ?
    'The hypothetical fixture value is not anatomical evidence; conservatively withhold a pillar value.' :
    'Retain the explicitly hypothetical STRONG tentative value to test neutral-state preservation; no visible pillar is claimed.' };
  if (fixture.id === 'P003') observations.CHR_03 = { value: 'ABSENT', state: morphology ? 'PRESENT' : 'ABSENT', comment: morphology ?
    'Synthetic declared-negative fixture: PRESENT records that the negative value is explicitly specified, not observed in a fossil.' :
    'Equivalent valid encoding of the same synthetic negative fixture: ABSENT value with ABSENT state. No physical observation is asserted.' };
  return { observations, quality: 'LOW', qualityNote: 'SOFTWARE_TEST: no physical fossil or biological image; quality is a form-usability placeholder.',
    materialMode: 'digital', independentGenus: '', alternativeGenera: '', subjectiveConfidence: '', unidentified: true,
    timezone: 'UTC', feedback: SIMULATION_LABEL };
}
function formAPlan(profileId, rule) {
  const morphology = profileId === SIMULATION_PROFILES[0];
  const notes = [], sources = [`api/data/rule_chr_mapping.json#${rule.rule_key}`, 'api/data/characters.json', 'api/src/services/scoring.js', 'client/src/assets/scs/revision_v32/audit_v32.txt'];
  let decision = morphology ? 'UNABLE' : 'APPROVE', mapping = rule.mappings.length ? 'CORRECT' : 'MISSING', effect = 'INVESTIGATE', problem = 'MISSING_CHARACTER';
  let correction = 'Retain the original scientific statement pending a qualified human review; do not infer taxonomic validity from technical consistency.';
  let proposedMapping = '';
  if (!rule.mappings.length) {
    decision = morphology ? 'UNABLE' : 'CORRECT'; effect = 'NEW_CHARACTER';
    notes.push(morphology ? 'The precise anatomical qualifier is not established by the supplied general vocabulary; an appropriate section and taxonomic source are needed.' :
      'The mapping list is empty, so the current scorer treats this card as neutral. This is a coverage limitation, not evidence that the morphological statement is false.');
    correction = 'Preserve the text, explicitly label it unscored, and request an anatomically qualified state or documented mapping from a human curator.';
  } else notes.push(morphology ? 'A text-to-vocabulary correspondence is visible, but an ontology rule is not independent taxonomic evidence.' :
    'The stated mapping is a legal controlled-vocabulary value. The recommendation addresses encoding only and does not validate a genus diagnosis.');
  if (rule.rule_key === 'Borelis_D1') {
    decision = 'CORRECT'; mapping = 'INCORRECT'; effect = 'NEW_CHARACTER'; problem = 'MAPPING';
    correction = 'Do not equate generic chamberlet presence with the distinctive smaller secondary tier; obtain an expert-approved tier-specific character/state.';
    notes.push(morphology ? 'A thin section must resolve the relative chamberlet tiers; generic presence cannot establish that distinction.' : 'CHR_11=PRESENT is also used by Alveolina_M5. The shared coarse value cannot encode the distinguishing tier qualifier.');
  }
  if (rule.rule_key === 'Borelis_C1') {
    decision = morphology ? 'UNABLE' : 'CORRECT'; mapping = 'INCORRECT'; effect = 'HINT_ONLY'; problem = 'AMBIGUOUS';
    correction = 'Require an explicit ontogenetic stage qualifier before applying this contradictory chamber-arrangement rule; retain an unscored hint if the stage is not representable.';
    notes.push('The statement refers to early growth, while the current mapping is an unqualified chamber-arrangement state.');
  }
  if (rule.rule_key === 'Alveolina_S2') {
    decision = 'CORRECT'; mapping = 'INCORRECT'; effect = 'CHANGE_SCORING'; problem = 'MAPPING';
    correction = 'Represent the stated alternative forms using only approved values; seek a curator decision for ellipsoidal rather than inventing a new value.';
    proposedMapping = 'Proposed existing alternatives: CHR_02=GLOBULAR|OVOID|FUSIFORM; ellipsoidal remains unrepresented pending expert approval.';
    notes.push('The statement lists several alternatives but the frozen mapping contains only FUSIFORM.');
  }
  if (rule.rule_key === 'Psammosphaera_C2') {
    decision = 'CORRECT'; mapping = 'INCORRECT'; effect = 'CHANGE_SCORING'; problem = 'MAPPING';
    correction = 'Review adding the missing PLANISPIRAL alternative to the existing TROCHOSPIRAL mapping, using the same-character disjunction semantics.';
    proposedMapping = 'CHR_06=PLANISPIRAL|TROCHOSPIRAL (proposal only)'; notes.push('The original text names both coiling alternatives; the stored mapping contains only one.');
  }
  if (rule.rule_key === 'Pseudolacazina_M4') {
    decision = 'CORRECT'; problem = morphology ? 'MAPPING' : 'AMBIGUOUS'; effect = morphology ? 'NEW_CHARACTER' : 'KEEP';
    mapping = morphology ? 'INCORRECT' : 'CORRECT';
    correction = morphology ? 'Have a taxonomist distinguish continuous septula from generalized pillars; avoid treating any vertical partition as the full anatomical qualifier.' :
      'Correct the stale curation note: the frozen scorer supports match_mode=ANY. Preserve the current OR logic while requesting separate anatomical verification.';
    notes.push(morphology ? 'The available species-level source supports a qualified partition description; it does not by itself establish every genus-level pillar alternative.' :
      'The curation note says cross-character OR is unsupported, but match_mode=ANY and evaluateRuleM now implement it. The documentary note and executable source disagree.');
  }
  if (rule.rule_key === 'Pseudolacazina_D1') {
    decision = morphology ? 'UNABLE' : 'APPROVE';
    notes.push(morphology ? 'Do not generalize a species description to a universal genus-level diagnostic without a human taxonomic assessment.' :
      'The value NON_ALTERNATING_PATTERN is a qualified observed pattern. The word absent in the statement does not justify flipping it to a generic ABSENT value; the audit screen alone is not proof of a mapping error.');
  }
  if (rule.rule_key === 'Pseudolacazina_D2') {
    decision = 'CORRECT'; effect = 'CHANGE_SCORING';
    correction = 'Consider the existing CHR_13=LONGITUDINAL_CONTINUOUS value for the currently unmapped continuous-partition qualifier, subject to human source and section verification.';
    proposedMapping = 'CHR_13=LONGITUDINAL_CONTINUOUS (proposed, not applied)';
  }
  if (rule.genus === 'Pseudolacazina') sources.push('eval/results/v32/sources/Sirel1986_Pseudolacazina.pdf.txt#PDF-page-2 (printed p.124), DOI/article metadata: https://dergipark.org.tr/en/pub/bulletinofmre/article/52243');
  if (rule.rule_key === 'Psammosphaera_D1') {
    decision = 'CORRECT'; correction = 'Do not replace wall-grain construction with an external surface-granularity proxy. Retain the unscored text until a qualified wall-texture state is approved.';
  }
  if (['Caudammina_C1', 'Karrerulina_C2', 'Nummulitoides_C2'].includes(rule.rule_key)) {
    decision = morphology ? 'UNABLE' : 'CORRECT'; mapping = 'INCORRECT'; problem = 'AMBIGUOUS'; effect = 'HINT_ONLY';
    correction = 'Resolve the compound anatomical/ontogenetic qualifier with a human curator; do not automatically reverse a positive mapping merely because the sentence contains a negation.';
    notes.push('The audit is a text screen. The negated qualifier and the mapped positive value may describe different parts of the statement; a compound state may be required.');
  }
  const limitations = 'AI-generated technical proposal only. No actual specimen was examined. Sources supplied by the repository are not independent expert evidence. Species-level descriptions are not automatically genus-wide diagnoses. No frozen rule is changed.';
  return { data: { decision, evidence: 'APPROPRIATE', mapping, correction, reference: sources.join('; '), pagePlateFigure: `Rule ${rule.rule_key}; controlled vocabulary and frozen scorer sections (not an invented publication page)`,
    observations: `${notes.join(' ')} ${limitations}`, visibilityCondition: morphology ? 'Require suitable thin sections resolving the named structure; unknown visibility is not absence.' : 'Only explicitly observed controlled values supply evidence; missing alternatives remain neutral.',
    proposedMapping, problemType: problem, expectedEffect: effect, literatureStrength: rule.genus === 'Pseudolacazina' ? 'PARTIAL' : 'MISSING' },
    reasoning: notes.join(' '), sources, limitations };
}
module.exports = { RULE_IDS, MODEL_CONFIGURATION, FIXTURES, formAPlan, formBPlan };
