#!/usr/bin/env node
// Local staging only. Never reads the existing application's .env, never
// selects a production URI, and imports ontology only into a proven empty DB.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), crypto = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');
const neo4j = require('neo4j-driver');
const { fail, digest } = require('../src/validation/common');
const { Neo4jValidationStore } = require('../src/validation/store');
const { ValidationAuth } = require('../src/validation/auth');
const root = path.resolve(__dirname, '../..');
const directory = path.join(root, '.tmp/expert-validation-staging');
const stateFile = path.join(directory, 'state.json');
const uri = 'bolt://127.0.0.1:18689', origin = 'http://127.0.0.1:3189';
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
function environment() {
  return { ...process.env, NODE_ENV: 'development', NEO4J_URI: uri, NEO4J_USERNAME: 'neo4j', NEO4J_USER: 'neo4j',
    NEO4J_PASSWORD: crypto.randomBytes(32).toString('base64url'), VALIDATION_NEO4J_DATABASE: 'neo4j',
    VALIDATION_APP_ORIGIN: origin, VALIDATION_TRUST_PROXY_HOPS: '0' };
}
const connect = () => neo4j.driver(uri, neo4j.auth.basic('neo4j', crypto.randomBytes(32).toString('hex')), { connectionTimeout: 2000, maxTransactionRetryTime: 0 });
function loadState() {
  const s = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  fail(s.environment === 'LOCAL_STAGING' && s.uri === uri && s.origin === origin && path.resolve(s.directory) === directory, 'Staging ownership or path check failed');
  return s;
}
function cli(args, input) {
  const result = spawnSync(process.execPath, [path.join(__dirname, 'validation-admin.js'), ...args], { cwd: path.join(root, 'api'), env: environment(), input, encoding: 'utf8', windowsHide: true });
  fail(result.status === 0, `Staging CLI ${args[0]} failed: ${result.stderr || 'no details'}`);
  return result;
}
async function graphReceipt(driver) {
  const session = driver.session();
  try {
    const nodes = await session.run('MATCH (n) WHERE NOT n:EVRecord AND NOT n:EVMutex RETURN labels(n) AS labels, properties(n) AS properties');
    const edges = await session.run('MATCH (a)-[r]->(b) WHERE NOT a:EVRecord AND NOT b:EVRecord RETURN type(r) AS type, properties(r) AS properties, properties(a) AS from, properties(b) AS to');
    const inventory = await session.run('MATCH (n) WHERE NOT n:EVRecord AND NOT n:EVMutex RETURN labels(n) AS labels, count(*) AS count');
    const normalize = rows => rows.map(r => JSON.stringify(r.toObject())).sort();
    return { sha256: digest({ nodes: normalize(nodes.records), relationships: normalize(edges.records) }), inventory: inventory.records.map(r => ({ labels: r.get('labels'), count: r.get('count').toNumber() })) };
  } finally { await session.close(); }
}
async function setup() {
  fs.mkdirSync(directory, { recursive: true });
  let state = fs.existsSync(stateFile) ? loadState() : { environment: 'LOCAL_STAGING', directory, uri, origin, instanceId: crypto.randomUUID(), createdAt: new Date().toISOString() };
  let driver = connect(), available = false;
  try { await driver.verifyConnectivity(); available = true; } catch { /* start only our dedicated instance */ }
  if (!available) {
    await driver.close();
    const cache = path.join(os.homedir(), '.Neo4jDesktop2/Cache');
    fail(fs.existsSync(cache), 'Neo4j Desktop runtime unavailable; provision a dedicated local instance before setup');
    const runtime = fs.readdirSync(path.join(cache, 'runtime')).filter(n => /21\./.test(n)).map(n => path.join(cache, 'runtime', n, 'bin', 'java.exe')).find(fs.existsSync);
    const distribution = fs.readdirSync(path.join(cache, 'dbmss')).map(n => path.join(cache, 'dbmss', n)).find(p => fs.existsSync(path.join(p, 'lib')));
    const classes = path.join(root, '.tmp/v32_classes');
    fail(runtime && distribution && fs.existsSync(path.join(classes, 'V32Neo4j.class')), 'Local Java/Neo4j or compiled eval/V32Neo4j.java helper is unavailable');
    const dbRoot = path.join(directory, 'database'); fs.mkdirSync(path.join(dbRoot, 'conf'), { recursive: true });
    const config = path.join(dbRoot, 'conf/neo4j.conf');
    fs.writeFileSync(config, 'server.default_listen_address=127.0.0.1\nserver.bolt.listen_address=127.0.0.1:18689\nserver.http.enabled=false\nserver.https.enabled=false\ndbms.security.auth_enabled=false\ninitial.dbms.default_database=neo4j\nserver.memory.pagecache.size=64m\nserver.config.strict_validation.enabled=true\ndbms.usage_report.enabled=false\n');
    const log = fs.openSync(path.join(directory, 'neo4j.log'), 'a');
    const child = spawn(runtime, ['-Xmx512m', '-cp', `${path.join(distribution, 'lib', '*')}${path.delimiter}${classes}`, 'V32Neo4j', dbRoot, config],
      { cwd: root, detached: true, windowsHide: true, stdio: ['ignore', log, log] });
    child.unref(); fs.closeSync(log); state.javaPid = child.pid; fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
    driver = connect();
    for (let attempt = 0; attempt < 60; attempt++) {
      try { await driver.verifyConnectivity(); available = true; break; } catch { await pause(500); }
    }
    fail(available, 'Dedicated staging Neo4j did not become ready; inspect its local log');
  }
  try {
    if (state.migration?.applied) {
      const marker = await new Neo4jValidationStore(driver).read(tx => tx.get('staging-metadata', 'environment'));
      fail(marker?.instanceId === state.instanceId && marker.environment === 'LOCAL_STAGING', 'Staging database ownership marker mismatch; no migrations attempted');
    }
    let before = await graphReceipt(driver);
    if (!before.inventory.length && !state.ontologyImported) {
      const importResult = spawnSync(process.execPath, [path.join(root, 'api/import_ontology.js')], { cwd: path.join(root, 'api'), env: environment(), encoding: 'utf8', windowsHide: true });
      fs.writeFileSync(path.join(directory, 'ontology-import.log'), importResult.stdout + importResult.stderr);
      fail(importResult.status === 0, 'Import into the proven-empty staging DB failed'); state.ontologyImported = true; before = await graphReceipt(driver);
    } else fail(state.ontologyImported === true, 'Refusing to initialize an unrecognized nonempty database on the staging port');
    cli(['migrate']); const afterFirst = await graphReceipt(driver); cli(['migrate']); const afterSecond = await graphReceipt(driver);
    fail(before.sha256 === afterFirst.sha256 && before.sha256 === afterSecond.sha256, 'Ontology changed during validation migration');
    const store = new Neo4jValidationStore(driver), auth = new ValidationAuth(store);
    let admin = await store.read(async tx => { const entry = await tx.get('login', 'staging-coordinator'); return entry ? tx.get('user', entry.userId) : null; });
    if (!admin) {
      const password = crypto.randomBytes(32).toString('base64url'); cli(['create-admin', 'staging-coordinator'], password);
      const signedIn = await auth.login('staging-coordinator', password); fail(signedIn.user.role === 'COORDINATOR', 'Coordinator authentication failed');
      await store.transaction(tx => tx.remove('session', digest(signedIn.token)));
      state.coordinator = { login: 'staging-coordinator', status: 'CREATED_AND_AUTHENTICATED', passwordRetained: false, userPasswordSetupRequired: true };
    }
    state.migration = { applied: true, idempotencyVerified: true, ontologyBeforeSha256: before.sha256, ontologyAfterSha256: afterSecond.sha256, inventory: afterSecond.inventory };
    await store.transaction(tx => tx.put('staging-metadata', 'environment', { instanceId: state.instanceId, environment: 'LOCAL_STAGING', uri }));
    const health = await fetch(`${origin}/api/health`, { signal: AbortSignal.timeout(1500) }).then(r => r.ok).catch(() => false);
    if (!health) {
      const log = fs.openSync(path.join(directory, 'web.log'), 'a');
      const child = spawn(process.execPath, [__filename, 'serve'], { cwd: root, env: environment(), detached: true, windowsHide: true, stdio: ['ignore', log, log] });
      child.unref(); fs.closeSync(log); state.webPid = child.pid;
      for (let i = 0; i < 30; i++) { if (await fetch(`${origin}/expert-validation`, { signal: AbortSignal.timeout(1000) }).then(r => r.ok).catch(() => false)) break; await pause(250); }
    }
    state.localWebReady = await fetch(`${origin}/expert-validation`, { signal: AbortSignal.timeout(2000) }).then(r => r.ok).catch(() => false);
    state.note = 'Local loopback-only staging. Neo4j transport auth disabled on this isolated local instance; web accounts remain authenticated. Never use this configuration remotely.';
    fs.writeFileSync(stateFile, JSON.stringify(state, null, 2)); console.log(JSON.stringify(state));
  } finally { await driver.close(); }
}
async function serve() {
  fail(process.env.NEO4J_URI === uri && process.env.VALIDATION_APP_ORIGIN === origin, 'Staging server environment mismatch');
  const express = require('express'), app = require('../src/app');
  app.use(express.static(path.join(root, 'client/dist')));
  app.get('/{*path}', (req, res) => res.sendFile(path.join(root, 'client/dist/index.html')));
  app.listen(3189, '127.0.0.1', () => console.log('GeoKnow local staging ready on loopback port 3189.'));
}
async function prepareHuman(output) {
  const state = loadState(); fail(state.localWebReady, 'Run local staging setup first');
  const driver = connect();
  try {
    const store = new Neo4jValidationStore(driver), service = new (require('../src/validation/service').ValidationService)(store);
    const user = await store.read(async tx => { const login = await tx.get('login', 'staging-coordinator'); return tx.get('user', login.userId); });
    const proposals = ['AI_SIM_EXP01', 'AI_SIM_EXP02'].flatMap(code => JSON.parse(fs.readFileSync(path.join(output, `${code}_Rule_Proposals.json`), 'utf8')).proposals);
    const study = await service.create({ title: 'Human evaluation preparation — NOT CONDUCTED', purpose: 'RESEARCH', cohort: 'PILOT', ruleReviewMode: 'AI_ASSISTED', reviewScope: 'SUBSET', ruleIds: [...new Set(proposals.map(p => p.ruleId))],
      selectionCriteria: 'Declared AI-assisted rule review after independent blinded Form B. Real material and participants remain unassigned.' }, user);
    for (const proposal of proposals) await service.addProposal(study.id, proposal, user);
    for (const code of ['EXP01', 'EXP02']) await service.invite(study.id, code, user); // Raw tokens deliberately discarded, never logged.
    const view = await service.get(study.id, user);
    const receipt = { environment: 'LOCAL_STAGING', studyId: study.id, phase: view.phase, ruleReviewMode: view.ruleReviewMode,
      sourceSnapshotHash: view.snapshotHash, proposalsRegistered: view.aiProposals.length, invitationGenerationVerified: true,
      rawInvitationTokensRetained: false, actualExpertsEnrolled: 0, actualSpecimensAssigned: 0, independentHumanObservation: 'NOT CONDUCTED',
      aiAssistedHumanApproval: 'NOT CONDUCTED', remaining: ['Actual experts and qualifications', 'Real independently sourced coded material', 'Separate reference verification', 'Coordinator interactive password setup'] };
    fs.writeFileSync(path.join(output, 'Human_Workflow_Readiness.json'), JSON.stringify(receipt, null, 2)); console.log(JSON.stringify(receipt));
  } finally { await driver.close(); }
}
async function main() {
  const [command = 'setup', argument] = process.argv.slice(2);
  if (command === 'setup') await setup();
  else if (command === 'serve') await serve();
  else if (command === 'status') console.log(JSON.stringify(loadState()));
  else if (command === 'set-password') {
    loadState(); const child = spawn(process.execPath, [path.join(__dirname, 'validation-admin.js'), 'set-admin-password', 'staging-coordinator'], { cwd: path.join(root, 'api'), env: environment(), stdio: 'inherit', windowsHide: true });
    child.on('exit', code => { process.exitCode = code || 0; });
  } else if (command === 'prepare-human') { fail(argument, 'Provide the simulation output directory'); await prepareHuman(path.resolve(argument)); }
  else fail(false, 'Commands: setup, serve, status, set-password, prepare-human <simulation-output>');
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { graphReceipt };
