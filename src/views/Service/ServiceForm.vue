<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard :isFormData="true">
      <div class="space-y-6">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Name
          </label>
          <input
            type="text"
            v-model="formData.name"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Prefix
          </label>
          <input
            type="text"
            v-model="formData.prefix"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Organization
          </label>
          <select
            v-model="formData.organizationId"
            :disabled="loading"
            class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          >
            <option :value="null">-- Select Organization --</option>
            <option v-for="org in organizations" :key="org.id" :value="org.id">
              {{ org.name }} - {{ org.fullName }}
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
import { ref, reactive, onMounted } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { useServiceStore, useOrganizationStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

import ComponentCard from '@/components/common/ComponentCard.vue'
import { showSuccessToast, showErrorToast } from '@/helpers/sweetalert'

const currentPageTitle = ref('Add Service')
const serviceId = ref(null)

const serviceStore = useServiceStore()
const { service, loading } = storeToRefs(serviceStore)
const { fetchService, createService, updateService } = serviceStore

const organizationStore = useOrganizationStore()
const { organizations } = storeToRefs(organizationStore)
const { fetchOrganizations } = organizationStore

const formData = reactive({
  name: '',
  prefix: '',
  organizationId: null,
  isActive: true,
})

let id = null

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
    serviceId.value = id
    currentPageTitle.value = 'Edit Service'
    await fetchService(id)
    formData.name = service.value.name
    formData.prefix = service.value.prefix
    formData.organizationId = service.value.organizationId
    formData.isActive = service.value.isActive
  }
})

const handleSubmit = async () => {
  try {
    if (!formData.organizationId) {
      showErrorToast('Please select an organization.')
      return
    }
    if (id) {
      const payload = {
        name: formData.name,
        prefix: formData.prefix,
        organizationId: formData.organizationId,
        isActive: formData.isActive,
      }
      await updateService(id, payload)
      showSuccessToast('Service updated successfully!')
    } else {
      const payload = {
        name: formData.name,
        prefix: formData.prefix,
        organizationId: formData.organizationId,
      }
      await createService(payload)
      showSuccessToast('Service created successfully!')
    }
    router.push('/admin/services')
  } catch (error) {
    showErrorToast('Failed to save service.')
    console.error('Error saving service:', error)
  }
}
</script>
