import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS } from '../helpers/constants'

export const useSummaryStore = defineStore('summary', {
  state: () => ({
    summary: {},
    loading: false
  }),
  actions: {
    async fetchSummary() {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.INTERNAL_SUMMARY.GET)
        this.summary = data.data
        this.loading = false
      } catch (error) {
        console.error('Error fetching summary:', error)
      } finally {
        this.loading = false
      }
    },
  }
})

