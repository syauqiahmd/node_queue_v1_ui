<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard :isFormData="true">
      <div class="space-y-6">
        <!-- Text Input -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Deskripsi
          </label>
          <input
            type="text"
            v-model="formData.description"
            :class="{ 'border-red-500': errors.description }"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
          <p v-if="errors.description" class="text-sm text-red-500 mt-1">
            {{ errors.description }}
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Tipe
          </label>
          <div class="flex flex-wrap items-center gap-8">
            <div>
              <label
                for="radioInternal"
                class="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400"
              >
                <div class="relative">
                  <input
                    type="radio"
                    id="radioInternal"
                    name="adType"
                    value="internal-ads"
                    v-model="formData.type"
                    class="sr-only"
                  />
                  <div
                    class="hover:border-brand-500 dark:hover:border-brand-500 mr-3 flex h-5 w-5 items-center justify-center rounded-full border-[1.25px]"
                    :class="
                      formData.type === 'internal-ads'
                        ? 'border-brand-500 bg-brand-500'
                        : 'bg-transparent border-gray-300 dark:border-gray-700'
                    "
                  >
                    <span
                      class="h-2 w-2 rounded-full"
                      :class="formData.type === 'internal-ads' ? 'bg-white' : 'bg-transparent'"
                    ></span>
                  </div>
                </div>
                Iklan Internal
              </label>
            </div>

            <div>
              <label
                for="radioExternal"
                class="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400"
              >
                <div class="relative">
                  <input
                    type="radio"
                    id="radioExternal"
                    name="adType"
                    value="external-ads"
                    v-model="formData.type"
                    class="sr-only"
                  />
                  <div
                    class="hover:border-brand-500 dark:hover:border-brand-500 mr-3 flex h-5 w-5 items-center justify-center rounded-full border-[1.25px]"
                    :class="
                      formData.type === 'external-ads'
                        ? 'border-brand-500 bg-brand-500'
                        : 'bg-transparent border-gray-300 dark:border-gray-700'
                    "
                  >
                    <span
                      class="h-2 w-2 rounded-full"
                      :class="formData.type === 'external-ads' ? 'bg-white' : 'bg-transparent'"
                    ></span>
                  </div>
                </div>
                Iklan External
              </label>
            </div>
          </div>
          <div class="mt-4">
            <hr />
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Custom Text Pada Tombol
          </label>
          <input
            type="text"
            v-model="formData.customCta"
            :class="{ 'border-red-500': errors.customCta }"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
          <p v-if="errors.customCta" class="text-sm text-red-500 mt-1">
            {{ errors.customCta }}
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            URL Link
          </label>
          <input
            type="text"
            v-model="formData.linkUrl"
            :class="{ 'border-red-500': errors.linkUrl }"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
          <p v-if="errors.linkUrl" class="text-sm text-red-500 mt-1">{{ errors.linkUrl }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Iklan Image
          </label>
          <input
            type="file"
            @change="handleFileUpload"
            :class="{ 'border-red-500': errors.image }"
            class="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400"
          />
          <p v-if="errors.image" class="text-sm text-red-500 mt-1">{{ errors.image }}</p>
          <div v-if="formData.imageUrl">
            <img :src="formData.imageUrl" alt="Iklan Image" class="mt-2 w-32 h-auto" />
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Tanggal Publikasi
          </label>
          <div class="relative">
            <flat-pickr
              v-model="formData.startDate"
              :config="flatpickrConfig"
              :class="{ 'border-red-500': errors.startDate }"
              class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              placeholder="Select start date"
            />
            <span
              class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
            >
              <svg
                class="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                  fill=""
                />
              </svg>
            </span>
          </div>
          <p v-if="errors.startDate" class="text-sm text-red-500 mt-1">{{ errors.startDate }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Tanggal Akhir
          </label>
          <div class="relative">
            <flat-pickr
              v-model="formData.endDate"
              :config="flatpickrConfig"
              :class="{ 'border-red-500': errors.endDate }"
              class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              placeholder="Select end date"
            />
            <span
              class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
            >
              <svg
                class="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                  fill=""
                />
              </svg>
            </span>
          </div>
          <p v-if="errors.endDate" class="text-sm text-red-500 mt-1">{{ errors.endDate }}</p>
        </div>
        <div v-if="adId">
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Status
          </label>
          <div class="relative z-20 bg-transparent">
            <select
              v-model="formData.status"
              :class="{
                'border-red-500': errors.status,
                'text-gray-800 dark:text-white/90': formData.status,
              }"
              class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              <option value="active" selected>Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <span
              class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400"
            >
              <svg
                class="stroke-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </div>
          <p v-if="errors.status" class="text-sm text-red-500 mt-1">{{ errors.status }}</p>
        </div>

        <button
          type="button"
          class="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
          @click="handleSubmit"
        >
          Simpan
        </button>
      </div>
    </ComponentCard>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { useAdsStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()

import ComponentCard from '@/components/common/ComponentCard.vue'
import adsSchema from '@/validation/adsSchema'
import { showSuccessToast, showErrorToast } from '@/helpers/sweetalert'

const currentPageTitle = ref('Tambah Iklan')
const adId = ref(null)

const adStore = useAdsStore()
const { ad, loading } = storeToRefs(adStore)
const { fetchAd, createAd, updateAd } = adStore

const errors = reactive({
  type: '',
  description: '',
  customCta: '',
  linkUrl: '',
  image: '',
  startDate: '',
  endDate: '',
  status: '',
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.image = file
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.imageUrl = e.target.result // For previewing the image
    }
    reader.readAsDataURL(file)
  }
}

const formData = reactive({
  type: 'external-ads',
  description: '',
  customCta: '',
  linkUrl: '',
  image: null,
  imageUrl: '', // To display existing image or new preview
  status: 'active',
  startDate: '',
  endDate: '',
})

const flatpickrConfig = {
  dateFormat: 'Y-m-dTH:i:S',
  altInput: true,
  altFormat: 'F j, Y H:i',
  enableTime: true,
  time_24hr: true,
  wrap: true,
}

function getTimezoneOffsetString() {
  const date = new Date()
  const offset = date.getTimezoneOffset() // minutes
  const sign = offset < 0 ? '+' : '-'
  const absOffset = Math.abs(offset)
  const hours = Math.floor(absOffset / 60)
  const minutes = absOffset % 60
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

onMounted(async () => {
  const id = useRoute().params.id
  if (id) {
    adId.value = id
    currentPageTitle.value = 'Edit Iklan'
    await fetchAd(id)
    const adData = { ...ad.value }

    formData.type = adData.type
    formData.description = adData.description
    formData.customCta = adData.customCta
    formData.linkUrl = adData.linkUrl
    formData.imageUrl = adData.imageUrl
    formData.status = adData.status
    formData.startDate = adData.startDate
    formData.endDate = adData.endDate
  }
})

const handleSubmit = async () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => (errors[key] = ''))

  const { error } = adsSchema.validate(formData, {
    abortEarly: false,
    context: { adId: adId.value },
  })

  if (error) {
    error.details.forEach((detail) => {
      errors[detail.context.key] = detail.message
    })
    showErrorToast('Validasi gagal. Silakan periksa kembali input Anda.')
    return
  }

  const data = new FormData()
  data.append('type', formData.type)
  data.append('description', formData.description)
  data.append('customCta', formData.customCta)
  data.append('linkUrl', formData.linkUrl)

  data.append('startDate', formData.startDate + getTimezoneOffsetString())
  data.append('endDate', formData.endDate + getTimezoneOffsetString())

  if (formData.image) {
    data.append('image', formData.image)
  }

  if (adId.value) {
    data.append('status', formData.status)
  }

  try {
    if (adId.value) {
      await updateAd(adId.value, data)
      showSuccessToast('Iklan berhasil diperbarui!')
    } else {
      await createAd(data)
      showSuccessToast('Iklan berhasil dibuat!')
    }
    router.push('/admin/ads')
  } catch (error) {
    showErrorToast('Gagal menyimpan iklan.')
    console.error('Error saving ad:', error)
  }
}
</script>
