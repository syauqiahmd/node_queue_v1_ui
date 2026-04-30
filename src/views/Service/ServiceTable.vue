<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard
      :isTableData="true"
      :searchableList="searchableList"
      @handle-search="handleSearch"
      :show-add-button="isAdmin"
      add-button-text="Add Service"
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
                  @click="() => handleSort('name')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Name</p>
                    <span class="ml-2">
                      <SortArrowIcon v-if="sortBy === 'name'" :direction="sortOrder" />
                    </span>
                  </div>
                </th>
                <th
                  class="px-5 py-3 text-left w-2/11 sm:px-6 cursor-pointer"
                  @click="() => handleSort('prefix')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Prefix</p>
                    <span class="ml-2">
                      <SortArrowIcon v-if="sortBy === 'prefix'" :direction="sortOrder" />
                    </span>
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
                v-for="(service, index) in services"
                :key="service.id"
                class="border-t border-gray-100 dark:border-gray-800"
              >
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ index + 1 }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ service.name }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ service.prefix }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ service.organization.name }} - {{ service.organization.fullName }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-theme-xs font-medium capitalize',
                      {
                        'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                          service.isActive,
                        'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500':
                          !service.isActive,
                      },
                    ]"
                  >
                    {{ service.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <div class="flex items-center space-x-2">
                    <router-link
                      v-if="isAdmin"
                      :to="`/admin/services/${service.id}/edit`"
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
                      @click="() => handleDelete(service.id)"
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
import { useServiceStore, useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { showConfirmationDialog, showSuccessToast, showErrorToast } from '@/helpers/sweetalert'
import ComponentCard from '@/components/common/ComponentCard.vue'
import PaginationBarAdmin from '@/components/common/PaginationBarAdmin.vue'

const router = useRouter()
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)
const currentPageTitle = ref('Service List')
const serviceStore = useServiceStore()
const { services, loading, pagination } = storeToRefs(serviceStore)
const { fetchServices, deleteService } = serviceStore

const searchQuery = ref('')
const searchBy = ref('name')
const sortBy = ref('name')
const sortOrder = ref('asc')

const searchableList = ref([
  { name: 'Name', param: 'name' },
  { name: 'Prefix', param: 'prefix' },
  { name: 'Organization', param: 'organizationName' },
])

const loadServices = (page = 1) => {
  fetchServices({
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
  loadServices()
}

const handleSort = (newSortBy) => {
  if (sortBy.value === newSortBy) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = newSortBy
    sortOrder.value = 'asc'
  }
  loadServices(pagination.value.page)
}

const handleDelete = async (id) => {
  const confirmed = await showConfirmationDialog()
  if (confirmed) {
    try {
      await deleteService(id)
      showSuccessToast('Service deleted successfully!')
      loadServices(pagination.value.page) // Reload data after deletion
    } catch (error) {
      showErrorToast('Failed to delete service.')
      console.error('Error deleting service:', error)
    }
  }
}

const goToPage = (page) => {
  loadServices(page)
}

const goToCreatePage = () => {
  router.push('/admin/services/create')
}

onMounted(() => {
  loadServices()
})
</script>

