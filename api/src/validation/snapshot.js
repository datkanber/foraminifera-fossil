const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { digest, fail } = require('./common');
const root = path.resolve(__dirname, '../../..');
const dataFiles = ['characters.json', 'rule_chr_mapping.json', 'genera_agglutinated.json', 'genera_porcelaneous.json', 'genera_hyaline.json', 'taxonomic_validation.json', 'expert_validation_schema.json', 'decision_tree_agglutinated.json', 'decision_tree_porcelaneous.json', 'decision_tree_hyaline.json'];
function createSnapshot() {
  const files = {};
  for (const name of dataFiles) files[`api/data/${name}`] = fs.readFileSync(path.join(root, 'api/data', name), 'utf8');
  for (const name of ['foram_ontology_v1.owl', 'api/src/services/scoring.js', 'api/src/validation/analysis.js', 'api/src/validation/validators.js', 'api/src/validation/provenance.js',
    'api/src/validation/simulation.js', 'api/src/validation/simulationProfiles.js', 'api/src/validation/simulationArtifacts.js', 'api/src/validation/snapshot.js',
    'api/src/validation/service.js', 'api/src/validation/auth.js', 'api/src/validation/routes.js', 'api/src/validation/common.js',
    'api/scripts/run-validation-simulation.js', 'api/scripts/staging-validation.js', 'api/package.json', 'api/package-lock.json',
    'client/src/assets/scs/revision_v32/audit_v32.txt', 'eval/results/v32/sources/Sirel1986_Pseudolacazina.pdf.txt',
    'eval/engine_bridge.cjs', 'eval/expert_comparison.py', 'eval/validate_expert_simulation_artifacts.py', 'eval/integrate_expert_validation_manuscript.py']) {
    files[name] = fs.readFileSync(path.join(root, name), 'utf8');
  }
  let commit = process.env.VALIDATION_GIT_COMMIT;
  let sourceState = commit ? 'DECLARED_DEPLOYMENT_COMMIT' : 'COMMITTED_CHECKOUT';
  if (!commit) { try { commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { /* deployment must supply it */ } }
  if (!process.env.VALIDATION_GIT_COMMIT) {
    try { if (execFileSync('git', ['status', '--porcelain', '--', 'api', 'eval', 'client/src/components/expert', 'client/src/pages/ExpertValidation.js'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()) sourceState = 'UNCOMMITTED_WORKTREE'; }
    catch { sourceState = 'SOURCE_STATE_UNVERIFIED'; }
  }
  fail(/^[a-f0-9]{40}$/.test(commit || ''), 'Set VALIDATION_GIT_COMMIT to the full source Git commit before creating a study');
  const characters = JSON.parse(files['api/data/characters.json']);
  const rules = JSON.parse(files['api/data/rule_chr_mapping.json']);
  fail(characters.characters.length === 21 && rules.length === 708 && new Set(rules.map(r => r.genus)).size === 75,
    'Current source is not the expected v32 vocabulary/rule inventory');
  const manifest = { softwareVersion: 'v32', schemaVersion: 'geoknow-independent-2', gitCommit: commit, sourceState,
    ontology: { file: 'foram_ontology_v1.owl', contentSha256: digest(files['foram_ontology_v1.owl']), versionPolicy: 'Exact content is frozen; v32 is the manuscript release, not a relabeling of the OWL internal version.' },
    vocabularyVersion: characters.meta.version, ruleCount: rules.length, genusCount: 75,
    files: Object.fromEntries(Object.entries(files).map(([name, body]) => [name, digest(body)])),
    scoring: { weights: { MANDATORY: 3, DIAGNOSTIC: 5, SUPPORTING: 1, CONTRADICTORY: -5 }, tauObs: 2, tauNoMatch: 3, delta: 1 },
    analysis: { bootstrapReplicates: 5000, seed: 20261112, unit: 'specimen/source-cluster', tieCredit: 'uniform', baseline: 'B1 observed M/D elimination, all survivors tied' } };
  return { manifest, hash: digest(manifest), files };
}
function verifySnapshot(snapshot) {
  fail(snapshot.hash === digest(snapshot.manifest), 'Version manifest integrity check failed', 409);
  for (const [name, hash] of Object.entries(snapshot.manifest.files)) fail(typeof snapshot.files[name] === 'string' && digest(snapshot.files[name]) === hash, `Frozen source changed: ${name}`, 409);
}
function loadFrozen(snapshot, name) {
  verifySnapshot(snapshot);
  const sandbox = { module: { exports: {} } };
  new vm.Script(snapshot.files[name], { filename: `frozen/${name}` }).runInNewContext(sandbox, { timeout: 1000 });
  return sandbox.module.exports;
}
const frozenCharacters = study => JSON.parse(study.snapshot.files['api/data/characters.json']).characters;
const frozenRules = study => JSON.parse(study.snapshot.files['api/data/rule_chr_mapping.json']);
module.exports = { createSnapshot, verifySnapshot, loadFrozen, frozenCharacters, frozenRules };
