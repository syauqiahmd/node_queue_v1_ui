import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS, DEFAULT_PAGE_SIZE } from '../helpers/constants'

export const useServiceStore = defineStore('service', {
  state: () => ({
    services: [],
    publicServices: [],
    service: null,
    loading: false,
    pagination: {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      total: 0,
    },
  }),
  actions: {
    async fetchServices({
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      search = '',
      searchBy = 'name',
      sortBy = 'name',
      sortOrder = 'asc',
      isActive = '',
      organizationId = '',
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
        if (organizationId) {
          params.append('organizationId', organizationId)
        }

        const response = await request.get(`${API_PATHS.SERVICES.GET_ALL}?${params.toString()}`)
        this.services = response.data.data.data
        this.pagination.page = page
        this.pagination.pageSize = pageSize
        this.pagination.total = response.data.data.totalRecord
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchService(id) {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.SERVICES.GET_DETAIL_BY_ID(id))
        this.service = data.data
      } catch (error) {
        console.error(`Error fetching service with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async fetchPublicServices() {
      this.loading = true
      try {
        const headers = { accept: 'application/json' }
        const url = API_PATHS.SERVICES.GET_ALL_PUBLIC
        const response = await request.get(url, { headers })
        const payload = response.data?.data?.data || response.data?.data || []
        this.publicServices = payload
      } catch (error) {
        console.error('Error fetching public services:', error)
        this.publicServices = []
        throw error
      } finally {
        this.loading = false
      }
    },
    async createService(service) {
      this.loading = true
      try {
        await request.post(API_PATHS.SERVICES.CREATE, service)
        await this.fetchServices()
      } catch (error) {
        console.error('Error creating service:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async updateService(id, service) {
      this.loading = true
      try {
        await request.put(API_PATHS.SERVICES.UPDATE(id), service)
        await this.fetchServices()
      } catch (error) {
        console.error(`Error updating service with id ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async deleteService(id) {
      this.loading = true
      try {
        await request.delete(API_PATHS.SERVICES.DELETE(id))
        await this.fetchServices()
      } catch (error) {
        console.error(`Error deleting service with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
  },
})
