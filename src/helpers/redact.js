// Masks personal data before anything leaves the browser for Grafana (see observability.js).
// Mirrors the backend's src/infra/utils/redact.js.

const PHONE_PATTERN = /(?<![\w+-])(?:\+62|62|0)8\d{7,11}(?![\w-])/g
// The lookbehind only lets a match start at the beginning of a word, which keeps this linear;
// without it a long string took seconds.
const EMAIL_PATTERN = /(?<![\w.%+-])[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
const JWT_PATTERN = /\beyJ[\w-]+\.[\w-]+\.[\w-]+/g
const TOKEN_PATTERN = /[^\s"']+/g

const MAX_DEPTH = 8

// Query strings can carry search filters (?phoneNumber=...) - keep only the path. Drops a `?query`
// (up to `#`) when the text before it, back to the previous `?`/`#`, contains a `/`.
// Done by hand because the equivalent regex backtracks badly on long paths.
const stripQueryStrings = (value) =>
  value.replace(TOKEN_PATTERN, (token) => {
    let out = ''
    let segStart = 0
    let i = 0
    while (i < token.length) {
      const ch = token[i]
      if (ch === '?' && token.slice(segStart, i).includes('/')) {
        const hash = token.indexOf('#', i)
        const end = hash === -1 ? token.length : hash
        out += token.slice(segStart, i)
        segStart = end
        i = end
        continue
      }
      if (ch === '?' || ch === '#') {
        out += token.slice(segStart, i + 1)
        segStart = i + 1
      }
      i++
    }
    return out + token.slice(segStart)
  })

export const redactString = (value) =>
  stripQueryStrings(value)
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
