const crypto = require('node:crypto');
const { now, digest, fail, str, passwordHash, passwordMatches } = require('./common');
const token = () => crypto.randomBytes(32).toString('base64url');
const SESSION_MS = 8 * 60 * 60 * 1000;
const publicUser = user => ({ id: user.id, role: user.role, code: user.code, studyId: user.studyId || null });
class ValidationAuth {
  constructor(store) { this.store = store; }
  async createAdmin(login, password) {
    login = str(login, 'login', 80, true).toLowerCase();
    fail(/^[a-z0-9._@-]+$/.test(login), 'Invalid login');
    const user = { id: crypto.randomUUID(), login, role: 'COORDINATOR', code: 'COORDINATOR', hash: await passwordHash(password), createdAt: now() };
    await this.store.transaction(async tx => {
      fail(!await tx.get('login', login), 'Login already exists', 409);
      await tx.put('user', user.id, user); await tx.put('login', login, { userId: user.id });
    });
    return publicUser(user);
  }
  async login(login, password) {
    const user = await this.store.read(async tx => {
      const entry = await tx.get('login', str(login, 'login', 80, true).toLowerCase());
      return entry ? tx.get('user', entry.userId) : null;
    });
    // Equal-cost check for unknown usernames, without a hardcoded credential.
    const dummy = `${'0'.repeat(32)}:${'0'.repeat(128)}`;
    const matches = await passwordMatches(password, user?.hash || dummy);
    fail(user && !user.disabled && matches, 'Invalid login or password', 401);
    return this.session(user);
  }
  async setAdminPassword(login, password) {
    const normalized = str(login, 'login', 80, true).toLowerCase();
    const hash = await passwordHash(password);
    await this.store.transaction(async tx => {
      const entry = await tx.get('login', normalized);
      const user = entry ? await tx.get('user', entry.userId) : null;
      fail(user?.role === 'COORDINATOR', 'Coordinator account not found');
      user.hash = hash; user.generation = (user.generation || 0) + 1;
      await tx.put('user', user.id, user);
    });
  }
  async session(user, tx) {
    const raw = token(), csrf = token();
    const session = { userId: user.id, generation: user.generation || 0, csrf, expiresAt: Date.now() + SESSION_MS, createdAt: now() };
    if (tx) await tx.put('session', digest(raw), session);
    else await this.store.transaction(t => t.put('session', digest(raw), session));
    return { token: raw, csrf, user: publicUser(user) };
  }
  async authenticate(raw) {
    fail(typeof raw === 'string' && /^[A-Za-z0-9_-]{43}$/.test(raw), 'Sign in required', 401);
    return this.store.read(async tx => {
      const session = await tx.get('session', digest(raw));
      fail(session && session.expiresAt > Date.now(), 'Session expired; sign in again', 401);
      const user = await tx.get('user', session.userId);
      fail(user && !user.disabled && (user.generation || 0) === session.generation, 'Account unavailable; sign in again', 401);
      return { ...publicUser(user), csrf: session.csrf };
    });
  }
  async redeem(raw, password) {
    fail(typeof raw === 'string' && /^[A-Za-z0-9_-]{43}$/.test(raw), 'Invalid invitation', 401);
    const hash = await passwordHash(password);
    return this.store.transaction(async tx => {
      const invite = await tx.get('invite', digest(raw));
      fail(invite && !invite.usedAt && invite.expiresAt > Date.now(), 'Invitation expired or already used', 401);
      const study = await tx.get('study', invite.studyId);
      fail(study && study.phase !== 'LOCKED' && study.invites[invite.code] === digest(raw), 'Invitation revoked', 401);
      const existing = study.experts[invite.code];
      let user = existing ? await tx.get('user', existing) : null;
      if (!user) {
        user = { id: crypto.randomUUID(), role: 'EXPERT', code: invite.code, studyId: invite.studyId,
          login: `${study.id}.${invite.code}`.toLowerCase(), createdAt: now() };
      }
      user.hash = hash;
      user.disabled = false;
      study.experts[invite.code] = user.id;
      invite.usedAt = now();
      const { audit } = require('./common');
      audit(study, user.code, existing ? 'ACCOUNT_RECOVERED' : 'INVITE_ACCEPTED');
      // Reissuing an invitation revokes every old session for that account.
      // Invalidate sessions without retaining raw session tokens.
      user.generation = (user.generation || 0) + 1;
      await tx.put('user', user.id, user);
      await tx.put('login', user.login, { userId: user.id });
      await tx.put('invite', digest(raw), invite); await tx.put('study', study.id, study);
      const session = await this.session(user, tx);
      session.user.login = user.login;
      return session;
    });
  }
}
module.exports = { ValidationAuth, token, publicUser, SESSION_MS };
