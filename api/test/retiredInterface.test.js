const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const app = require('../src/app');

test('retired evaluation API is unavailable while public health remains available', async () => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const [method, path] of [
      ['GET', '/api/expert-validation/auth/session'],
      ['POST', '/api/expert-validation/auth/login'],
      ['GET', '/api/expert-validation/studies'],
    ]) {
      const response = await fetch(origin + path, { method });
      assert.equal(response.status, 404, `${method} ${path} must remain retired`);
    }
    const health = await fetch(origin + '/api/health');
    assert.equal(health.status, 200);
    assert.equal((await health.json()).status, 'ok');
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
