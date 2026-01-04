<template>
  <div
    :class="[
      'rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]',
      className,
    ]"
  >
    <!-- Card Header -->
    <div v-if="isTableData" class="px-6 py-5">
      <span>
        <SearchBar :searchableList="searchableList" @perform-search="handleSearch" />
      </span>
    </div>
    <div v-if="isFormData" class="px-6 py-5">
      <button
        type="button"
        class="flex items-center gap-2 text-blue-600 hover:underline"
        @click="$router.back()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Kembali
      </button>
    </div>

    <!-- Card Body -->
    <div class="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
      <div class="space-y-5">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import SearchBar from '../layout/header/SearchBar.vue'

defineProps({
  isTableData: {
    type: Boolean,
    required: false,
  },
  isFormData: {
    type: Boolean,
    required: false,
  },
  className: {
    type: String,
    default: '',
  },
  searchableList: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['handle-search'])

const handleSearch = (searchParams) => {
  emit('handle-search', searchParams)
}
</script>
