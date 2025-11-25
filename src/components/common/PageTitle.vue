<template>
  <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90" x-text="pageTitle">
      {{ pageTitle }}
    </h2>
  </div>
</template>

<script setup lang="js">
const props = defineProps({
  pageTitle: {
    type: String,
    required: true,
  },
})
</script>
