import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS, DEFAULT_PAGE_SIZE } from '../helpers/constants'

export const useVisitorHistoryStore = defineStore('visitorHistory', {
  state: () => ({
    histories: [],
    loading: false,
    downloadingReport: false,
    pagination: {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      total: 0,
    },
  }),
  actions: {
    async fetchVisitorHistories({
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      search = '',
      searchBy = 'name',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      organizationId = '',
      visitDate = '',
    } = {}) {
      this.loading = true
      try {
        const params = new URLSearchParams()
        params.append('page', page)
        params.append('pageSize', pageSize)
        if (search && searchBy) {
          params.append(searchBy, search)
        }
        if (sortBy) {
          params.append('sortBy', sortBy)
        }
        if (sortOrder) {
          params.append('sortOrder', sortOrder)
        }
        if (organizationId) {
          params.append('organizationId', organizationId)
        }
        if (visitDate) {
          params.append('visitDate', visitDate)
        }

        const response = await request.get(
          `${API_PATHS.VISITOR_HISTORIES.GET_ALL}?${params.toString()}`,
        )
        this.histories = response.data.data.data
        this.pagination.page = page
        this.pagination.pageSize = pageSize
        this.pagination.total = response.data.data.totalRecord
      } catch (error) {
        console.error('Error fetching visitor histories:', error)
      } finally {
        this.loading = false
      }
    },
    // Fire-and-forget from callers (e.g. the kiosk flow); still returns the
    // request promise for the rare caller that wants to await/catch it.
    // `silent: true` suppresses the global error popup — a failed background
    // history write shouldn't interrupt a visitor who already got their ticket.
    async recordVisit({ visitorId, organizationId }) {
      return request.post(
        API_PATHS.VISITOR_HISTORIES.CREATE_PUBLIC,
        { visitorId, organizationId },
        { silent: true },
      )
    },
    async downloadReport({
      visitorId = '',
      name = '',
      phoneNumber = '',
      email = '',
      organizationId = '',
      organizationName = '',
      organizationFullName = '',
      startDate,
      endDate = null,
    }) {
      this.downloadingReport = true
      try {
        const payload = { startDate }
        if (visitorId) payload.visitorId = visitorId
        if (name) payload.name = name
        if (phoneNumber) payload.phoneNumber = phoneNumber
        if (email) payload.email = email
        if (organizationId) payload.organizationId = organizationId
        if (organizationName) payload.organizationName = organizationName
        if (organizationFullName) payload.organizationFullName = organizationFullName
        if (endDate) payload.endDate = endDate

        const response = await request.post(API_PATHS.VISITOR_HISTORIES.REPORT, payload, {
          responseType: 'blob',
          headers: { accept: 'text/csv' },
        })

        const blob = response.data
        const disposition = response.headers?.['content-disposition'] || ''
        let filename = 'visitor-histories.csv'
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
        console.error('Error downloading visitor history report:', error)
        throw error
      } finally {
        this.downloadingReport = false
      }
    },
  },
})
