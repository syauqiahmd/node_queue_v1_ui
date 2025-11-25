import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS } from '../helpers/constants'


export const useMenuStore = defineStore('menu', {
  state: () => ({
    menus: [],
    menu: null,
    loading: false
  }),
  actions: {
    async fetchMenus(params = {}) {
      this.loading = true
      try {
        const searchParams = new URLSearchParams(params)
        if (!searchParams.has('status')) {
          searchParams.append('status', 'active')
        }
        const { data } = await request.get(`${API_PATHS.MENUS.GET_ALL}?${searchParams.toString()}`)
        this.menus = data.data
        return data.data
      } catch (error) {
        console.error('Error fetching menus:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchMenu(id) {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.MENUS.GET_DETAIL_BY_ID(id))
        this.menu = data.data
      } catch (error) {
        console.error(`Error fetching menu with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async createMenu(menu) {
      this.loading = true
      try {
        await request.post(API_PATHS.MENUS.CREATE, menu)
        await this.fetchMenus()
      } catch (error) {
        console.error('Error creating menu:', error)
      } finally {
        this.loading = false
      }
    },
    async updateMenu(id, menu) {
      this.loading = true
      try {
        await request.put(API_PATHS.MENUS.UPDATE(id), menu)
      } catch (error) {
        console.error(`Error updating menu with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async deleteMenu(id) {
      this.loading = true
      try {
        await request.delete(API_PATHS.MENUS.DELETE(id))
        await this.fetchMenus()
      } catch (error) {
        console.error(`Error deleting menu with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async updateMenuOrder(menus) {
      this.loading = true
      try {
        await request.put(API_PATHS.MENUS.UPDATE_ORDER, menus)
      } catch (error) {
        console.error('Error updating menu order:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
