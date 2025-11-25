<template>
  <div class="space-y-5 sm:space-y-6">
    <PageTitle :pageTitle="currentPageTitle" />

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <ComponentCard>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Select Service</h3>
        <select
          v-model="selectedServiceId"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        >
          <option :value="null">-- Select Service --</option>
          <option v-for="service in services" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
        </select>
      </ComponentCard>

      <ComponentCard>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Select Counter</h3>
        <select
          v-model="selectedCounterId"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        >
          <option :value="null">-- Select Counter --</option>
          <option v-for="counter in counters" :key="counter.id" :value="counter.id">
            {{ counter.counterNumber }}
          </option>
        </select>
      </ComponentCard>

      <ComponentCard v-if="queueSummary">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Queue Summary</h3>
        <div class="space-y-2">
          <p class="text-gray-700 dark:text-gray-300">
            Total Queued: {{ queueSummary.totalQueued }}
          </p>
          <p class="text-gray-700 dark:text-gray-300">In Progress: {{ queueSummary.inProgress }}</p>
          <p class="text-gray-700 dark:text-gray-300">Completed: {{ queueSummary.completed }}</p>
        </div>
      </ComponentCard>
    </div>

    <ComponentCard v-if="selectedServiceId">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Queue Actions</h3>
      <div class="flex space-x-4">
        <button
          @click="callNext"
          :disabled="!selectedCounterId || queueStore.loading"
          class="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Call Next
        </button>
        <button
          @click="resolveTicket"
          :disabled="!selectedCounterId || queueStore.loading"
          class="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-success-500 text-white font-medium hover:bg-success-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Resolve Current
        </button>
        <button
          @click="retryTicket"
          :disabled="!selectedCounterId || queueStore.loading"
          class="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-warning-500 text-white font-medium hover:bg-warning-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Retry Current
        </button>
      </div>
    </ComponentCard>

    <ComponentCard v-if="selectedServiceId">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Queue List</h3>
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-5 py-3 text-left w-1/20 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">#</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Ticket Number
                  </p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Called By
                  </p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Actions</p>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(ticket, index) in queueList"
                :key="index"
                class="border-t border-gray-100 dark:border-gray-800"
              >
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ index + 1 }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ ticket.ticketNumber }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-theme-xs font-medium capitalize',
                      {
                        'bg-info-50 text-info-700 dark:bg-info-500/15 dark:text-info-500':
                          ticket.status === 'waiting',
                        'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-500':
                          ticket.status === 'in-progress',
                        'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                          ticket.status === 'completed',
                      },
                    ]"
                  >
                    {{ ticket.status }}
                  </span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ ticket.calledBy || 'N/A' }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <button
                    @click="() => prioritizeTicket(ticket.id)"
                    :disabled="queueStore.loading || ticket.status !== 'waiting'"
                    class="flex items-center px-2 py-1 rounded text-sm bg-brand-500 text-white hover:bg-brand-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Prioritize"
                  >
                    Prioritize
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ComponentCard>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { useQueueStore, useServiceStore, useCounterStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { showSuccessToast, showErrorToast } from '@/helpers/sweetalert'
import { io } from 'socket.io-client'

const currentPageTitle = ref('Queue Management')

const queueStore = useQueueStore()
const { queueList, queueSummary } = storeToRefs(queueStore)
const {
  callNextTicket,
  performTicketAction,
  fetchQueueList,
  fetchQueueSummary,
  prioritizeTicket: storePrioritizeTicket,
} = queueStore

const serviceStore = useServiceStore()
const { services } = storeToRefs(serviceStore)
const { fetchServices } = serviceStore

const counterStore = useCounterStore()
const { counters } = storeToRefs(counterStore)
const { fetchCounters } = counterStore

const selectedServiceId = ref(null)
const selectedCounterId = ref(null)

let socket = null

const connectSocket = () => {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  const socketUrl = VITE_API_BASE_URL.replace('/api/v1', '')
  socket = io(socketUrl)

  socket.on('connect', () => {
    console.log('Connected to WebSocket server')
    if (selectedServiceId.value) {
      socket.emit('join-service-room', selectedServiceId.value)
    }
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server')
  })

  socket.on('ticket:created', (newTicket) => {
    showSuccessToast(`New ticket ${newTicket.prefix}-${newTicket.queueNumber} created!`)
    fetchQueueData()
  })

  socket.on('ticket:called', (calledTicket) => {
    showSuccessToast(
      `Ticket ${calledTicket.prefix}-${calledTicket.queueNumber} called by ${calledTicket.counterNumber}!`,
    )
    fetchQueueData()
  })

  socket.on('ticket:resolved', (resolvedTicket) => {
    showSuccessToast(`Ticket ${resolvedTicket.id} resolved!`)
    fetchQueueData()
  })

  socket.on('ticket:prioritized', (prioritizedTicket) => {
    showSuccessToast(`Ticket ${prioritizedTicket.id} prioritized!`)
    fetchQueueData()
  })

  socket.on('error', (error) => {
    console.error('WebSocket error:', error)
    showErrorToast('WebSocket error occurred.')
  })
}

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
  }
}

const fetchQueueData = async () => {
  if (selectedServiceId.value) {
    await fetchQueueList(selectedServiceId.value)
    await fetchQueueSummary(selectedServiceId.value)
  }
}

const callNext = async () => {
  if (!selectedServiceId.value || !selectedCounterId.value) {
    showErrorToast('Please select both a service and a counter.')
    return
  }
  try {
    await callNextTicket({ serviceId: selectedServiceId.value, counterId: selectedCounterId.value })
    // Data will be updated via WebSocket event
  } catch (error) {
    showErrorToast('Failed to call next ticket.')
  }
}

const resolveTicket = async () => {
  if (!selectedServiceId.value || !selectedCounterId.value) {
    showErrorToast('Please select both a service and a counter.')
    return
  }
  const currentTicket = queueList.value.find(
    (ticket) => ticket.status === 'in-progress' && ticket.calledBy === selectedCounterId.value,
  )
  if (!currentTicket) {
    showErrorToast('No ticket in progress for this counter.')
    return
  }
  try {
    await performTicketAction({
      action: 'resolve',
      queueId: currentTicket.id,
      counterId: selectedCounterId.value,
    })
    // Data will be updated via WebSocket event
  } catch (error) {
    showErrorToast('Failed to resolve ticket.')
  }
}

const retryTicket = async () => {
  if (!selectedServiceId.value || !selectedCounterId.value) {
    showErrorToast('Please select both a service and a counter.')
    return
  }
  const currentTicket = queueList.value.find(
    (ticket) => ticket.status === 'in-progress' && ticket.calledBy === selectedCounterId.value,
  )
  if (!currentTicket) {
    showErrorToast('No ticket in progress for this counter.')
    return
  }
  try {
    await performTicketAction({
      action: 'retry',
      queueId: currentTicket.id,
      counterId: selectedCounterId.value,
    })
    // Data will be updated via WebSocket event
  } catch (error) {
    showErrorToast('Failed to retry ticket.')
  }
}

const prioritizeTicket = async (queueId) => {
  try {
    await storePrioritizeTicket(queueId)
    // Data will be updated via WebSocket event
  } catch (error) {
    showErrorToast('Failed to prioritize ticket.')
  }
}

onMounted(async () => {
  await fetchServices({ pagination: false })
  await fetchCounters({ pagination: false })

  if (services.value.length > 0) {
    selectedServiceId.value = services.value[0].id
  }
  if (counters.value.length > 0) {
    selectedCounterId.value = counters.value[0].id
  }
  connectSocket()
  fetchQueueData()
})

onUnmounted(() => {
  disconnectSocket()
})

watch(selectedServiceId, (newServiceId, oldServiceId) => {
  if (socket && socket.connected) {
    if (oldServiceId) {
      socket.emit('leave-service-room', oldServiceId)
    }
    if (newServiceId) {
      socket.emit('join-service-room', newServiceId)
    }
  }
  fetchQueueData()
})

watch(selectedCounterId, () => {
  fetchQueueData()
})
</script>
