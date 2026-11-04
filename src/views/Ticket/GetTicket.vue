<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col p-4 md:p-8"
  >
    <!-- Title -->
    <div class="w-full mb-8 md:mb-12">
      <h1 class="text-white text-3xl md:text-4xl lg:text-5xl font-light text-center tracking-wide">
        Silahkan Ambil Nomor Antrian
      </h1>
    </div>

    <!-- Services Grid -->
    <div class="flex-1 w-full max-w-screen-xl mx-auto overflow-hidden">
      <div
        ref="scrollContainer"
        class="h-[calc(100vh-200px)] md:h-[calc(100vh-220px)] overflow-y-auto pr-1 auto-hide-scrollbar"
        @scroll="handleScroll"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 pb-6">
          <!-- Loading skeleton -->
          <template v-if="isLoading">
            <div
              v-for="i in 6"
              :key="i"
              class="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 min-h-[80px] md:min-h-[100px] animate-pulse"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 shrink-0" />
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-white/10 rounded w-3/4" />
                  <div class="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            </div>
          </template>

          <div v-else-if="loadError" class="col-span-full text-center py-8">
            <span class="text-red-400">{{ loadError }}</span>
          </div>

          <div
            v-else
            v-for="svc in publicServices"
            :key="svc.id"
            @click="selectService(svc)"
            :class="[
              'bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 transition-all duration-300 flex items-center gap-4 group min-h-[80px] md:min-h-[100px] touch-manipulation select-none',
              requestingServiceId === svc.id
                ? 'cursor-wait opacity-80 border-emerald-400/30'
                : requestingServiceId
                  ? 'cursor-not-allowed opacity-40'
                  : 'cursor-pointer hover:bg-white/10 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]',
            ]"
          >
            <!-- Logo -->
            <div
              class="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/20 flex items-center justify-center group-hover:border-emerald-400/40 transition-all"
            >
              <img
                v-if="requestingServiceId !== svc.id"
                :src="svc.organization.logoUrl || defaultOrgImage"
                :alt="svc.organization?.name || 'Organization'"
                class="w-8 h-8 md:w-12 md:h-12 object-contain"
              />
              <!-- Spinner while requesting -->
              <svg
                v-else
                class="w-6 h-6 text-emerald-400 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <!-- Service name (env-gated) -->
              <h2
                v-if="showServiceNameOnCard"
                class="text-emerald-400 text-base md:text-lg font-medium group-hover:text-emerald-300 transition-colors whitespace-normal break-words"
              >
                {{ svc.name }}
              </h2>
              <h3
                :class="[
                  'text-white font-light group-hover:text-emerald-400 transition-colors whitespace-normal break-words',
                  showServiceNameOnCard
                    ? 'text-sm md:text-base mt-0.5'
                    : 'text-lg md:text-xl lg:text-2xl',
                ]"
              >
                {{ svc.organization?.name }}
              </h3>
              <p
                v-if="svc.organization?.fullName && svc.organization?.fullName !== '-'"
                class="text-white/60 text-sm md:text-base mt-1 whitespace-normal break-words"
              >
                {{ svc.organization.fullName }}
              </p>
            </div>

            <!-- Arrow -->
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

    <!-- Footer -->
    <div class="w-full mt-6 md:mt-8">
      <div
        class="flex flex-col sm:flex-row justify-between items-center text-white/60 text-sm md:text-base px-2 gap-4 sm:gap-0"
      >
        <span class="font-light">{{ currentDateTime }}</span>
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span class="text-sm">{{ pointerHint }}</span>
        </div>
      </div>
    </div>

    <!-- Ticket / Error Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeModal" />
        <div
          :class="[
            'bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 lg:p-10 w-full relative z-10 shadow-2xl',
            modalState === 'visitor-form' ? 'max-w-md md:max-w-xl' : 'max-w-sm md:max-w-md',
          ]"
        >
          <!-- Visitor Info Form -->
          <div v-if="modalState === 'visitor-form'">
            <h3 class="text-white text-xl md:text-2xl font-light mb-2 text-center">
              Data Pengunjung
            </h3>
            <p class="text-white/50 text-sm text-center mb-6 md:mb-8">
              Silahkan isi data Anda sebelum mengambil nomor antrian.
            </p>

            <div class="space-y-4">
              <div>
                <label class="block text-white/70 text-sm mb-1.5">
                  Nama <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="visitorForm.name"
                  @input="visitorFormErrors.name = ''"
                  @focus="activeField = 'name'"
                  type="text"
                  inputmode="none"
                  autocomplete="name"
                  placeholder="Nama lengkap"
                  :class="[
                    'w-full h-12 rounded-lg bg-white/5 border px-4 text-white text-base placeholder:text-white/30 focus:outline-none focus:ring-2 touch-manipulation',
                    activeField === 'name'
                      ? 'border-emerald-400/60 ring-2 ring-emerald-400/30'
                      : '',
                    visitorFormErrors.name
                      ? 'border-red-400/60 focus:ring-red-400/30'
                      : 'border-white/10 focus:border-emerald-400/40 focus:ring-emerald-400/30',
                  ]"
                />
                <p v-if="visitorFormErrors.name" class="mt-1 text-xs text-red-400">
                  {{ visitorFormErrors.name }}
                </p>
              </div>

              <div>
                <label class="block text-white/70 text-sm mb-1.5">
                  Nomor HP <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="visitorForm.phoneNumber"
                  @input="visitorFormErrors.phoneNumber = ''"
                  @focus="activeField = 'phoneNumber'"
                  type="tel"
                  inputmode="none"
                  autocomplete="tel"
                  placeholder="08xxxxxxxxxx"
                  :class="[
                    'w-full h-12 rounded-lg bg-white/5 border px-4 text-white text-base placeholder:text-white/30 focus:outline-none focus:ring-2 touch-manipulation',
                    activeField === 'phoneNumber'
                      ? 'border-emerald-400/60 ring-2 ring-emerald-400/30'
                      : '',
                    visitorFormErrors.phoneNumber
                      ? 'border-red-400/60 focus:ring-red-400/30'
                      : 'border-white/10 focus:border-emerald-400/40 focus:ring-emerald-400/30',
                  ]"
                />
                <p v-if="visitorFormErrors.phoneNumber" class="mt-1 text-xs text-red-400">
                  {{ visitorFormErrors.phoneNumber }}
                </p>
              </div>

              <div>
                <label class="block text-white/70 text-sm mb-1.5">Email (opsional)</label>
                <input
                  v-model="visitorForm.email"
                  @input="visitorFormErrors.email = ''"
                  @focus="activeField = 'email'"
                  type="email"
                  inputmode="none"
                  autocomplete="email"
                  placeholder="nama@email.com"
                  :class="[
                    'w-full h-12 rounded-lg bg-white/5 border px-4 text-white text-base placeholder:text-white/30 focus:outline-none focus:ring-2 touch-manipulation',
                    activeField === 'email'
                      ? 'border-emerald-400/60 ring-2 ring-emerald-400/30'
                      : '',
                    visitorFormErrors.email
                      ? 'border-red-400/60 focus:ring-red-400/30'
                      : 'border-white/10 focus:border-emerald-400/40 focus:ring-emerald-400/30',
                  ]"
                />
                <p v-if="visitorFormErrors.email" class="mt-1 text-xs text-red-400">
                  {{ visitorFormErrors.email }}
                </p>
              </div>
            </div>

            <!-- On-screen keyboard -->
            <div v-if="activeField" class="mt-5 pt-5 border-t border-white/10">
              <VirtualKeyboard
                v-model="activeFieldValue"
                :mode="activeField === 'phoneNumber' ? 'numeric' : 'text'"
                @done="activeField = null"
              />
            </div>

            <div class="flex gap-3 mt-8">
              <button
                @click="closeModal"
                :disabled="submittingVisitor"
                class="flex-1 bg-white/10 border border-white/20 text-white px-4 py-3 rounded-full text-base font-medium transition-all hover:bg-white/20 disabled:opacity-50 touch-manipulation"
              >
                Batal
              </button>
              <button
                @click="submitVisitorForm"
                :disabled="submittingVisitor"
                class="flex-1 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 border border-emerald-400/50 text-white px-4 py-3 rounded-full text-base font-medium transition-all duration-300 hover:bg-emerald-500/40 active:scale-95 disabled:opacity-50 touch-manipulation"
              >
                {{ submittingVisitor ? 'Memproses...' : 'Lanjutkan' }}
              </button>
            </div>
          </div>

          <!-- Success -->
          <div v-else-if="modalState === 'success'" class="text-center">
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
              <p class="text-white/70 text-xs md:text-sm uppercase tracking-widest mb-1">Layanan</p>
              <div class="text-white text-lg md:text-xl font-light">
                {{ selectedOrg?.name }}
                {{
                  selectedOrg?.fullName && selectedOrg?.fullName !== '-'
                    ? ' - ' + selectedOrg?.fullName
                    : ''
                }}
              </div>

              <!-- Waiting count -->
              <div v-if="waitingCount !== null" class="mt-4 pt-4 border-t border-white/10">
                <p class="text-white/50 text-xs uppercase tracking-widest mb-1">
                  Antrian sebelum Anda
                </p>
                <p class="text-amber-400 text-2xl md:text-3xl font-light">
                  {{ waitingCount }} orang
                </p>
              </div>
            </div>

            <!-- Print error notice -->
            <div
              v-if="printError"
              class="mb-4 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-400 text-sm text-left"
            >
              ⚠ Cetak tiket gagal. Silahkan hubungi petugas.
            </div>

            <button
              @click="closeModal"
              class="bg-gradient-to-r from-emerald-500/30 to-blue-500/30 border border-emerald-400/50 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium transition-all duration-300 hover:bg-emerald-500/40 hover:scale-105 w-full active:scale-95 touch-manipulation"
            >
              Selesai
            </button>
          </div>

          <!-- Error -->
          <div v-else-if="modalState === 'error'" class="text-center">
            <div
              class="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-400/30 flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 class="text-white text-xl md:text-2xl font-light mb-3">Gagal Mengambil Antrian</h3>
            <p class="text-white/50 text-sm md:text-base mb-8">
              Terjadi kesalahan. Silahkan coba lagi atau hubungi petugas.
            </p>
            <button
              @click="closeModal"
              class="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-full text-base font-medium transition-all hover:bg-white/20 w-full touch-manipulation"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useQueueStore, useServiceStore, useVisitorStore, useVisitorHistoryStore } from '@/stores'
import { storeToRefs } from 'pinia'
import defaultOrgImage from '@/assets/images/default-organization.svg'
import VirtualKeyboard from '@/components/common/VirtualKeyboard.vue'

const showServiceNameOnCard = import.meta.env.VITE_TICKET_SHOW_SERVICE_NAME === 'true'
const timezone = import.meta.env.VITE_TIMEZONE || 'Asia/Jakarta'
const requireVisitorData = import.meta.env.VITE_REQUIRE_VISITOR_DATA === 'true'

const currentDateTime = ref('')
const showModal = ref(false)
const modalState = ref(null) // 'visitor-form' | 'success' | 'error'
const selectedOrg = ref(null)
const ticketNumber = ref('')
const waitingCount = ref(null)
const printError = ref(false)
const requestingServiceId = ref(null)
const scrollContainer = ref(null)

const pendingService = ref(null)
const submittingVisitor = ref(false)
// Same rule as the API's phoneNormalizer: 0/62/+62, then 8 followed by 7–11 digits.
const PHONE_PATTERN = /^(?:\+62|62|0)8\d{7,11}$/
// Dot-separated domain labels keep this linear (the old /^\S+@\S+\.\S+$/ could backtrack).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/
const visitorForm = reactive({ name: '', phoneNumber: '', email: '' })
const visitorFormErrors = reactive({ name: '', phoneNumber: '', email: '' })
const activeField = ref(null) // 'name' | 'phoneNumber' | 'email' | null — drives the on-screen keyboard

const activeFieldValue = computed({
  get: () => (activeField.value ? visitorForm[activeField.value] : ''),
  set: (val) => {
    if (activeField.value) visitorForm[activeField.value] = val
  },
})

const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
const pointerHint = isTouch ? 'Sentuh untuk memilih' : 'Klik untuk memilih'

let scrollTimeout = null
const handleScroll = () => {
  if (scrollContainer.value) {
    scrollContainer.value.classList.add('scrolling')
    if (scrollTimeout) clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      scrollContainer.value?.classList.remove('scrolling')
    }, 1500)
  }
}

const serviceStore = useServiceStore()
const { publicServices } = storeToRefs(serviceStore)
const { fetchPublicServices } = serviceStore

const queueStore = useQueueStore()
const visitorStore = useVisitorStore()
const visitorHistoryStore = useVisitorHistoryStore()
const isLoading = ref(false)
const loadError = ref('')

const createTicket = async (service, visitor = null) => {
  requestingServiceId.value = service.id
  try {
    const ticket = await queueStore.requestPublicTicket({ serviceId: service.id })
    ticketNumber.value =
      ticket?.queueNumber ||
      ticket?.ticketNumber ||
      (ticket?.prefix && ticket?.queueNumber ? `${ticket.prefix}-${ticket.queueNumber}` : '-')
    waitingCount.value = ticket?.totalWaitingQueue ?? null
    modalState.value = 'success'
    showModal.value = true
    printTicket(ticket, service)

    // Record the visit in the background — never blocks or fails the ticket flow.
    if (visitor?.id && service.organization?.id) {
      visitorHistoryStore
        .recordVisit({ visitorId: visitor.id, organizationId: service.organization.id })
        .catch((error) => console.error('Error recording visitor history:', error))
    }
  } catch {
    modalState.value = 'error'
    showModal.value = true
  } finally {
    requestingServiceId.value = null
  }
}

const selectService = async (service) => {
  if (requestingServiceId.value || showModal.value) return
  selectedOrg.value = service.organization
  waitingCount.value = null
  printError.value = false

  if (requireVisitorData) {
    pendingService.value = service
    visitorForm.name = ''
    visitorForm.phoneNumber = ''
    visitorForm.email = ''
    visitorFormErrors.name = ''
    visitorFormErrors.phoneNumber = ''
    visitorFormErrors.email = ''
    activeField.value = 'name'
    modalState.value = 'visitor-form'
    showModal.value = true
    return
  }

  await createTicket(service)
}

const phoneNumberError = (value) => {
  if (!value.trim()) return 'Nomor HP wajib diisi.'
  if (!PHONE_PATTERN.test(value.trim().replace(/[\s-]/g, ''))) {
    return 'Format nomor HP tidak valid (contoh: 081234567890).'
  }
  return ''
}

const validateVisitorForm = () => {
  visitorFormErrors.name = ''
  visitorFormErrors.phoneNumber = ''
  visitorFormErrors.email = ''
  let valid = true

  if (!visitorForm.name.trim()) {
    visitorFormErrors.name = 'Nama wajib diisi.'
    valid = false
  }
  visitorFormErrors.phoneNumber = phoneNumberError(visitorForm.phoneNumber)
  if (visitorFormErrors.phoneNumber) valid = false
  if (visitorForm.email.trim() && !EMAIL_PATTERN.test(visitorForm.email.trim())) {
    visitorFormErrors.email = 'Format email tidak valid.'
    valid = false
  }

  return valid
}

const submitVisitorForm = async () => {
  if (!validateVisitorForm() || !pendingService.value) return

  submittingVisitor.value = true
  try {
    const visitor = await visitorStore.upsertVisitor({
      name: visitorForm.name.trim(),
      phoneNumber: visitorForm.phoneNumber.trim(),
      email: visitorForm.email.trim(),
    })
    const service = pendingService.value
    pendingService.value = null
    activeField.value = null
    await createTicket(service, visitor)
  } catch (error) {
    console.error('Error upserting visitor:', error)
    modalState.value = 'error'
  } finally {
    submittingVisitor.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  modalState.value = null
  pendingService.value = null
  activeField.value = null
}

const updateDateTime = () => {
  const now = new Date()
  currentDateTime.value = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  })
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
    loadError.value = 'Gagal memuat layanan.'
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
  printError.value = false
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
      timeZone: timezone,
    })
    const serviceName =
      service.organization?.name +
      (service.organization?.fullName && service.organization?.fullName !== '-'
        ? ' - ' + service.organization?.fullName
        : '')
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    })
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
    printError.value = true
  }
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.touch-manipulation {
  touch-action: manipulation;
}

.auto-hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
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
.auto-hide-scrollbar.scrolling::-webkit-scrollbar {
  opacity: 1;
}
.auto-hide-scrollbar.scrolling::-webkit-scrollbar-thumb {
  opacity: 1;
}

@media (hover: hover) and (pointer: fine) {
  .auto-hide-scrollbar:hover::-webkit-scrollbar {
    opacity: 1;
  }
  .auto-hide-scrollbar:hover::-webkit-scrollbar-thumb {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .hover\:scale-\[1\.02\]:hover {
    transform: none;
  }
  .active\:scale-\[0\.98\]:active {
    transform: scale(0.98);
  }
}
@media (hover: hover) and (pointer: fine) {
  .hover\:scale-\[1\.02\]:hover {
    transform: scale(1.02);
  }
}
</style>
