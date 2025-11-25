<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard :isFormData="true">
      <div class="space-y-6">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Counter Number
          </label>
          <input
            type="text"
            v-model="formData.counterNumber"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Organization
          </label>
          <select
            v-model="selectedOrganizationId"
            :disabled="loading"
            class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          >
            <option :value="null">-- Select Organization --</option>
            <option v-for="org in organizations" :key="org.id" :value="org.id">
              {{ org.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Service
          </label>
          <select
            v-model="formData.serviceId"
            :disabled="!selectedOrganizationId || loading"
            class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          >
            <option :value="null">-- Select Service --</option>
            <option v-for="service in services" :key="service.id" :value="service.id">
              {{ service.name }}
            </option>
          </select>
        </div>
        <div v-if="id">
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Status
          </label>
          <div class="flex items-center">
            <input
              type="checkbox"
              v-model="formData.isActive"
              class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <label for="isActive" class="ml-2 block text-sm text-gray-900 dark:text-gray-300"
              >Active</label
            >
          </div>
        </div>

        <button
          type="button"
          :disabled="loading"
          class="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleSubmit"
        >
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </ComponentCard>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { useCounterStore, useServiceStore, useOrganizationStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

import ComponentCard from '@/components/common/ComponentCard.vue'
import { showSuccessToast, showErrorToast } from '@/helpers/sweetalert'

const currentPageTitle = ref('Add Counter')
const counterId = ref(null)

const counterStore = useCounterStore()
const { counter, loading } = storeToRefs(counterStore)
const { fetchCounter, createCounter, updateCounter } = counterStore

const serviceStore = useServiceStore()
const { services, service } = storeToRefs(serviceStore)
const { fetchServices, fetchService } = serviceStore

const organizationStore = useOrganizationStore()
const { organizations } = storeToRefs(organizationStore)
const { fetchOrganizations } = organizationStore

const formData = reactive({
  counterNumber: '',
  serviceId: null,
  isActive: true,
})

let id = null
const selectedOrganizationId = ref(null)

onMounted(async () => {
  await fetchOrganizations({
    pageSize: 25,
    sortBy: 'name',
    sortOrder: 'asc',
    isActive: true,
    pagination: true,
  })
  id = route.params.id
  if (id) {
    counterId.value = id
    currentPageTitle.value = 'Edit Counter'
    await fetchCounter(id)
    formData.counterNumber = counter.value.counterNumber
    formData.serviceId = counter.value.serviceId
    formData.isActive = counter.value.isActive
    await fetchService(formData.serviceId)
    selectedOrganizationId.value = service.value.organizationId
    await fetchServices({
      pagination: true,
      pageSize: 25,
      sortBy: 'name',
      sortOrder: 'asc',
      isActive: true,
      organizationId: selectedOrganizationId.value,
    })
  } else {
    if (organizations.value.length > 0) {
      selectedOrganizationId.value = organizations.value[0].id
      await fetchServices({
        pagination: true,
        pageSize: 25,
        sortBy: 'name',
        sortOrder: 'asc',
        isActive: true,
        organizationId: selectedOrganizationId.value,
      })
    }
  }
})

const handleSubmit = async () => {
  try {
    if (!selectedOrganizationId.value || !formData.serviceId) {
      showErrorToast('Please select organization and service.')
      return
    }
    if (id) {
      const payload = {
        counterNumber: formData.counterNumber,
        serviceId: formData.serviceId,
        isActive: formData.isActive,
      }
      await updateCounter(id, payload)
      showSuccessToast('Counter updated successfully!')
    } else {
      const payload = {
        counterNumber: formData.counterNumber,
        serviceId: formData.serviceId,
      }
      await createCounter(payload)
      showSuccessToast('Counter created successfully!')
    }
    router.push('/admin/counters')
  } catch (error) {
    showErrorToast('Failed to save counter.')
    console.error('Error saving counter:', error)
  }
}

watch(selectedOrganizationId, async (newOrgId) => {
  formData.serviceId = null
  services.value = []
  if (newOrgId) {
    await fetchServices({
      pagination: true,
      pageSize: 25,
      sortBy: 'name',
      sortOrder: 'asc',
      isActive: true,
      organizationId: newOrgId,
    })
  }
})
</script>
