<template>
  <svg
    class="w-4 h-4"
    :class="{ 'transform rotate-180': direction === 'desc' }"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fill-rule="evenodd"
      d="M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L11 6.414V17a1 1 0 11-2 0V6.414L5.707 9.707a1 1 0 01-1.414-1.414l5-5A1 1 0 0110 3z"
      clip-rule="evenodd"
    />
  </svg>
</template>

<script setup>
defineProps({
  direction: {
    type: String,
    default: 'asc', // 'asc' or 'desc'
  },
});
</script>
