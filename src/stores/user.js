import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS, DEFAULT_PAGE_SIZE } from '../helpers/constants'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    user: null,
    loading: false,
    pagination: {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      total: 0,
    }
  }),
  actions: {
    async fetchUsers({ page = 1, pageSize = DEFAULT_PAGE_SIZE, search = '', searchBy = 'userName', sortBy = 'userName', sortOrder = 'asc', isActive = '' } = {}) {
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
        if (isActive !== '') {
          params.append('isActive', isActive)
        }
        
        const response = await request.get(`${API_PATHS.USERS.GET_ALL}?${params.toString()}`)
        this.users = response.data.data.data
        this.pagination.page = page
        this.pagination.pageSize = pageSize
        this.pagination.total = response.data.data.totalRecord
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchUser(id) {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.USERS.GET_DETAIL_BY_ID(id))
        this.user = data.data
      } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async createUser(user) {
      this.loading = true
      try {
        await request.post(API_PATHS.USERS.CREATE, user)
        await this.fetchUsers()
      } catch (error) {
        console.error('Error creating user:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async updateUser(id, user) {
      this.loading = true
      try {
        await request.put(API_PATHS.USERS.UPDATE(id), user)
        await this.fetchUsers()
      } catch (error) {
        console.error(`Error updating user with id ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async deleteUser(id) {
      this.loading = true
      try {
        await request.delete(API_PATHS.USERS.DELETE(id))
        await this.fetchUsers()
      } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    }
  }
})