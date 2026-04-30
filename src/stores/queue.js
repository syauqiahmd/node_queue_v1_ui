import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS } from '../helpers/constants'

export const useQueueStore = defineStore('queue', {
  state: () => ({
    queueList: [],
    queueSummary: null,
    loading: false,
  }),
  actions: {
    async requestPublicTicket({ serviceId }) {
      this.loading = true
      try {
        const headers = { accept: 'application/json', 'Content-Type': 'application/json' }
        const { data } = await request.post(
          API_PATHS.TICKETS.CREATE_PUBLIC,
          { serviceId },
          { headers },
        )
        return data?.data
      } catch (error) {
        console.error('Error requesting public ticket:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async callNextTicket({ serviceId, counterId }) {
      this.loading = true
      try {
        await request.post(API_PATHS.QUEUES.CALL, { serviceId, counterId })
      } catch (error) {
        console.error('Error calling next ticket:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async performTicketAction({ action, queueId, counterId }) {
      this.loading = true
      try {
        await request.post(API_PATHS.QUEUES.ACTION, { action, queueId, counterId })
      } catch (error) {
        console.error('Error performing ticket action:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async fetchQueueList(serviceId, { status = '', counterId = '' } = {}) {
      this.loading = true
      try {
        const params = new URLSearchParams()
        if (status) {
          params.append('status', status)
        }
        if (counterId) {
          params.append('counterId', counterId)
        }
        const { data } = await request.get(
          `${API_PATHS.QUEUES.GET_LIST(serviceId)}?${params.toString()}`,
        )
        this.queueList = data.data
      } catch (error) {
        console.error(`Error fetching queue list for service ${serviceId}:`, error)
      } finally {
        this.loading = false
      }
    },
    async fetchQueueSummary(serviceId, { status = '', counterId = '' } = {}) {
      this.loading = true
      try {
        const params = new URLSearchParams()
        if (status) {
          params.append('status', status)
        }
        if (counterId) {
          params.append('counterId', counterId)
        }
        const { data } = await request.get(
          `${API_PATHS.QUEUES.GET_SUMMARY(serviceId)}?${params.toString()}`,
        )
        this.queueSummary = data.data
      } catch (error) {
        console.error(`Error fetching queue summary for service ${serviceId}:`, error)
      } finally {
        this.loading = false
      }
    },
    async prioritizeTicket(queueId) {
      this.loading = true
      try {
        await request.put(API_PATHS.QUEUES.PRIORITIZE(queueId))
      } catch (error) {
        console.error(`Error prioritizing ticket ${queueId}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
