const express = require('express');
const { digest, fail } = require('./common');
const { ValidationAuth, SESSION_MS } = require('./auth');
const { ValidationService, requireCoordinator } = require('./service');
const { sanitizeImage } = require('./images');
const { csv, formRows, printForm, reportHtml, s10 } = require('./exports');
function createValidationRouter(store, options = {}) {
  const router = express.Router();
  const auth = new ValidationAuth(store), service = new ValidationService(store, options);
  const production = options.production ?? process.env.NODE_ENV === 'production';
  const origin = options.origin || process.env.VALIDATION_APP_ORIGIN || 'http://localhost:3000';
  const cookieName = production ? '__Host-geoknow_validation' : 'geoknow_validation';
  const cookie = (res, value, age) => res.cookie(cookieName, value, { httpOnly: true, secure: production, sameSite: 'strict', path: '/', maxAge: age });
  const rawToken = req => (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  async function limit(bucket, maximum, windowMs) {
    await store.transaction(async tx => {
      const hashed = digest(bucket), time = Date.now();
      const old = await tx.get('rate', hashed);
      const entry = old && old.resetAt > time ? old : { count: 0, resetAt: time + windowMs };
      fail(entry.count < maximum, 'Too many requests; try again later', 429);
      entry.count++; await tx.put('rate', hashed, entry);
    });
  }
  router.use((req, res, next) => {
    res.set({ 'Cache-Control': 'no-store, private', 'Pragma': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'" });
    if (req.headers.origin && req.headers.origin !== origin) return res.status(403).json({ error: 'Untrusted origin' });
    if (!['GET', 'HEAD'].includes(req.method) && req.headers.origin !== origin) return res.status(403).json({ error: 'Origin header required' });
    next();
  });
  router.use(express.json({ limit: '12mb', strict: true }));
  const signIn = method => async (req, res) => {
    await limit(`signin:${req.ip}`, 20, 15 * 60_000);
    if (method === 'login') await limit(`login:${digest(String(req.body.login).toLowerCase())}`, 10, 15 * 60_000);
    const result = method === 'login' ? await auth.login(req.body.login, req.body.password) : await auth.redeem(req.body.token, req.body.password);
    cookie(res, result.token, SESSION_MS); res.json({ user: result.user, csrf: result.csrf });
  };
  router.post('/auth/login', signIn('login'));
  router.post('/auth/redeem', signIn('redeem'));
  router.use(async (req, res, next) => {
    req.actor = await auth.authenticate(rawToken(req));
    if (!['GET', 'HEAD'].includes(req.method)) fail(req.headers['x-validation-csrf'] === req.actor.csrf, 'Invalid CSRF token', 403);
    await limit(`requests:${req.actor.id}`, 300, 60_000);
    next();
  });
  router.get('/auth/session', (req, res) => res.json({ user: { id: req.actor.id, role: req.actor.role, code: req.actor.code, studyId: req.actor.studyId }, csrf: req.actor.csrf }));
  router.post('/auth/logout', async (req, res) => {
    await store.transaction(tx => tx.remove('session', digest(rawToken(req)))); cookie(res, '', 0); res.json({ signedOut: true });
  });
  router.get('/catalog', (req, res) => {
    requireCoordinator(req.actor);
    const { createSnapshot } = require('./snapshot');
    const snapshot = createSnapshot();
    res.json({ version: snapshot.manifest, rules: JSON.parse(snapshot.files['api/data/rule_chr_mapping.json']) });
  });
  router.get('/studies', async (req, res) => res.json(await service.list(req.actor)));
  router.post('/studies', async (req, res) => res.status(201).json(await service.create(req.body, req.actor)));
  router.get('/studies/:study', async (req, res) => res.json(await service.get(req.params.study, req.actor)));
  router.post('/studies/:study/invitations', async (req, res) => res.status(201).json(await service.invite(req.params.study, req.body.code, req.actor)));
  router.post('/studies/:study/specimens', async (req, res) => res.status(201).json(await service.addSpecimen(req.params.study, req.body, req.actor)));
  router.post('/studies/:study/specimens/:specimen/images', async (req, res) => {
    requireCoordinator(req.actor);
    fail(req.body.visualBlindingConfirmed === true, 'Confirm that pixels contain no taxonomic labels or identifying collection text');
    await limit(`upload:${req.actor.id}`, 20, 10 * 60_000);
    const image = await sanitizeImage(req.body.base64);
    res.status(201).json(await service.upload(req.params.study, req.params.specimen, image, req.actor));
  });
  router.get('/studies/:study/specimens/:specimen/images/:image', async (req, res) => {
    const image = await service.image(req.params.study, req.params.specimen, req.params.image, req.actor);
    res.type('png').set('Content-Disposition', 'inline; filename="view.png"').send(Buffer.from(image.data, 'base64'));
  });
  router.put('/studies/:study/references/:specimen', async (req, res) => res.json(await service.reference(req.params.study, req.params.specimen, req.body, req.actor)));
  router.post('/studies/:study/advance', async (req, res) => res.json(await service.advance(req.params.study, req.body, req.actor)));
  router.get('/studies/:study/forms/:kind/:subject', async (req, res) => res.json(await service.getForm(req.params.study, req.params.kind, req.params.subject, req.actor)));
  router.put('/studies/:study/forms/:kind/:subject', async (req, res) => res.json(await service.save(req.params.study, req.params.kind, req.params.subject, req.body, req.actor)));
  router.post('/studies/:study/specimens/:specimen/timer', async (req, res) => res.json(await service.timer(req.params.study, req.params.specimen, req.body.action, req.actor)));
  router.post('/studies/:study/adjudications', async (req, res) => res.status(201).json(await service.adjudicate(req.params.study, req.body, req.actor)));
  router.post('/studies/:study/ai-proposals', async (req, res) => res.status(201).json(await service.addProposal(req.params.study, req.body, req.actor)));
  router.post('/studies/:study/revisions', async (req, res) => res.status(201).json(await service.revision(req.params.study, req.body, req.actor)));
  router.get('/studies/:study/forms/:kind/:subject/export', async (req, res) => {
    const f = await service.getForm(req.params.study, req.params.kind, req.params.subject, req.actor);
    fail(f.status === 'FINAL', 'Submit the form before exporting', 409);
    const format = req.query.format || 'json';
    if (format === 'csv') return res.type('csv').attachment('expert-form.csv').send(csv(formRows([f])));
    if (format === 'print') return res.type('html').send(printForm(f));
    fail(format === 'json', 'Choose json, csv or print'); res.attachment('expert-form.json').json(f);
  });
  router.get('/studies/:study/report', async (req, res) => {
    const report = await service.report(req.params.study, req.actor);
    if (req.query.format === 'print') return res.type('html').send(reportHtml(report));
    if (req.query.format === 'csv') {
      const rows = ['A0', 'B1'].flatMap(method => Object.entries(report.formB.performance[method]).map(([metric, result]) => ({ table: 'classification', method, metric, ...result })));
      rows.push(...Object.entries(report.formA.counts).map(([decision, count]) => ({ table: 'rule_review', decision, count })),
        ...report.formB.morphologicalAgreement.map(r => ({ table: 'character_agreement', character: r.character, ...r.allStates })));
      for (const [module, methods] of Object.entries(report.formB.byModule)) for (const [method, metrics] of Object.entries(methods))
        for (const [metric, result] of Object.entries(metrics)) rows.push({ table: 'wall_composition', module, method, metric, ...result });
      for (const [state, result] of Object.entries(report.formB.byConfidenceState)) rows.push({ table: 'confidence_state', state, forms: result.forms, specimens: result.specimens, ...result.top1 });
      rows.push({ table: 'paired_difference', method: 'A0-B1', metric: 'top1', ...report.formB.pairedTop1Difference });
      for (const [level, result] of Object.entries(report.formA.byEvidence)) rows.push({ table: 'rule_evidence_agreement', level, ...result });
      for (const [character, result] of Object.entries(report.formA.byCharacter)) rows.push({ table: 'rule_character_agreement', character, ...result });
      for (const discrepancy of report.formA.discrepancies) rows.push({ table: 'rule_discrepancy', ...discrepancy });
      for (const discrepancy of report.formB.morphologicalAgreement.flatMap(r => r.discrepancies)) rows.push({ table: 'specimen_discrepancy', ...discrepancy });
      for (const excluded of report.formB.excludedCases) rows.push({ table: 'excluded_case', ...excluded });
      return res.type('csv').attachment('expert-validation-tables.csv').send(csv(rows));
    }
    res.json(report);
  });
  router.get('/studies/:study/export', async (req, res) => {
    const s = await service.locked(req.params.study, req.actor);
    const report = await service.report(req.params.study, req.actor);
    if (req.query.format === 'csv') return res.type('csv').attachment('expert-validation-forms.csv').send(csv(formRows(Object.values(s.forms))));
    if (req.query.format === 'reproducible') {
      // Private coordinator archive: includes frozen executable sources, labels,
      // source clusters and audit history. Never place this file in public assets.
      return res.attachment('expert-validation-private-reproduction.json').json({ format: 'GEOKNOW-PRIVATE-REPRODUCTION-1', study: s });
    }
    res.attachment('S10-independent-expert-validation.json').json(s10(s, report));
  });
  router.use((req, res) => res.status(404).json({ error: 'Validation endpoint not found' }));
  router.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = error.status || (error.type === 'entity.too.large' ? 413 : 503);
    if (status === 429) res.set('Retry-After', '900');
    res.status(status).json({ error: status >= 500 ? 'Validation service unavailable. Contact the coordinator.' : error.message });
  });
  return router;
}
module.exports = { createValidationRouter };
