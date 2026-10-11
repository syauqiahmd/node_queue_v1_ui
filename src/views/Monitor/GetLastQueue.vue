<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center p-2 md:p-6 monitor-root"
  >
    <!-- Persistent audio toggle -->
    <div class="fixed top-4 right-4 z-50">
      <button
        @click="toggleAudio"
        :title="audioEnabled ? 'Matikan suara' : 'Aktifkan suara'"
        class="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
      >
        <!-- Speaker on -->
        <svg
          v-if="audioEnabled"
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-4-4H5a1 1 0 01-1-1v-2a1 1 0 011-1h3l4-4z"
          />
        </svg>
        <!-- Speaker muted -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-white/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      </button>
    </div>

    <!-- Title -->
    <div class="w-full max-w-none mx-1 md:mx-4 mb-8">
      <h1
        class="text-white text-3xl md:text-4xl font-light text-center tracking-wide monitor-title"
      >
        {{ monitorTitle }}
      </h1>
    </div>

    <!-- Main Content -->
    <div class="max-w-none mx-1 md:mx-4 flex-1 flex items-center w-full monitor-content">
      <div v-if="loading" class="w-full text-center py-12">
        <span class="text-white/70">Memuat data antrian...</span>
      </div>
      <div v-else-if="error" class="w-full text-center py-12">
        <span class="text-red-400">{{ error }}</span>
      </div>
      <div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10 2xl:gap-12 w-full">
        <!-- Main Current Queue -->
        <div class="lg:col-span-3">
          <div
            class="relative bg-slate-800/50 border border-white/10 rounded-2xl p-16 md:p-20 2xl:p-24 text-center h-full flex flex-col justify-center shadow-2xl monitor-card"
          >
            <!-- Flash ring on new call — opacity only, TV-safe -->
            <div
              v-if="isFlashing"
              class="absolute inset-0 rounded-2xl border-2 border-emerald-400 pointer-events-none call-flash"
            />
            <p
              class="text-white/70 text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-semibold mb-6 uppercase tracking-widest"
            >
              Antrian Saat Ini
            </p>

            <!-- Queue Number — idle vs active -->
            <div class="relative overflow-hidden mb-8 md:mb-12">
              <Transition name="slide-up" mode="out-in">
                <!-- Idle state -->
                <div
                  v-if="currentQueue.number === '-'"
                  key="idle"
                  class="flex flex-col items-center gap-6 py-6 current-number"
                >
                  <div class="flex gap-3 items-end">
                    <span
                      class="w-3 h-3 rounded-full bg-white/20 animate-bounce"
                      style="animation-delay: 0ms"
                    />
                    <span
                      class="w-3 h-3 rounded-full bg-white/20 animate-bounce"
                      style="animation-delay: 150ms"
                    />
                    <span
                      class="w-3 h-3 rounded-full bg-white/20 animate-bounce"
                      style="animation-delay: 300ms"
                    />
                  </div>
                  <p
                    class="text-white/30 text-2xl md:text-3xl lg:text-4xl font-light tracking-wide idle-breathe"
                  >
                    Menunggu panggilan...
                  </p>
                </div>

                <!-- Active state -->
                <div
                  v-else
                  :key="currentQueue.number"
                  class="text-emerald-400 text-9xl md:text-[10rem] lg:text-[14rem] 2xl:text-[18rem] font-light transition-all duration-500 current-number"
                >
                  {{ currentQueue.number }}
                </div>
              </Transition>
            </div>

            <!-- Counter badge -->
            <div v-if="currentQueue.number !== '-'" class="flex justify-center items-center gap-4">
              <Transition name="fade" mode="out-in">
                <div
                  :key="currentQueue.counter"
                  class="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-400/50 px-8 py-4 2xl:px-10 2xl:py-5 rounded-full shadow-lg counter-badge"
                >
                  <span
                    class="text-blue-300 text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-semibold"
                  >
                    Loket : {{ currentQueue.counter }}
                  </span>
                </div>
              </Transition>
            </div>

            <!-- Service name (env-gated) -->
            <div
              v-if="showServiceName && currentQueue.service && currentQueue.number !== '-'"
              class="mt-6"
            >
              <span class="text-white/40 text-base md:text-lg lg:text-xl tracking-wide">
                {{ currentQueue.service }}
              </span>
            </div>
          </div>
        </div>

        <!-- History Sidebar -->
        <div class="lg:col-span-2 h-full">
          <TransitionGroup
            name="queue-list"
            tag="div"
            :class="['flex flex-col gap-4 md:gap-6', queueHistory.length === 3 ? 'h-full' : '']"
          >
            <div
              v-for="queue in queueHistory"
              :key="queue.id"
              :class="[
                'bg-slate-800/50 border border-white/10 rounded-xl p-6 md:p-8 2xl:p-10 queue-item flex items-center justify-between gap-4',
                queueHistory.length === 3 ? 'flex-1' : '',
              ]"
            >
              <div
                class="text-emerald-400 text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-light queue-number"
              >
                {{ queue.number }}
              </div>
              <div :class="queue.badgeClass">
                <span :class="queue.textClass" class="queue-counter"
                  >Loket : {{ queue.counter }}</span
                >
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="w-full max-w-none mx-1 md:mx-4 mt-8 md:mt-12">
      <div
        class="flex justify-between items-center text-white/60 text-base md:text-lg lg:text-xl px-2"
      >
        <span class="font-light">{{ currentDateTime }}</span>
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-3 h-3 rounded-full animate-pulse',
              connectionStatus === 'connected'
                ? 'bg-emerald-400'
                : connectionStatus === 'reconnecting'
                  ? 'bg-amber-400'
                  : 'bg-red-500',
            ]"
          />
          <span class="text-sm">{{
            connectionStatus === 'connected'
              ? 'Live'
              : connectionStatus === 'reconnecting'
                ? 'Reconnecting…'
                : 'Disconnected'
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import request from '@/helpers/request'
import { API_PATHS } from '@/helpers/constants'

const monitorTitle = import.meta.env.VITE_MONITOR_TITLE || 'Antrian'
const showServiceName = import.meta.env.VITE_MONITOR_SHOW_SERVICE === 'true'
const timezone = import.meta.env.VITE_TIMEZONE || 'Asia/Jakarta'

const currentDateTime = ref('')
const loading = ref(false)
const error = ref('')

const currentQueue = ref({ number: '-', counter: '-', service: null })
const queueHistory = ref([])
const audioEnabled = ref(false)
const connected = ref(false)
const connectionStatus = ref('disconnected')
const isFlashing = ref(false)
let flashTimer = null
let reconnectTimer

const triggerFlash = () => {
  if (flashTimer) clearTimeout(flashTimer)
  isFlashing.value = false
  requestAnimationFrame(() => {
    isFlashing.value = true
    flashTimer = setTimeout(() => {
      isFlashing.value = false
    }, 1600)
  })
}

const badgeStyles = [
  {
    badgeClass:
      'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 px-6 py-3 rounded-full shadow-lg',
    textClass: 'text-purple-300 text-xl md:text-2xl lg:text-3xl font-medium',
  },
  {
    badgeClass:
      'bg-gradient-to-r from-orange-500/30 to-amber-500/30 border border-orange-400/50 px-6 py-3 rounded-full shadow-lg',
    textClass: 'text-orange-300 text-xl md:text-2xl lg:text-3xl font-medium',
  },
  {
    badgeClass:
      'bg-gradient-to-r from-rose-500/30 to-red-500/30 border border-rose-400/50 px-6 py-3 rounded-full shadow-lg',
    textClass: 'text-rose-300 text-xl md:text-2xl lg:text-3xl font-medium',
  },
]

let socket = null
let socketClosedByUser = false
let reconnectDelay = 1000
const MAX_RECONNECT_DELAY = 10000

const startPolling = () => {
  if (!pollId) pollId = setInterval(fetchQueues, 5000)
}

const scheduleReconnect = () => {
  if (socketClosedByUser || reconnectTimer) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    connectSocket()
  }, reconnectDelay)
  reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY)
}

const connectSocket = () => {
  if (socketClosedByUser) return
  const explicitWs = import.meta.env.VITE_WS_URL
  let url = explicitWs
  if (!url) {
    let base =
      import.meta.env.VITE_SOCKET_BASE_URL || import.meta.env.VITE_API_BASE_URL || location.origin
    if (!/^https?:\/\//.test(base)) base = `http://${base}`
    base = base.replace(/\/api(\/v1)?$/, '')
    const secure = base.startsWith('https')
    url = base.replace(/^https?/, secure ? 'wss' : 'ws')
  }
  if (!url && import.meta.env.DEV) url = 'ws://localhost:8080'
  try {
    socket = new WebSocket(url)
  } catch {
    connectionStatus.value = 'disconnected'
    return
  }
  socket.onopen = () => {
    connected.value = true
    connectionStatus.value = 'connected'
    reconnectDelay = 1000
    if (pollId) {
      clearInterval(pollId)
      pollId = null
    }
  }
  // A failed connection fires onerror then onclose; reconnect only from onclose.
  socket.onclose = () => {
    connected.value = false
    if (socketClosedByUser) return
    connectionStatus.value = 'reconnecting'
    scheduleReconnect()
    startPolling()
  }
  socket.onmessage = (ev) => {
    try {
      const parsed = JSON.parse(ev.data)
      let event = parsed && parsed.event ? parsed.event : null
      const data = parsed && parsed.data ? parsed.data : parsed
      if (!event && data && (data.queueNumber || data.counterNumber || data.prefix)) {
        event = 'ticket:called'
      }
      if (event === 'ticket:called') {
        const key = `${data.prefix || ''}-${data.queueNumber || ''}-${data.counterNumber || ''}`
        const nowTs = Date.now()
        if (key && key === lastCallKey && nowTs - lastCallTs < 5000) return
        lastCallKey = key
        lastCallTs = nowTs
        const prev = { ...currentQueue.value }
        if (prev.number !== '-' && prev.counter !== '-') {
          queueHistory.value.unshift({
            id: Date.now(),
            number: prev.number,
            counter: prev.counter,
            ...badgeStyles[0],
          })
          if (queueHistory.value.length > 3) queueHistory.value.pop()
          queueHistory.value.forEach((item, index) => {
            if (index < badgeStyles.length) Object.assign(item, badgeStyles[index])
          })
        }
        const qn =
          (data && data.queueNumber) ||
          (data && data.prefix && data.queueNumber ? `${data.prefix}-${data.queueNumber}` : '-')
        currentQueue.value = {
          number: qn,
          counter: data.counterNumber || '-',
          service: data.serviceName || data.service?.name || null,
        }
        triggerFlash()
        enqueueAnnouncement(
          data.soundUrl,
          `${data.prefix || ''}-${data.queueNumber || ''}-${data.counterNumber || ''}`,
        )
      }
    } catch (e) {
      console.error('Error processing message:', e)
    }
  }
}

const disconnectSocket = () => {
  socketClosedByUser = true
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (socket) {
    try {
      socket.close()
    } catch (err) {
      console.error('Error disconnecting socket:', err)
    }
  }
}

const bellUrl = '/bell-anounce.m4a'
let bellAudio
let lastAnnounceKey = ''
let lastAnnounceTs = 0
let lastCallKey = ''
let lastCallTs = 0

const resolveSoundUrl = (src) => {
  try {
    if (!src) return null
    if (/^https?:\/\//.test(src)) {
      try {
        const u = new URL(src)
        const proxyPath = import.meta.env.VITE_AUDIO_PROXY_PATH
        if (u.hostname.includes('is3.cloudhost.id')) {
          if (import.meta.env.DEV) return `/audio${u.pathname}${u.search || ''}`
          if (proxyPath) return `${proxyPath}${u.pathname}${u.search || ''}`
          return src
        }
      } catch {
        /* noop */
      }
      return src
    }
    let base = import.meta.env.VITE_API_BASE_URL || location.origin
    if (!/^https?:\/\//.test(base)) base = `http://${base}`
    base = base.replace(/\/api(\/v1)?$/, '')
    if (!src.startsWith('/')) src = `/${src}`
    return `${base}${src}`
  } catch {
    return src
  }
}

const playAudio = (src) => {
  return new Promise((resolve) => {
    try {
      const a = src === bellUrl && bellAudio ? bellAudio : new Audio(src)
      a.playsInline = true
      try {
        a.crossOrigin = 'anonymous'
        a.preload = 'auto'
        a.load()
      } catch (err) {
        console.error('Error loading audio:', err)
      }
      try {
        a.currentTime = 0
      } catch (err) {
        console.error('Error setting audio current time:', err)
      }
      a.addEventListener('ended', () => resolve())
      a.addEventListener('error', () => resolve())
      a.play().catch(() => resolve())
      setTimeout(() => resolve(), 60000)
    } catch {
      resolve()
    }
  })
}

const audioQueue = []
let loopActive = false
const startPlaybackLoop = async () => {
  if (loopActive) return
  loopActive = true
  try {
    while (audioQueue.length) {
      if (!audioEnabled.value) {
        await new Promise((r) => setTimeout(r, 300))
        continue
      }
      const item = audioQueue.shift()
      await playAudio(bellUrl)
      if (item && item.soundUrl) await playAudio(item.soundUrl)
    }
  } finally {
    loopActive = false
    if (audioQueue.length) startPlaybackLoop()
  }
}

const enqueueAnnouncement = (soundUrl, key) => {
  try {
    if (key) {
      const now = Date.now()
      if (key === lastAnnounceKey && now - lastAnnounceTs < 2000) return
      lastAnnounceKey = key
      lastAnnounceTs = now
    }
  } catch {
    void 0
  }
  audioQueue.push({ soundUrl: resolveSoundUrl(soundUrl) })
  startPlaybackLoop()
}

const enableAudio = async () => {
  try {
    if (!bellAudio) {
      bellAudio = document.createElement('audio')
      bellAudio.src = bellUrl
      bellAudio.preload = 'auto'
      try {
        bellAudio.load()
      } catch (err) {
        console.error('Error loading audio:', err)
      }
    }
    bellAudio.muted = true
    await bellAudio.play()
    bellAudio.pause()
    bellAudio.muted = false
  } catch (err) {
    console.error('Error playing audio:', err)
  }
  audioEnabled.value = true
}

const toggleAudio = async () => {
  if (!audioEnabled.value) {
    await enableAudio()
  } else {
    audioEnabled.value = false
  }
}

const fetchQueues = async () => {
  loading.value = true
  error.value = ''
  try {
    const headers = { accept: 'application/json' }
    const { data } = await request.get(API_PATHS.QUEUES.GET_RECENT_PUBLIC, { headers })
    const arr = Array.isArray(data?.data) ? data.data.slice(0, 4) : []
    if (arr.length > 0) {
      currentQueue.value = {
        number: arr[0].queueNumber || '-',
        counter: arr[0].counterNumber || '-',
        service: arr[0].serviceName || arr[0].service?.name || null,
      }
      queueHistory.value = arr.slice(1, 4).map((q, i) => ({
        id: q.id,
        number: q.queueNumber,
        counter: q.counterNumber,
        ...badgeStyles[i % badgeStyles.length],
      }))
    } else {
      currentQueue.value = { number: '-', counter: '-', service: null }
      queueHistory.value = []
    }
  } catch {
    error.value = 'Gagal memuat data antrian.'
  } finally {
    loading.value = false
  }
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
let pollId
const unlockHandler = () => {
  if (!audioEnabled.value) enableAudio()
}

onMounted(async () => {
  updateDateTime()
  intervalId = setInterval(updateDateTime, 1000)
  connectSocket()
  await fetchQueues()
  try {
    bellAudio = document.createElement('audio')
    bellAudio.src = bellUrl
    bellAudio.preload = 'auto'
    bellAudio.load()
  } catch (err) {
    console.error('Error loading audio:', err)
  }
  window.addEventListener('click', unlockHandler, { once: true })
  window.addEventListener('touchstart', unlockHandler, { once: true })
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  disconnectSocket()
  window.removeEventListener('click', unlockHandler)
  window.removeEventListener('touchstart', unlockHandler)
  if (reconnectTimer) clearTimeout(reconnectTimer)
  if (pollId) clearInterval(pollId)
  if (flashTimer) clearTimeout(flashTimer)
})
</script>

<style scoped>
/* ── Main queue number ────────────────────────────────────────
   No scale — large text + scale looks bad / choppy on TV.
   Gentle translateY + opacity only; GPU-composited, TV-safe. */
.slide-up-enter-active {
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}
.slide-up-leave-active {
  transition:
    opacity 0.3s ease-in,
    transform 0.3s ease-in;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(32px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-32px);
}

/* ── Counter badge ─────────────────────────────────────────── */
.fade-enter-active {
  transition:
    opacity 0.35s ease-out,
    transform 0.35s ease-out;
}
.fade-leave-active {
  transition:
    opacity 0.2s ease-in,
    transform 0.2s ease-in;
}
.fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* ── History cards ─────────────────────────────────────────────
   Cards "fall in" from top (the previous current queue drops
   into history). Leave toward bottom (oldest card falls off).
   translateY only — no scale, no translateX. TV-safe. */
.queue-list-move {
  transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.queue-list-enter-active {
  transition:
    opacity 0.45s ease-out,
    transform 0.45s ease-out;
}
.queue-list-leave-active {
  transition:
    opacity 0.3s ease-in,
    transform 0.3s ease-in;
  position: absolute;
  right: 0;
  left: 0;
}
.queue-list-enter-from {
  opacity: 0;
  transform: translateY(-28px);
}
.queue-list-leave-to {
  opacity: 0;
  transform: translateY(28px);
}

/* ── New call flash ring ───────────────────────────────────────
   Opacity-only animation on an absolutely positioned overlay.
   100% GPU-composited — works on all Smart TV browsers. */
@keyframes callFlash {
  0% {
    opacity: 1;
  }
  60% {
    opacity: 0.6;
  }
  100% {
    opacity: 0;
  }
}
.call-flash {
  animation: callFlash 1.6s ease-out forwards;
}

/* ── Idle breathing text ───────────────────────────────────── */
@keyframes breathe {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}
.idle-breathe {
  animation: breathe 3s ease-in-out infinite;
}

@media (min-width: 2560px) {
  .monitor-title {
    font-size: 4rem;
  }
  .monitor-content .grid {
    gap: 3rem;
  }
  .monitor-card {
    padding: 6rem;
  }
  .current-number {
    font-size: clamp(16rem, 12vw, 22rem);
  }
  .counter-badge {
    padding: 2rem 2.5rem;
  }
  .queue-item {
    padding: 3rem;
  }
  .queue-number {
    font-size: 6rem;
  }
  .queue-counter {
    font-size: 4rem;
  }
}

@media (min-width: 3840px) {
  .monitor-title {
    font-size: 4.5rem;
  }
  .monitor-content .grid {
    gap: 4rem;
  }
  .monitor-card {
    padding: 8rem;
  }
  .current-number {
    font-size: clamp(22rem, 10vw, 28rem);
  }
  .counter-badge {
    padding: 2.5rem 3rem;
  }
  .queue-item {
    padding: 4rem;
  }
  .queue-number {
    font-size: 8rem;
  }
  .queue-counter {
    font-size: 5rem;
  }
}
</style>
