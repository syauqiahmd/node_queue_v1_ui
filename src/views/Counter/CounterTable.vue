<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard
      :isTableData="true"
      :searchableList="searchableList"
      @handle-search="handleSearch"
      :show-add-button="isAdmin"
      add-button-text="Add Counter"
      @add-new="goToCreatePage"
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
                  class="px-5 py-3 text-left w-2/11 sm:px-6 cursor-pointer"
                  @click="() => handleSort('counterNumber')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      Counter Number
                    </p>
                    <span class="ml-2">
                      <SortArrowIcon v-if="sortBy === 'counterNumber'" :direction="sortOrder" />
                    </span>
                  </div>
                </th>
                <th class="px-5 py-3 text-left w-2/11 sm:px-6 cursor-pointer">
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      Service
                    </p>
                  </div>
                </th>
                <th class="px-5 py-3 text-left w-2/11 sm:px-6 cursor-pointer">
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      Organization
                    </p>
                  </div>
                </th>
                <th class="px-5 py-3 text-left w-2/11 sm:px-6 cursor-pointer">
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p>
                  </div>
                </th>
                <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(counter, index) in counters"
                :key="index"
                class="border-t border-gray-100 dark:border-gray-800"
              >
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ index + 1 }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ counter.counterNumber }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ counter.service.name }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ counter.service.organization.name }} -
                    {{ counter.service.organization.fullName }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-theme-xs font-medium capitalize',
                      {
                        'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                          counter.isActive,
                        'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500':
                          !counter.isActive,
                      },
                    ]"
                  >
                    {{ counter.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <div class="flex items-center space-x-2">
                    <router-link
                      v-if="isAdmin"
                      :to="`/admin/counters/${counter.id}/edit`"
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
                      @click="() => handleDelete(counter.id)"
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
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <PaginationBarAdmin
        :current-page="pagination.page"
        :total-items="pagination.total"
        :page-size="pagination.pageSize"
        :loading="loading"
        @page-changed="goToPage"
      ></PaginationBarAdmin>
    </ComponentCard>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/PageTitle.vue'
import SortArrowIcon from '@/icons/SortArrowIcon.vue'
import { useCounterStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { showConfirmationDialog, showSuccessToast, showErrorToast } from '@/helpers/sweetalert'
import ComponentCard from '@/components/common/ComponentCard.vue'
import PaginationBarAdmin from '@/components/common/PaginationBarAdmin.vue'
import { useAuthStore } from '@/stores'

const router = useRouter()
const authStore = useAuthStore()
const isAdmin = computed(() => (authStore.user?.role || authStore.user?.roleName) === 'ADMIN')
const currentPageTitle = ref('Counter List')
const counterStore = useCounterStore()
const { counters, loading, pagination } = storeToRefs(counterStore)
const { fetchCounters, deleteCounter } = counterStore

const searchQuery = ref('')
const searchBy = ref('counterNumber')
const sortBy = ref('counterNumber')
const sortOrder = ref('asc')

const searchableList = ref([
  { name: 'Counter Number', param: 'counterNumber' },
  { name: 'Service', param: 'serviceName' },
  { name: 'Organization', param: 'organizationName' },
])

const loadCounters = (page = 1) => {
  fetchCounters({
    page,
    search: searchQuery.value,
    searchBy: searchBy.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
  })
}

const handleSearch = (params) => {
  searchQuery.value = params.query
  searchBy.value = params.by
  loadCounters()
}

const handleSort = (newSortBy) => {
  if (sortBy.value === newSortBy) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = newSortBy
    sortOrder.value = 'asc'
  }
  loadCounters(pagination.value.page)
}

const handleDelete = async (id) => {
  const confirmed = await showConfirmationDialog()
  if (confirmed) {
    try {
      await deleteCounter(id)
      showSuccessToast('Counter deleted successfully!')
      loadCounters(pagination.value.page) // Reload data after deletion
    } catch (error) {
      showErrorToast('Failed to delete counter.')
      console.error('Error deleting counter:', error)
    }
  }
}

const goToPage = (page) => {
  loadCounters(page)
}

const goToCreatePage = () => {
  router.push('/admin/counters/create')
}

onMounted(() => {
  loadCounters()
})
</script>

<style scoped>
.disabled-link {
  pointer-events: none;
  opacity: 0.5;
}
</style>
