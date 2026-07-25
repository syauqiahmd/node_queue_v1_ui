import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS, DEFAULT_PAGE_SIZE } from '../helpers/constants'

export const useVisitorStore = defineStore('visitor', {
  state: () => ({
    visitors: [],
    loading: false,
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
  },
})
