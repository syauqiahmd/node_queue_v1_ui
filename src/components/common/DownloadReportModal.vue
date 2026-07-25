<template>
  <div class="fixed inset-0 z-99999 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />
    <div
      class="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">{{ title }}</h3>

      <div class="space-y-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ fromLabel }} <span class="text-error-500">*</span>
          </label>
          <VueFlatpickr
            v-model="startDate"
            :config="fpConfig"
            class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ toLabel }}
            <span class="text-xs font-normal text-gray-400">(max. 1 month)</span>
          </label>
          <VueFlatpickr
            v-model="endDate"
            :config="endFpConfig"
            class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>
      </div>

      <div class="mt-6 flex items-center gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="loading || !startDate"
          @click="handleDownload"
          class="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 disabled:bg-brand-300"
        >
          {{ loading ? 'Downloading...' : 'Download' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import VueFlatpickr from 'vue-flatpickr-component'

const props = defineProps({
  title: { type: String, default: 'Download Report' },
  fromLabel: { type: String, default: 'From' },
  toLabel: { type: String, default: 'To' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'download'])

const startDate = ref('')
const endDate = ref('')

const fpConfig = {
  dateFormat: 'Y-m-d',
  allowInput: true,
  disableMobile: true,
}

const endFpConfig = computed(() => ({
  ...fpConfig,
  minDate: startDate.value || undefined,
  maxDate: startDate.value
    ? dayjs(startDate.value).add(1, 'month').format('YYYY-MM-DD')
    : undefined,
}))

watch(startDate, (newStart) => {
  if (endDate.value && newStart) {
    const maxEnd = dayjs(newStart).add(1, 'month').format('YYYY-MM-DD')
    if (endDate.value > maxEnd || endDate.value < newStart) endDate.value = ''
  }
})

const handleDownload = () => {
  if (!startDate.value || props.loading) return
  emit('download', { startDate: startDate.value, endDate: endDate.value || null })
}
</script>
