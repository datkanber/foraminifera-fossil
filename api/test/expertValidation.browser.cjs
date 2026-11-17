/* Real browser → Express → isolated in-memory data → UI verification.
 * SOFTWARE TEST ONLY. No production connection, research record or AI call. */
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const express = require('express');
const sharp = require('sharp');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { MemoryStore } = require('./support/validationMemoryStore');
const { ValidationAuth } = require('../src/validation/auth');
const { createValidationRouter } = require('../src/validation/routes');
const root = path.resolve(__dirname, '../..');
async function main() {
  const store = new MemoryStore(), app = express(), password = `Browser-${crypto.randomBytes(16).toString('hex')}`;
  await new ValidationAuth(store).createAdmin('software-test-coordinator', password);
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  app.use('/api/expert-validation', createValidationRouter(store, { production: false, origin }));
  app.use(express.static(path.join(root, 'client/dist')));
  app.get('/{*path}', (req, res) => res.sendFile(path.join(root, 'client/dist/index.html')));
  const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
  const errors = [];
  let diagnosticPage;
  const context = async () => {
    const c = await browser.newContext({ viewport: { width: 1366, height: 1000 } });
    await c.addInitScript(() => { if (location.protocol === 'http:' || location.protocol === 'https:') localStorage.setItem('foram_lang', 'en'); });
    await c.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
    c.on('page', p => p.on('pageerror', error => errors.push(error.message)));
    return c;
  };
  try {
    const coordinator = await context(), cp = await coordinator.newPage(); diagnosticPage = cp;
    await cp.goto(`${origin}/expert-validation`);
    await cp.getByLabel('Account login').fill('software-test-coordinator'); await cp.getByLabel('Password', { exact: true }).fill(password);
    await cp.getByRole('button', { name: 'Sign in', exact: true }).click();
    await cp.getByRole('button', { name: 'New study', exact: true }).click();
    await cp.getByLabel('Study title').fill('SOFTWARE TEST — browser only');
    await cp.getByLabel('Study purpose').selectOption('SOFTWARE_TEST');
    await cp.getByLabel('Selection criteria and protocol rationale').fill('SOFTWARE TEST ONLY — one card and one specimen');
    await cp.getByLabel('Search rule ID / genus').fill('Borelis_M1');
    await cp.getByLabel('Borelis_M1 · Borelis · M').check();
    await cp.getByRole('button', { name: 'Create study and freeze version' }).click();
    await cp.getByRole('heading', { name: 'Expert invitations' }).waitFor();
    const links = [];
    for (const code of ['EXP01', 'EXP02']) {
      await cp.getByRole('button', { name: 'Create / renew invite' }).nth(code === 'EXP01' ? 0 : 1).click();
      const field = cp.getByLabel(`${code} private link`); await field.waitFor(); links.push(await field.inputValue());
    }
    await cp.getByLabel('Anonymous ID (P001 / F001)').fill('P001');
    await cp.getByLabel('Private unique physical fossil ID').fill('SOFTWARE-TEST-UNIQUE');
    await cp.getByLabel('Private source/rock cluster ID').fill('SOFTWARE-TEST-CLUSTER');
    await cp.getByLabel('I verified actual material, specimen independence and visual blinding.').check();
    await cp.getByRole('button', { name: 'Assign fossil to both experts' }).click();
    await cp.getByLabel('Specimen ID', { exact: true }).selectOption('P001');
    const png = await sharp({ create: { width: 80, height: 60, channels: 3, background: '#af9979' } }).png().toBuffer();
    await cp.locator('input[type=file]').setInputFiles({ name: 'SOFTWARE-TEST.png', mimeType: 'image/png', buffer: png });
    await cp.getByLabel('I checked that pixels contain no taxonomic or identifying labels. File metadata will be stripped by the server.').check();
    await cp.getByRole('button', { name: 'Save private view' }).click();
    const experts = [];
    for (const link of links) {
      const c = await context(), p = await c.newPage(); await p.goto(link);
      await p.getByLabel('New password (at least 12 characters)').fill(password);
      await p.getByRole('button', { name: 'Activate account' }).click();
      await p.getByText('The coordinator is preparing material and assignments. Evaluation has not opened.').waitFor();
      assert.equal(new URL(p.url()).hash, ''); experts.push({ context: c, page: p });
    }
    await cp.getByLabel('Protocol deviations / rationale for a below-target specimen count').fill('SOFTWARE TEST ONLY — one synthetic fixture');
    await cp.getByRole('button', { name: 'Open Form B', exact: true }).click();
    for (const { page: p } of experts) {
      await p.getByRole('button', { name: 'Refresh status' }).click();
      await p.getByLabel('Assigned evaluation').selectOption('P001');
      await p.getByRole('heading', { name: 'Form B · P001' }).waitFor();
      assert.equal(await p.getByRole('link', { name: '2. Form A · Rule review' }).count(), 0);
      assert.equal(await p.locator('.ev-character-table tbody tr').count(), 21);
      const image = p.getByRole('img', { name: 'P001 — view 1' });
      await image.waitFor(); assert.equal(await image.evaluate(img => img.complete && img.naturalWidth > 0), true);
      await p.getByRole('button', { name: 'Zoom in' }).click(); assert.ok((await p.locator('.ev-view-controls output').textContent()).includes('150'));
      await p.getByRole('button', { name: 'Start observation' }).click();
      await p.getByLabel('Overall quality').selectOption('GOOD');
      for (let n = 1; n <= 21; n++) await p.getByLabel(`CHR_${String(n).padStart(2, '0')} state`, { exact: true }).selectOption('NOT_OBSERVABLE');
      await p.getByLabel('CHR_03 value', { exact: true }).selectOption('ABSENT'); await p.getByLabel('CHR_03 state', { exact: true }).selectOption('PRESENT');
      await p.getByRole('button', { name: 'Save draft', exact: true }).click();
      await p.reload(); await p.getByLabel('Assigned evaluation').selectOption('P001');
      await p.getByRole('heading', { name: 'Form B · P001' }).waitFor();
      assert.equal(await p.getByLabel('CHR_03 value', { exact: true }).inputValue(), 'ABSENT');
      for (const label of ['I have not seen the reference genus.', 'I have not seen the other expert’s form.', 'I have not seen system or VLM/AI predictions.', 'I completed these observations independently, without AI.']) await p.getByLabel(label, { exact: true }).check();
      await p.getByRole('button', { name: 'Submit evaluation', exact: true }).click(); await p.getByRole('button', { name: 'Confirm final submission' }).click();
      await p.getByText('Final submission is locked. Your responses are read-only.', { exact: false }).waitFor();
      assert.equal(await p.getByLabel('CHR_03 value', { exact: true }).isDisabled(), true);
      assert.equal(await p.getByRole('link', { name: 'JSON', exact: true }).count(), 1);
    }
    await cp.getByRole('button', { name: 'Refresh status' }).click(); await cp.getByRole('button', { name: 'Open Form A', exact: true }).click();
    for (const { page: p } of experts) {
      await p.getByRole('button', { name: 'Refresh status' }).click(); await p.getByRole('link', { name: '2. Form A · Rule review' }).click();
      await p.getByLabel('Assigned evaluation').selectOption('Borelis_M1');
      await p.getByLabel('Taxonomic decision').selectOption('APPROVE'); await p.getByLabel('Evidence classification').selectOption('APPROPRIATE');
      await p.getByLabel('Character mapping').selectOption('CORRECT'); await p.getByLabel('Literature support').selectOption('MISSING');
      for (const label of ['I have not seen the other expert’s responses.', 'The reviewed version and rule list are recorded.', 'The reasons reflect my own scientific judgment.']) await p.getByLabel(label, { exact: true }).check();
      await p.getByRole('button', { name: 'Submit evaluation', exact: true }).click(); await p.getByRole('button', { name: 'Confirm final submission' }).click();
      await p.getByText('Final submission is locked. Your responses are read-only.', { exact: false }).waitFor();
      await p.getByLabel('Assigned evaluation').selectOption('review');
      for (const label of ['Institution', 'Expertise', 'Relationship to rule development / independence disclosure', 'Sources used']) await p.getByLabel(label, { exact: true }).fill('SOFTWARE TEST ONLY');
      for (const label of ['I have not seen the other expert’s responses.', 'The reviewed version and rule list are recorded.', 'The reasons reflect my own scientific judgment.']) await p.getByLabel(label, { exact: true }).check();
      await p.getByRole('button', { name: 'Submit evaluation', exact: true }).click(); await p.getByRole('button', { name: 'Confirm final submission' }).click();
      await p.getByText('Final submission is locked. Your responses are read-only.', { exact: false }).waitFor();
    }
    await cp.getByRole('button', { name: 'Refresh status' }).click();
    await cp.getByLabel('Specimen', { exact: true }).selectOption('P001'); await cp.getByLabel('Reference genus', { exact: true }).fill('Borelis');
    await cp.getByLabel('Reference evidence / archive / literature').fill('SOFTWARE TEST ONLY — not an actual verification');
    await cp.getByLabel('Verification is independent of EXP01/EXP02 and system predictions.').check();
    await cp.getByRole('button', { name: 'Save private reference' }).click();
    await cp.getByRole('button', { name: 'Lock study data', exact: true }).click();
    await cp.getByRole('button', { name: 'Generate Expert Validation Report' }).click();
    await cp.getByText('SOFTWARE TEST — NOT HUMAN RESEARCH RESULTS', { exact: true }).waitFor();
    const output = path.join(root, '.tmp/expert-validation'); fs.mkdirSync(output, { recursive: true });
    await cp.screenshot({ path: path.join(output, 'coordinator-software-test.png'), fullPage: true });
    const p = experts[0].page; await p.setViewportSize({ width: 768, height: 1024 }); await p.screenshot({ path: path.join(output, 'expert-tablet-software-test.png'), fullPage: true });
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    const reportLink = cp.getByRole('link', { name: 'English report / PDF' });
    const response = await coordinator.request.get(new URL(await reportLink.getAttribute('href'), origin).href); assert.equal(response.status(), 200); assert.ok((await response.text()).includes('NOT HUMAN RESEARCH RESULTS'));
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ passed: true, scope: 'SOFTWARE TEST ONLY; no real research records', checks: ['coordinator creates frozen study', 'single-use invitations', 'private decoded images', '21 observations', 'draft resume', 'immutable final forms', 'Form B before Form A', 'rule review and summary', 'independent reference', 'data lock', 'marked English report', 'tablet overflow', 'no browser errors'], screenshots: output }));
  } catch (error) {
    if (diagnosticPage) {
      const output = path.join(root, '.tmp/expert-validation'); fs.mkdirSync(output, { recursive: true });
      await diagnosticPage.screenshot({ path: path.join(output, 'failure-software-test.png'), fullPage: true });
      console.error('Visible UI errors:', await diagnosticPage.locator('.ev-error').allTextContents());
    }
    throw error;
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
