import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS } from '../helpers/constants'

export const useReportStore = defineStore('report', {
  state: () => ({
    loading: false,
  }),
  actions: {
    async downloadDailyServiceStats({
      organizationId = null,
      serviceId = null,
      startDate,
      endDate = null,
    }) {
      this.loading = true
      try {
        const payload = { startDate }
        if (organizationId) payload.organizationId = organizationId
        if (serviceId) payload.serviceId = serviceId
        if (endDate) payload.endDate = endDate

        const response = await request.post(API_PATHS.REPORTS.DAILY_SERVICE_STATS, payload, {
          responseType: 'blob',
          headers: { accept: 'text/csv' },
        })

        const blob = response.data
        const disposition = response.headers?.['content-disposition'] || ''
        let filename = 'daily-service-stats.csv'
        const match = /filename\*=UTF-8''([^;]+)|filename=(?:"([^"]+)"|([^;]+))/i.exec(disposition)
        if (match) {
          filename = decodeURIComponent(match[1] || match[2] || match[3])
        }

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error downloading report:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
