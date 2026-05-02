<template>
  <div>
    <PageTitle pageTitle="Activity" />
    <ComponentCard isFormData>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="space-y-2">
          <label for="activity-date" class="text-sm text-gray-700">Date</label>
          <VueFlatpickr
            v-model="form.date"
            :config="fpConfig"
            id="activity-date"
            class="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90"
          />
        </div>
        <div class="space-y-2">
          <label for="activity-cron-type" class="text-sm text-gray-700">Cron Type</label>
          <select
            v-model="form.cronType"
            id="activity-cron-type"
            class="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90"
          >
            <option disabled value="">-- Select Cron Type --</option>
            <option value="PRE_CALCULATE">PRE_CALCULATE</option>
            <option value="HOUSEKEEPING_QUEUE_DATA">HOUSEKEEPING_QUEUE_DATA</option>
            <option value="HOUSEKEEPING_S3_FILES">HOUSEKEEPING_S3_FILES</option>
          </select>
        </div>
        <div class="space-y-2 md:col-span-2">
          <label for="activity-master-password" class="text-sm text-gray-700"
            >Master Password</label
          >
          <input
            type="password"
            v-model="form.masterPassword"
            placeholder="Enter master password"
            id="activity-master-password"
            class="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90"
          />
        </div>
      </div>
      <div class="flex justify-end gap-3 mt-6">
        <button
          type="button"
          :disabled="loading"
          @click="handleTrigger"
          class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-6 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
        >
          {{ loading ? 'Triggering...' : 'Trigger Cron' }}
        </button>
      </div>
    </ComponentCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import PageTitle from '@/components/common/PageTitle.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { showSuccessToast, showErrorToast, showApiErrorToast } from '@/helpers/sweetalert'
import { useCronStore } from '@/stores'
import { storeToRefs } from 'pinia'
import VueFlatpickr from 'vue-flatpickr-component'

const form = ref({
  date: '',
  cronType: '',
  masterPassword: '',
})

const cronStore = useCronStore()
const { loading } = storeToRefs(cronStore)

onMounted(() => {
  form.value.date = dayjs().format('YYYY-MM-DD')
})

const fpConfig = {
  dateFormat: 'Y-m-d',
  allowInput: true,
  disableMobile: true,
}

const handleTrigger = async () => {
  if (!form.value.date || !form.value.cronType || !form.value.masterPassword) {
    showErrorToast('Please fill all fields')
    return
  }
  try {
    const payload = {
      date: form.value.date,
      cronType: form.value.cronType,
      masterPassword: form.value.masterPassword,
    }
    await cronStore.triggerCron(payload)
    showSuccessToast('Cron triggered successfully')
    form.value.masterPassword = ''
  } catch (error) {
    showApiErrorToast(error, 'Failed to trigger cron.')
  }
}
</script>
