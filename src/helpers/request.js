import axios from 'axios'
import Swal from 'sweetalert2'
import { useAuthStore } from '../stores/auth'
import router from '../router'
import { useLoadingBar } from '../composables/useLoadingBar'
import { API_PATHS } from './constants'
import { reportApiError } from './observability'

const { start: startLoading, finish: finishLoading } = useLoadingBar()

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (API_BASE_URL && API_BASE_URL.startsWith('localhost')) {
  API_BASE_URL = `http://${API_BASE_URL}`
}

// Several requests can fail with 401 at once; show the session popup and log out only once.
let handlingSessionExpiry = false

const request = axios.create({
  baseURL: API_BASE_URL || '/api',
})

request.interceptors.request.use(
  (config) => {
    startLoading()
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    finishLoading()
    return Promise.reject(error)
  },
)

// Downloads use responseType 'blob', so an error body arrives as a Blob. Parse it back to JSON
// so the API's error message (e.g. a date-range validation) reaches the user.
const parseBlobErrorBody = async (error) => {
  const data = error.response?.data
  if (typeof Blob === 'undefined' || !(data instanceof Blob)) return
  try {
    error.response.data = JSON.parse(await data.text())
  } catch {
    // Not JSON; leave the body as is.
  }
}

// Footer link for the generic error popup: copies the transaction ID when the API sent one,
// otherwise the whole error response.
const buildErrorFooter = (error, transactionId) => {
  const copyOnClick = (id, text) => () => {
    document.getElementById(id).addEventListener('click', (e) => {
      e.preventDefault()
      navigator.clipboard.writeText(text)
      Swal.showValidationMessage('Copied to clipboard!')
    })
  }
  if (transactionId) {
    return {
      footerContent: `<a href="#" id="copy-transaction-id">Copy Transaction ID: ${transactionId}</a>`,
      didOpenFunction: copyOnClick('copy-transaction-id', transactionId),
    }
  }
  const fullErrorResponse = JSON.stringify(error.response?.data || error.response, null, 2)
  return {
    footerContent: `<a href="#" id="copy-full-error">Copy Full Error Response</a>`,
    didOpenFunction: copyOnClick('copy-full-error', fullErrorResponse),
  }
}

request.interceptors.response.use(
  (response) => {
    finishLoading()
    return response
  },
  async (error) => {
    finishLoading()
    await parseBlobErrorBody(error)
    reportApiError(error)
    if (error.config?.silent) {
      error._swalShown = true
      return Promise.reject(error)
    }

    if (error.response && error.response.status === 404) {
      const message = error.response?.data?.error?.message || 'Resource not found.'
      const code = error.response?.data?.error?.code || 'Not Found'
      error._swalShown = true
      Swal.fire({ icon: 'error', title: code, text: message })
      return Promise.reject(error)
    }

    if (error.response && error.response.status === 403) {
      error._swalShown = true
      Swal.fire({
        icon: 'error',
        title: 'Access denied',
        text:
          error.response?.data?.error?.message ||
          'You do not have permission to perform this action.',
      })
      return Promise.reject(error)
    }

    if (error.response && error.response.status === 429) {
      // Mostly hit on the public kiosk, so the message is in Indonesian.
      error._swalShown = true
      Swal.fire({
        icon: 'warning',
        title: 'Mohon tunggu sebentar',
        text: 'Terlalu banyak permintaan. Silakan coba lagi dalam 1 menit.',
        timer: 5000,
        timerProgressBar: true,
      })
      return Promise.reject(error)
    }

    if (error.response && error.response.status === 401) {
      // Login endpoint returning 401 means invalid credentials — let the
      // auth store handle it inline; don't show the session-expired popup.
      const isLoginRequest = error.config?.url?.includes(API_PATHS.AUTH.LOGIN)
      if (!isLoginRequest && !handlingSessionExpiry) {
        handlingSessionExpiry = true
        const authStore = useAuthStore()
        const errorMessage =
          error.response?.data?.error?.message || 'Your session has expired. Please log in again.'
        const errorTitle = error.response?.data?.error?.code || 'Unauthorized'
        Swal.fire({
          icon: 'error',
          title: errorTitle,
          text: errorMessage,
        })
          .then(async () => {
            await authStore.logout()
            await router.push('/login')
          })
          .finally(() => {
            handlingSessionExpiry = false
          })
      }
      error._swalShown = true
      return Promise.reject(error)
    }

    const transactionId = error.response?.data?.transactionId
    const { footerContent, didOpenFunction } = buildErrorFooter(error, transactionId)

    error._swalShown = true
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: transactionId
        ? error.response?.data?.error?.message || 'Something went wrong!'
        : 'An unexpected error occurred. Please report this to your administrator.',
      footer: footerContent,
      didOpen: didOpenFunction,
    })
    return Promise.reject(error)
  },
)

export default request
