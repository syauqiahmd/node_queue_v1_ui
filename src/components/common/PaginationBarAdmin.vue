<template>
  <div class="mt-5 flex justify-end items-center space-x-2">
    <button
      class="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-white/[0.08] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/[0.15] transition"
      :class="{ 'disabled-link': !hasPreviousPage || loading }"
      :disabled="!hasPreviousPage || loading"
      @click="changePage(currentPage - 1)"
    >
      Previous
    </button>
    <button
      class="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-white/[0.08] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/[0.15] transition"
      :class="{ 'disabled-link': !hasNextPage || loading }"
      :disabled="!hasNextPage || loading"
      @click="changePage(currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['page-changed'])

const hasPreviousPage = computed(() => props.currentPage > 1)
const hasNextPage = computed(() => props.currentPage * props.pageSize < props.totalItems)

function changePage(page) {
  if (page > 0 && page <= Math.ceil(props.totalItems / props.pageSize)) {
    emit('page-changed', page)
  }
}
</script>

<style scoped>
.disabled-link {
  pointer-events: none;
  opacity: 0.5;
}
</style>
