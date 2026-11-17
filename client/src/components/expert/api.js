export const VALIDATION_API = '/api/expert-validation';
let csrf = '';
export function setValidationCsrf(value) { csrf = value || ''; }
export async function validationRequest(path, options = {}) {
  const response = await fetch(`${VALIDATION_API}${path}`, {
    ...options, credentials: 'same-origin', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...(csrf ? { 'X-Validation-CSRF': csrf } : {}), ...options.headers },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {})
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(data.error || `HTTP ${response.status}`); error.status = response.status; throw error; }
  return data;
}
export const studyPath = id => `/studies/${encodeURIComponent(id)}`;
