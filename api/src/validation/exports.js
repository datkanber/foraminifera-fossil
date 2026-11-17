const { fail } = require('./common');
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function csv(rows) {
  const fields = [...new Set(rows.flatMap(Object.keys))];
  const cell = value => {
    let text = value && typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
    if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`; // Spreadsheet formula injection.
    return `"${text.replace(/"/g, '""')}"`;
  };
  return '\uFEFF' + [fields.map(cell).join(','), ...rows.map(r => fields.map(k => cell(r[k])).join(','))].join('\r\n');
}
function formRows(forms) {
  return forms.flatMap(f => f.kind === 'specimens' ? Object.entries(f.data.observations || {}).map(([character, o]) => ({
    form: 'B', dataCategory: f.dataCategory || 'LEGACY_UNCLASSIFIED', specimen: f.subject, expert: f.expertCode, status: f.status, character, value: o.value, state: o.state, comment: o.comment,
    quality: f.data.quality, independentGenus: f.data.independentGenus, subjectiveConfidence: f.data.subjectiveConfidence,
    activeSeconds: f.timer.activeMs / 1000, submittedAt: f.submittedAt, responseHash: f.responseHash, snapshotHash: f.snapshotHash
  })) : [{ form: f.kind === 'rules' ? 'A' : 'A_SUMMARY', dataCategory: f.dataCategory || 'LEGACY_UNCLASSIFIED', subject: f.subject, expert: f.expertCode, status: f.status,
    ...f.data, submittedAt: f.submittedAt, responseHash: f.responseHash, snapshotHash: f.snapshotHash }]);
}
function printable(title, content) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title><style>body{font:15px system-ui;margin:40px;color:#172b3a}h1{font-size:26px}pre{white-space:pre-wrap;overflow-wrap:anywhere}table{border-collapse:collapse;width:100%;margin:20px 0}td,th{border:1px solid #ccc;padding:8px;text-align:left}@media print{body{margin:0}tr,pre{break-inside:avoid}}button{padding:10px}</style></head><body><h1>${escapeHtml(title)}</h1><p>Print this document and select “Save as PDF” in your browser.</p>${content}</body></html>`;
}
function printForm(f) {
  const row = (label, value) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value && typeof value === 'object' ? JSON.stringify(value) : value)}</td></tr>`;
  const metadata = `<table>${Object.entries({ 'Expert code': f.expertCode, 'Record ID': f.subject, Status: f.status,
    'Submitted at (UTC)': f.submittedAt, 'Active observation seconds': f.timer?.activeMs / 1000,
    'Schema version': f.schemaVersion, 'Frozen source hash': f.snapshotHash, 'Response hash': f.responseHash }).map(([k, v]) => row(k, v)).join('')}</table>`;
  const body = f.kind === 'specimens' ? `<h2>Morphological observations</h2><table><thead><tr><th>Character</th><th>Value</th><th>Observation state</th><th>Visual justification / comment</th></tr></thead><tbody>${Object.entries(f.data.observations).map(([character, o]) => `<tr><td>${escapeHtml(character)}</td><td>${escapeHtml(o.value || '—')}</td><td>${escapeHtml(o.state)}</td><td>${escapeHtml(o.comment)}</td></tr>`).join('')}</tbody></table>
    <h2>Observation context and optional independent identification</h2><table>${Object.entries(f.data).filter(([k]) => !['observations', 'declarations'].includes(k)).map(([k, v]) => row(k, v)).join('')}</table>
    <p>CHR_21 is section-orientation context only. NOT_OBSERVABLE and UNCERTAIN provide no scoring evidence. Subjective confidence is separate from the engine’s confidence classes.</p>` :
    `<table>${Object.entries(f.data).filter(([k]) => k !== 'declarations').map(([k, v]) => row(k, v)).join('')}</table>`;
  const declarations = `<h2>Independence and digital confirmation</h2><table>${Object.entries(f.data.declarations || {}).map(([k, v]) => row(k, v ? 'Confirmed' : 'Not confirmed')).join('')}${row('Digital confirmation', f.signature)}</table>`;
  return printable(`Form ${f.kind === 'specimens' ? 'B' : 'A'} — ${f.subject} — ${f.expertCode}`, metadata + body + declarations);
}
function reportHtml(report) {
  const software = report.study.purpose === 'SOFTWARE_TEST';
  const table = (title, rows) => `<h2>${escapeHtml(title)}</h2><table><thead><tr><th>Measure</th><th>Value</th></tr></thead><tbody>${rows.map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value ?? 'NOT ESTIMABLE')}</td></tr>`).join('')}</tbody></table>`;
  const estimate = v => v?.estimate == null ? 'NOT ESTIMABLE' : `${(v.estimate * 100).toFixed(2)}%${v.lower == null ? ' (CI: NOT ESTIMABLE)' : ` (95% CI ${(v.lower * 100).toFixed(2)}–${(v.upper * 100).toFixed(2)}%)`}`;
  return printable('GeoKnow — Independent Expert Validation Report', `<p><strong>${escapeHtml(report.status)}</strong></p>
    <h2>Methods</h2><p>${escapeHtml(report.manuscript.methods)}</p><p>${escapeHtml(report.methodology)}</p>
    <h2>Results</h2><p>${escapeHtml(report.manuscript.results)}</p>
    ${table(software ? 'Simulated rule-review recommendations' : report.formA.dataCategory === 'AI_ASSISTED_REVIEW' ? 'AI-assisted human rule-card review' : 'Independent rule-card review', [['Review scope', report.formA.scope], ['Distinct reviewed rules', report.formA.uniqueRulesReviewed], ['Individual reviews', report.formA.individualReviews], ...Object.entries(report.formA.counts), ['Agreement', report.formA.agreement.agreement], ["Cohen’s kappa", report.formA.agreement.kappa], ['Unresolved discrepancies', report.formA.unresolvedDiscrepancies]])}
    ${table('Rule review by expert', Object.entries(report.formA.byExpert).flatMap(([expert, counts]) => Object.entries(counts).map(([decision, count]) => [`${expert}: ${decision}`, count])))}
    ${table('Rule agreement by evidence level', Object.entries(report.formA.byEvidence).flatMap(([level, result]) => [[`${level}: paired rules`, result.n], [`${level}: agreement`, result.agreement], [`${level}: kappa`, result.kappa]]))}
    ${table('Rule agreement by character', Object.entries(report.formA.byCharacter).flatMap(([character, result]) => [[`${character}: paired rules`, result.n], [`${character}: agreement`, result.agreement], [`${character}: kappa`, result.kappa]]))}
    ${table(software ? 'Simulated Form B schema probes' : 'Blinded specimen observations', [[software ? 'Synthetic fixtures (physical fossils: 0)' : 'Distinct fossils', report.formB.specimens], ['Submitted forms', report.formB.forms], ['Analyzable paired fossils', report.formB.analyzableSpecimens], ...['A0', 'B1'].flatMap(method => Object.entries(report.formB.performance[method]).map(([metric, value]) => [`${method}: ${metric}`, estimate(value)])), ['Paired A0–B1 Top-1 difference (percentage points)', estimate(report.formB.pairedTop1Difference)], ['Probability calibration', 'NOT ESTIMABLE']])}
    <p>Rule-review category: ${escapeHtml(report.formA.dataCategory)}. ${escapeHtml(report.formA.agreementBasis)}</p>
    <h2>Character agreement</h2><table><tr><th>Character</th><th>N</th><th>Agreement</th><th>Kappa</th><th>Not observable / uncertain (observer order)</th></tr>${report.formB.morphologicalAgreement.map(r => `<tr><td>${escapeHtml(r.character)}</td><td>${r.allStates.n}</td><td>${escapeHtml(r.allStates.agreement ?? 'NOT ESTIMABLE')}</td><td>${escapeHtml(r.allStates.kappa ?? 'NOT ESTIMABLE')}</td><td>${Object.values(r.missing).map(escapeHtml).join(' / ')}</td></tr>`).join('')}</table>
    ${table('Classification by reference wall-composition module', Object.entries(report.formB.byModule).flatMap(([module, methods]) => Object.entries(methods).flatMap(([method, metrics]) => Object.entries(metrics).map(([metric, result]) => [`${module} / ${method} / ${metric}`, estimate(result)]))))}
    ${table('Engine confidence-state performance', Object.entries(report.formB.byConfidenceState).flatMap(([state, result]) => [[`${state}: forms`, result.forms], [`${state}: distinct specimens`, result.specimens], [`${state}: Top-1`, estimate(result.top1)]]))}
    <h2>Version and audit provenance</h2><pre>${escapeHtml(JSON.stringify({ study: report.study, version: report.version, audit: { sealedAuditHead: report.auditProvenance?.sealedAuditHead, eventCount: report.auditProvenance?.events.length, fullAudit: 'Retained in the structured JSON export', corrections: report.auditProvenance?.corrections, adjudications: report.auditProvenance?.adjudications } }, null, 2))}</pre>
    <h2>Discrepancies and excluded cases</h2><pre>${escapeHtml(JSON.stringify({ ruleDiscrepancies: report.formA.discrepancies, specimenDiscrepancies: report.formB.morphologicalAgreement.flatMap(r => r.discrepancies), excludedCases: report.formB.excludedCases }, null, 2))}</pre>`);
}
function s10(study, report) {
  fail(study.phase === 'LOCKED', 'Locked study required');
  return { format: 'S10-INDEPENDENT-1', status: report.status, study: report.study, version: report.version,
    forms: Object.values(study.forms).map(f => {
      const data = structuredClone(f.data);
      // Anonymous codes only. Narrative fields may still need publication review.
      if (f.kind === 'summary') { delete data.institution; delete data.expertise; delete data.developmentRelationship; }
      const { history, ...record } = f;
      return { ...record, data };
    }),
    references: Object.entries(study.references).map(([specimenId, r]) => ({ specimenId, genus: r.genus, verified: r.verified, exclusionReason: r.exclusionReason })),
    images: study.specimens.map(p => ({ specimenId: p.id, views: p.images.map(i => ({ id: i.id, sha256: i.sha256 })) })),
    report, publicationReview: 'Expert codes are anonymized; coordinator must review free-text fields for identifying information before sharing.' };
}
module.exports = { csv, formRows, printForm, reportHtml, s10, escapeHtml };
