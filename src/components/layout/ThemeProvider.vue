<template>
  <slot></slot>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const theme = ref('light')
const isInitialized = ref(false)

onMounted(() => {
  const initialTheme = 'light' // Default to light theme

  theme.value = initialTheme
  isInitialized.value = true
})
</script>
