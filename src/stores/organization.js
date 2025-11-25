import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS } from '../helpers/constants'

const DEFAULT_PAGE_SIZE = 10;

export const useOrganizationStore = defineStore('organization', {
  state: () => ({
    organizations: [],
    organization: null,
    loading: false,
    pagination: {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      total: 0,
    }
  }),
  actions: {
    async fetchOrganizations({ page = 1, pageSize = DEFAULT_PAGE_SIZE, search = '', searchBy = 'name', sortBy = 'name', sortOrder = 'asc', isActive = '', pagination = true } = {}) {
      this.loading = true
      try {
        const params = new URLSearchParams()
        if (pagination) {
          params.append('page', page)
          params.append('pageSize', pageSize)
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
        
        const response = await request.get(`${API_PATHS.ORGANIZATIONS.GET_ALL}?${params.toString()}`)
        this.organizations = response.data.data.data
        this.pagination.page = page
        this.pagination.pageSize = pageSize
        this.pagination.total = response.data.data.totalRecord
      } catch (error) {
        console.error('Error fetching organizations:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchOrganization(id) {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.ORGANIZATIONS.GET_DETAIL_BY_ID(id))
        this.organization = data.data
      } catch (error)
{
        console.error(`Error fetching organization with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async createOrganization(organization) {
      this.loading = true
      try {
        await request.post(API_PATHS.ORGANIZATIONS.CREATE, organization)
        await this.fetchOrganizations()
      } catch (error) {
        console.error('Error creating organization:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async updateOrganization(id, organization) {
      this.loading = true
      try {
        await request.put(API_PATHS.ORGANIZATIONS.UPDATE(id), organization)
        await this.fetchOrganizations()
      } catch (error) {
        console.error(`Error updating organization with id ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async deleteOrganization(id) {
      this.loading = true
      try {
        await request.delete(API_PATHS.ORGANIZATIONS.DELETE(id))
        await this.fetchOrganizations()
      } catch (error) {
        console.error(`Error deleting organization with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
  }
})
