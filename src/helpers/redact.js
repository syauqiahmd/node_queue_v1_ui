// Masks personal data before anything leaves the browser for Grafana (see observability.js).
// Mirrors the backend's src/infra/utils/redact.js.

const PHONE_PATTERN = /(?<![\w+-])(?:\+62|62|0)8\d{7,11}(?![\w-])/g
const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
const JWT_PATTERN = /\beyJ[\w-]+\.[\w-]+\.[\w-]+/g
// Query strings can carry search filters (?phoneNumber=...) - keep only the path.
const URL_QUERY_PATTERN = /(https?:\/\/[^\s?#"']+|\/[^\s?#"']*)\?[^\s#"']*/g

const MAX_DEPTH = 8

export const redactString = (value) =>
  value
    .replace(URL_QUERY_PATTERN, '$1')
    .replace(JWT_PATTERN, '[REDACTED]')
    .replace(EMAIL_PATTERN, '[EMAIL]')
    .replace(PHONE_PATTERN, '[PHONE]')

/** Returns a redacted deep copy; never mutates the input. */
export function redact(value, depth = 0, seen = new WeakSet()) {
  if (typeof value === 'string') return redactString(value)
  if (value === null || typeof value !== 'object') return value
  if (depth >= MAX_DEPTH) return '[Truncated]'
  if (seen.has(value)) return '[Circular]'
  seen.add(value)

  if (Array.isArray(value)) return value.map((item) => redact(item, depth + 1, seen))
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, redact(item, depth + 1, seen)]),
  )
}
