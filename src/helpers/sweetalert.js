import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  target: 'body',
  customClass: {
    container: 'sweetalert-toast-container',
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

export const showSuccessToast = (message) => {
  Toast.fire({
    icon: 'success',
    title: message,
  })
}

export const showErrorToast = (message) => {
  Toast.fire({
    icon: 'error',
    title: message,
  })
}

export const showConfirmationDialog = async (itemName = null) => {
  const title = itemName ? `Hapus "${itemName}"?` : 'Apakah Anda yakin?'
  const result = await Swal.fire({
    title: title,
    text: 'Tindakan ini tidak dapat dibatalkan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  })
  return result.isConfirmed
}

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error?.response) {
    return 'Unable to reach the server. Check your internet connection.'
  }
  const apiMsg = error.response?.data?.error?.message
  if (apiMsg) return apiMsg
  const status = error.response.status
  if (status >= 500) return 'Server is experiencing issues. Please try again later.'
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status === 429) return 'Too many requests. Please slow down and try again.'
  return fallback
}

export const showApiErrorToast = (error, fallback) => {
  if (error?._swalShown) return
  showErrorToast(getApiErrorMessage(error, fallback))
}

export const showErrorAlert = (title, text) => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'error',
    confirmButtonText: 'OK',
  })
}
