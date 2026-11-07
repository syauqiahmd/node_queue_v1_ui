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
            :class="[
              'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
              errors.name
                ? 'border-error-400 focus:border-error-400 focus:ring-error-500/10 dark:border-error-500'
                : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800',
            ]"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-error-500">{{ errors.name }}</p>
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
            <label class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Active</label>
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Logo
          </label>
          <div class="flex flex-wrap items-center gap-3">
            <input
              ref="logoInputRef"
              type="file"
              :accept="LOGO_TYPES.join(',')"
              class="hidden"
              @change="onLogoSelected"
            />
            <button
              type="button"
              :disabled="uploadingLogo"
              class="flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-60 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              @click="logoInputRef?.click()"
            >
              {{ uploadingLogo ? 'Uploading…' : id ? 'Upload new logo' : 'Choose logo' }}
            </button>
            <span v-if="pendingLogo" class="text-sm text-gray-600 dark:text-gray-400">
              {{ pendingLogo.name }} — uploaded when you save
            </span>
          </div>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG or WEBP, max 1 MB. Stored on our own server, so it also shows on the kiosk and
            monitor (images from other websites are blocked there).
          </p>
          <p v-if="errors.logoFile" class="mt-1 text-sm text-error-500">{{ errors.logoFile }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Logo URL (optional)
          </label>
          <input
            type="url"
            v-model="formData.logoUrl"
            @input="errors.logoUrl = ''"
            placeholder="https://example.com/logo.png"
            :class="[
              'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
              errors.logoUrl
                ? 'border-error-400 focus:border-error-400 focus:ring-error-500/10 dark:border-error-500'
                : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800',
            ]"
          />
          <p v-if="errors.logoUrl" class="mt-1 text-sm text-error-500">{{ errors.logoUrl }}</p>
          <div v-if="formData.logoUrl && !errors.logoUrl" class="mt-2">
            <img :src="formData.logoUrl" alt="Logo Preview" class="h-16 w-auto rounded" />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
            @click="handleSubmit"
          >
            Save
          </button>
          <router-link
            to="/admin/organizations"
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
import { useOrganizationStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

import ComponentCard from '@/components/common/ComponentCard.vue'
import { showSuccessToast, showApiErrorToast } from '@/helpers/sweetalert'

const currentPageTitle = ref('Add Organization')
const firstInputRef = ref(null)

const organizationStore = useOrganizationStore()
const { organization } = storeToRefs(organizationStore)
const { fetchOrganization, createOrganization, updateOrganization, uploadOrganizationLogo } =
  organizationStore

// Must match the API (POST /organizations/:id/logo): PNG, JPEG or WEBP up to 1 MB.
const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_LOGO_BYTES = 1024 * 1024
const logoInputRef = ref(null)
const uploadingLogo = ref(false)
// New organization: the file waits until the organization exists (uploaded right after create).
const pendingLogo = ref(null)

const checkLogoFile = (file) => {
  if (!LOGO_TYPES.includes(file.type)) return 'Logo must be a PNG, JPG or WEBP image.'
  if (file.size > MAX_LOGO_BYTES) return 'Logo must be 1 MB or smaller.'
  return ''
}

const onLogoSelected = async (event) => {
  const file = event.target.files?.[0]
  event.target.value = '' // allow picking the same file again
  if (!file) return
  errors.logoFile = checkLogoFile(file)
  if (errors.logoFile) return

  if (!id) {
    pendingLogo.value = file
    return
  }
  // Existing organization: upload right away so the preview shows the stored logo.
  uploadingLogo.value = true
  try {
    const updated = await uploadOrganizationLogo(id, file)
    formData.logoUrl = updated.logoUrl || ''
    errors.logoUrl = ''
    showSuccessToast('Logo updated!')
  } catch (error) {
    showApiErrorToast(error, 'Failed to upload logo.')
  } finally {
    uploadingLogo.value = false
  }
}

const formData = reactive({
  name: '',
  fullName: '',
  isActive: true,
  logoUrl: '',
})

const errors = reactive({ name: '', logoUrl: '', logoFile: '' })

const isValidUrl = (value) => {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

const validate = () => {
  errors.name = ''
  errors.logoUrl = ''
  let valid = true

  if (!formData.name.trim()) {
    errors.name = 'Name is required.'
    valid = false
  }
  if (formData.logoUrl && !isValidUrl(formData.logoUrl)) {
    errors.logoUrl = 'Must be a valid URL (e.g. https://example.com/logo.png).'
    valid = false
  }

  return valid
}

const id = route.params.id

onMounted(async () => {
  if (id) {
    currentPageTitle.value = 'Edit Organization'
    await fetchOrganization(id)
    formData.name = organization.value.name
    formData.fullName = organization.value.fullName
    formData.isActive = organization.value.isActive
    formData.logoUrl = organization.value.logoUrl || ''
  }
  await nextTick()
  firstInputRef.value?.focus()
})

const saveOrganization = async () => {
  if (id) {
    const payload = {
      name: formData.name,
      fullName: formData.fullName,
      isActive: formData.isActive,
    }
    if (formData.logoUrl) payload.logoUrl = formData.logoUrl
    await updateOrganization(id, payload)
    showSuccessToast('Organization updated successfully!')
    return
  }
  const payload = { name: formData.name, fullName: formData.fullName }
  if (formData.logoUrl && !pendingLogo.value) payload.logoUrl = formData.logoUrl
  const created = await createOrganization(payload)
  if (pendingLogo.value && created?.id) {
    try {
      await uploadOrganizationLogo(created.id, pendingLogo.value)
    } catch (error) {
      // The organization exists; only the logo failed. Let the admin retry from Edit.
      showApiErrorToast(
        error,
        'Organization created, but the logo upload failed. Try again from Edit.',
      )
      return
    }
  }
  showSuccessToast('Organization created successfully!')
}

const handleSubmit = async () => {
  if (!validate()) return

  try {
    await saveOrganization()
    router.push('/admin/organizations')
  } catch (error) {
    showApiErrorToast(error, 'Failed to save organization.')
    console.error('Error saving organization:', error)
  }
}
</script>
