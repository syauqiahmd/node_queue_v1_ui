<template>
  <div class="space-y-5 sm:space-y-6">
    <PageTitle pageTitle="Report" />

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <ComponentCard v-if="isAdmin">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Select Organization
        </h3>
        <StatusSelect
          v-model="selectedOrganizationId"
          :options="organizationOptions"
          placeholder="-- Select Organization --"
          :show-status="false"
        />
      </ComponentCard>

      <ComponentCard>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Select Service</h3>
        <StatusSelect
          v-model="selectedServiceId"
          :options="serviceOptions"
          placeholder="-- Select Service --"
          :disabled="!selectedOrganizationId"
          :show-status="false"
        />
      </ComponentCard>
    </div>

    <ComponentCard>
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Select Date Range</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="space-y-2">
          <label for="report-start-date" class="text-sm text-gray-700">Start Date</label>
          <VueFlatpickr
            v-model="startDate"
            :config="fpConfig"
            id="report-start-date"
            class="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90"
          />
        </div>
        <div class="space-y-2">
          <label for="report-end-date" class="text-sm text-gray-700">
            End Date
            <span class="text-xs text-gray-400 font-normal ml-1">(max. 1 month from start)</span>
          </label>
          <VueFlatpickr
            v-model="endDate"
            :config="endFpConfig"
            id="report-end-date"
            class="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90"
          />
        </div>
      </div>
      <div class="flex justify-end mt-6">
        <button
          type="button"
          :disabled="reportStore.loading || !startDate"
          @click="downloadReport"
          class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-6 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
        >
          {{ reportStore.loading ? 'Downloading...' : 'Download' }}
        </button>
      </div>
    </ComponentCard>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import dayjs from 'dayjs'
import PageTitle from '@/components/common/PageTitle.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import StatusSelect from '@/components/common/StatusSelect.vue'
import VueFlatpickr from 'vue-flatpickr-component'
import { useOrganizationStore, useServiceStore, useReportStore, useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { showSuccessToast, showErrorAlert, showApiErrorToast } from '@/helpers/sweetalert'

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)

const organizationStore = useOrganizationStore()
const { organizations } = storeToRefs(organizationStore)
const { fetchOrganizations } = organizationStore

const serviceStore = useServiceStore()
const { services } = storeToRefs(serviceStore)
const { fetchServices } = serviceStore

const reportStore = useReportStore()

const organizationOptions = computed(() =>
  organizations.value.map((o) => ({
    value: o.id,
    label: `${o.name} - ${o.fullName}`,
    isActive: o.isActive,
  })),
)

const serviceOptions = computed(() =>
  services.value.map((s) => ({
    value: s.id,
    label: s.name,
    isActive: s.isActive,
  })),
)

const selectedOrganizationId = ref(null)
const selectedServiceId = ref(null)
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

onMounted(async () => {
  if (isAdmin.value) {
    await fetchOrganizations({ pagination: true, pageSize: 25, sortBy: 'name', sortOrder: 'asc' })
    selectedOrganizationId.value = null
  } else {
    const orgId = authStore.user?.organization?.organizationId
    if (orgId) {
      selectedOrganizationId.value = orgId
      await fetchServices({
        pagination: false,
        organizationId: orgId,
        isActive: true,
        sortBy: 'name',
        sortOrder: 'asc',
      })
    }
  }
  startDate.value = dayjs().format('YYYY-MM-DD')
})

watch(startDate, (newStart) => {
  if (endDate.value && newStart) {
    const maxEnd = dayjs(newStart).add(1, 'month').format('YYYY-MM-DD')
    if (endDate.value > maxEnd || endDate.value < newStart) endDate.value = ''
  }
})

watch(selectedOrganizationId, async (newOrgId) => {
  selectedServiceId.value = null
  serviceStore.$patch({ services: [] })
  if (newOrgId) {
    await fetchServices({
      pagination: false,
      organizationId: newOrgId,
      isActive: true,
      sortBy: 'name',
      sortOrder: 'asc',
    })
  }
})

const downloadReport = async () => {
  try {
    await reportStore.downloadDailyServiceStats({
      organizationId: selectedOrganizationId.value,
      serviceId: selectedServiceId.value,
      startDate: startDate.value,
      endDate: endDate.value || null,
    })
    showSuccessToast('Report download started')
  } catch (error) {
    try {
      const blob = error?.response?.data
      if (blob && typeof blob === 'object' && 'text' in blob) {
        const text = await blob.text()
        const json = JSON.parse(text)
        const code = json?.error?.code || 'Error'
        const message = json?.error?.message || 'Failed to download report'
        showErrorAlert(code, message)
      } else {
        showApiErrorToast(error, 'Failed to download report.')
      }
    } catch {
      showApiErrorToast(error, 'Failed to download report.')
    }
  }
}
</script>
