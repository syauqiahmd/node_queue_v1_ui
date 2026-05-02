import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS } from '../helpers/constants'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('access_token') || null,
    loading: false,
    error: null,
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
        if (data.success) {
          this.accessToken = data.data.token
          this.user = data.data.userDetail
          localStorage.setItem('access_token', this.accessToken)
          localStorage.setItem('user', JSON.stringify(this.user))
          return true
        } else {
          this.error = data.message || 'Login failed.'
          return false
        }
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
        await request.post(API_PATHS.AUTH.LOGOUT)
      } catch {
        // proceed with local cleanup regardless
      }
      this.user = null
      this.accessToken = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    },
  },
})
