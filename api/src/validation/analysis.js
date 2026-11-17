/* Frozen with every study. Pure, dependency-free analysis of locked records.
 * Never call the live database, network, a VLM or an AI provider here. */
const ABSTAIN = ['INDETERMINATE', 'NO_MATCH_WITHIN_CORE_TAXA'];
const LEVELS = { M: 'MANDATORY', D: 'DIAGNOSTIC', S: 'SUPPORTING', C: 'CONTRADICTORY' };
const mean = values => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
function agreement(pairs) {
  if (!pairs.length) return { n: 0, agreement: null, kappa: null, status: 'NOT ESTIMABLE' };
  const a = {}, b = {};
  let same = 0;
  for (const [x, y] of pairs) { a[x] = (a[x] || 0) + 1; b[y] = (b[y] || 0) + 1; same += x === y ? 1 : 0; }
  const observed = same / pairs.length;
  const expected = Object.keys(a).reduce((s, key) => s + a[key] * (b[key] || 0), 0) / pairs.length ** 2;
  return { n: pairs.length, agreement: observed, kappa: expected < 1 ? (observed - expected) / (1 - expected) : null,
    status: expected < 1 ? 'ESTIMATED' : 'NOT ESTIMABLE', reason: expected === 1 ? 'No marginal category variation' : null };
}
function bootstrap(rows, field, seed = 20261112, replicates = 5000) {
  const valid = rows.filter(r => Number.isFinite(r[field]));
  const groups = {};
  for (const row of valid) (groups[row.cluster] ||= []).push(row[field]);
  const clusters = Object.values(groups);
  const estimate = mean(valid.map(r => r[field]));
  if (clusters.length < 2) return { estimate, lower: null, upper: null, clusters: clusters.length, status: 'NOT ESTIMABLE' };
  let state = seed >>> 0;
  const random = () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 4294967296; };
  const values = [];
  for (let i = 0; i < replicates; i++) {
    const sample = [];
    for (let j = 0; j < clusters.length; j++) sample.push(...clusters[Math.floor(random() * clusters.length)]);
    values.push(mean(sample));
  }
  values.sort((a, b) => a - b);
  return { estimate, lower: values[Math.floor(replicates * .025)], upper: values[Math.floor(replicates * .975)],
    clusters: clusters.length, specimens: valid.length, replicates, seed, status: 'ESTIMATED' };
}
function topCredit(result, reference, k) {
  if (ABSTAIN.includes(result.status)) return 0;
  const item = result.ranking.find(r => r.genus === reference);
  if (!item) return 0;
  const above = result.ranking.filter(r => r.score > item.score).length;
  const tied = result.ranking.filter(r => r.score === item.score).length;
  return Math.max(0, Math.min(1, (k - above) / tied));
}
function baseline(observations, genera, engine, config) {
  const h = engine.buildH(observations), ranking = [], excluded = [];
  const n = Object.entries(observations).filter(([c, o]) => !['CHR_01', 'CHR_21'].includes(c) && o.value &&
    !['UNCERTAIN', 'NOT_OBSERVABLE'].includes(o.state)).length;
  for (const g of Object.values(genera)) {
    const incompatible = g.rules.some(r => ['MANDATORY', 'DIAGNOSTIC'].includes(r.level) && engine.evaluateRuleM(h, r.mappings, r.matchMode).verdict === 'MISMATCH');
    (incompatible ? excluded : ranking).push({ genus: g.genus, score: 0 });
  }
  ranking.sort((a, b) => a.genus.localeCompare(b.genus));
  return { ranking, excluded, status: n < config.tauObs || !ranking.length ? 'INDETERMINATE' : 'CANDIDATE_GENUS' };
}
function analyze(study, engine) {
  if (study.phase !== 'LOCKED') throw new Error('Analysis requires locked data');
  const codes = study.purpose === 'SOFTWARE_TEST' && study.simulationProfiles ? study.simulationProfiles : ['EXP01', 'EXP02'];
  const [codeA, codeB] = codes;
  const rules = JSON.parse(study.snapshot.files['api/data/rule_chr_mapping.json']);
  const characters = JSON.parse(study.snapshot.files['api/data/characters.json']).characters;
  const submitted = Object.values(study.forms).filter(f => f.status === 'FINAL');
  if (study.purpose !== 'SOFTWARE_TEST' && submitted.some(f => !['AI_ASSISTED_REVIEW', 'INDEPENDENT_HUMAN_OBSERVATION'].includes(f.dataCategory))) throw new Error('Unclassified or software-test records cannot enter human research analysis');
  if (submitted.some(f => f.dataCategory !== (study.purpose === 'SOFTWARE_TEST' ? 'SOFTWARE_TEST' : f.kind !== 'specimens' && study.ruleReviewMode === 'AI_ASSISTED' ? 'AI_ASSISTED_REVIEW' : 'INDEPENDENT_HUMAN_OBSERVATION'))) throw new Error('Mixed provenance categories are not permitted in a scientific analysis');
  const bforms = submitted.filter(f => f.kind === 'specimens');
  const aforms = submitted.filter(f => f.kind === 'rules');
  const byKey = (kind, subject, code) => study.forms[`${kind}:${subject}:${code}`];
  const counts = forms => Object.fromEntries(['APPROVE', 'CORRECT', 'REJECT', 'UNABLE'].map(d => [d, forms.filter(f => f.data.decision === d).length]));
  const ruleDiscrepancies = study.ruleIds.flatMap(ruleId => {
    const a = byKey('rules', ruleId, codeA)?.data, b = byKey('rules', ruleId, codeB)?.data;
    return a && b && ['decision', 'evidence', 'mapping'].some(key => a[key] !== b[key]) ?
      [{ ruleId, [codeA]: { decision: a.decision, evidence: a.evidence, mapping: a.mapping }, [codeB]: { decision: b.decision, evidence: b.evidence, mapping: b.mapping } }] : [];
  });
  const rulePairs = ids => ids.flatMap(key => {
    const a = byKey('rules', key, codeA), b = byKey('rules', key, codeB);
    return a?.status === 'FINAL' && b?.status === 'FINAL' ? [[a.data.decision, b.data.decision]] : [];
  });
  const reviewedRules = [...new Set(aforms.map(f => f.subject))];
  const formA = { status: !aforms.length ? 'NOT CONDUCTED' : reviewedRules.length === study.ruleIds.length ? 'COMPLETE' : 'INCOMPLETE',
    dataCategory: study.purpose === 'SOFTWARE_TEST' ? 'SOFTWARE_TEST' : study.ruleReviewMode === 'AI_ASSISTED' ? 'AI_ASSISTED_REVIEW' : 'INDEPENDENT_HUMAN_OBSERVATION',
    agreementBasis: study.purpose === 'SOFTWARE_TEST' ? 'SIMULATED SOFTWARE-TEST DECISIONS ONLY' : study.ruleReviewMode === 'AI_ASSISTED' ? 'AI-assisted human review decisions; not independent blinded human agreement' : 'Independent human rule decisions',
    scope: study.reviewScope, selectionCriteria: study.selectionCriteria, assignedRules: study.ruleIds.length,
    uniqueRulesReviewed: reviewedRules.length, individualReviews: aforms.length, counts: counts(aforms),
    approvalPercentage: aforms.length ? 100 * aforms.filter(f => f.data.decision === 'APPROVE').length / aforms.length : null,
    byExpert: Object.fromEntries(codes.map(code => [code, counts(aforms.filter(f => f.expertCode === code))])),
    agreement: agreement(rulePairs(study.ruleIds)),
    byEvidence: Object.fromEntries(['M', 'D', 'S', 'C'].map(level => [level, agreement(rulePairs(rules.filter(r => r.level === level && study.ruleIds.includes(r.rule_key)).map(r => r.rule_key)))])),
    byCharacter: Object.fromEntries(characters.map(c => [c.id, agreement(rulePairs(rules.filter(r => study.ruleIds.includes(r.rule_key) && r.mappings.some(m => m.chr_id === c.id)).map(r => r.rule_key)))])),
    discrepancies: ruleDiscrepancies,
    unresolvedDiscrepancies: ruleDiscrepancies.filter(d => study.adjudications.filter(a => a.kind === 'rules' && a.subject === d.ruleId).at(-1)?.resolution !== 'RESOLVED').length };
  const morphological = characters.map(c => {
    const pairs = [], observed = [], missing = { [codeA]: 0, [codeB]: 0 }, discrepancies = [];
    for (const specimen of study.specimens) {
      const a = byKey('specimens', specimen.id, codeA)?.data.observations[c.id];
      const b = byKey('specimens', specimen.id, codeB)?.data.observations[c.id];
      for (const [code, o] of [[codeA, a], [codeB, b]]) if (!o || ['NOT_OBSERVABLE', 'UNCERTAIN'].includes(o.state)) missing[code]++;
      if (!a || !b) continue;
      // A clearly observed negative value has identical meaning under PRESENT
      // and ABSENT. Neutral states are compared as states, never as anatomy.
      const category = o => ['NOT_OBSERVABLE', 'UNCERTAIN'].includes(o.state) ? o.state : `VALUE:${o.value}`;
      pairs.push([category(a), category(b)]);
      if (![a, b].some(o => ['NOT_OBSERVABLE', 'UNCERTAIN'].includes(o.state))) observed.push([a.value, b.value]);
      if (category(a) !== category(b)) discrepancies.push({ specimenId: specimen.id, character: c.id, [codeA]: a, [codeB]: b });
    }
    return { character: c.id, contextOnly: c.id === 'CHR_21', allStates: agreement(pairs), jointlyObservable: agreement(observed), missing, discrepancies };
  });
  const allGenera = {};
  for (const r of rules) {
    allGenera[r.genus] ||= { genus: r.genus, module: r.module, rules: [] };
    allGenera[r.genus].rules.push({ level: LEVELS[r.level], text: r.text, rule_key: r.rule_key, matchMode: r.match_mode,
      mappings: r.mappings.map(m => ({ chrId: m.chr_id, value: m.value })).filter(m => m.value) });
  }
  const perForm = [], excludedCases = [];
  for (const specimen of study.specimens) {
    const ref = study.references[specimen.id];
    if (!ref?.verified || !allGenera[ref.genus]) { excludedCases.push({ specimenId: specimen.id, reason: ref?.exclusionReason || 'No verified in-scope reference genus' }); continue; }
    for (const code of codes) {
      const form = byKey('specimens', specimen.id, code);
      if (form?.status !== 'FINAL') { excludedCases.push({ specimenId: specimen.id, expert: code, reason: 'No final Form B' }); continue; }
      const obs = form.data.observations;
      const wall = obs.CHR_01;
      const module = wall?.state === 'PRESENT' && ['AGGLUTINATED', 'PORCELANEOUS', 'HYALINE'].includes(wall.value) ? wall.value : null;
      const genera = Object.fromEntries(Object.entries(allGenera).filter(([, g]) => !module || g.module === module));
      const a0 = engine.scoreGenera(obs, genera, study.snapshot.manifest.scoring);
      const b1 = baseline(obs, genera, engine, study.snapshot.manifest.scoring);
      const metrics = result => ({ top1: topCredit(result, ref.genus, 1), top3: topCredit(result, ref.genus, 3),
        coverage: ABSTAIN.includes(result.status) ? 0 : 1, abstention: ABSTAIN.includes(result.status) ? 1 : 0, referenceExcluded: result.excluded.some(r => r.genus === ref.genus) ? 1 : 0,
        referenceUnavailable: !genera[ref.genus] ? 1 : 0, state: result.status });
      const exact = form.data.independentGenus;
      perForm.push({ specimenId: specimen.id, expert: code, referenceGenus: ref.genus, referenceModule: allGenera[ref.genus].module,
        A0: metrics(a0), B1: metrics(b1), humanGenusAgreement: exact ? Number(exact.toLowerCase() === ref.genus.toLowerCase()) : null,
        subjectiveConfidence: form.data.subjectiveConfidence || null });
    }
  }
  const perSpecimen = study.specimens.flatMap(specimen => {
    const forms = perForm.filter(r => r.specimenId === specimen.id);
    if (forms.length !== 2) return [];
    const result = { specimenId: specimen.id, cluster: specimen.clusterId || specimen.id, module: forms[0].referenceModule };
    for (const method of ['A0', 'B1']) for (const metric of ['top1', 'top3', 'coverage', 'abstention', 'referenceExcluded', 'referenceUnavailable']) result[`${method}_${metric}`] = mean(forms.map(f => f[method][metric]));
    result.pairedTop1Difference = result.A0_top1 - result.B1_top1;
    return [result];
  });
  const config = study.snapshot.manifest.analysis;
  const estimate = (rows, field) => bootstrap(rows, field, config.seed, config.bootstrapReplicates);
  const performance = rows => Object.fromEntries(['A0', 'B1'].map(method => [method, Object.fromEntries(['top1', 'top3', 'coverage', 'abstention', 'referenceExcluded', 'referenceUnavailable'].map(metric => [metric, estimate(rows, `${method}_${metric}`)]))]));
  const formB = { status: !bforms.length ? 'NOT CONDUCTED' : bforms.length === study.specimens.length * 2 ? 'COMPLETE' : 'INCOMPLETE',
    dataCategory: study.purpose === 'SOFTWARE_TEST' ? 'SOFTWARE_TEST' : 'INDEPENDENT_HUMAN_OBSERVATION',
    specimens: study.specimens.length, forms: bforms.length, analyzableSpecimens: perSpecimen.length, excludedCases,
    morphologicalAgreement: morphological, performance: performance(perSpecimen), pairedTop1Difference: estimate(perSpecimen, 'pairedTop1Difference'),
    byModule: Object.fromEntries(['AGGLUTINATED', 'PORCELANEOUS', 'HYALINE'].map(module => [module, performance(perSpecimen.filter(r => r.module === module))])),
    byConfidenceState: Object.fromEntries(['CONFIRMED_GENUS', 'PROBABLE_GENUS', 'CANDIDATE_GENUS', 'INDETERMINATE', 'NO_MATCH_WITHIN_CORE_TAXA'].map(state => {
      const forms = perForm.filter(f => f.A0.state === state);
      const specimens = [...new Set(forms.map(f => f.specimenId))].map(sid => ({ cluster: study.specimens.find(s => s.id === sid).clusterId || sid,
        top1: mean(forms.filter(f => f.specimenId === sid).map(f => f.A0.top1)) }));
      return [state, { forms: forms.length, specimens: specimens.length, top1: estimate(specimens, 'top1') }];
    })),
    humanGenusAgreement: { n: perForm.filter(f => f.humanGenusAgreement !== null).length,
      estimate: mean(perSpecimen.flatMap(s => { const values = perForm.filter(f => f.specimenId === s.specimenId && f.humanGenusAgreement !== null).map(f => f.humanGenusAgreement); return values.length ? [mean(values)] : []; })) },
    probabilityCalibration: { status: 'NOT ESTIMABLE', reason: 'The frozen engine supplies categorical confidence states, not probability estimates. Subjective human confidence is separate.' },
    perForm, perSpecimen: perSpecimen.map(({ cluster, ...row }) => row) };
  return { status: study.purpose === 'SOFTWARE_TEST' ? 'SOFTWARE TEST — NOT HUMAN RESEARCH RESULTS' : 'LOCKED',
    study: { id: study.id, title: study.title, cohort: study.cohort, purpose: study.purpose, lockedAt: study.lockedAt, seal: study.seal },
    version: study.snapshot.manifest, observerCodes: codes, formA, formB,
    humanParticipation: { independentSpecimenObservation: study.purpose === 'SOFTWARE_TEST' ? 'NOT CONDUCTED' : formB.status,
      aiAssistedRuleApproval: study.purpose === 'SOFTWARE_TEST' || study.ruleReviewMode !== 'AI_ASSISTED' ? 'NOT CONDUCTED' : formA.status,
      independentlyVerifiedReferenceCases: study.purpose === 'SOFTWARE_TEST' ? 0 : perSpecimen.length,
      demographicData: 'NOT COLLECTED', qualificationSummaries: study.purpose === 'SOFTWARE_TEST' ? 'NOT CONDUCTED' : codes.map(code => ({ code, expertise: byKey('summary', 'review', code)?.data.expertise || 'NOT RECORDED' })) },
    auditProvenance: { sealedAuditHead: study.sealedAuditHead, events: study.audit, corrections: study.revisions.map(r => ({ id: r.id, kind: r.kind, subject: r.subject, expertCode: r.expertCode, originalHash: r.originalHash, includedInPrimaryAnalysis: false })),
      adjudications: study.adjudications.map(r => ({ id: r.id, kind: r.kind, subject: r.subject, resolution: r.resolution, at: r.at })) },
    methodology: (study.purpose === 'SOFTWARE_TEST' ? 'AI-generated SOFTWARE_TEST profiles; no human observers and no independent validation. Synthetic fixtures are not physical fossils. Simulated agreement only exercises software logic. Classification accuracy is not estimable without real verified references. ' : 'Two independent specimen observers; Form B before Form A. ') + 'CHR_21 is context only. Neutral states never provide evidence. A0 and B1 receive identical unmodified observations. Top-k uses fractional credit for ties and zero for abstentions. Observer credits are averaged within each specimen. Deterministic 5,000-replicate percentile bootstrap resamples specimens or source clusters, retaining paired observers and methods. Kappa uses categorical marginals; constant marginals are not estimable. Pilot and confirmatory studies are analyzed separately. No probability calibration is claimed.',
    manuscript: study.purpose === 'SOFTWARE_TEST' ? { methods: 'SOFTWARE TEST ONLY', results: 'NOT CONDUCTED: no human research results may be inferred from this software test.' } : {
      methods: `Independent experts EXP01 and EXP02 evaluated the same coded material using a frozen ${study.snapshot.manifest.softwareVersion} implementation (source commit ${study.snapshot.manifest.gitCommit}; content hash ${study.snapshot.hash}). Specimen observations preceded rule-card review. Original submissions were retained and sealed before analysis. The ${study.cohort.toLowerCase()} cohort was analyzed separately.`,
      results: `The locked study contained ${study.specimens.length} distinct specimens and ${bforms.length} submitted observation forms. ${perSpecimen.length} specimens had paired final observations and verified in-scope reference labels. The experts reviewed ${reviewedRules.length} distinct rule cards (${aforms.length} individual reviews; scope: ${study.reviewScope}). ${ruleDiscrepancies.length} rule cards had discrepant decisions, evidence classes or mappings. Rule-review counts do not estimate specimen identification accuracy. Classification estimates and uncertainty are provided in the accompanying tables; empty or constant-data estimates are marked NOT ESTIMABLE.` } };
}
module.exports = { analyze, agreement, bootstrap, topCredit, baseline };
