import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS } from '../helpers/constants'
const DEFAULT_PAGE_SIZE = 10;

export const useSliderStore = defineStore('slider', {
  state: () => ({
    sliders: [],
    slider: null,
    loading: false,
    nextCursor: null,
    prevCursor: null,
  }),
  actions: {
    async fetchPublicSliders() {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.SLIDERS.GET_ALL_PUBLIC)
        this.sliders = data.data
      } catch (error) {
        console.error('Error fetching sliders:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchSliders({ cursor = null, search = '', searchBy = 'title', sortBy = 'title', sortOrder = 'asc' } = {}) {
      this.loading = true
      try {
        const params = new URLSearchParams()
        if (cursor) {
          params.append('cursor', cursor)
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
        params.append('take', DEFAULT_PAGE_SIZE)
        const { data } = await request.get(`${API_PATHS.SLIDERS.GET_ALL}?${params.toString()}`)
        this.sliders = data.data
        this.nextCursor = data.meta.nextCursor
        this.prevCursor = data.meta.prevCursor
      } catch (error) {
        console.error('Error fetching sliders:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchSlider(id) {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.SLIDERS.GET_DETAIL_BY_ID(id))
        this.slider = data.data
      } catch (error) {
        console.error(`Error fetching slider with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async createSlider(slider) {
      this.loading = true
      try {
        await request.post(API_PATHS.SLIDERS.CREATE, slider)
        await this.fetchSliders()
      } catch (error) {
        console.error('Error creating slider:', error)
      } finally {
        this.loading = false
      }
    },
    async updateSlider(id, slider) {
      this.loading = true
      try {
        await request.put(API_PATHS.SLIDERS.UPDATE(id), slider)
        await this.fetchSliders()
      } catch (error) {
        console.error(`Error updating slider with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async deleteSlider(id) {
      this.loading = true
      try {
        await request.delete(API_PATHS.SLIDERS.DELETE(id))
        await this.fetchSliders()
      } catch (error) {
        console.error(`Error deleting slider with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    }
  }
})
