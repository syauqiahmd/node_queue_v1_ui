<template>
  <div class="space-y-5 sm:space-y-6">
    <PageTitle pageTitle="Report" />

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <ComponentCard v-if="isAdmin">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Select Organization
        </h3>
        <select
          v-model="selectedOrganizationId"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        >
          <option :value="null">-- Select Organization --</option>
          <option
            v-for="organization in organizations"
            :key="organization.id"
            :value="organization.id"
          >
            {{ organization.name }} - {{ organization.fullName }}
          </option>
        </select>
      </ComponentCard>

      <ComponentCard>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Select Service</h3>
        <select
          v-model="selectedServiceId"
          :disabled="!selectedOrganizationId"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        >
          <option :value="null">-- Select Service --</option>
          <option v-for="service in services" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
        </select>
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
          <label for="report-end-date" class="text-sm text-gray-700">End Date</label>
          <VueFlatpickr
            v-model="endDate"
            :config="fpConfig"
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
import VueFlatpickr from 'vue-flatpickr-component'
import { useOrganizationStore, useServiceStore, useReportStore, useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { showErrorToast, showSuccessToast, showErrorAlert } from '@/helpers/sweetalert'

const authStore = useAuthStore()
const isAdmin = computed(() => (authStore.user?.role || authStore.user?.roleName) === 'ADMIN')

const organizationStore = useOrganizationStore()
const { organizations } = storeToRefs(organizationStore)
const { fetchOrganizations } = organizationStore

const serviceStore = useServiceStore()
const { services } = storeToRefs(serviceStore)
const { fetchServices } = serviceStore

const reportStore = useReportStore()

const selectedOrganizationId = ref(null)
const selectedServiceId = ref(null)
const startDate = ref('')
const endDate = ref('')

const fpConfig = {
  dateFormat: 'Y-m-d',
  allowInput: true,
  disableMobile: true,
}

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

watch(selectedOrganizationId, async (newOrgId) => {
  selectedServiceId.value = null
  services.value = []
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
        showErrorToast('Failed to download report')
      }
    } catch {
      showErrorToast('Failed to download report')
    }
    console.error('Report download error:', error)
  }
}
</script>

<style scoped></style>
