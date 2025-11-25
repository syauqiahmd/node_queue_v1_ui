import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS } from '../helpers/constants'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('access_token') || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated() {
      return !!this.accessToken
    }
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
        this.error = error.response?.data?.message || 'An unexpected error occurred during login.'
        console.error('Login error:', error)
        return false
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.accessToken = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    }
  }
})
