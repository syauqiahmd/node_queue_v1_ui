import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk'
import { redact } from './redact'

let faro = null

/**
 * Starts Grafana Faro (frontend errors, web vitals, page views) when VITE_FARO_URL is set.
 * Without it this is a no-op, so local development sends nothing.
 */
export function initObservability() {
  const url = import.meta.env.VITE_FARO_URL
  if (!url || faro) return faro

  faro = initializeFaro({
    url,
    app: {
      name: 'qms-mpp-ui',
      version: import.meta.env.VITE_APP_VERSION || 'unknown',
      environment: import.meta.env.MODE,
    },
    instrumentations: [
      // Console output can contain API payloads with personal data, so it isn't collected.
      ...getWebInstrumentations({ captureConsole: false }),
    ],
    // Last step before data leaves the browser: mask phone numbers, emails, tokens, and
    // drop query strings from URLs (page URLs, resource timings, error messages).
    beforeSend: (item) => redact(item),
  })
  return faro
}

/** Forwards Vue component errors (which don't reach window.onerror) to Faro. */
export function attachVueErrorHandler(app) {
  const previous = app.config.errorHandler
  app.config.errorHandler = (err, instance, info) => {
    faro?.api.pushError(err instanceof Error ? err : new Error(String(err)), {
      context: { source: 'vue', info: String(info) },
    })
    if (previous) {
      previous(err, instance, info)
      return
    }
    console.error(err)
  }
}

/**
 * Reports failed API calls: server errors (5xx) and network failures. Client errors (4xx)
 * are expected (validation, expired session) and are not reported. The backend
 * transactionId is attached so the error can be looked up in the API logs.
 */
export function reportApiError(error) {
  if (!faro) return
  const status = error.response?.status
  if (status && status < 500) return

  const config = error.config || {}
  const path = String(config.url || '').split('?')[0]
  faro.api.pushError(
    new Error(`API ${status || 'network error'}: ${config.method?.toUpperCase()} ${path}`),
    {
      type: 'ApiError',
      context: {
        method: String(config.method || '').toUpperCase(),
        path,
        status: String(status || 'network_error'),
        transactionId: String(error.response?.data?.transactionId || ''),
      },
    },
  )
}
