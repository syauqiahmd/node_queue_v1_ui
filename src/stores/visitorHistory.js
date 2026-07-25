import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS, DEFAULT_PAGE_SIZE } from '../helpers/constants'

export const useVisitorHistoryStore = defineStore('visitorHistory', {
  state: () => ({
    histories: [],
    loading: false,
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
  },
})
