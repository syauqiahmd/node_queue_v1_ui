import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS, DEFAULT_PAGE_SIZE } from '../helpers/constants'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counters: [],
    counter: null,
    loading: false,
    pagination: {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      total: 0,
    },
  }),
  actions: {
    async fetchCounters({
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      search = '',
      searchBy = 'counterNumber',
      sortBy = 'counterNumber',
      sortOrder = 'asc',
      isActive = '',
      serviceId = '',
      pagination = true,
    } = {}) {
      this.loading = true
      try {
        const params = new URLSearchParams()
        if (pagination) {
          params.append('page', page)
          params.append('pageSize', pageSize)
        }
        // Without this the API falls back to its default page size (10).
        if (!pagination) {
          params.append('pagination', 'false')
        }
        if (search && searchBy) {
          params.append(searchBy, search)
        }
        if (sortBy) {
          params.append('sortBy', sortBy)
        }
        if (sortOrder) {
          params.append('sortOrder', sortOrder)
        }
        if (isActive !== '') {
          params.append('isActive', isActive)
        }
        if (serviceId) {
          params.append('serviceId', serviceId)
        }

        const response = await request.get(`${API_PATHS.COUNTERS.GET_ALL}?${params.toString()}`)
        this.counters = response.data.data.data
        this.pagination.page = page
        this.pagination.pageSize = pageSize
        this.pagination.total = response.data.data.totalRecord
      } catch (error) {
        console.error('Error fetching counters:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchCounter(id) {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.COUNTERS.GET_DETAIL_BY_ID(id))
        this.counter = data.data
      } catch (error) {
        console.error(`Error fetching counter with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async createCounter(counter) {
      this.loading = true
      try {
        await request.post(API_PATHS.COUNTERS.CREATE, counter)
        await this.fetchCounters()
      } catch (error) {
        console.error('Error creating counter:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async updateCounter(id, counter) {
      this.loading = true
      try {
        await request.put(API_PATHS.COUNTERS.UPDATE(id), counter)
        await this.fetchCounters()
      } catch (error) {
        console.error(`Error updating counter with id ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async deleteCounter(id) {
      this.loading = true
      try {
        await request.delete(API_PATHS.COUNTERS.DELETE(id))
        await this.fetchCounters()
      } catch (error) {
        console.error(`Error deleting counter with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
  },
})
