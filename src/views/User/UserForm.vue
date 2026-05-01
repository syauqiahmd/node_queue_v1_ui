<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard :isFormData="true">
      <div class="space-y-6">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Username <span class="text-error-500">*</span>
          </label>
          <input
            ref="firstInputRef"
            type="text"
            v-model="formData.userName"
            @input="errors.userName = ''"
            :class="fieldClass(errors.userName)"
          />
          <p v-if="errors.userName" class="mt-1 text-sm text-error-500">{{ errors.userName }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Full Name <span class="text-error-500">*</span>
          </label>
          <input
            type="text"
            v-model="formData.fullName"
            @input="errors.fullName = ''"
            :class="fieldClass(errors.fullName)"
          />
          <p v-if="errors.fullName" class="mt-1 text-sm text-error-500">{{ errors.fullName }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Password
            <span v-if="!id" class="text-error-500">*</span>
            <span v-else class="text-gray-400 font-normal text-xs ml-1">(leave blank to keep current)</span>
          </label>
          <input
            type="password"
            v-model="formData.password"
            @input="errors.password = ''"
            :class="fieldClass(errors.password)"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-error-500">{{ errors.password }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Role <span class="text-error-500">*</span>
          </label>
          <select
            v-model="formData.role"
            @change="errors.organizationId = ''"
            :class="fieldClass(errors.role)"
          >
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
          <p v-if="errors.role" class="mt-1 text-sm text-error-500">{{ errors.role }}</p>
        </div>

        <div v-if="formData.role === 'USER'">
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
            to="/admin/users"
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
import { useUserStore, useOrganizationStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

import ComponentCard from '@/components/common/ComponentCard.vue'
import { showSuccessToast, showErrorToast } from '@/helpers/sweetalert'

const currentPageTitle = ref('Add User')
const firstInputRef = ref(null)

const userStore = useUserStore()
const { user, loading } = storeToRefs(userStore)
const { fetchUser, createUser, updateUser } = userStore

const organizationStore = useOrganizationStore()
const { organizations } = storeToRefs(organizationStore)
const { fetchOrganizations } = organizationStore

const formData = reactive({
  userName: '',
  fullName: '',
  password: '',
  role: 'USER',
  organizationId: null,
  isActive: true,
})

const errors = reactive({
  userName: '',
  fullName: '',
  password: '',
  role: '',
  organizationId: '',
})

const baseInputClass = 'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
const normalClass = 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
const errorClass = 'border-error-400 focus:border-error-400 focus:ring-error-500/10 dark:border-error-500'

const fieldClass = (error) => [baseInputClass, error ? errorClass : normalClass]

const validate = () => {
  errors.userName = ''
  errors.fullName = ''
  errors.password = ''
  errors.role = ''
  errors.organizationId = ''
  let valid = true

  if (!formData.userName.trim()) {
    errors.userName = 'Username is required.'
    valid = false
  }
  if (!formData.fullName.trim()) {
    errors.fullName = 'Full name is required.'
    valid = false
  }
  if (!id && !formData.password.trim()) {
    errors.password = 'Password is required.'
    valid = false
  }
  if (!formData.role) {
    errors.role = 'Role is required.'
    valid = false
  }
  if (formData.role === 'USER' && !formData.organizationId) {
    errors.organizationId = 'Organization is required for USER role.'
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
    currentPageTitle.value = 'Edit User'
    await fetchUser(id)
    formData.userName = user.value.userName
    formData.fullName = user.value.fullName
    formData.role = user.value.role
    formData.organizationId = user.value.organizationId
    formData.isActive = user.value.isActive
  }
  await nextTick()
  firstInputRef.value?.focus()
})

const handleSubmit = async () => {
  if (!validate()) return

  try {
    const basePayload = {
      userName: formData.userName,
      fullName: formData.fullName,
      role: formData.role,
      isActive: formData.isActive,
    }
    if (formData.role === 'USER' && formData.organizationId) {
      basePayload.organizationId = formData.organizationId
    }
    if (formData.password) {
      basePayload.password = formData.password
    }

    if (id) {
      await updateUser(id, basePayload)
      showSuccessToast('User updated successfully!')
    } else {
      delete basePayload.isActive
      await createUser(basePayload)
      showSuccessToast('User created successfully!')
    }
    router.push('/admin/users')
  } catch (error) {
    showErrorToast('Failed to save user.')
    console.error('Error saving user:', error)
  }
}
</script>
