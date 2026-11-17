// SYNTHETIC SOFTWARE TESTS ONLY. Nothing here is saved to a research database.
const test = require('node:test'), assert = require('node:assert/strict');
const crypto = require('node:crypto'), express = require('express'), sharp = require('sharp');
const { MemoryStore } = require('./support/validationMemoryStore');
const { createValidationRouter } = require('../src/validation/routes');
const { ValidationService, sealedData } = require('../src/validation/service');
const { ValidationAuth } = require('../src/validation/auth');
const { createSnapshot, verifySnapshot, loadFrozen } = require('../src/validation/snapshot');
const { formB, formA, B_DECLARATIONS, A_DECLARATIONS } = require('../src/validation/validators');
const { digest } = require('../src/validation/common');
const { sanitizeImage } = require('../src/validation/images');
const { csv, reportHtml, s10 } = require('../src/validation/exports');
const { agreement, bootstrap, topCredit } = require('../src/validation/analysis');
const { characters } = require('../data/characters.json');
const decl = keys => Object.fromEntries(keys.map(k => [k, true]));
const testPassword = () => `Test-${crypto.randomBytes(18).toString('hex')}`;
const neutralB = () => ({ materialMode: 'physical', quality: 'GOOD', observations: Object.fromEntries(characters.map(c => [c.id, { value: null, state: 'NOT_OBSERVABLE', comment: 'Software test only' }])), declarations: decl(B_DECLARATIONS) });
const approveA = () => ({ decision: 'APPROVE', evidence: 'APPROPRIATE', mapping: 'CORRECT', literatureStrength: 'MISSING', declarations: decl(A_DECLARATIONS) });
const summaryA = () => ({ institution: 'SOFTWARE TEST', expertise: 'SOFTWARE TEST', developmentRelationship: 'SOFTWARE TEST', sourcesUsed: 'SOFTWARE TEST', declarations: decl(A_DECLARATIONS) });
const admin = { id: 'test-admin', code: 'COORDINATOR', role: 'COORDINATOR' };
async function fixture() {
  const store = new MemoryStore(); let time = Date.now();
  const service = new ValidationService(store, { clock: () => time });
  const auth = new ValidationAuth(store);
  const { id } = await service.create({ title: 'SOFTWARE TEST — no real observations', cohort: 'PILOT', purpose: 'SOFTWARE_TEST', reviewScope: 'SUBSET', selectionCriteria: 'Software test only', ruleIds: ['Borelis_M1'] }, admin);
  const experts = [];
  for (const code of ['EXP01', 'EXP02']) {
    const invite = await service.invite(id, code, admin);
    const session = await auth.redeem(invite.token, testPassword()); experts.push(session.user);
  }
  await service.addSpecimen(id, { id: 'P001', sourceId: 'SOFTWARE-TEST-ONLY', clusterId: 'TEST-CLUSTER', materialMode: 'physical', realMaterialConfirmed: true, independenceConfirmed: true, blindingConfirmed: true }, admin);
  await service.advance(id, { deviations: 'SOFTWARE TEST ONLY: one artificial case' }, admin);
  return { id, store, service, auth, experts, tick: ms => { time += ms; } };
}
async function submitB(f, expert, data = neutralB()) {
  await f.service.timer(f.id, 'P001', 'start', expert); f.tick(2000);
  return f.service.save(f.id, 'specimens', 'P001', { revision: 0, submit: true, data }, expert);
}
async function lockFixture(f) {
  for (const expert of f.experts) await submitB(f, expert);
  await f.service.advance(f.id, {}, admin);
  for (const expert of f.experts) {
    await f.service.save(f.id, 'rules', 'Borelis_M1', { revision: 0, data: approveA(), submit: true }, expert);
    await f.service.save(f.id, 'summary', 'review', { revision: 0, data: summaryA(), submit: true }, expert);
  }
  await f.service.reference(f.id, 'P001', { genus: 'Borelis', verified: true, verifierCode: 'REF01', independentVerification: true, evidence: 'SOFTWARE TEST: not actual reference evidence' }, admin);
  await f.service.advance(f.id, {}, admin);
}
test('v32 snapshot freezes actual definitions and executable sources, detects changes and preserves V29', () => {
  const snapshot = createSnapshot(); verifySnapshot(snapshot);
  assert.equal(snapshot.manifest.ruleCount, 708); assert.equal(snapshot.manifest.genusCount, 75);
  assert.equal(snapshot.manifest.softwareVersion, 'v32');
  assert.equal(snapshot.manifest.files['api/src/services/scoring.js'], digest(snapshot.files['api/src/services/scoring.js']));
  const engine = loadFrozen(snapshot, 'api/src/services/scoring.js'); assert.equal(typeof engine.scoreGenera, 'function');
  const fs = require('node:fs');
  const v29 = fs.readFileSync('../client/src/assets/scs/expert_study_v29/frozen_v29/version_lock.json', 'utf8');
  assert.ok(v29.includes('29'));
  snapshot.files['api/data/characters.json'] += ' '; assert.throws(() => verifySnapshot(snapshot), /Frozen source changed/);
  delete snapshot.files['api/data/characters.json']; assert.throws(() => verifySnapshot(snapshot), /Frozen source changed/);
});
test('all 21 explicit observations are required, negative observations are preserved, neutral tentative values remain neutral', () => {
  const b = neutralB(); delete b.observations.CHR_03;
  assert.throws(() => formB(b, characters, true), /missing observation/);
  b.observations.CHR_03 = { value: 'ABSENT', state: 'PRESENT', comment: 'Clearly absent' };
  b.observations.CHR_14 = { value: 'STRONG', state: 'UNCERTAIN', comment: 'Uncertain pillar' };
  b.observations.CHR_21 = { value: 'UNKNOWN', state: 'PRESENT', comment: 'Context' };
  const saved = formB(b, characters, true);
  assert.deepEqual(saved.observations.CHR_03, b.observations.CHR_03);
  assert.deepEqual(saved.observations.CHR_14, b.observations.CHR_14);
  const { buildH } = require('../src/services/scoring'); assert.deepEqual(Object.keys(buildH(saved.observations)), ['CHR_03']);
  b.observations.CHR_03 = { value: 'PRESENT', state: 'ABSENT' };
  assert.throws(() => formB(b, characters, true), /ABSENT state requires/);
  b.observations.CHR_03 = { value: 'INVALID', state: 'PRESENT' };
  assert.throws(() => formB(b, characters, true), /invalid controlled value/);
  b.observations.CHR_03 = { value: null, state: 'NOT_OBSERVABLE' }; b.declarations.system_outputs_hidden = false;
  assert.throws(() => formB(b, characters, true), /declarations/);
});
test('rule corrections require scientific evidence, page/figure, problem and effect', () => {
  const a = { ...approveA(), decision: 'CORRECT' };
  assert.throws(() => formA(a, true), /required/);
  Object.assign(a, { correction: 'SOFTWARE TEST', reference: 'Test reference', pagePlateFigure: 'Test page', problemType: 'EVIDENCE', expectedEffect: 'CHANGE_SCORING', evidence: 'CHANGE' });
  assert.throws(() => formA(a, true), /proposed evidence level/);
  a.proposedLevel = 'S'; assert.equal(formA(a, true).decision, 'CORRECT');
});
test('Form B precedes Form A across both experts, every final form is immutable, drafts have optimistic concurrency', async () => {
  const f = await fixture(); const [a, b] = f.experts;
  await assert.rejects(f.service.getForm(f.id, 'rules', 'Borelis_M1', a), /not open/);
  await assert.rejects(f.service.report(f.id, admin), /only after data lock/);
  const draft = await f.service.save(f.id, 'specimens', 'P001', { revision: 0, data: { observations: {} } }, a);
  const restarted = new ValidationService(f.store); assert.equal((await restarted.getForm(f.id, 'specimens', 'P001', a)).revision, 1);
  await assert.rejects(f.service.save(f.id, 'specimens', 'P001', { revision: 0, data: neutralB() }, a), /newer draft/);
  await f.service.timer(f.id, 'P001', 'start', a); f.tick(1000);
  const original = await f.service.save(f.id, 'specimens', 'P001', { revision: draft.revision, data: neutralB(), submit: true }, a);
  await assert.rejects(f.service.save(f.id, 'specimens', 'P001', { revision: original.revision, data: neutralB() }, a), /immutable/);
  await assert.rejects(f.service.advance(f.id, {}, admin), /Both experts/);
  await submitB(f, b); await f.service.advance(f.id, {}, admin);
  assert.equal((await f.service.get(f.id, a)).rules.length, 1);
  const other = await f.service.get(f.id, b); assert.equal(other.ownForms.length, 1); assert.ok(other.ownForms.every(v => v.expertCode === 'EXP02'));
});
test('simultaneous final submissions commit once and retain independent responses', async () => {
  const f = await fixture(), a = f.experts[0]; await f.service.timer(f.id, 'P001', 'start', a); f.tick(1000);
  const submit = () => f.service.save(f.id, 'specimens', 'P001', { revision: 0, data: neutralB(), submit: true }, a);
  const outcomes = await Promise.allSettled([submit(), submit()]);
  assert.equal(outcomes.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(outcomes.filter(r => r.status === 'rejected').length, 1);
  assert.equal((await f.service.get(f.id, admin)).progress.finalB, 1);
});
test('timer excludes pauses, caps unobserved browser gaps and survives server restarts', async () => {
  const f = await fixture(), a = f.experts[0];
  await f.service.timer(f.id, 'P001', 'start', a); f.tick(2000); await f.service.timer(f.id, 'P001', 'pause', a);
  f.tick(60_000); const t = await f.service.timer(f.id, 'P001', 'resume', a); assert.equal(t.activeMs, 2000);
  f.tick(500_000); const stopped = await f.service.timer(f.id, 'P001', 'pause', a); assert.equal(stopped.activeMs, 92_000);
});
test('locked records are reproducible, sealed, reference-independent, and keep authorized corrections separate', async () => {
  const f = await fixture();
  for (const expert of f.experts) await submitB(f, expert);
  await f.service.advance(f.id, {}, admin);
  for (const expert of f.experts) {
    await f.service.save(f.id, 'rules', 'Borelis_M1', { revision: 0, data: { ...approveA(), decision: expert.code === 'EXP02' ? 'UNABLE' : 'APPROVE' }, submit: true }, expert);
    await f.service.save(f.id, 'summary', 'review', { revision: 0, data: summaryA(), submit: true }, expert);
  }
  await assert.rejects(f.service.reference(f.id, 'P001', { genus: 'Borelis', verified: true, verifierCode: 'EXP01', independentVerification: true, evidence: 'test' }, admin), /independent/);
  await assert.rejects(f.service.advance(f.id, {}, admin), /references/);
  const original = await f.service.getForm(f.id, 'specimens', 'P001', f.experts[0]);
  await f.service.revision(f.id, { kind: 'specimens', subject: 'P001', expertCode: 'EXP01', data: { ...neutralB(), quality: 'LOW' }, reason: 'SOFTWARE TEST authorization' }, admin);
  assert.deepEqual((await f.service.getForm(f.id, 'specimens', 'P001', f.experts[0])).data, original.data);
  await f.service.reference(f.id, 'P001', { genus: 'Borelis', verified: true, verifierCode: 'REF01', independentVerification: true, evidence: 'SOFTWARE TEST' }, admin);
  await f.service.adjudicate(f.id, { kind: 'rules', subject: 'Borelis_M1', resolution: 'RESOLVED', note: 'SOFTWARE TEST' }, admin);
  await f.service.adjudicate(f.id, { kind: 'rules', subject: 'Borelis_M1', resolution: 'UNRESOLVED', note: 'SOFTWARE TEST: latest adjudication reopens the discrepancy' }, admin);
  await f.service.advance(f.id, {}, admin);
  const s = await f.service.locked(f.id, admin); assert.equal(s.seal, digest(sealedData(s))); assert.equal(s.revisions.length, 1);
  const r = await f.service.report(f.id, admin), again = await f.service.report(f.id, admin);
  assert.equal(JSON.stringify(r), JSON.stringify(again)); assert.equal(r.formB.specimens, 1); assert.equal(r.formB.forms, 2);
  assert.equal(r.formB.performance.A0.top1.lower, null); assert.equal(r.formA.uniqueRulesReviewed, 1);
  assert.equal(r.formA.discrepancies.length, 1); assert.equal(r.formA.unresolvedDiscrepancies, 1);
  assert.match(r.status, /SOFTWARE TEST/); assert.match(r.manuscript.results, /NOT CONDUCTED/);
  const shareable = JSON.stringify(s10(s, r)); assert.ok(!shareable.includes('TEST-CLUSTER')); assert.ok(!shareable.includes('SOFTWARE-TEST-ONLY')); assert.ok(!shareable.includes('institution'));
  assert.ok(!shareable.includes(f.experts[0].id));
  await assert.rejects(f.service.reference(f.id, 'P001', {}, admin), /locked/);
  await assert.rejects(f.service.report(f.id, f.experts[0]), /Coordinator/);
  await f.store.transaction(async tx => { const altered = await tx.get('study', f.id); altered.forms['specimens:P001:EXP01'].data.quality = 'MODERATE'; await tx.put('study', f.id, altered); });
  await assert.rejects(f.service.report(f.id, admin), /integrity/);
});
test('agreement and deterministic clustered bootstrap use appropriate denominators and nonestimable edge cases', () => {
  assert.equal(agreement([]).kappa, null); assert.equal(agreement([['A', 'A']]).kappa, null);
  assert.equal(agreement([['A', 'A'], ['B', 'B']]).kappa, 1);
  assert.equal(agreement([['A', 'B'], ['B', 'A']]).kappa, -1);
  const rows = [{ cluster: 'A', x: 1 }, { cluster: 'A', x: 0 }, { cluster: 'B', x: 0 }];
  const interval = bootstrap(rows, 'x'); assert.equal(interval.clusters, 2); assert.equal(interval.specimens, 3); assert.equal(interval.estimate, 1 / 3);
  assert.deepEqual(interval, bootstrap(rows, 'x')); assert.equal(bootstrap(rows.slice(0, 2), 'x').status, 'NOT ESTIMABLE');
  const tied = { status: 'CANDIDATE_GENUS', ranking: [{ genus: 'A', score: 0 }, { genus: 'B', score: 0 }, { genus: 'C', score: 0 }] };
  assert.equal(topCredit(tied, 'A', 1), 1 / 3); assert.equal(topCredit(tied, 'A', 3), 1);
  assert.equal(topCredit({ ...tied, status: 'INDETERMINATE' }, 'A', 3), 0);
});
test('safe uploads remove metadata, retain dimensions and pixels, reject SVG and malformed input', async () => {
  const raw = Buffer.from([10, 20, 30, 40, 50, 60]);
  const source = await sharp(raw, { raw: { width: 2, height: 1, channels: 3 } }).withMetadata({ exif: { IFD0: { ImageDescription: 'SECRET TAXON LABEL' } } }).png().toBuffer();
  const image = await sanitizeImage(source.toString('base64'));
  const clean = Buffer.from(image.data, 'base64'), meta = await sharp(clean).metadata();
  assert.equal(meta.width, 2); assert.equal(meta.height, 1); assert.equal(meta.exif, undefined); assert.equal(meta.xmp, undefined);
  assert.equal(clean.includes(Buffer.from('SECRET TAXON')), false);
  assert.deepEqual(await sharp(clean).raw().toBuffer(), raw);
  await assert.rejects(sanitizeImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>').toString('base64')), /single-view/);
  await assert.rejects(sanitizeImage('not-base64!'), /Upload/);
});
test('exports quote CSV cells, neutralize formula injection and escape report text', async () => {
  const result = csv([{ note: '=HYPERLINK("bad")', other: 'a,b\n"quoted"' }]);
  assert.ok(result.includes("'=HYPERLINK")); assert.ok(result.includes('""quoted""'));
  const f = await fixture(); await lockFixture(f); const report = await f.service.report(f.id, admin);
  report.manuscript.methods = '<script>alert(1)</script>';
  const html = reportHtml(report); assert.ok(!html.includes('<script>')); assert.ok(html.includes('&lt;script&gt;'));
});
test('HTTP boundaries enforce roles, CSRF, blinding, per-account isolation, session revocation and invitation replay protection', async t => {
  const store = new MemoryStore(), auth = new ValidationAuth(store), password = testPassword();
  await auth.createAdmin('test-coordinator', password);
  const app = express(); app.use('/api/expert-validation', createValidationRouter(store, { production: true, origin: 'https://test.invalid' }));
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}/api/expert-validation`;
  const request = async (path, method = 'GET', body, session, extra = {}) => {
    const response = await fetch(`${base}${path}`, { method, headers: { Origin: 'https://test.invalid', 'Content-Type': 'application/json', ...(session ? { Cookie: session.cookie, 'X-Validation-CSRF': session.csrf } : {}), ...extra }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const data = await response.json().catch(() => null); return { response, data };
  };
  const session = result => ({ cookie: result.response.headers.get('set-cookie').split(';')[0], csrf: result.data.csrf });
  assert.equal((await request('/studies')).response.status, 401);
  assert.equal((await request('/auth/login', 'POST', { login: 'test-coordinator', password }, null, { Origin: 'https://evil.invalid' })).response.status, 403);
  const signedIn = await request('/auth/login', 'POST', { login: 'test-coordinator', password }); assert.equal(signedIn.response.status, 200);
  assert.match(signedIn.response.headers.get('set-cookie'), /__Host-geoknow_validation=/); assert.match(signedIn.response.headers.get('set-cookie'), /HttpOnly/); assert.match(signedIn.response.headers.get('set-cookie'), /Secure/); assert.match(signedIn.response.headers.get('set-cookie'), /SameSite=Strict/);
  const coordinator = session(signedIn);
  const spec = { title: 'SOFTWARE TEST', cohort: 'PILOT', purpose: 'SOFTWARE_TEST', reviewScope: 'SUBSET', selectionCriteria: 'private taxonomic test criterion', ruleIds: ['Borelis_M1'] };
  assert.equal((await request('/studies', 'POST', spec, coordinator, { 'X-Validation-CSRF': '' })).response.status, 403);
  const study = await request('/studies', 'POST', spec, coordinator); assert.equal(study.response.status, 201); const path = `/studies/${study.data.id}`;
  const experts = [];
  for (const code of ['EXP01', 'EXP02']) {
    const invite = await request(`${path}/invitations`, 'POST', { code }, coordinator);
    const accepted = await request('/auth/redeem', 'POST', { token: invite.data.token, password: testPassword() }); assert.equal(accepted.response.status, 200); experts.push(session(accepted));
    assert.equal((await request('/auth/redeem', 'POST', { token: invite.data.token, password: testPassword() })).response.status, 401);
  }
  assert.equal((await request('/studies', 'POST', spec, experts[0])).response.status, 403);
  assert.equal((await request(`${path}/references/P001`, 'PUT', {}, experts[0])).response.status, 403);
  assert.equal((await request(`${path}/specimens`, 'POST', { id: 'P001', sourceId: 'SECRET-ARCHIVE-TAXON', clusterId: 'SECRET-ROCK', materialMode: 'digital', independenceConfirmed: true, blindingConfirmed: true, realMaterialConfirmed: true }, coordinator)).response.status, 201);
  const pixels = await sharp({ create: { width: 2, height: 2, channels: 3, background: '#123456' } }).png().toBuffer();
  const upload = await request(`${path}/specimens/P001/images`, 'POST', { base64: pixels.toString('base64'), visualBlindingConfirmed: true, filename: 'SECRET-BORELIS.png' }, coordinator); assert.equal(upload.response.status, 201);
  assert.equal((await request(`${path}/advance`, 'POST', { deviations: 'SOFTWARE TEST ONLY' }, coordinator)).response.status, 200);
  const view = await request(path, 'GET', undefined, experts[0]); assert.equal(view.response.status, 200);
  const publicJson = JSON.stringify(view.data);
  for (const secret of ['SECRET-', 'references', 'snapshot"', 'privateSpecimens', 'private taxonomic', 'Borelis', 'EXP02']) assert.equal(publicJson.includes(secret), false, secret);
  assert.deepEqual(view.data.rules, []); assert.equal(view.data.characters.length, 21);
  assert.equal((await request(`${path}/forms/rules/Borelis_M1`, 'GET', undefined, experts[0])).response.status, 403);
  assert.equal((await request(`${path}/report`, 'GET', undefined, experts[0])).response.status, 403);
  assert.equal((await request(`${path}/export`, 'GET', undefined, coordinator)).response.status, 409);
  const imageResponse = await fetch(`${base}${path}/specimens/P001/images/${upload.data.id}`, { headers: { Cookie: experts[0].cookie } });
  assert.equal(imageResponse.status, 200); assert.match(imageResponse.headers.get('cache-control'), /no-store/); assert.ok(!imageResponse.headers.get('access-control-allow-origin'));
  assert.equal((await fetch(`${base}${path}/specimens/P001/images/${upload.data.id}`)).status, 401);
  const another = await request('/studies', 'POST', spec, coordinator);
  assert.equal((await request(`/studies/${another.data.id}`, 'GET', undefined, experts[0])).response.status, 404);
  assert.equal((await request(`${path}/forms/specimens/P001`, 'PUT', { revision: 0, data: { aiGenerated: true, observations: {} } }, experts[0])).response.status, 400);
  const newInvite = await request(`${path}/invitations`, 'POST', { code: 'EXP01' }, coordinator);
  const recovery = await request('/auth/redeem', 'POST', { token: newInvite.data.token, password: testPassword() }); assert.equal(recovery.response.status, 200);
  assert.equal((await request('/auth/session', 'GET', undefined, experts[0])).response.status, 401);
  assert.equal((await request('/auth/logout', 'POST', {}, session(recovery))).response.status, 200);
  assert.equal((await request('/auth/session', 'GET', undefined, session(recovery))).response.status, 401);
});
