// Optional integration test against an EMPTY, DISPOSABLE local Neo4j instance.
// No application .env is read. A fixed private test port prevents use of the
// research database. All test fixtures are explicitly marked SOFTWARE_TEST.
const assert = require('node:assert/strict');
const path = require('node:path'), fs = require('node:fs'), crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const neo4j = require('neo4j-driver');
const { Neo4jValidationStore } = require('../src/validation/store');
const { ValidationAuth } = require('../src/validation/auth');
const { ValidationService } = require('../src/validation/service');
const { sanitizeImage } = require('../src/validation/images');
const { characters } = require('../data/characters.json');
const { A_DECLARATIONS, B_DECLARATIONS } = require('../src/validation/validators');
const uri = process.env.VALIDATION_TEST_NEO4J_URI;
assert.equal(uri, 'bolt://127.0.0.1:18687', 'Use only the dedicated disposable test instance on port 18687');
const testPassword = `Software-${crypto.randomBytes(16).toString('hex')}`;
const root = path.resolve(__dirname, '../..');
const output = path.join(root, '.tmp/expert-validation');
const declarations = keys => Object.fromEntries(keys.map(k => [k, true]));
const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', testPassword));
async function main() {
  const inspect = driver.session();
  try { assert.equal((await inspect.run('MATCH (n) RETURN count(n) AS n')).records[0].get('n').toNumber(), 0, 'Test requires a fresh empty database'); }
  finally { await inspect.close(); }
  const store = new Neo4jValidationStore(driver); await store.init();
  const auth = new ValidationAuth(store), admin = await auth.createAdmin('software-test-admin', testPassword);
  let time = Date.now(); const service = new ValidationService(store, { clock: () => time });
  const { id } = await service.create({ title: 'SOFTWARE TEST — actual isolated Neo4j', purpose: 'SOFTWARE_TEST', cohort: 'PILOT', reviewScope: 'SUBSET', ruleIds: ['Borelis_M1'], selectionCriteria: 'SOFTWARE TEST ONLY' }, admin);
  const actors = [];
  for (const code of ['EXP01', 'EXP02']) { const invite = await service.invite(id, code, admin); actors.push((await auth.redeem(invite.token, testPassword)).user); }
  await service.addSpecimen(id, { id: 'P001', sourceId: 'SOFTWARE-TEST-FOSSIL', clusterId: 'SOFTWARE-TEST-CLUSTER', independenceConfirmed: true, blindingConfirmed: true, realMaterialConfirmed: true }, admin);
  const source = await require('sharp')({ create: { width: 4, height: 4, channels: 3, background: '#887766' } }).png().toBuffer();
  const image = await sanitizeImage(source.toString('base64')); const view = await service.upload(id, 'P001', image, admin);
  await service.advance(id, { deviations: 'SOFTWARE TEST ONLY' }, admin);
  // Database write lock serializes competing revisions across independent
  // service instances; a failed transaction rolls back its draft and audit.
  const b = { observations: Object.fromEntries(characters.map(c => [c.id, { value: null, state: 'NOT_OBSERVABLE' }])), quality: 'GOOD', materialMode: 'digital', declarations: declarations(B_DECLARATIONS) };
  const secondService = new ValidationService(new Neo4jValidationStore(driver), { clock: () => time });
  const outcomes = await Promise.allSettled([service.save(id, 'specimens', 'P001', { revision: 0, data: b }, actors[0]), secondService.save(id, 'specimens', 'P001', { revision: 0, data: b }, actors[0])]);
  assert.equal(outcomes.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(outcomes.filter(r => r.status === 'rejected').length, 1);
  for (const actor of actors) {
    await service.timer(id, 'P001', 'start', actor); time += 1000;
    const current = await service.getForm(id, 'specimens', 'P001', actor);
    await service.save(id, 'specimens', 'P001', { revision: current.revision, data: b, submit: true }, actor);
  }
  await service.advance(id, {}, admin);
  for (const actor of actors) {
    await service.save(id, 'rules', 'Borelis_M1', { revision: 0, submit: true, data: { decision: 'APPROVE', evidence: 'APPROPRIATE', mapping: 'CORRECT', literatureStrength: 'MISSING', declarations: declarations(A_DECLARATIONS) } }, actor);
    await service.save(id, 'summary', 'review', { revision: 0, submit: true, data: { institution: 'SOFTWARE TEST', expertise: 'SOFTWARE TEST', developmentRelationship: 'SOFTWARE TEST', sourcesUsed: 'SOFTWARE TEST', declarations: declarations(A_DECLARATIONS) } }, actor);
  }
  await service.reference(id, 'P001', { genus: 'Borelis', verified: true, verifierCode: 'REF01', independentVerification: true, evidence: 'SOFTWARE TEST ONLY' }, admin);
  await service.advance(id, {}, admin);
  const before = await service.report(id, admin);
  const locked = await service.locked(id, admin); fs.mkdirSync(output, { recursive: true });
  const archive = path.join(output, 'private-software-test-reproduction.json');
  fs.writeFileSync(archive, JSON.stringify({ format: 'GEOKNOW-PRIVATE-REPRODUCTION-1', study: locked }));
  const cli = (args, input) => spawnSync(process.execPath, [path.join(root, 'api/scripts/validation-admin.js'), ...args], { cwd: path.join(root, 'api'), input, encoding: 'utf8', env: { ...process.env, NEO4J_URI: uri, NEO4J_USERNAME: 'neo4j', NEO4J_USER: 'neo4j', NEO4J_PASSWORD: testPassword, VALIDATION_NEO4J_DATABASE: 'neo4j' } });
  const offline = cli(['analyze-archive', archive]); assert.equal(offline.status, 0, offline.stderr);
  // dotenv's normal startup notice can precede stdout; parse the actual JSON.
  const reproduced = JSON.parse(offline.stdout.slice(offline.stdout.indexOf('{'))); assert.deepEqual(reproduced, JSON.parse(JSON.stringify(before)));
  const backup = path.join(output, `test-${crypto.randomUUID()}.validation-backup.json`);
  const saved = cli(['backup', backup], testPassword); assert.equal(saved.status, 0, saved.stderr);
  assert.ok(!fs.readFileSync(backup, 'utf8').includes('SOFTWARE-TEST-FOSSIL'));
  const refused = cli(['restore-empty', backup], testPassword); assert.equal(refused.status, 1); assert.match(refused.stderr, /empty validation database/);
  const cleanup = driver.session();
  try { await cleanup.run('MATCH (n:EVRecord) DELETE n'); } finally { await cleanup.close(); }
  const wrongPassword = cli(['restore-empty', backup], 'wrong-test-passphrase'); assert.equal(wrongPassword.status, 1);
  const restored = cli(['restore-empty', backup], testPassword); assert.equal(restored.status, 0, restored.stderr);
  const after = await service.report(id, admin); assert.deepEqual(JSON.parse(JSON.stringify(after)), JSON.parse(JSON.stringify(before)));
  assert.equal((await service.image(id, 'P001', view.id, actors[0])).sha256, view.sha256);
  console.log(JSON.stringify({ passed: true, scope: 'SOFTWARE TEST ONLY; fresh disposable local Neo4j; no research database accessed', checks: ['schema migration', 'secure account persistence', 'transactional concurrent drafts', 'private image persistence', 'complete Form B / Form A / reference flow', 'sealed report', 'offline identical report', 'encrypted backup', 'refuse nonempty restore', 'reject wrong encryption key', 'restore identical report and image'] }));
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => driver.close());
