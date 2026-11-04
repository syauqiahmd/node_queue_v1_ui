import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS } from '../helpers/constants'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('access_token') || null,
    loading: false,
    error: null,
    // Not persisted: the stored token is re-checked once per page load.
    sessionValidated: false,
  }),
  getters: {
    isAuthenticated() {
      return !!this.accessToken
    },
    isAdmin() {
      return (this.user?.role || this.user?.roleName) === 'ADMIN'
    },
  },
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const { data } = await request.post(API_PATHS.AUTH.LOGIN, credentials)
        if (!data.success) {
          this.error = data.message || 'Login failed.'
          return false
        }
        this.accessToken = data.data.token
        this.user = data.data.userDetail
        localStorage.setItem('access_token', this.accessToken)
        localStorage.setItem('user', JSON.stringify(this.user))
        this.sessionValidated = true
        return true
      } catch (error) {
        this.error =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'An unexpected error occurred during login.'
        return false
      } finally {
        this.loading = false
      }
    },
    async logout() {
      if (!this.accessToken) return
      try {
        // Silent: an expired session makes this 401, which must not re-trigger the session popup.
        await request.post(API_PATHS.AUTH.LOGOUT, null, { silent: true })
      } catch {
        // proceed with local cleanup regardless
      }
      this.clearSession()
    },
    clearSession() {
      this.user = null
      this.accessToken = null
      this.sessionValidated = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    },
    // Returns false only when the API says the stored token is no longer valid (401).
    // Network/server errors don't lock the user out.
    async validateSession() {
      if (!this.accessToken) return false
      if (this.sessionValidated) return true
      try {
        await request.get(API_PATHS.AUTH.VALIDATE_TOKEN, { silent: true })
        this.sessionValidated = true
        return true
      } catch (error) {
        if (error.response?.status === 401) {
          this.clearSession()
          return false
        }
        return true
      }
    },
  },
})
