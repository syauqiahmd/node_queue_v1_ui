<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard :isFormData="true">
      <div class="space-y-6">
        <!-- Text Input -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Judul Artikel
          </label>
          <input
            type="text"
            v-model="formData.title"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Kustom Slug
          </label>
          <input
            type="text"
            v-model="formData.slug"
            @input="isSlugManuallyEdited = true"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Tanggal Publikasi
          </label>
          <div class="relative">
            <flat-pickr
              v-model="formData.publishAt"
              modelValue="formData.publishAt"
              :config="flatpickrConfig"
              class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              placeholder="Select date"
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
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Isi Artikel
          </label>
          <QuillEditor
            ref="quillEditor"
            v-model:content="formData.content"
            contentType="html"
            :toolbar="toolbarOptions"
            @ready="onEditorReady"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Thumbnail Artikel
          </label>
          <div v-if="thumbnailPreviewUrl" class="mt-2">
            <img :src="thumbnailPreviewUrl" alt="Thumbnail Preview" class="h-40 w-auto rounded" />
          </div>
          <input
            type="file"
            @change="handleFileUpload"
            class="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400"
          />
        </div>
        <div v-if="articleId">
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Status
          </label>
          <div class="relative z-20 bg-transparent">
            <select
              v-model="formData.status"
              class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              :class="{ 'text-gray-800 dark:text-white/90': formData.status }"
            >
              <option value="active" selected>Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
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
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Kategori Artikel
          </label>
          <Multiselect
            v-model="formData.categoryIds"
            :options="categories"
            mode="tags"
            :searchable="true"
            track-by="name"
            label="name"
            value-prop="id"
            placeholder="Select categories"
            class="dark:bg-dark-900"
          />
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
import { ref, reactive, onMounted, watch } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useArticleStore, useCategoryStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'
import { marked } from 'marked'
import request from '@/helpers/request'
import { showSuccessToast, showErrorToast } from '@/helpers/sweetalert'

import ComponentCard from '@/components/common/ComponentCard.vue'
const currentPageTitle = ref('Tambah Artikel')
const quillEditor = ref(null)
const router = useRouter()
const route = useRoute()
const articleId = ref(null)
const thumbnailPreviewUrl = ref(null)

const articleStore = useArticleStore()
const { article, loading: articleLoading } = storeToRefs(articleStore)
const { fetchArticle, createArticle, updateArticle } = articleStore

const categoryStore = useCategoryStore()
const { categories, loading: categoryLoading } = storeToRefs(categoryStore)
const { fetchCategories } = categoryStore

const flatpickrConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'F j, Y',
  wrap: true,
}

const isSlugManuallyEdited = ref(false)

const formData = reactive({
  title: '',
  slug: '',
  publishAt: '',
  content: '',
  image: null, // Changed from thumbnail
  categoryIds: [],
  status: 'active',
})

watch(
  () => formData.title,
  (newTitle) => {
    if (!isSlugManuallyEdited.value) {
      formData.slug = generateSlug(newTitle)
    }
  },
)

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .trim() // Trim leading/trailing whitespace
}

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image'],

  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction
  [{ align: [] }],

  ['clean'], // remove formatting button
]

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.image = file // Changed from formData.thumbnail and removed FileReader
    thumbnailPreviewUrl.value = URL.createObjectURL(file)
  }
}

const uploadImage = async (file) => {
  const data = new FormData()
  data.append('image', file)

  try {
    const response = await request.post('/articles/upload/image', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    if (response.data.success) {
      return response.data.data.image_url
    } else {
      console.error('Image upload failed:', response.data.message)
      return '/images/cards/card-01.jpg' // Fallback to mock image
    }
  } catch (error) {
    console.error('Image upload failed:', error)
    return '/images/cards/card-01.jpg' // Fallback to mock image
  }
}

const customImageHandler = () => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()

  input.onchange = async () => {
    const file = input.files[0]
    if (file) {
      const imageUrl = await uploadImage(file)
      if (imageUrl) {
        const quill = quillEditor.value.getQuill()
        const range = quill.getSelection(true)
        quill.insertEmbed(range.index, 'image', imageUrl)
      }
    }
  }
}

const onEditorReady = (quill) => {
  quill.getModule('toolbar').addHandler('image', customImageHandler)
}

const handleSubmit = async () => {
  let payload;

  payload = new FormData();
  payload.append('title', formData.title);
  payload.append('slug', formData.slug);
  payload.append('content', formData.content);
  formData.categoryIds.forEach((id) => payload.append('categoryIds[]', id));
  if (!articleId.value || formData.image !== article.value.thumbnailUrl) {
    payload.append('image', formData.image);
  }
  payload.append('publishAt', formData.publishAt);

  try {
    if (articleId.value) {
      payload.append('status', formData.status);
      await updateArticle(payload, route.params.id);
      showSuccessToast('Artikel berhasil diperbarui!');
    } else {
      await createArticle(payload);
      showSuccessToast('Artikel berhasil dibuat!');
    }
    router.push('/admin/articles');
  } catch (error) {
    showErrorToast('Gagal menyimpan artikel.');
    console.error('Error saving article:', error);
  }
};

onMounted(async () => {
  await fetchCategories({ take: 50, status: 'active' })
  const id = route.params.id
  if (id) {
    articleId.value = id
    currentPageTitle.value = 'Edit Artikel'
    await fetchArticle(id)
    formData.title = article.value.title
    formData.slug = article.value.slug
    formData.publishAt = article.value.publishAt
    formData.content = marked(article.value.content)
    formData.image = article.value.thumbnailUrl
    thumbnailPreviewUrl.value = article.value.thumbnailUrl
    if (article.value.categories) {
      formData.categoryIds = article.value.categories.map((category) => category.id)
    }
    formData.status = article.value.status
  }
})
</script>
