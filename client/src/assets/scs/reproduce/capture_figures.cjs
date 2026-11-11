// Run from the repository root with the client (:3000) and real API (:5000) running.
// PLAYWRIGHT_MODULE may point at an existing Playwright installation.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseUrl = process.env.CAPTURE_BASE_URL || 'http://localhost:3000';
const apiUrl = process.env.CAPTURE_API_URL || 'http://localhost:5000';

const out = path.resolve(__dirname, '..');
const evidence = path.join(out, 'evidence');
fs.mkdirSync(evidence, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext({
      viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 3.125, locale: 'en-US',
    });
    await context.addInitScript(() => localStorage.setItem('foram_lang', 'en'));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${baseUrl}/tani`);
    await page.locator('.mode-card').filter({ hasText: 'Character Scoring' }).click();
    const selected = {
      CHR_01: 'Agglutinated', CHR_03: 'Absent', CHR_04: 'Undivided',
      CHR_06: 'Planispiral', CHR_07: 'Single plane',
    };
    for (const [chr, label] of Object.entries(selected)) {
      await page.locator('.chr-block').filter({ has: page.locator('.chr-id-badge', { hasText: chr }) })
        .getByRole('button', { name: label, exact: true }).click();
    }
    const responsePromise = page.waitForResponse(r => r.url().endsWith('/api/diagnose/score') && r.request().method() === 'POST');
    await page.locator('.diagnose-button').click();
    const response = await responsePromise;
    assert.equal(response.status(), 200);
    const result = await response.json();
    assert.equal(result.identification, 'Ammodiscus');
    assert.equal(result.status, 'CONFIRMED_GENUS');
    assert.equal(result.ranking[0].score, 19);
    assert.equal(result.ranking[1].genus, 'Saccammina');
    assert.equal(result.ranking[1].score, 9);
    assert.equal(result.observedCharacterCount, 4);
    fs.writeFileSync(path.join(evidence, 'table_XIII_scenario_A_api.json'), JSON.stringify(result, null, 2));
    await page.locator('.excluded-section summary').click();
    await page.locator('.excluded-section[open]').waitFor();
    assert.equal(await page.locator('.excluded-list li').count(), result.excluded.length);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.excluded-section').screenshot({ path: path.join(out, 'Figure_10_Excluded_Genera_EN.png') });
    // A full, unmodified application context is supplied separately.
    await page.locator('.score-result').screenshot({ path: path.join(out, 'Figure_10_Scenario_A_Context_EN.png') });

    const envPromise = page.waitForResponse(r => r.url().endsWith('/api/taxa/environment'));
    await page.goto(`${baseUrl}/jeoloji`);
    const envResponse = await envPromise;
    assert.equal(envResponse.status(), 200);
    const env = await envResponse.json();
    assert.equal(env.profiles.length, 18);
    await page.locator('.taxon-env-card').last().waitFor();
    assert.equal(await page.locator('.taxon-env-card').count(), 18);
    for (const p of env.profiles) {
      for (const key of ['depthTextEn', 'habitatTextEn', 'sourceLabelEn']) assert.ok(p[key], `${p.scientificName}: ${key}`);
      const card = page.locator('.taxon-env-card').filter({ has: page.getByText(p.scientificName, { exact: true }) });
      const text = await card.innerText();
      for (const key of ['depthTextEn', 'habitatTextEn', 'sourceLabelEn']) assert.ok(text.includes(p[key]), `${p.scientificName}: rendered ${key}`);
    }
    fs.writeFileSync(path.join(evidence, 'taxon_profiles_english_api.json'), JSON.stringify(env, null, 2));
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.taxon-env-section').screenshot({ path: path.join(out, 'Figure_15_TaxonProfiles_EN_all18.png') });
    // Capture the heading, filters and first four complete records without altering the page.
    await page.evaluate(() => scrollTo(0, 0));
    const section = await page.locator('.taxon-env-section').boundingBox();
    const fourth = await page.locator('.taxon-env-card').nth(3).boundingBox();
    const scroll = await page.evaluate(() => ({ x: scrollX, y: scrollY }));
    await page.screenshot({ path: path.join(out, 'Figure_15_TaxonProfiles_EN.png'), clip: {
      x: section.x + scroll.x, y: section.y + scroll.y, width: section.width,
      height: fourth.y + fourth.height - section.y + 10,
    } });
    const summary = {
      capturedAt: new Date().toISOString(), baseUrl, apiUrl,
      deviceScaleFactor: 3.125, language: 'en', observations: selected,
      score: result.ranking[0].score, margin: 10, evaluatedObservations: 4,
      excludedCount: result.excluded.length,
      mandatoryExclusions: result.excluded.filter(r => r.exclusionReason.startsWith('mandatory')).length,
      contradictionExclusions: result.excluded.filter(r => r.exclusionReason.startsWith('strong contradiction')).length,
      taxonProfileCount: env.profiles.length, allEnglishFieldsRendered: true, browserErrors: errors,
      screenshotMethod: 'Native Playwright element/region capture; no DOM, CSS or pixel modifications.',
    };
    fs.writeFileSync(path.join(evidence, 'capture_summary.json'), JSON.stringify(summary, null, 2));
    assert.deepEqual(errors, []);
    console.log(JSON.stringify(summary, null, 2));
    await context.close();
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
