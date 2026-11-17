/* SOFTWARE TEST ONLY: production-shaped broken responses; no remote requests. */
const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('express');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

async function main() {
  const app = express();
  const dist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(dist));
  // Reproduce the deployed static host's HTTP 200 index.html API fallback.
  app.all('/{*path}', (req, res) => res.sendFile(path.join(dist, 'index.html')));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  const errors = [], checks = [];
  const coordinator = { user: { id: 'software-test-user', code: 'COORDINATOR', role: 'COORDINATOR', studyId: null }, csrf: 'software-test-csrf' };
  const json = (data, status = 200) => ({ status, contentType: 'application/json', body: JSON.stringify(data) });
  try {
    browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
    for (const scenario of [
      { name: 'static HTML fallback on session and login', fallback: true, attemptLogin: true },
      { name: 'HTML 404 from an outdated API', session: { status: 404, contentType: 'text/html', body: '<html>Cannot GET</html>' } },
      { name: 'HTML 401 from a proxy', session: { status: 401, contentType: 'text/html', body: '<html>Unauthorized</html>' } },
      { name: 'empty session object', session: json({}) },
      { name: 'null session', session: json(null) },
      { name: 'user without a code', session: json({ ...coordinator, user: { id: 'test-user', role: 'COORDINATOR' } }) },
      { name: 'normal anonymous visit', session: json({ error: 'Authentication required' }, 401), healthyAnonymous: true },
      { name: 'invalid login response', session: json({ error: 'Authentication required' }, 401), login: json({}), attemptLogin: true },
      { name: 'invalid invitation response', session: json({ error: 'Authentication required' }, 401), login: json({}), invitation: true, attemptLogin: true },
      { name: 'valid coordinator with no studies', session: json(coordinator), studies: json([]), authenticated: true },
      { name: 'invalid study list after valid authentication', session: json(coordinator), studies: json({}), authenticated: true, studyError: true },
    ]) {
      const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
      await context.addInitScript(() => localStorage.setItem('foram_lang', 'en'));
      await context.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
      if (!scenario.fallback) await context.route('**/api/expert-validation/**', route => {
        const pathname = new URL(route.request().url()).pathname;
        return route.fulfill(pathname.endsWith('/auth/session') ? scenario.session : pathname.endsWith('/studies') ? scenario.studies : scenario.login);
      });
      const page = await context.newPage();
      page.setDefaultTimeout(6000);
      page.on('pageerror', error => errors.push(`${scenario.name}: ${error.message}`));
      await page.goto(`${origin}/expert-validation${scenario.invitation ? '#invite=software-test-only' : ''}`);
      if (scenario.authenticated) {
        await page.getByRole('button', { name: 'Sign out', exact: true }).waitFor();
        if (!scenario.studyError) await page.getByText('No study has been assigned yet.', { exact: true }).waitFor();
      } else {
        await page.getByRole('heading', { name: scenario.invitation ? 'Accept expert invitation' : 'Secure sign-in', exact: true }).waitFor();
        assert.equal(await page.getByRole('button', { name: 'Sign out', exact: true }).count(), 0);
        if (scenario.attemptLogin) {
          if (!scenario.invitation) await page.getByLabel('Account login').fill('software-test-user');
          await page.getByLabel(scenario.invitation ? 'New password (at least 12 characters)' : 'Password', { exact: true }).fill('Software-test-only-password');
          await page.getByRole('button', { name: scenario.invitation ? 'Activate account' : 'Sign in', exact: true }).click();
          assert.equal(await page.getByRole('button', { name: 'Sign out', exact: true }).count(), 0);
        }
      }
      if (scenario.healthyAnonymous) assert.equal(await page.getByRole('alert').count(), 0);
      else if (!scenario.authenticated || scenario.studyError) await page.getByRole('alert').filter({ hasText: 'The expert evaluation service is currently unavailable.' }).waitFor();
      checks.push(scenario.name);
      await context.close();
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ passed: true, checks, browserErrors: errors }));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
