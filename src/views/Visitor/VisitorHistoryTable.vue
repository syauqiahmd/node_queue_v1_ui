<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard
      :isTableData="true"
      :searchableList="searchableList"
      @handle-search="handleSearch"
    >
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <div v-if="isAdmin" class="w-full sm:max-w-xs">
          <StatusSelect
            v-model="organizationId"
            :options="organizationOptions"
            placeholder="All Organizations"
            :show-status="false"
            @update:modelValue="loadHistories()"
          />
        </div>
        <div class="w-full sm:max-w-xs">
          <VueFlatpickr
            v-model="visitDate"
            :config="fpConfig"
            placeholder="Filter by visit date"
            class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>
        <button
          v-if="visitDate || organizationId"
          type="button"
          @click="clearFilters"
          class="shrink-0 px-4 py-2.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-300"
        >
          Clear filters
        </button>
      </div>

      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="max-w-full overflow-auto max-h-[440px] custom-scrollbar">
          <table class="min-w-full">
            <thead class="sticky top-0 z-10 bg-white dark:bg-gray-900">
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-5 py-3 text-left w-1/12 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">#</p>
                </th>
                <th class="px-5 py-3 text-left w-2/12 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Visitor</p>
                </th>
                <th class="px-5 py-3 text-left w-2/12 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Phone Number
                  </p>
                </th>
                <th class="px-5 py-3 text-left w-2/12 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Organization
                  </p>
                </th>
                <th
                  class="px-5 py-3 text-left w-2/12 sm:px-6 cursor-pointer"
                  @click="() => handleSort('visitDate')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      Visit Date
                    </p>
                    <span class="ml-2">
                      <SortArrowIcon v-if="sortBy === 'visitDate'" :direction="sortOrder" />
                    </span>
                  </div>
                </th>
                <th
                  class="px-5 py-3 text-left w-2/12 sm:px-6 cursor-pointer"
                  @click="() => handleSort('createdAt')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      Recorded At
                    </p>
                    <span class="ml-2">
                      <SortArrowIcon v-if="sortBy === 'createdAt'" :direction="sortOrder" />
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <!-- Skeleton loading rows -->
              <TableSkeleton v-if="loading && histories.length === 0" :rows="5" :columns="6" />

              <!-- Empty state -->
              <tr v-else-if="!loading && histories.length === 0">
                <td :colspan="6">
                  <EmptyState
                    message="No visitor history found"
                    description="Try adjusting your search or filter criteria."
                  />
                </td>
              </tr>

              <!-- Data rows -->
              <tr
                v-else
                v-for="(history, index) in histories"
                :key="history.id"
                class="border-t border-gray-100 dark:border-gray-800"
              >
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ index + 1 }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ history.visitor?.name || '-' }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ history.visitor?.phoneNumber || '-' }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ history.organization?.name || '-' }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ formatDate(history.visitDate) }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ formatDateTime(history.createdAt) }}
                  </p>
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
import { ref, onMounted, computed, watch } from 'vue'
import dayjs from 'dayjs'
import VueFlatpickr from 'vue-flatpickr-component'
import PageTitle from '@/components/common/PageTitle.vue'
import SortArrowIcon from '@/icons/SortArrowIcon.vue'
import { useVisitorHistoryStore, useOrganizationStore, useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'
import ComponentCard from '@/components/common/ComponentCard.vue'
import PaginationBarAdmin from '@/components/common/PaginationBarAdmin.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TableSkeleton from '@/components/common/TableSkeleton.vue'
import StatusSelect from '@/components/common/StatusSelect.vue'

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)

const currentPageTitle = ref('Visitor History')
const visitorHistoryStore = useVisitorHistoryStore()
const { histories, loading, pagination } = storeToRefs(visitorHistoryStore)
const { fetchVisitorHistories } = visitorHistoryStore

const organizationStore = useOrganizationStore()
const { organizations } = storeToRefs(organizationStore)
const { fetchOrganizations } = organizationStore

const organizationOptions = computed(() =>
  organizations.value.map((o) => ({ value: o.id, label: o.name })),
)

const searchQuery = ref('')
const searchBy = ref('name')
const sortBy = ref('createdAt')
const sortOrder = ref('desc')
const organizationId = ref(null)
const visitDate = ref('')

const fpConfig = {
  dateFormat: 'Y-m-d',
  allowInput: true,
  disableMobile: true,
}

const searchableList = ref([
  { name: 'Visitor Name', param: 'name' },
  { name: 'Phone Number', param: 'phoneNumber' },
  { name: 'Email', param: 'email' },
  { name: 'Organization Name', param: 'organizationName' },
  { name: 'Organization Full Name', param: 'organizationFullName' },
])

const loadHistories = (page = 1) => {
  fetchVisitorHistories({
    page,
    search: searchQuery.value,
    searchBy: searchBy.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    organizationId: isAdmin.value ? organizationId.value || '' : '',
    visitDate: visitDate.value || '',
  })
}

const handleSearch = (params) => {
  searchQuery.value = params.query
  searchBy.value = params.by
  loadHistories()
}

const handleSort = (newSortBy) => {
  if (sortBy.value === newSortBy) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = newSortBy
    sortOrder.value = 'asc'
  }
  loadHistories(pagination.value.page)
}

const clearFilters = () => {
  organizationId.value = null
  visitDate.value = ''
  loadHistories()
}

const goToPage = (page) => {
  loadHistories(page)
}

watch(visitDate, () => loadHistories())

const formatDate = (value) => (value ? dayjs(value).format('DD MMM YYYY') : '-')
const formatDateTime = (value) => (value ? dayjs(value).format('DD MMM YYYY, HH:mm') : '-')

onMounted(() => {
  if (isAdmin.value) {
    fetchOrganizations({ pagination: false, sortBy: 'name', sortOrder: 'asc' })
  }
  loadHistories()
})
</script>
