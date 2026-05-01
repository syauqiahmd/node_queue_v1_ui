<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard :isFormData="true">
      <div class="space-y-6">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Name <span class="text-error-500">*</span>
          </label>
          <input
            ref="firstInputRef"
            type="text"
            v-model="formData.name"
            @input="errors.name = ''"
            :class="fieldClass(errors.name)"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-error-500">{{ errors.name }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Prefix <span class="text-error-500">*</span>
            <span class="text-gray-400 font-normal text-xs ml-1">(max 2 characters)</span>
          </label>
          <div class="relative">
            <input
              type="text"
              v-model="formData.prefix"
              @input="errors.prefix = ''"
              maxlength="2"
              :class="[fieldClass(errors.prefix), 'pr-12']"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              {{ formData.prefix.length }}/2
            </span>
          </div>
          <p v-if="errors.prefix" class="mt-1 text-sm text-error-500">{{ errors.prefix }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Organization <span class="text-error-500">*</span>
          </label>
          <select
            v-model="formData.organizationId"
            :disabled="loading"
            @change="errors.organizationId = ''"
            :class="[fieldClass(errors.organizationId), !formData.organizationId ? 'text-gray-400 dark:text-gray-500' : '']"
          >
            <option :value="null">-- Select Organization --</option>
            <option v-for="org in organizations" :key="org.id" :value="org.id">
              {{ org.name }} - {{ org.fullName }}
            </option>
          </select>
          <p v-if="errors.organizationId" class="mt-1 text-sm text-error-500">{{ errors.organizationId }}</p>
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
            <label class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Active</label>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            :disabled="loading"
            class="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleSubmit"
          >
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
          <router-link
            to="/admin/services"
            class="flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </router-link>
        </div>
      </div>
    </ComponentCard>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { useServiceStore, useOrganizationStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

import ComponentCard from '@/components/common/ComponentCard.vue'
import { showSuccessToast, showErrorToast } from '@/helpers/sweetalert'

const currentPageTitle = ref('Add Service')
const firstInputRef = ref(null)

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

const errors = reactive({ name: '', prefix: '', organizationId: '' })

const baseInputClass = 'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
const normalClass = 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
const errorClass = 'border-error-400 focus:border-error-400 focus:ring-error-500/10 dark:border-error-500'

const fieldClass = (error) => [baseInputClass, error ? errorClass : normalClass]

const validate = () => {
  errors.name = ''
  errors.prefix = ''
  errors.organizationId = ''
  let valid = true

  if (!formData.name.trim()) {
    errors.name = 'Name is required.'
    valid = false
  }
  if (!formData.prefix.trim()) {
    errors.prefix = 'Prefix is required.'
    valid = false
  } else if (formData.prefix.trim().length > 2) {
    errors.prefix = 'Prefix must be at most 2 characters.'
    valid = false
  }
  if (!formData.organizationId) {
    errors.organizationId = 'Organization is required.'
    valid = false
  }

  return valid
}

const id = route.params.id

onMounted(async () => {
  await fetchOrganizations({
    pageSize: 25,
    sortBy: 'name',
    sortOrder: 'asc',
    isActive: true,
    pagination: true,
  })
  if (id) {
    currentPageTitle.value = 'Edit Service'
    await fetchService(id)
    formData.name = service.value.name
    formData.prefix = service.value.prefix
    formData.organizationId = service.value.organizationId
    formData.isActive = service.value.isActive
  }
  await nextTick()
  firstInputRef.value?.focus()
})

const handleSubmit = async () => {
  if (!validate()) return

  try {
    if (id) {
      await updateService(id, {
        name: formData.name,
        prefix: formData.prefix,
        organizationId: formData.organizationId,
        isActive: formData.isActive,
      })
      showSuccessToast('Service updated successfully!')
    } else {
      await createService({
        name: formData.name,
        prefix: formData.prefix,
        organizationId: formData.organizationId,
      })
      showSuccessToast('Service created successfully!')
    }
    router.push('/admin/services')
  } catch (error) {
    showErrorToast('Failed to save service.')
    console.error('Error saving service:', error)
  }
}
</script>
