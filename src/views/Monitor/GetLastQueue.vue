<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center p-2 md:p-6"
  >
    <!-- Title Section -->
    <div class="w-full max-w-none mx-1 md:mx-4 mb-8">
      <h1 class="text-white text-3xl md:text-4xl font-light text-center tracking-wide">
        Queue Management
      </h1>
    </div>

    <!-- Main Content - Centered -->
    <div class="max-w-none mx-1 md:mx-4 flex-1 flex items-center w-full">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 w-full">
        <!-- Main Current Queue Section -->
        <div class="lg:col-span-3">
          <div
            class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 md:p-16 text-center h-full flex flex-col justify-center shadow-2xl transition-all duration-300 hover:bg-white/10"
          >
            <p
              class="text-white/70 text-base md:text-lg font-medium mb-6 uppercase tracking-widest"
            >
              Current Queue
            </p>

            <!-- Animated Current Queue Number -->
            <div class="relative overflow-hidden mb-8 md:mb-12">
              <Transition name="slide-up" mode="out-in">
                <div
                  :key="currentQueue.number"
                  class="text-emerald-400 text-8xl md:text-9xl lg:text-[12rem] font-extralight transition-all duration-500"
                >
                  {{ currentQueue.number }}
                </div>
              </Transition>
            </div>

            <div class="flex justify-center items-center gap-4">
              <Transition name="fade" mode="out-in">
                <div
                  :key="currentQueue.counter"
                  class="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-400/50 px-6 py-3 rounded-full shadow-lg"
                >
                  <span class="text-blue-300 text-xl md:text-2xl font-medium">{{
                    currentQueue.counter
                  }}</span>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Right Sidebar - Queue History -->
        <div class="lg:col-span-2 space-y-4 md:space-y-6">
          <TransitionGroup name="queue-list" tag="div" class="space-y-4 md:space-y-6">
            <div
              v-for="(queue, index) in queueHistory"
              :key="queue.id"
              class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8 transition-all duration-300 hover:bg-white/10 hover:scale-105"
            >
              <div class="flex justify-between items-center">
                <div class="flex-1">
                  <p
                    class="text-white/50 text-sm md:text-base font-medium mb-3 uppercase tracking-wide"
                  >
                    Queue {{ index + 1 }}
                  </p>
                  <div class="text-emerald-400 text-3xl md:text-4xl font-light mb-2">
                    {{ queue.number }}
                  </div>
                </div>
                <div class="text-right ml-6">
                  <div :class="queue.badgeClass">
                    <span :class="queue.textClass">{{ queue.counter }}</span>
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
      <div class="flex justify-between items-center text-white/60 text-sm md:text-base px-2">
        <span class="font-light">{{ currentDateTime }}</span>
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span class="text-sm">Live</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentDateTime = ref('')
let queueCounter = 1235

// Current queue state
const currentQueue = ref({
  number: '#1234',
  counter: 'Counter 5',
})

// Queue history with badge styles
const queueHistory = ref([
  {
    id: 1,
    number: '#1233',
    counter: 'Counter 4',
    badgeClass:
      'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 px-4 py-2 rounded-full shadow-lg',
    textClass: 'text-purple-300 text-base md:text-lg font-medium',
  },
  {
    id: 2,
    number: '#1232',
    counter: 'Counter 3',
    badgeClass:
      'bg-gradient-to-r from-orange-500/30 to-amber-500/30 border border-orange-400/50 px-4 py-2 rounded-full shadow-lg',
    textClass: 'text-orange-300 text-base md:text-lg font-medium',
  },
  {
    id: 3,
    number: '#1231',
    counter: 'Counter 2',
    badgeClass:
      'bg-gradient-to-r from-rose-500/30 to-red-500/30 border border-rose-400/50 px-4 py-2 rounded-full shadow-lg',
    textClass: 'text-rose-300 text-base md:text-lg font-medium',
  },
])

const badgeStyles = [
  {
    badgeClass:
      'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 px-4 py-2 rounded-full shadow-lg',
    textClass: 'text-purple-300 text-base md:text-lg font-medium',
  },
  {
    badgeClass:
      'bg-gradient-to-r from-orange-500/30 to-amber-500/30 border border-orange-400/50 px-4 py-2 rounded-full shadow-lg',
    textClass: 'text-orange-300 text-base md:text-lg font-medium',
  },
  {
    badgeClass:
      'bg-gradient-to-r from-rose-500/30 to-red-500/30 border border-rose-400/50 px-4 py-2 rounded-full shadow-lg',
    textClass: 'text-rose-300 text-base md:text-lg font-medium',
  },
]

// Function to update queue (will be triggered by WebSocket in real app)
const updateQueue = async () => {
  // Add current queue to history
  const newHistoryItem = {
    id: Date.now(),
    number: currentQueue.value.number,
    counter: currentQueue.value.counter,
    ...badgeStyles[0],
  }

  // Update queue history - shift everything down
  queueHistory.value.unshift(newHistoryItem)

  // Keep only 3 items in history
  if (queueHistory.value.length > 3) {
    queueHistory.value.pop()
  }

  // Update badge styles for existing items
  queueHistory.value.forEach((item, index) => {
    if (index < badgeStyles.length) {
      Object.assign(item, badgeStyles[index])
    }
  })

  // Wait a bit for the history animation
  await new Promise((resolve) => setTimeout(resolve, 200))

  // Update current queue
  const randomCounter = Math.floor(Math.random() * 8) + 1
  currentQueue.value = {
    number: `#${queueCounter}`,
    counter: `Counter ${randomCounter}`,
  }

  queueCounter++
}

// Auto-update for demo (simulating WebSocket events)
let autoUpdateInterval

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

onMounted(() => {
  updateDateTime()
  intervalId = setInterval(updateDateTime, 1000)

  // Auto-update every 8 seconds to simulate WebSocket events
  autoUpdateInterval = setInterval(updateQueue, 8000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  if (autoUpdateInterval) {
    clearInterval(autoUpdateInterval)
  }
})

// Expose updateQueue function for WebSocket integration
defineExpose({
  updateQueue,
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
</style>
