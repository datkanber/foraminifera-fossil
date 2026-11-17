const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { digest, fail } = require('./common');
const { SIMULATION_LABEL } = require('./provenance');
const { csv, escapeHtml: esc, reportHtml } = require('./exports');
const { frozenCharacters, frozenRules } = require('./snapshot');
function document(title, body, simulated = true) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title><style>body{font:11px Arial,sans-serif;color:#172b3a;line-height:1.45}h1{font-size:23px}h2{font-size:17px;margin-top:24px}h3{font-size:14px}.banner{padding:12px;background:#fff1d4;border:2px solid #865300;font-weight:bold}table{border-collapse:collapse;width:100%;table-layout:fixed;margin:12px 0}td,th{padding:6px;border:1px solid #bbb;text-align:left;vertical-align:top;overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:9px}.record{break-before:page}.record:first-of-type{break-before:auto}tr{break-inside:avoid}.note{color:#724900}input,textarea,select{max-width:100%}</style></head><body>${simulated ? `<p class="banner">${esc(SIMULATION_LABEL)}</p>` : '<p class="banner">PREPARATION ONLY — HUMAN VALIDATION NOT CONDUCTED</p>'}<h1>${esc(title)}</h1>${body}</body></html>`;
}
const pairs = object => `<table>${Object.entries(object).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(typeof v === 'object' ? JSON.stringify(v) : v)}</td></tr>`).join('')}</table>`;
function formsHtml(study, profile, kind) {
  const rules = frozenRules(study), characters = frozenCharacters(study);
  const forms = Object.values(study.forms).filter(f => f.expertCode === profile && f.kind === kind);
  const body = `<p>Simulation profile: <b>${profile}</b>. No real scientific expert participated. Three synthetic fixtures are schema probes, not physical fossils. All timing fields are simulated. Source hash: ${study.snapshot.hash}.</p>` + forms.map(f => {
    const rule = rules.find(r => r.rule_key === f.subject);
    const context = rule ? pairs({ 'Rule ID': rule.rule_key, Genus: rule.genus, 'Original statement': rule.text, 'Evidence level': rule.level,
      'Existing mapping / expected states': rule.mappings, 'Match mode': rule.match_mode || 'ALL' }) : pairs({ 'Fixture ID': f.subject,
      'Fixture description': study.specimens.find(p => p.id === f.subject).description, 'Physical fossil': false });
    const data = kind === 'specimens' ? `<table><tr><th>Character</th><th>Value / state</th><th>Reason / limitation</th></tr>${characters.map(c => {
      const o = f.data.observations[c.id]; return `<tr><td>${c.id}<br>${esc(c.name_en)}</td><td>${esc(o.value || '—')}<br>${o.state}</td><td>${esc(o.comment)}</td></tr>`;
    }).join('')}</table>` : pairs(f.data);
    return `<section class="record"><h2>${kind === 'specimens' ? 'Form B fixture' : 'Form A proposed assessment'}: ${esc(f.subject)}</h2><p class="banner">${esc(SIMULATION_LABEL)}</p>${context}${data}
      <p>AI-generated provenance: ${esc(JSON.stringify(f.provenance))}</p><p>Source references: ${esc(JSON.stringify(f.sourceReferences))}</p><p>Response SHA-256: ${f.responseHash}. Final responses immutable. Human approval: NOT CONDUCTED.</p></section>`;
  }).join('');
  return document(`${profile} — ${kind === 'specimens' ? 'Form B' : 'Form A'}`, body);
}
function humanInstructions() {
  return document('GeoKnow — Human Expert Review Instructions', `<h2>Study status</h2><p>Independent human observations, AI-assisted human approvals and independent reference verification are NOT CONDUCTED. No expert identity, qualification or participation is assumed. The planned pilot and confirmatory counts are recruitment targets, not completed specimens.</p>
    <h2>1. Independent Form B comes first</h2><p>The coordinator must register actual, independently sourced, coded thin sections and verify visual blinding. EXP01 and EXP02 receive the same assigned views and only their own forms. Do not provide either AI_SIM dataset, rule proposals, reference genera, engine rankings or the other observer’s responses. Record all 21 character values/states directly through the private website. Missing or uncertain anatomy must remain neutral; CHR_21 is context only.</p>
    <p>Use the genuine timer and record actual qualifications and independence disclosures. Save drafts if needed; review the four independence declarations before final submission. The final original is immutable. Do not sign an AI-filled specimen form as independent observation.</p>
    <h2>2. Explicit human review of separate rule proposals</h2><p>Only after both experts’ relevant Form B submissions are final may the coordinator open the AI-assisted rule stage. For each assigned card, inspect the original frozen rule, sources and immutable AI drafts. Record APPROVE, REJECT, CORRECT or INDEPENDENT_ALTERNATIVE for the proposal, your own taxonomic decision, correction and evidence. Explicitly verify each individual card; no bulk approval is permitted.</p>
    <p>The original AI draft remains SOFTWARE_TEST/unverified AI provenance. Your separately signed decision is AI_ASSISTED_REVIEW. It is not counted as independent blinded human rule agreement. Form B remains INDEPENDENT_HUMAN_OBSERVATION.</p>
    <h2>3. Independent reference verification</h2><p>REF01 or a separate documented reference process verifies genus labels using actual taxonomic evidence. Do not derive references from EXP01/EXP02 guesses or engine results. Unknown references require a recorded exclusion reason. Reference labels remain private.</p>
    <h2>4. Lock and analysis</h2><p>The coordinator checks completeness, deviations, reference evidence and original response integrity before data lock. Analyze only locked records using the frozen v32 definitions. Keep pilot and confirmatory cohorts separate and resample physical specimens or source clusters, retaining both observers together. Two forms are not two fossils.</p>
    <h2>Publication and limitations</h2><p>Publish software tests, AI-assisted decisions and independent specimen observations in separate tables. The current independent human results and qualification summaries are NOT CONDUCTED. Never treat synthetic fixture agreement as identification accuracy. Review all free text for personal information before sharing exports. The private reproduction archive is coordinator-only.</p>
    <h2>Sign-in and invitations</h2><p>Access /expert-validation using a private individual invitation. Set your own password. The coordinator generates links in the protected panel; tokens and passwords must not be included in public packages or logs. All actual participants, material permissions and taxonomic reference evidence remain to be supplied.</p>`, false);
}
function blankObservationHtml(characters) {
  return document('Independent Blinded Form B — Blank Preparation Template', `<p>No specimen is assigned in this package. The coordinator must supply genuine coded material through the website. This package intentionally contains no AI answers, rule cards, genus labels or predictions.</p><p>Observer code: ______ Specimen ID: ______ Actual start/end/timezone: ______ Active duration excluding pauses: ______</p>
    <table><tr><th>Character</th><th>Controlled value</th><th>Observation state</th><th>Visual reason / limitation</th></tr>${characters.map(c => `<tr><td>${c.id}<br>${esc(c.name_en)}</td><td></td><td></td><td></td></tr>`).join('')}</table>
    <p>PRESENT / ABSENT / NOT_OBSERVABLE / UNCERTAIN. ABSENT state requires ABSENT/NONE value. A clearly specified negative value may use PRESENT. CHR_21 is non-scoring section context.</p>
    <p>Independent completion declarations: reference hidden ☐ other observer hidden ☐ system/AI predictions hidden ☐ completed independently ☐</p><p>Real expert code, date and digital confirmation: __________________</p>`, false);
}
async function writeArtifacts(output, study, report, integrity, datasets, proposals, playwrightModule) {
  fs.mkdirSync(output, { recursive: true });
  const write = (name, text) => fs.writeFileSync(path.join(output, name), text);
  const json = (name, object) => write(name, JSON.stringify(object, null, 2) + '\n');
  json('V32_Version_Manifest.json', { label: SIMULATION_LABEL, snapshotHash: study.snapshot.hash, ...study.snapshot.manifest });
  json('Data_Integrity_Report.json', integrity); json('Software_Test_Validation_Report.json', report);
  json('S10_Software_Test_Only.json', { dataCategory: 'SOFTWARE_TEST', label: SIMULATION_LABEL, humanValidation: 'NOT CONDUCTED', version: study.snapshot.manifest, report, datasets });
  json('Synthetic_Fixtures.json', study.specimens); json('Simulation_Audit.json', study.audit);
  const rules = frozenRules(study);
  const comparisons = study.ruleIds.map(ruleId => {
    const forms = study.simulationProfiles.map(code => study.forms[`rules:${ruleId}:${code}`]);
    return { dataCategory: 'SOFTWARE_TEST', label: SIMULATION_LABEL, ruleId, genus: rules.find(r => r.rule_key === ruleId).genus,
      AI_SIM_EXP01: forms[0].data.decision, AI_SIM_EXP02: forms[1].data.decision, sameRecommendation: forms[0].data.decision === forms[1].data.decision,
      reason01: forms[0].data.observations, reason02: forms[1].data.observations, humanVerified: false };
  });
  write('Rule_Review_Comparison.csv', csv(comparisons));
  const observationRows = study.specimens.flatMap(p => frozenCharacters(study).map(c => {
    const a = study.forms[`specimens:${p.id}:AI_SIM_EXP01`].data.observations[c.id], b = study.forms[`specimens:${p.id}:AI_SIM_EXP02`].data.observations[c.id];
    return { dataCategory: 'SOFTWARE_TEST', label: SIMULATION_LABEL, fixtureId: p.fixtureId, specimenCode: p.id, character: c.id,
      value01: a.value, state01: a.state, reason01: a.comment, value02: b.value, state02: b.state, reason02: b.comment,
      source: 'Synthetic_Fixtures.json', simulatedTiming: true, physicalFossil: false };
  }));
  write('Specimen_Observation_Comparison.csv', csv(observationRows));
  const { chromium } = require(playwrightModule || 'playwright');
  const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
  const pdfs = [];
  try {
    const page = await browser.newPage(); await page.route('**/*', route => route.abort());
    const pdf = async (name, html, simulated = true) => {
      await page.setContent(html, { waitUntil: 'load' });
      const watermark = simulated ? SIMULATION_LABEL : 'PREPARATION ONLY — HUMAN VALIDATION NOT CONDUCTED';
      await page.pdf({ path: path.join(output, name), format: 'A4', printBackground: true, displayHeaderFooter: true,
        margin: { top: '20mm', bottom: '20mm', left: '14mm', right: '14mm' },
        headerTemplate: `<div style="font:8px Arial;width:100%;text-align:center;color:#744400">${esc(watermark)}</div>`,
        footerTemplate: '<div style="font:8px Arial;width:100%;text-align:center">GeoKnow · <span class="pageNumber"></span> / <span class="totalPages"></span></div>' });
      pdfs.push({ file: name, expectedPageLabel: watermark });
    };
    for (const profile of study.simulationProfiles) {
      json(`${profile}.json`, datasets[profile]);
      json(`${profile}_Rule_Proposals.json`, { dataCategory: 'SOFTWARE_TEST', label: SIMULATION_LABEL, proposals: proposals.filter(p => p.profileId === profile) });
      for (const kind of ['rules', 'specimens']) {
        const name = `${profile}_Form_${kind === 'rules' ? 'A' : 'B'}`;
        const html = formsHtml(study, profile, kind); write(`${name}.html`, html); await pdf(`${name}.pdf`, html);
      }
    }
    let html = reportHtml(report);
    html = html.replace('<body>', `<body><p>${esc(SIMULATION_LABEL)}</p>`);
    write('Software_Test_Validation_Report.html', html); await pdf('Software_Test_Validation_Report.pdf', html);
    const instructions = humanInstructions(); write('Human_Expert_Review_Instructions.html', instructions); await pdf('Human_Expert_Review_Instructions.pdf', instructions, false);
  } finally { await browser.close(); }
  const rulePackage = path.join(output, 'human-rule-review'), blindPackage = path.join(output, 'independent-blinded-observation');
  fs.mkdirSync(rulePackage, { recursive: true }); fs.mkdirSync(blindPackage, { recursive: true });
  const savePackageJson = (directory, name, value) => fs.writeFileSync(path.join(directory, name), JSON.stringify(value, null, 2) + '\n');
  fs.copyFileSync(path.join(output, 'Human_Expert_Review_Instructions.pdf'), path.join(rulePackage, 'Human_Expert_Review_Instructions.pdf'));
  savePackageJson(rulePackage, 'Original_Frozen_Rule_Cards.json', rules.filter(r => study.ruleIds.includes(r.rule_key)));
  savePackageJson(rulePackage, 'AI_Drafts_UNVERIFIED.json', { label: SIMULATION_LABEL, dataCategory: 'SOFTWARE_TEST', proposals });
  fs.writeFileSync(path.join(rulePackage, 'WITHHOLD_UNTIL_FORM_B_FINAL.txt'), 'Provide this package only after all relevant independent Form B submissions are final. Every AI draft needs explicit per-rule human review. This package contains no human approvals.\n');
  savePackageJson(rulePackage, 'Blank_Human_Review_Record.json', { status: 'NOT CONDUCTED', targetDataCategory: 'AI_ASSISTED_REVIEW', humanReview: { action: null, correction: null, supportingEvidence: null, reviewerCode: null, approvedAt: null, completedByHuman: false }, originalDraftHash: null, ruleId: null });
  fs.writeFileSync(path.join(blindPackage, 'Blank_Form_B.html'), blankObservationHtml(frozenCharacters(study)));
  savePackageJson(blindPackage, 'Controlled_Character_Vocabulary.json', { characters: frozenCharacters(study), schemaVersion: study.snapshot.manifest.schemaVersion });
  savePackageJson(blindPackage, 'Blank_Independent_Observation.json', { status: 'NOT CONDUCTED', targetDataCategory: 'INDEPENDENT_HUMAN_OBSERVATION', observerCode: null, specimenId: null,
    observations: Object.fromEntries(frozenCharacters(study).map(c => [c.id, { value: null, state: null, comment: '' }])) });
  fs.writeFileSync(path.join(blindPackage, 'MATERIALS_NOT_ASSIGNED.txt'), 'Preparation template only. No physical fossils, images or completed observations are included. Assign real coded material through /expert-validation. Do not distribute AI simulation answers, rule proposals, reference genera or engine results to independent observers.\n');
  const zip = (folder, target) => {
    const python = "from pathlib import Path;from zipfile import ZipFile,ZIP_DEFLATED;import sys;root=Path(sys.argv[1]);out=Path(sys.argv[2]);z=ZipFile(out,'w',ZIP_DEFLATED);[(z.write(p,p.relative_to(root).as_posix())) for p in sorted(root.rglob('*')) if p.is_file()];z.close()";
    const result = spawnSync('python', ['-c', python, folder, path.join(output, target)], { encoding: 'utf8' }); fail(result.status === 0, 'ZIP packaging failed');
  };
  zip(rulePackage, 'Human_Expert_Rule_Review_Package.zip'); zip(blindPackage, 'Independent_Blinded_Observation_Package.zip');
  json('Artifact_Validation_Plan.json', { pdfs, prohibitedBlindPackageContent: ['AI_SIM_EXP01', 'AI_SIM_EXP02', 'referenceGenus', 'Borelis', 'Alveolina', 'ranking', 'predictions'],
    requiredArtifacts: ['AI_SIM_EXP01_Form_A.pdf', 'AI_SIM_EXP02_Form_A.pdf', 'AI_SIM_EXP01_Form_B.pdf', 'AI_SIM_EXP02_Form_B.pdf', 'AI_SIM_EXP01.json', 'AI_SIM_EXP02.json', 'Rule_Review_Comparison.csv', 'Specimen_Observation_Comparison.csv', 'Software_Test_Validation_Report.pdf', 'Data_Integrity_Report.json', 'V32_Version_Manifest.json', 'Human_Expert_Review_Instructions.pdf', 'Human_Expert_Rule_Review_Package.zip', 'Independent_Blinded_Observation_Package.zip'] });
  const hashes = fs.readdirSync(output).filter(n => fs.statSync(path.join(output, n)).isFile()).map(n => `${digest(fs.readFileSync(path.join(output, n)))}  ${n}`).join('\n');
  write('SHA256SUMS.txt', hashes + '\n');
  write('index.html', document('GeoKnow — Downloadable Validation Preparation Outputs', `<p>${esc(SIMULATION_LABEL)}</p><p>Independent human observations and approvals: NOT CONDUCTED. No physical specimens were created or evaluated.</p><ul>${fs.readdirSync(output).filter(n => fs.statSync(path.join(output, n)).isFile() && n !== 'index.html').map(n => `<li><a href="${encodeURIComponent(n)}">${esc(n)}</a></li>`).join('')}</ul>`));
}
module.exports = { writeArtifacts, humanInstructions, blankObservationHtml };
