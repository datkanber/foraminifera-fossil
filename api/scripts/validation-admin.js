#!/usr/bin/env node
// Run from api/. Passwords and backup encryption secrets are read from stdin,
// never command-line arguments or tracked environment files.
require('dotenv').config({ quiet: true });
const fs = require('node:fs');
const crypto = require('node:crypto');
const { Neo4jValidationStore } = require('../src/validation/store');
const { ValidationAuth } = require('../src/validation/auth');
const { digest, fail, verifyAudit } = require('../src/validation/common');
const { verifySnapshot, loadFrozen } = require('../src/validation/snapshot');
const { sealedData } = require('../src/validation/service');
let driver, store;
async function stdin() {
  if (process.stdin.isTTY) {
    const readline = require('node:readline');
    return new Promise((resolve, reject) => {
      process.stderr.write('Secret (input hidden): ');
      readline.emitKeypressEvents(process.stdin); process.stdin.setRawMode(true); process.stdin.resume();
      let value = '';
      const finish = error => {
        process.stdin.removeListener('keypress', handler); process.stdin.setRawMode(false); process.stdin.pause(); process.stderr.write('\n');
        if (error) reject(error); else resolve(value);
      };
      const handler = (text, key = {}) => {
        if (key.ctrl && key.name === 'c') return finish(new Error('Secret entry cancelled'));
        if (key.name === 'return') return finish();
        if (key.name === 'backspace') value = value.slice(0, -1);
        else if (text && !key.ctrl && !key.meta && !/[\x00-\x1f]/.test(text)) value += text;
      };
      process.stdin.on('keypress', handler);
    });
  }
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8').replace(/\r?\n$/, '');
}
async function main() {
  const [command, argument] = process.argv.slice(2);
  if (command !== 'analyze-archive') {
    driver = require('../src/db/neo4j').driver;
    store = new Neo4jValidationStore(driver, process.env.VALIDATION_NEO4J_DATABASE);
  }
  if (command === 'migrate') { await store.init(); console.log('Validation constraints and transaction lock initialized. Ontology data unchanged.'); }
  else if (command === 'create-admin') {
    fail(argument, 'Usage: create-admin <login>; provide password on stdin');
    await new ValidationAuth(store).createAdmin(argument, await stdin()); console.log('Coordinator account created.');
  } else if (command === 'set-admin-password') {
    fail(argument, 'Usage: set-admin-password <login>; secret is read from stdin or a hidden interactive prompt');
    await new ValidationAuth(store).setAdminPassword(argument, await stdin()); console.log('Coordinator password updated; previous sessions revoked.');
  } else if (command === 'purge-expired') {
    await store.transaction(async tx => {
      for (const type of ['session', 'invite', 'rate']) {
        const session = driver.session(process.env.VALIDATION_NEO4J_DATABASE ? { database: process.env.VALIDATION_NEO4J_DATABASE } : {});
        try {
          // Expiration fields are inside JSON; only selected expired auth/rate
          // records are removed. Research records are never purged.
          const all = await session.run('MATCH (n:EVRecord {type: $type}) RETURN n.key AS key, n.payload AS payload', { type });
          for (const row of all.records) {
            const value = JSON.parse(row.get('payload'));
            if ((value.expiresAt || value.resetAt) < Date.now()) await tx.remove(type, row.get('key').slice(type.length + 1));
          }
        } finally { await session.close(); }
      }
    });
    console.log('Expired invitations, sessions and rate counters removed.');
  } else if (command === 'backup') {
    fail(argument, 'Usage: backup <new-output-file>; provide encryption passphrase on stdin');
    const password = await stdin(); fail(password.length >= 16, 'Backup passphrase must contain at least 16 characters');
    const payload = await store.transaction(async tx => ({ format: 'GEOKNOW-VALIDATION-BACKUP-1', createdAt: new Date().toISOString(),
      studies: await tx.list('study'), simulations: await tx.list('simulation'), images: await tx.list('image'), users: await tx.list('user'), logins: await tx.list('login') }));
    const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
    const key = crypto.scryptSync(password, salt, 32), cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload)), cipher.final()]);
    fs.writeFileSync(argument, JSON.stringify({ format: 'GEOKNOW-AES256GCM-1', salt: salt.toString('hex'), iv: iv.toString('hex'), tag: cipher.getAuthTag().toString('hex'), data: encrypted.toString('base64') }), { flag: 'wx', mode: 0o600 });
    console.log('Encrypted backup saved. Sessions and invitation tokens were excluded.');
  } else if (command === 'restore-empty') {
    fail(argument, 'Usage: restore-empty <backup-file>; provide encryption passphrase on stdin');
    const archive = JSON.parse(fs.readFileSync(argument, 'utf8')); fail(archive.format === 'GEOKNOW-AES256GCM-1', 'Unknown backup format');
    const password = await stdin(), key = crypto.scryptSync(password, Buffer.from(archive.salt, 'hex'), 32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(archive.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(archive.tag, 'hex'));
    const payload = JSON.parse(Buffer.concat([decipher.update(Buffer.from(archive.data, 'base64')), decipher.final()]).toString('utf8'));
    fail(payload.format === 'GEOKNOW-VALIDATION-BACKUP-1', 'Unknown payload format');
    for (const s of payload.studies) { verifySnapshot(s.snapshot); verifyAudit(s); if (s.phase === 'LOCKED') fail(s.seal === digest(sealedData(s)), 'Locked study integrity check failed'); }
    for (const s of payload.simulations || []) { verifySnapshot(s.snapshot); verifyAudit(s); if (s.phase === 'LOCKED') fail(s.seal === digest(sealedData(s)), 'Locked simulation integrity check failed'); }
    await store.init();
    await store.transaction(async tx => {
      for (const type of ['study', 'simulation', 'image', 'user', 'login', 'session', 'invite']) fail(!(await tx.list(type)).length, 'Restore requires an empty validation database');
      for (const [type, values, identifier] of [['study', payload.studies, 'id'], ['image', payload.images, 'id'], ['user', payload.users, 'id']]) for (const item of values) await tx.put(type, item[identifier], item);
      for (const user of payload.users) await tx.put('login', user.login, { userId: user.id });
      for (const s of payload.simulations || []) await tx.put('simulation', s.id, s);
    });
    console.log('Backup restored to an empty validation database. Issue new invitations if account recovery is needed.');
  } else if (command === 'analyze-archive') {
    fail(argument, 'Usage: analyze-archive <private-reproduction.json>');
    const archive = JSON.parse(fs.readFileSync(argument, 'utf8'));
    fail(archive.format === 'GEOKNOW-PRIVATE-REPRODUCTION-1', 'Unknown archive format');
    const s = archive.study; verifySnapshot(s.snapshot);
    verifyAudit(s);
    fail(s.phase === 'LOCKED' && s.seal === digest(sealedData(s)), 'Locked study integrity check failed');
    const engine = loadFrozen(s.snapshot, 'api/src/services/scoring.js');
    const analysis = loadFrozen(s.snapshot, 'api/src/validation/analysis.js');
    process.stdout.write(JSON.stringify(analysis.analyze(s, engine), null, 2) + '\n');
  } else fail(false, 'Commands: migrate, create-admin <login>, set-admin-password <login>, purge-expired, backup <file>, restore-empty <file>, analyze-archive <file>');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => driver?.close());
