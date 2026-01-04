import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS } from '../helpers/constants'

export const useCronStore = defineStore('cron', {
  state: () => ({
    loading: false,
  }),
  actions: {
    async triggerCron({ date, cronType, masterPassword }) {
      this.loading = true
      try {
        const payload = { date, cronType, masterPassword }
        const { data } = await request.post(API_PATHS.CRON.TRIGGER, payload)
        return data?.data ?? data
      } catch (error) {
        console.error('Error triggering cron:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
