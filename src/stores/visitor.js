import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS, DEFAULT_PAGE_SIZE } from '../helpers/constants'

export const useVisitorStore = defineStore('visitor', {
  state: () => ({
    visitors: [],
    loading: false,
    downloadingReport: false,
    pagination: {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      total: 0,
    },
  }),
  actions: {
    async fetchVisitors({
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      search = '',
      searchBy = 'name',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      organizationId = '',
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

        const response = await request.get(`${API_PATHS.VISITORS.GET_ALL}?${params.toString()}`)
        this.visitors = response.data.data.data
        this.pagination.page = page
        this.pagination.pageSize = pageSize
        this.pagination.total = response.data.data.totalRecord
      } catch (error) {
        console.error('Error fetching visitors:', error)
      } finally {
        this.loading = false
      }
    },
    async upsertVisitor(visitor) {
      const { data } = await request.post(API_PATHS.VISITORS.UPSERT_PUBLIC, visitor)
      return data?.data
    },
    async downloadReport({
      name = '',
      phoneNumber = '',
      email = '',
      organizationId = '',
      startDate,
      endDate = null,
    }) {
      this.downloadingReport = true
      try {
        const payload = { startDate }
        if (name) payload.name = name
        if (phoneNumber) payload.phoneNumber = phoneNumber
        if (email) payload.email = email
        if (organizationId) payload.organizationId = organizationId
        if (endDate) payload.endDate = endDate

        const response = await request.post(API_PATHS.VISITORS.REPORT, payload, {
          responseType: 'blob',
          headers: { accept: 'text/csv' },
        })

        const blob = response.data
        const disposition = response.headers?.['content-disposition'] || ''
        let filename = 'visitors.csv'
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
        console.error('Error downloading visitor report:', error)
        throw error
      } finally {
        this.downloadingReport = false
      }
    },
  },
})
