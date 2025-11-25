<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard
      :isTableData="true"
      :searchableList="searchableList"
      @handle-search="handleSearch"
    >
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-5 py-3 text-left w-1/20 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">#</p>
                </th>
                <th
                  class="px-5 py-3 text-left w-4/11 sm:px-6 cursor-pointer"
                  @click="() => handleSort('title')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Judul</p>
                    <span class="ml-2">
                      <SortArrowIcon v-if="sortBy === 'title'" :direction="sortOrder" />
                    </span>
                  </div>
                </th>
                <th
                  class="px-5 py-3 text-left w-2/11 sm:px-6 cursor-pointer"
                  @click="() => handleSort('viewCount')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      Dilihat
                    </p>
                    <span class="ml-2">
                      <SortArrowIcon v-if="sortBy === 'viewCount'" :direction="sortOrder" />
                    </span>
                  </div>
                </th>
                <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400"></p>
                </th>
                <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Dibuat Oleh
                  </p>
                </th>
                <th
                  class="px-5 py-3 text-left w-2/11 sm:px-6 cursor-pointer"
                  @click="() => handleSort('publishAt')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      Tanggal Publish
                    </p>
                    <span class="ml-2">
                      <SortArrowIcon v-if="sortBy === 'publishAt'" :direction="sortOrder" />
                    </span>
                  </div>
                </th>
                <!-- <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Tanggal Buat
                  </p>
                </th> -->
                <th
                  class="px-5 py-3 text-left w-2/11 sm:px-6 cursor-pointer"
                  @click="() => handleSort('status')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p>
                    <span class="ml-2">
                      <SortArrowIcon v-if="sortBy === 'status'" :direction="sortOrder" />
                    </span>
                  </div>
                </th>
                <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(article, index) in articles"
                :key="index"
                class="border-t border-gray-100 dark:border-gray-800"
              >
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ index + 1 }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <a
                    :href="`/post/${article.slug}`"
                    target="_blank"
                    class="text-gray-500 text-theme-sm dark:text-gray-400 hover:text-brand-500"
                  >
                    {{
                      article.title.length > 50
                        ? article.title.substring(0, 50) + '...'
                        : article.title
                    }}
                  </a>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ article.viewCount ? article.viewCount : 'N/A' }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <div
                    v-if="isAdmin && article.isHeadline"
                    @click="() => handleSetHeadline(article.id)"
                    class="cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="h-6 w-6 text-yellow-400"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div
                    v-else-if="isAdmin"
                    @click="() => handleSetHeadline(article.id)"
                    class="cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-6 w-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.254 3.624a.563.563 0 00-.162.524l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.162-.524l-4.254-3.624a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </div>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ article.publishBy || 'N/A' }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ formatDate(article.publishAt) }}
                  </p>
                </td>
                <!-- <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ article.createdDate || 'N/A' }}
                  </p>
                </td> -->

                <td class="px-5 py-4 sm:px-6">
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-theme-xs font-medium capitalize',
                      {
                        'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                          article.status === 'active',
                        'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-500':
                          article.status === 'inactive',
                        'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500':
                          article.status === 'archived',
                      },
                    ]"
                  >
                    {{ article.status }}
                  </span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <div class="flex items-center space-x-2">
                    <router-link
                      v-if="isAdmin"
                      :to="`/admin/articles/${article.id}/edit`"
                      class="flex items-center px-2 py-1 rounded text-sm bg-brand-500 text-white hover:bg-brand-600 focus:outline-none"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z"
                        />
                      </svg>
                      Edit
                    </router-link>
                    <button
                      v-if="isAdmin"
                      @click="() => handleDelete(article.id)"
                      class="flex items-center px-2 py-1 rounded text-sm bg-error-50 text-error-600 hover:bg-error-100 hover:text-error-700 dark:bg-error-900 dark:text-error-300 dark:hover:bg-error-800 dark:hover:text-error-200"
                      title="Hapus"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Hapus
                    </button>
                    <button
                      v-if="article.status == 'active' || article.status == 'archived'"
                      @click="() => handleCopy(article.slug)"
                      class="flex items-center px-2 py-1 rounded text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      title="Copy Link"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Share
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <PaginationBarAdmin
        :hasPrevious="prevCursor !== null"
        :hasNext="nextCursor !== null"
        :loading="loading"
        @next-page="goToNextPage"
        @previous-page="goToPreviousPage"
      ></PaginationBarAdmin>
    </ComponentCard>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import SortArrowIcon from '@/icons/SortArrowIcon.vue'
import { useArticleStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { showConfirmationDialog, showSuccessToast, showErrorToast } from '@/helpers/sweetalert'
import { formatDate } from '@/helpers/dayjs'
import { useAuthStore } from '@/stores'

import ComponentCard from '@/components/common/ComponentCard.vue'
import PaginationBarAdmin from '@/components/common/PaginationBarAdmin.vue'
const currentPageTitle = ref('Artikel List')
const authStore = useAuthStore()
const isAdmin = computed(() => (authStore.user?.role || authStore.user?.roleName) === 'ADMIN')

const articleStore = useArticleStore()
const { articles, loading, nextCursor, prevCursor } = storeToRefs(articleStore)
const { fetchArticles, deleteArticle, setHeadlineArticle } = articleStore

const sortBy = ref('publishAt')
const sortOrder = ref('desc')
const searchQuery = ref('')
const searchBy = ref('title')

const searchableList = ref([
  { name: 'Judul', param: 'title' },
  { name: 'Status', param: 'status' },
])

const loadArticles = () => {
  fetchArticles({
    search: searchQuery.value,
    searchBy: searchBy.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
  })
}

const handleSearch = (params) => {
  searchQuery.value = params.query
  searchBy.value = params.by
  loadArticles()
}

const handleSort = (newSortBy) => {
  if (sortBy.value === newSortBy) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = newSortBy
    sortOrder.value = 'asc'
  }
  loadArticles()
}

const handleDelete = async (id) => {
  const confirmed = await showConfirmationDialog()
  if (confirmed) {
    try {
      await deleteArticle(id)
      showSuccessToast('Artikel berhasil dihapus!')
      loadArticles() // Reload data after deletion
    } catch (error) {
      showErrorToast('Gagal menghapus artikel.')
      console.error('Error deleting article:', error)
    }
  }
}

const handleSetHeadline = async (id) => {
  const confirmed = await showConfirmationDialog(
    'Setel sebagai Headline?',
    'Artikel ini akan ditampilkan sebagai headline.',
  )
  if (confirmed) {
    try {
      await setHeadlineArticle(id)
      showSuccessToast('Artikel berhasil disetel sebagai headline!')
      loadArticles() // Reload data after setting headline
    } catch (error) {
      showErrorToast('Gagal menyetel artikel sebagai headline.')
      console.error('Error setting headline:', error)
    }
  }
}

const handleCopy = (slug) => {
  const url = `${window.location.origin}/post/${slug}`
  navigator.clipboard.writeText(url)
  showSuccessToast('Link berhasil disalin!')
}

const goToNextPage = () => {
  fetchArticles({
    cursor: nextCursor.value,
    search: searchQuery.value,
    searchBy: searchBy.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
  })
}

const goToPreviousPage = () => {
  fetchArticles({
    cursor: prevCursor.value,
    search: searchQuery.value,
    searchBy: searchBy.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
  })
}

onMounted(() => {
  loadArticles()
})
</script>
