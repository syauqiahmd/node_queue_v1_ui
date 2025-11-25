import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS } from '../helpers/constants'
const DEFAULT_PAGE_SIZE = 10;

export const useAdsStore = defineStore('ads', {
  state: () => ({
    ads: [],
    publicAds: [],
    ad: null,
    loading: false,
    nextCursor: null,
    prevCursor: null,
  }),
  actions: {
    async fetchPublicAds() {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.ADS.GET_ALL_PUBLIC)
        this.publicAds = data.data
      } catch (error) {
        console.error('Error fetching ads:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchAds({ cursor = null, search = '', searchBy = 'title', sortBy = 'title', sortOrder = 'asc' } = {}) {
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
        const { data } = await request.get(`${API_PATHS.ADS.GET_ALL}?${params.toString()}`)
        this.ads = data.data
        this.nextCursor = data.meta.nextCursor
        this.prevCursor = data.meta.prevCursor
      } catch (error) {
        console.error('Error fetching ads:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchAd(id) {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.ADS.GET_DETAIL_BY_ID(id))
        this.ad = data.data
      } catch (error) {
        console.error(`Error fetching ad with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async createAd(ad) {
      this.loading = true
      try {
        await request.post(API_PATHS.ADS.CREATE, ad)
        await this.fetchAds()
      } catch (error) {
        console.error('Error creating ad:', error)
      } finally {
        this.loading = false
      }
    },
    async updateAd(id, ad) {
      this.loading = true
      try {
        await request.put(API_PATHS.ADS.UPDATE(id), ad)
        await this.fetchAds()
      } catch (error) {
        console.error(`Error updating ad with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async deleteAd(id) {
      this.loading = true
      try {
        await request.delete(API_PATHS.ADS.DELETE(id))
        await this.fetchAds()
      } catch (error) {
        console.error(`Error deleting ad with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    }
  }
})
