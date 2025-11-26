<template>
  <div class="space-y-5 sm:space-y-6">
    <PageTitle :pageTitle="currentPageTitle" />

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <ComponentCard v-if="isAdmin">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Select Organization
        </h3>
        <select
          v-model="selectedOrganizationId"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        >
          <option :value="null">-- Select Organization --</option>
          <option
            v-for="organization in organizations"
            :key="organization.id"
            :value="organization.id"
          >
            {{ organization.name }}
          </option>
        </select>
      </ComponentCard>

      <ComponentCard>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Select Service</h3>
        <select
          v-model="selectedServiceId"
          :disabled="!selectedOrganizationId"
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
          :disabled="!selectedServiceId"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        >
          <option :value="null">-- Select Counter --</option>
          <option v-for="counter in counters" :key="counter.id" :value="counter.id">
            {{ counter.counterNumber }}
          </option>
        </select>
      </ComponentCard>
    </div>

    <ComponentCard v-if="selectedServiceId">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Queue Actions</h3>
      <div class="flex space-x-4">
        <div class="relative inline-block">
          <button
            @click="callNext"
            :disabled="!selectedCounterId || queueStore.loading"
            :class="[
              'flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-brand-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
              hasNewTickets
                ? 'hover:bg-brand-600 animate-shake ring-2 ring-red-500'
                : 'hover:bg-brand-600',
            ]"
          >
            Call Next
          </button>
          <span
            v-if="hasNewTickets"
            class="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-500 animate-ping"
          ></span>
        </div>
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
                    Latest Assignee
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
                    {{ ticket.prefix }}-{{ ticket.queueNumber }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-theme-xs font-medium capitalize',
                      {
                        'bg-info-50 text-info-700 dark:bg-info-500/15 dark:text-info-500':
                          getStatus(ticket) === 'waiting',
                        'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-500':
                          getStatus(ticket) === 'in-progress',
                        'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                          getStatus(ticket) === 'completed',
                      },
                    ]"
                  >
                    {{ getStatus(ticket) }}
                  </span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ getCounterNumber(ticket.latestAssigneeCounterId) }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <div class="flex gap-2">
                    <button
                      @click="() => recallTicket(ticket)"
                      :disabled="
                        queueStore.loading ||
                        !selectedCounterId ||
                        getStatus(ticket) !== 'in-progress'
                      "
                      class="flex items-center px-2 py-1 rounded text-sm bg-brand-500 text-white hover:bg-brand-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Recall"
                    >
                      Recall
                    </button>
                    <button
                      @click="() => resolveTicketForRow(ticket)"
                      :disabled="
                        queueStore.loading ||
                        !selectedCounterId ||
                        getStatus(ticket) !== 'in-progress'
                      "
                      class="flex items-center px-2 py-1 rounded text-sm bg-success-500 text-white hover:bg-success-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Resolve"
                    >
                      Resolve
                    </button>
                  </div>
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
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { useQueueStore, useServiceStore, useCounterStore, useOrganizationStore } from '@/stores'
import { useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { showSuccessToast, showErrorToast } from '@/helpers/sweetalert'
import { io } from 'socket.io-client'

const currentPageTitle = ref('Queue Management')
const hasNewTickets = ref(false)
const authStore = useAuthStore()
const isAdmin = computed(() => (authStore.user?.role || authStore.user?.roleName) === 'ADMIN')

const queueStore = useQueueStore()
const { queueList, queueSummary } = storeToRefs(queueStore)
const {
  callNextTicket,
  performTicketAction,
  fetchQueueList,
  fetchQueueSummary,
  // prioritizeTicket: storePrioritizeTicket,
} = queueStore

const organizationStore = useOrganizationStore()
const { organizations } = storeToRefs(organizationStore)
const { fetchOrganizations } = organizationStore

const serviceStore = useServiceStore()
const { services } = storeToRefs(serviceStore)
const { fetchServices } = serviceStore

const counterStore = useCounterStore()
const { counters } = storeToRefs(counterStore)
const { fetchCounters } = counterStore

const selectedOrganizationId = ref(null)
const selectedServiceId = ref(null)
const selectedCounterId = ref(null)

let socket = null

const connectSocket = () => {
  const SOCKET_BASE = import.meta.env.VITE_SOCKET_BASE_URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  const socketUrl = SOCKET_BASE || API_BASE.replace(/\/api(\/v1)?$/, '')
  socket = io(socketUrl, { transports: ['websocket', 'polling'] })

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
    if (newTicket.serviceId === selectedServiceId.value) {
      hasNewTickets.value = true
    }
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
    await fetchQueueList(selectedServiceId.value, { status: 'in-progress' })
    await fetchQueueSummary(selectedServiceId.value, {})
    hasNewTickets.value = !!(queueSummary.value && queueSummary.value.totalRecords > 0)
  }
}

const callNext = async () => {
  if (!selectedServiceId.value || !selectedCounterId.value) {
    showErrorToast('Please select both a service and a counter.')
    return
  }
  try {
    await callNextTicket({ serviceId: selectedServiceId.value, counterId: selectedCounterId.value })
    hasNewTickets.value = false
    // Data will be updated via WebSocket event
  } catch (error) {
    console.error('Error calling next ticket:', error.error.message)
    showErrorToast('Failed to call next ticket.')
  }
}

const resolveTicketForRow = async (ticket) => {
  if (!selectedServiceId.value || !selectedCounterId.value) {
    showErrorToast('Please select both a service and a counter.')
    return
  }
  try {
    await performTicketAction({
      action: 'resolve',
      queueId: ticket.id,
      counterId: selectedCounterId.value,
    })
  } catch (error) {
    console.error('Error resolving ticket:', error)
    showErrorToast('Failed to resolve ticket.')
  }
}

const recallTicket = async (ticket) => {
  if (!selectedServiceId.value || !selectedCounterId.value) {
    showErrorToast('Please select both a service and a counter.')
    return
  }
  try {
    await performTicketAction({
      action: 'retry',
      queueId: ticket.id,
      counterId: selectedCounterId.value,
    })
  } catch (error) {
    console.error('Error recalling ticket:', error)
    showErrorToast('Failed to recall ticket.')
  }
}

const getStatus = (ticket) => {
  if (ticket.isResolved) return 'completed'
  if (ticket.isCall) return 'in-progress'
  return 'waiting'
}

const getCounterNumber = (counterId) => {
  const counter = counters.value.find((c) => c.id === counterId)
  return counter ? counter.counterNumber : 'N/A'
}

onMounted(async () => {
  if (isAdmin.value) {
    await fetchOrganizations({ pagination: false, sortBy: 'name', sortOrder: 'asc' })
    if (organizations.value.length > 0) {
      selectedOrganizationId.value = organizations.value[0].id
      await fetchServices({
        pagination: false,
        organizationId: selectedOrganizationId.value,
        isActive: true,
        sortBy: 'name',
        sortOrder: 'asc',
      })
      if (services.value.length > 0) {
        selectedServiceId.value = services.value[0].id
        await fetchCounters({
          pagination: false,
          serviceId: selectedServiceId.value,
          isActive: true,
          sortBy: 'counterNumber',
          sortOrder: 'asc',
        })
        if (counters.value.length > 0) {
          selectedCounterId.value = counters.value[0].id
        }
      }
    }
  } else {
    const orgId = authStore.user?.organization?.organizationId
    if (orgId) {
      selectedOrganizationId.value = orgId
      await fetchServices({
        pagination: false,
        organizationId: orgId,
        isActive: true,
        sortBy: 'name',
        sortOrder: 'asc',
      })
      if (services.value.length > 0) {
        selectedServiceId.value = services.value[0].id
        await fetchCounters({
          pagination: false,
          serviceId: selectedServiceId.value,
          isActive: true,
          sortBy: 'counterNumber',
          sortOrder: 'asc',
        })
        if (counters.value.length > 0) {
          selectedCounterId.value = counters.value[0].id
        }
      }
    }
  }
  connectSocket()
  fetchQueueData()
})

onUnmounted(() => {
  disconnectSocket()
})

watch(selectedOrganizationId, async (newOrgId) => {
  selectedServiceId.value = null
  selectedCounterId.value = null
  services.value = []
  counters.value = []
  if (newOrgId) {
    await fetchServices({
      pagination: false,
      organizationId: newOrgId,
      isActive: true,
      sortBy: 'name',
      sortOrder: 'asc',
    })
    if (services.value.length > 0) {
      selectedServiceId.value = services.value[0].id
    }
  }
})
watch(selectedServiceId, async (newServiceId, oldServiceId) => {
  if (socket && socket.connected) {
    if (oldServiceId) {
      socket.emit('leave-service-room', oldServiceId)
    }
    if (newServiceId) {
      socket.emit('join-service-room', newServiceId)
    }
  }
  selectedCounterId.value = null
  hasNewTickets.value = false
  if (newServiceId) {
    await fetchCounters({
      pagination: false,
      serviceId: newServiceId,
      isActive: true,
      sortBy: 'counterNumber',
      sortOrder: 'asc',
    })
    if (counters.value.length > 0) {
      selectedCounterId.value = counters.value[0].id
    }
  }
  fetchQueueData()
})

watch(selectedCounterId, () => {
  fetchQueueData()
})

const playBeep = () => {
  try {
    const C = window.AudioContext || window.webkitAudioContext
    const ctx = new C()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.4)
    setTimeout(() => ctx.close(), 500)
  } catch (error) {
    console.error('Error playing beep:', error)
  }
}

watch(hasNewTickets, (val, old) => {
  if (val && !old) playBeep()
})
</script>
<style scoped>
@keyframes shake {
  10%,
  90% {
    transform: translateX(-1px);
  }
  20%,
  80% {
    transform: translateX(2px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-4px);
  }
  40%,
  60% {
    transform: translateX(4px);
  }
}
.animate-shake {
  animation: shake 0.6s infinite;
}
</style>
