<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col p-4 md:p-8"
  >
    <!-- Title Section -->
    <div class="w-full mb-8 md:mb-12">
      <h1 class="text-white text-3xl md:text-4xl lg:text-5xl font-light text-center tracking-wide">
        Silahkan Ambil Nomor Antrian
      </h1>
    </div>

    <!-- Organizations Grid with Scrolling -->
    <div class="flex-1 w-full max-w-screen-xl mx-auto overflow-hidden">
      <!-- Scrollable Container -->
      <div
        ref="scrollContainer"
        class="h-[calc(100vh-200px)] md:h-[calc(100vh-220px)] overflow-y-auto pr-1 auto-hide-scrollbar"
        @scroll="handleScroll"
      >
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 pb-6"
        >
          <div v-if="isLoading" class="col-span-full text-center py-8">
            <span class="text-white/70">Loading services...</span>
          </div>
          <div v-else-if="loadError" class="col-span-full text-center py-8">
            <span class="text-red-400">{{ loadError }}</span>
          </div>
          <div
            v-else
            v-for="svc in publicServices"
            :key="svc.id"
            @click="selectOrganization(svc)"
            class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] hover:shadow-xl cursor-pointer flex items-center gap-4 group min-h-[80px] md:min-h-[100px] active:scale-[0.98] touch-manipulation"
          >
            <!-- Organization Logo -->
            <div
              class="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/20 flex items-center justify-center group-hover:border-emerald-400/40 transition-all"
            >
              <img
                :src="svc.organization.logoUrl || defaultOrgImage"
                :alt="svc.organization?.name || 'Organization'"
                class="w-8 h-8 md:w-12 md:h-12 object-contain"
              />
            </div>

            <!-- Service & Organization Info -->
            <div class="flex-1 min-w-0">
              <h2
                class="text-white text-lg md:text-xl lg:text-2xl font-light group-hover:text-emerald-400 transition-colors whitespace-normal break-words"
              >
                {{ svc.organization?.name }}
              </h2>
              <p class="text-white/60 text-sm md:text-base mt-1 whitespace-normal break-words">
                {{ svc.organization?.fullName !== '-' ? svc.organization?.fullName : '' }}
              </p>
            </div>

            <!-- Arrow Icon -->
            <div class="flex-shrink-0 text-white/40 group-hover:text-emerald-400 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Section -->
    <div class="w-full mt-6 md:mt-8">
      <div
        class="flex flex-col sm:flex-row justify-between items-center text-white/60 text-sm md:text-base px-2 gap-4 sm:gap-0"
      >
        <span class="font-light">{{ currentDateTime }}</span>
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span class="text-sm">Touch to select</span>
        </div>
      </div>
    </div>

    <!-- Ticket Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeModal"></div>
        <div
          class="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 lg:p-10 w-full max-w-sm md:max-w-md relative z-10 shadow-2xl"
        >
          <div class="text-center">
            <h3 class="text-white text-xl md:text-2xl lg:text-3xl font-light mb-6">
              Nomor Antrian Anda
            </h3>

            <div
              class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 mb-6 md:mb-8"
            >
              <p class="text-white/70 text-xs md:text-sm uppercase tracking-widest mb-2">
                Nomor Antrian
              </p>
              <div class="text-emerald-400 text-4xl md:text-5xl lg:text-6xl font-light mb-4">
                {{ ticketNumber }}
              </div>
              <p class="text-white/70 text-xs md:text-sm uppercase tracking-widest mb-2">Layanan</p>
              <div class="text-white text-lg md:text-xl font-light">
                {{ selectedOrg?.name }}
                {{ selectedOrg?.fullName !== '-' ? ' - ' + selectedOrg?.fullName : '' }}
              </div>
            </div>

            <button
              @click="closeModal"
              class="bg-gradient-to-r from-emerald-500/30 to-blue-500/30 border border-emerald-400/50 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium transition-all duration-300 hover:bg-emerald-500/40 hover:scale-105 w-full active:scale-95 touch-manipulation"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useQueueStore, useServiceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import defaultOrgImage from '@/assets/images/default-organization.svg'

const currentDateTime = ref('')
const showModal = ref(false)
const selectedOrg = ref(null)
const ticketNumber = ref('')
const scrollContainer = ref(null)

// Scroll handling for auto-hide scrollbar
let scrollTimeout = null

const handleScroll = () => {
  if (scrollContainer.value) {
    // Show scrollbar when scrolling
    scrollContainer.value.classList.add('scrolling')

    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }

    // Hide scrollbar after 1.5 seconds of no scrolling
    scrollTimeout = setTimeout(() => {
      if (scrollContainer.value) {
        scrollContainer.value.classList.remove('scrolling')
      }
    }, 1500)
  }
}

const serviceStore = useServiceStore()
const { publicServices } = storeToRefs(serviceStore)
const { fetchPublicServices } = serviceStore

const queueStore = useQueueStore()
const isLoading = ref(false)
const loadError = ref('')

const selectOrganization = async (service) => {
  selectedOrg.value = service.organization
  try {
    const ticket = await queueStore.requestPublicTicket({ serviceId: service.id })
    if (
      ticket &&
      (ticket.queueNumber || ticket.ticketNumber || (ticket.prefix && ticket.queueNumber))
    ) {
      ticketNumber.value =
        ticket.queueNumber || ticket.ticketNumber || `${ticket.prefix}-${ticket.queueNumber}`
    } else {
      ticketNumber.value = `${String(service.prefix || 'TK')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    }
    showModal.value = true
    await printTicket(ticket, service)
  } catch {
    ticketNumber.value = `${String(service.prefix || 'TK')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    showModal.value = true
  }
}

// Close the modal
const closeModal = () => {
  showModal.value = false
  // In a real app, you might want to print the ticket or send it to a device
}

const updateDateTime = () => {
  const now = new Date()
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  currentDateTime.value = now.toLocaleDateString('en-US', options)
}

let intervalId

onMounted(async () => {
  updateDateTime()
  intervalId = setInterval(updateDateTime, 1000)
  isLoading.value = true
  loadError.value = ''
  try {
    await fetchPublicServices({ pagination: false })
  } catch {
    loadError.value = 'Failed to load services.'
  } finally {
    isLoading.value = false
  }
})

const ensureRectaLoaded = () => {
  return new Promise((resolve, reject) => {
    if (window.Recta) {
      resolve()
      return
    }
    const existing = document.getElementById('recta-js')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Recta failed to load')))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/recta@latest/dist/recta.js'
    script.id = 'recta-js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Recta failed to load'))
    document.head.appendChild(script)
  })
}

const printTicket = async (ticket, service) => {
  try {
    await ensureRectaLoaded()
    const printerId = import.meta.env.VITE_RECTA_PRINTER_ID || '1234567890'
    const profile = import.meta.env.VITE_RECTA_PROFILE || '1811'
    const printer = new window.Recta(printerId, profile)
    const orgName = ticket?.organizationName || service?.organization?.name || ''
    const orgFullName = ticket?.organizationFullName || service?.organization?.fullName || ''
    const queueStr = ticket?.queueNumber || ticketNumber.value
    const waiting = ticket?.totalWaitingQueue ?? ''
    const now = new Date()
    const dateStr = now.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const serviceName =
      service.organization?.name +
      (service.organization?.fullName !== '-' ? ' - ' + service.organization?.fullName : '')
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    await printer.open()
    printer
      .align('center')
      .mode('B', false, true, false, false)
      .text(orgFullName || orgName)
      .text('-----------------------------------------------------')
      .mode()
      .text('')
      .mode('B', false, true, false, false)
      .text('PELAYANAN PADA :')
      .mode()
      .mode('B', true, true, false, false)
      .text(serviceName)
      .mode()
      .text('')
      .mode('B', false, true, false, false)
      .text('Nomor Antrian :')
      .mode()
      .text('')
      .mode('A', true, true, true, false)
      .text(queueStr)
      .mode()
      .text('')
      .mode('B', false, true, false, false)
      .raw('Sisa Antrian :')
      .text(String(waiting))
      .text(`${dateStr} - ${timeStr}`)
      .text('Silahkan Menunggu, Nomor Antrian Anda Akan Dipanggil')
      .text('Sesuai Urutan. TerimaKasih!')
      .mode()
      .text('')
      .text('')
      .text('')
      .text('')
      .cut(true, 1)
      .print()
  } catch (error) {
    console.error('Error printing ticket:', error)
  }
}

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<style scoped>
/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Touch optimization */
.touch-manipulation {
  touch-action: manipulation;
}

/* Auto-hide scrollbar styling */
.auto-hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.auto-hide-scrollbar::-webkit-scrollbar {
  width: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.auto-hide-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.auto-hide-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.auto-hide-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Show scrollbar when scrolling */
.auto-hide-scrollbar.scrolling::-webkit-scrollbar {
  opacity: 1;
}

.auto-hide-scrollbar.scrolling::-webkit-scrollbar-thumb {
  opacity: 1;
}

/* Show scrollbar on hover for desktop */
@media (hover: hover) and (pointer: fine) {
  .auto-hide-scrollbar:hover::-webkit-scrollbar {
    opacity: 1;
  }

  .auto-hide-scrollbar:hover::-webkit-scrollbar-thumb {
    opacity: 1;
  }
}

/* Ensure proper scaling on touch devices */
@media (max-width: 768px) {
  .hover\:scale-\[1\.02\]:hover {
    transform: none;
  }

  .active\:scale-\[0\.98\]:active {
    transform: scale(0.98);
  }
}

/* Desktop hover effects */
@media (hover: hover) and (pointer: fine) {
  .hover\:scale-\[1\.02\]:hover {
    transform: scale(1.02);
  }
}
</style>
