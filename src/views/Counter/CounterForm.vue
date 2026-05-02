<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard :isFormData="true">
      <div class="space-y-6">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Counter Number <span class="text-error-500">*</span>
            <span class="text-gray-400 font-normal text-xs ml-1">(max 3 characters)</span>
          </label>
          <div class="relative">
            <input
              ref="firstInputRef"
              type="text"
              v-model="formData.counterNumber"
              @input="errors.counterNumber = ''"
              maxlength="3"
              :class="[fieldClass(errors.counterNumber), 'pr-12']"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              {{ formData.counterNumber.length }}/3
            </span>
          </div>
          <p v-if="errors.counterNumber" class="mt-1 text-sm text-error-500">{{ errors.counterNumber }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Organization <span class="text-error-500">*</span>
          </label>
          <StatusSelect
            v-model="selectedOrganizationId"
            :options="organizationOptions"
            placeholder="-- Select Organization --"
            :disabled="loading"
            :show-status="false"
            @update:modelValue="errors.serviceId = ''"
          />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Service <span class="text-error-500">*</span>
          </label>
          <StatusSelect
            v-model="formData.serviceId"
            :options="serviceOptions"
            placeholder="-- Select Service --"
            :disabled="!selectedOrganizationId || loading"
            :show-status="false"
            @update:modelValue="errors.serviceId = ''"
          />
          <p v-if="errors.serviceId" class="mt-1 text-sm text-error-500">{{ errors.serviceId }}</p>
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
            to="/admin/counters"
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
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { useCounterStore, useServiceStore, useOrganizationStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

import ComponentCard from '@/components/common/ComponentCard.vue'
import StatusSelect from '@/components/common/StatusSelect.vue'
import { showSuccessToast, showApiErrorToast } from '@/helpers/sweetalert'

const currentPageTitle = ref('Add Counter')
const firstInputRef = ref(null)

const counterStore = useCounterStore()
const { counter, loading } = storeToRefs(counterStore)
const { fetchCounter, createCounter, updateCounter } = counterStore

const serviceStore = useServiceStore()
const { services, service } = storeToRefs(serviceStore)
const { fetchServices, fetchService } = serviceStore

const organizationStore = useOrganizationStore()
const { organizations } = storeToRefs(organizationStore)
const { fetchOrganizations } = organizationStore

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

const formData = reactive({
  counterNumber: '',
  serviceId: null,
  isActive: true,
})

const errors = reactive({ counterNumber: '', serviceId: '' })

const selectedOrganizationId = ref(null)

const baseInputClass = 'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
const normalClass = 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
const errorClass = 'border-error-400 focus:border-error-400 focus:ring-error-500/10 dark:border-error-500'

const fieldClass = (error) => [baseInputClass, error ? errorClass : normalClass]

const validate = () => {
  errors.counterNumber = ''
  errors.serviceId = ''
  let valid = true

  if (!formData.counterNumber.trim()) {
    errors.counterNumber = 'Counter number is required.'
    valid = false
  } else if (formData.counterNumber.trim().length > 3) {
    errors.counterNumber = 'Counter number must be at most 3 characters.'
    valid = false
  }
  if (!selectedOrganizationId.value) {
    errors.serviceId = 'Please select an organization first.'
    valid = false
  } else if (!formData.serviceId) {
    errors.serviceId = 'Service is required.'
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
  await nextTick()
  firstInputRef.value?.focus()
})

const handleSubmit = async () => {
  if (!validate()) return

  try {
    if (id) {
      await updateCounter(id, {
        counterNumber: formData.counterNumber,
        serviceId: formData.serviceId,
        isActive: formData.isActive,
      })
      showSuccessToast('Counter updated successfully!')
    } else {
      await createCounter({
        counterNumber: formData.counterNumber,
        serviceId: formData.serviceId,
      })
      showSuccessToast('Counter created successfully!')
    }
    router.push('/admin/counters')
  } catch (error) {
    showApiErrorToast(error, 'Failed to save counter.')
    console.error('Error saving counter:', error)
  }
}

watch(selectedOrganizationId, async (newOrgId) => {
  formData.serviceId = null
  serviceStore.$patch({ services: [] })
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
