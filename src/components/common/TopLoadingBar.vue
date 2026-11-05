<template>
  <Transition name="bar">
    <div v-if="loading" class="loading-bar" />
  </Transition>
</template>

<script setup>
import { useLoadingBar } from '@/composables/useLoadingBar'

const { loading } = useLoadingBar()
</script>

<style scoped>
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 99999;
  background: linear-gradient(
    90deg,
    #6366f1,
    #8b5cf6,
    #ec4899,
    #ef4444,
    #f59e0b,
    #10b981,
    #3b82f6,
    #6366f1
  );
  background-size: 300% 100%;
  animation: shimmer 1.4s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.bar-enter-active,
.bar-leave-active {
  transition: opacity 0.2s ease;
}

.bar-enter-from,
.bar-leave-to {
  opacity: 0;
}
</style>
