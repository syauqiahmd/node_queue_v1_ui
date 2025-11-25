
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../stores/auth';
import router from '../router';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (API_BASE_URL && API_BASE_URL.startsWith('localhost')) {
  API_BASE_URL = `http://${API_BASE_URL}`;
}

const request = axios.create({
  baseURL: API_BASE_URL || '/api',
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if ((error.response && error.response.status === 404)) {
      router.push('/not-found-page')
      return
    }

    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      const errorMessage =
        error.response?.data?.error?.message?.message || 'Your session has expired. Please log in again.'
      const errorTitle = error.response?.data?.error?.code || 'Unauthorized'

      Swal.fire({
        icon: 'error',
        title: errorTitle,
        text: errorMessage
      }).then(() => {
        authStore.logout()
        router.push('/login')
      })
      return Promise.reject(error)
    }

    let footerContent
    let didOpenFunction
    const transactionId = error.response?.data?.transactionId

    if (transactionId) {
      footerContent = `<a href="#" id="copy-transaction-id">Copy Transaction ID: ${transactionId}</a>`
      didOpenFunction = () => {
        document.getElementById('copy-transaction-id').addEventListener('click', (e) => {
          e.preventDefault()
          navigator.clipboard.writeText(transactionId)
          Swal.showValidationMessage('Copied to clipboard!')
        })
      }
    } else {
      const fullErrorResponse = JSON.stringify(error.response?.data || error.response, null, 2)
      footerContent = `<a href="#" id="copy-full-error">Copy Full Error Response</a>`
      didOpenFunction = () => {
        document.getElementById('copy-full-error').addEventListener('click', (e) => {
          e.preventDefault()
          navigator.clipboard.writeText(fullErrorResponse)
          Swal.showValidationMessage('Copied to clipboard!')
        })
      }
    }

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: transactionId
        ? error.response?.data?.error?.message || 'Something went wrong!'
        : ' Please report this error to the developer.',
      footer: footerContent,
      didOpen: didOpenFunction
    })
    return Promise.reject(error)
  }
);

export default request;
