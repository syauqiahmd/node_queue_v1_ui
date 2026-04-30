<template>
  <slot></slot>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const theme = ref('light')

onMounted(() => {
  theme.value = 'light'
})
</script>
