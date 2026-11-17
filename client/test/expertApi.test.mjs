import assert from 'node:assert/strict';
import { test, afterEach } from 'node:test';
import { isValidationSession, setValidationCsrf, validationRequest } from '../src/components/expert/api.js';

const coordinator = { user: { id: 'test-user', code: 'COORDINATOR', role: 'COORDINATOR', studyId: null }, csrf: 'software-test-csrf' };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
const unavailable = error => error.code === 'INVALID_VALIDATION_RESPONSE' && !error.message.includes('<html');
afterEach(() => setValidationCsrf(''));

for (const [label, response] of [
  ['HTML with a successful HTTP status (SPA fallback)', () => new Response('<html>index.html</html>', { headers: { 'Content-Type': 'text/html' } })],
  ['an HTML 404 from an outdated backend', () => new Response('<html>Cannot GET</html>', { status: 404, headers: { 'Content-Type': 'text/html' } })],
  ['malformed JSON', () => new Response('{', { headers: { 'Content-Type': 'application/json' } })],
  ['an empty JSON body', () => new Response('', { headers: { 'Content-Type': 'application/json' } })],
  ['a missing content type', () => new Response(JSON.stringify(coordinator))],
]) {
  test(`rejects ${label}`, async t => {
    t.mock.method(globalThis, 'fetch', async () => response());
    await assert.rejects(validationRequest('/auth/session'), unavailable);
  });
}

for (const [label, data] of [
  ['null', null], ['an empty object', {}], ['an array', []],
  ['a missing user', { csrf: 'test' }],
  ['a missing user code', { ...coordinator, user: { id: 'test-user', role: 'COORDINATOR' } }],
  ['a missing CSRF token', { user: coordinator.user }],
  ['an unsupported role', { ...coordinator, user: { ...coordinator.user, role: 'ADMIN' } }],
  ['an expert without a study', { ...coordinator, user: { ...coordinator.user, code: 'EXP01', role: 'EXPERT' } }],
]) {
  test(`rejects ${label} for session, login and invitation redemption`, async t => {
    t.mock.method(globalThis, 'fetch', async () => json(data));
    for (const path of ['/auth/session', '/auth/login', '/auth/redeem']) {
      await assert.rejects(validationRequest(path), unavailable);
    }
    assert.equal(isValidationSession(data), false);
  });
}

test('accepts real coordinator and expert session shapes', async t => {
  for (const session of [coordinator, { ...coordinator, user: { id: 'test-expert', code: 'EXP01', role: 'EXPERT', studyId: 'test-study' } }]) {
    t.mock.method(globalThis, 'fetch', async () => json(session));
    assert.deepEqual(await validationRequest('/auth/session'), session);
    assert.equal(isValidationSession(session), true);
  }
});

test('preserves authentication and service error statuses', async t => {
  for (const [status, error] of [[401, 'Authentication required'], [403, 'Invalid CSRF token'], [503, 'Validation service unavailable']]) {
    t.mock.method(globalThis, 'fetch', async () => json({ error }, status));
    await assert.rejects(validationRequest('/auth/session'), e => e.status === status && e.message === error);
  }
});

test('sends same-origin credentials and CSRF without changing the JSON body', async t => {
  const request = t.mock.method(globalThis, 'fetch', async () => json({ signedOut: true }));
  setValidationCsrf(coordinator.csrf);
  await validationRequest('/auth/logout', { method: 'POST', body: { example: true } });
  const [url, options] = request.mock.calls[0].arguments;
  assert.equal(url, '/api/expert-validation/auth/logout');
  assert.equal(options.credentials, 'same-origin');
  assert.equal(options.cache, 'no-store');
  assert.equal(options.headers['X-Validation-CSRF'], coordinator.csrf);
  assert.equal(options.body, '{"example":true}');
});

test('rejects a broken study list while accepting an empty list and study creation', async t => {
  for (const invalid of [{}, [null], [{ title: 'No ID' }]]) {
    t.mock.method(globalThis, 'fetch', async () => json(invalid));
    await assert.rejects(validationRequest('/studies'), unavailable);
  }
  t.mock.method(globalThis, 'fetch', async () => json([]));
  assert.deepEqual(await validationRequest('/studies'), []);
  t.mock.method(globalThis, 'fetch', async () => json({ id: 'new-study' }, 201));
  assert.deepEqual(await validationRequest('/studies', { method: 'POST', body: {} }), { id: 'new-study' });
});

test('uses English service guidance when the page language is English', async t => {
  globalThis.document = { documentElement: { lang: 'en' } };
  t.after(() => { delete globalThis.document; });
  t.mock.method(globalThis, 'fetch', async () => json({}));
  await assert.rejects(validationRequest('/auth/session'), e => e.message.startsWith('The expert evaluation service'));
});
