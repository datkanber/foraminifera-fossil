const crypto = require('node:crypto');
const { promisify } = require('node:util');
const scrypt = promisify(crypto.scrypt);
const now = () => new Date().toISOString();
const digest = value => crypto.createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : canonical(value)).digest('hex');
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
function fail(condition, message, status = 400) {
  if (!condition) { const e = new Error(message); e.status = status; throw e; }
}
function str(value, field, max = 4000, required = false) {
  fail(typeof value === 'string' || (!required && value == null), `${field}: expected text`);
  const result = (value || '').trim();
  fail(result.length <= max && (!required || result.length > 0), `${field}: invalid length`);
  return result;
}
function choice(value, allowed, field) { fail(allowed.includes(value), `${field}: invalid selection`); return value; }
function id(value) { fail(typeof value === 'string' && /^[a-zA-Z0-9_-]{1,90}$/.test(value), 'Invalid identifier'); return value; }
function audit(study, actor, action, details = {}) {
  const event = { at: now(), actor, action, details, previous: study.audit.at(-1)?.hash || null };
  study.audit.push({ ...event, hash: digest(event) });
}
function verifyAudit(study) {
  let previous = null;
  for (const entry of study.audit) {
    const { hash, ...event } = entry;
    fail(event.previous === previous && digest(event) === hash, 'Audit chain integrity check failed', 409);
    previous = hash;
  }
  if (study.phase === 'LOCKED') {
    const last = study.audit.at(-1);
    fail(last?.action === 'PHASE_ADVANCED' && last.details.to === 'LOCKED' && last.details.seal === study.seal && last.previous === study.sealedAuditHead,
      'Locked audit checkpoint is missing or changed', 409);
  }
}
async function passwordHash(password) {
  fail(typeof password === 'string' && password.length >= 12 && password.length <= 200, 'Password must contain 12–200 characters');
  const salt = crypto.randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 64);
  return `${salt}:${key.toString('hex')}`;
}
async function passwordMatches(password, stored) {
  if (typeof password !== 'string' || password.length > 200) return false;
  const [salt, encoded] = stored.split(':');
  const key = await scrypt(password, salt, 64);
  return crypto.timingSafeEqual(key, Buffer.from(encoded, 'hex'));
}
module.exports = { now, digest, canonical, fail, str, choice, id, audit, verifyAudit, passwordHash, passwordMatches };
