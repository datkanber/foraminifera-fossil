export const VALIDATION_API = '/api/expert-validation';
let csrf = '';
export function setValidationCsrf(value) { csrf = typeof value === 'string' ? value : ''; }

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
export function isValidationSession(value) {
  return object(value) && object(value.user) && nonempty(value.csrf) &&
    nonempty(value.user.id) && nonempty(value.user.code) &&
    (value.user.role === 'COORDINATOR' || (value.user.role === 'EXPERT' && nonempty(value.user.studyId)));
}

function unavailable(status = 502) {
  const english = typeof document !== 'undefined' && document.documentElement.lang === 'en';
  const error = new Error(english
    ? 'The expert evaluation service is currently unavailable. Please try again later or contact your coordinator.'
    : 'Uzman değerlendirme servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin veya koordinatörünüze bildirin.');
  error.status = status;
  error.code = 'INVALID_VALIDATION_RESPONSE';
  return error;
}

export async function validationRequest(path, options = {}) {
  const response = await fetch(`${VALIDATION_API}${path}`, {
    ...options, credentials: 'same-origin', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...(csrf ? { 'X-Validation-CSRF': csrf } : {}), ...options.headers },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {})
  });
  // An SPA fallback can return index.html with HTTP 200. Never treat that as
  // an authenticated session, or silently turn a parsing failure into {}.
  const contentType = (response.headers.get('content-type') || '').split(';')[0].trim();
  if (!/^application\/(?:[\w.-]+\+)?json$/i.test(contentType)) throw unavailable(response.ok ? 502 : response.status);
  let data;
  try { data = await response.json(); } catch { throw unavailable(response.ok ? 502 : response.status); }
  if (!response.ok) {
    const error = new Error(object(data) && nonempty(data.error) ? data.error : `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  if (!object(data) && !Array.isArray(data)) throw unavailable();
  if (['/auth/session', '/auth/login', '/auth/redeem'].includes(path) && !isValidationSession(data)) throw unavailable();
  if (path === '/studies' && (!options.method || options.method === 'GET') &&
      (!Array.isArray(data) || !data.every(s => object(s) && nonempty(s.id) && nonempty(s.title)))) throw unavailable();
  return data;
}
export const studyPath = id => `/studies/${encodeURIComponent(id)}`;
