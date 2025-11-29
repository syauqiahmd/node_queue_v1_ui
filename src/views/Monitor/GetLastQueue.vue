<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center p-2 md:p-6 monitor-root"
  >
    <div v-if="!audioEnabled" class="fixed top-4 right-4 z-50">
      <button
        @click="enableAudio"
        class="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/15 shadow-lg"
      >
        Enable Sound
      </button>
    </div>
    <!-- Title Section -->
    <div class="w-full max-w-none mx-1 md:mx-4 mb-8">
      <h1
        class="text-white text-3xl md:text-4xl font-light text-center tracking-wide monitor-title"
      >
        Mall Pelayanan Publik - Kab. Berau
      </h1>
    </div>

    <!-- Main Content - Centered -->
    <div class="max-w-none mx-1 md:mx-4 flex-1 flex items-center w-full monitor-content">
      <div v-if="loading" class="w-full text-center py-12">
        <span class="text-white/70">Memuat data antrian...</span>
      </div>
      <div v-else-if="error" class="w-full text-center py-12">
        <span class="text-red-400">{{ error }}</span>
      </div>
      <div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10 2xl:gap-12 w-full">
        <!-- Main Current Queue Section -->
        <div class="lg:col-span-3">
          <div
            class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-16 md:p-20 2xl:p-24 text-center h-full flex flex-col justify-center shadow-2xl transition-all duration-300 hover:bg-white/10 monitor-card"
          >
            <p
              class="text-white/70 text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-semibold mb-6 uppercase tracking-widest"
            >
              Antrian Saat Ini
            </p>

            <!-- Animated Current Queue Number -->
            <div class="relative overflow-hidden mb-8 md:mb-12">
              <Transition name="slide-up" mode="out-in">
                <div
                  :key="currentQueue.number"
                  class="text-emerald-400 text-9xl md:text-[10rem] lg:text-[14rem] 2xl:text-[18rem] font-light transition-all duration-500 current-number"
                >
                  {{ currentQueue.number }}
                </div>
              </Transition>
            </div>

            <div class="flex justify-center items-center gap-4">
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
          </div>
        </div>

        <!-- Right Sidebar - Queue History -->
        <div class="lg:col-span-2 space-y-4 md:space-y-6">
          <TransitionGroup name="queue-list" tag="div" class="space-y-4 md:space-y-6">
            <div
              v-for="queue in queueHistory"
              :key="queue.id"
              class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 md:p-10 2xl:p-12 transition-all duration-300 hover:bg-white/10 hover:scale-105 queue-item"
            >
              <div class="flex justify-between items-center">
                <div class="flex-1">
                  <p
                    class="text-white/50 text-base md:text-lg lg:text-xl font-medium mb-3 uppercase tracking-wide"
                  >
                    Nomor Antrian
                  </p>
                  <div
                    class="text-emerald-400 text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-light mb-2 queue-number"
                  >
                    {{ queue.number }}
                  </div>
                </div>
                <div class="text-right ml-6">
                  <div :class="queue.badgeClass">
                    <span :class="queue.textClass" class="queue-counter"
                      >Loket : {{ queue.counter }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <!-- Footer Section -->
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
          ></div>
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
// import { useServiceStore } from '@/stores'
// import { storeToRefs } from 'pinia'

const currentDateTime = ref('')
const loading = ref(false)
const error = ref('')

const currentQueue = ref({ number: '-', counter: '-' })
const queueHistory = ref([])
const audioEnabled = ref(false)
const connected = ref(false)
const connectionStatus = ref('disconnected')
let reconnectTimer

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
const connectSocket = () => {
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
  console.log('Connecting WebSocket to', url)
  let delay = 1000
  const maxDelay = 10000
  try {
    socket = new WebSocket(url)
  } catch {
    connectionStatus.value = 'disconnected'
    return
  }
  socket.onopen = () => {
    connected.value = true
    connectionStatus.value = 'connected'
    delay = 1000
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (pollId) {
      clearInterval(pollId)
      pollId = null
    }
  }
  socket.onclose = () => {
    connected.value = false
    connectionStatus.value = 'reconnecting'
    setTimeout(connectSocket, delay)
    delay = Math.min(delay * 2, maxDelay)
    if (!pollId) pollId = setInterval(fetchQueues, 5000)
  }
  socket.onerror = () => {
    connectionStatus.value = 'reconnecting'
    setTimeout(connectSocket, delay)
    delay = Math.min(delay * 2, maxDelay)
    if (!pollId) pollId = setInterval(fetchQueues, 5000)
  }
  socket.onmessage = (ev) => {
    try {
      const parsed = JSON.parse(ev.data)
      let event = parsed && parsed.event ? parsed.event : null
      let data = parsed && parsed.data ? parsed.data : parsed
      if (!event && data && (data.queueNumber || data.counterNumber || data.prefix)) {
        event = 'ticket:called'
      }
      if (event === 'ticket:called') {
        const key = `${data.prefix || ''}-${data.queueNumber || ''}-${data.counterNumber || ''}`
        const nowTs = Date.now()
        if (key && key === lastCallKey && nowTs - lastCallTs < 5000) {
          return
        }
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
        currentQueue.value = { number: qn, counter: data.counterNumber || '-' }
        enqueueAnnouncement(
          data.soundUrl,
          `${data.prefix || ''}-${data.queueNumber || ''}-${data.counterNumber || ''}`,
        )
      } else {
        console.log('WS monitor: unhandled event', parsed)
      }
    } catch (e) {
      console.error('Error processing message:', e)
    }
  }
}

const disconnectSocket = () => {
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
          if (import.meta.env.DEV) {
            return `/audio${u.pathname}${u.search || ''}`
          }
          if (proxyPath) {
            return `${proxyPath}${u.pathname}${u.search || ''}`
          }
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
      try {
        console.log('Playing audio:', src)
      } catch {
        void 0
      }
      a.addEventListener('ended', () => resolve())
      a.addEventListener('error', () => resolve())
      a.play().catch((e) => {
        try {
          console.error('Audio play failed:', src, e)
        } catch {
          void 0
        }
        resolve()
      })
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
      if (item && item.soundUrl) {
        await playAudio(item.soundUrl)
      }
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
      }
      queueHistory.value = arr.slice(1, 4).map((q, i) => ({
        id: q.id,
        number: q.queueNumber,
        counter: q.counterNumber,
        ...badgeStyles[i % badgeStyles.length],
      }))
    } else {
      currentQueue.value = { number: '-', counter: '-' }
      queueHistory.value = []
    }
  } catch {
    error.value = 'Failed to load queues.'
  } finally {
    loading.value = false
  }
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
let pollId
const unlockHandler = () => {
  if (!audioEnabled.value) enableAudio()
}

onMounted(async () => {
  updateDateTime()
  intervalId = setInterval(updateDateTime, 1000)
  connectSocket()
  await fetchQueues()
  // const serviceStore = useServiceStore()
  // const { publicServices } = storeToRefs(serviceStore)
  // await serviceStore.fetchPublicServices({ pagination: false })

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
})
</script>

<style scoped>
/* Slide up animation for main queue number */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100px) scale(0.8);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-100px) scale(1.2);
}

/* Fade animation for counter badge */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Queue list animations */
.queue-list-move,
.queue-list-enter-active,
.queue-list-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.queue-list-enter-from {
  opacity: 0;
  transform: translateX(-100px) scale(0.8);
}

.queue-list-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.8);
}

.queue-list-leave-active {
  position: absolute;
  right: 0;
  left: 0;
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
