<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard :isFormData="true">
      <div class="space-y-6">
        <!-- Text Input -->
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
            Full Name
          </label>
          <input
            type="text"
            v-model="formData.fullName"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
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
            <label for="isActive" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Active</label>
          </div>
        </div>

        <button
          type="button"
          class="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
          @click="handleSubmit"
        >
          Save
        </button>
      </div>
    </ComponentCard>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { useOrganizationStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

import ComponentCard from '@/components/common/ComponentCard.vue'
import { showSuccessToast, showErrorToast } from '@/helpers/sweetalert'

const currentPageTitle = ref('Add Organization')
const organizationId = ref(null)

const organizationStore = useOrganizationStore()
const { organization, loading } = storeToRefs(organizationStore)
const { fetchOrganization, createOrganization, updateOrganization } = organizationStore

const formData = reactive({
  name: '',
  fullName: '',
  isActive: true,
})

let id = null

onMounted(async () => {
  id = route.params.id
  if (id) {
    organizationId.value = id
    currentPageTitle.value = 'Edit Organization'
    await fetchOrganization(id)
    formData.name = organization.value.name
    formData.fullName = organization.value.fullName
    formData.isActive = organization.value.isActive
  }
})

const handleSubmit = async () => {
  try {
    if (id) {
      await updateOrganization(id, formData)
      showSuccessToast('Organization updated successfully!')
    } else {
      const createData = { name: formData.name, fullName: formData.fullName }
      await createOrganization(createData)
      showSuccessToast('Organization created successfully!')
    }
    router.push('/admin/organizations')
  } catch (error) {
    showErrorToast('Failed to save organization.')
    console.error('Error saving organization:', error)
  }
}
</script>