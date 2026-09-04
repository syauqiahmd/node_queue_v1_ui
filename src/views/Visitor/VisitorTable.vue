<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard
      :isTableData="true"
      :searchableList="searchableList"
      @handle-search="handleSearch"
    >
      <!-- Organization filter + CSV export trigger -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div class="max-w-xs w-full">
          <StatusSelect
            v-model="organizationId"
            :options="organizationOptions"
            placeholder="All Organizations"
            :show-status="false"
            @update:modelValue="loadVisitors()"
          />
        </div>
        <button
          type="button"
          @click="showReportModal = true"
          class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-2.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
        >
          Download CSV
        </button>
      </div>

      <DownloadReportModal
        v-if="showReportModal"
        title="Download Visitor Report"
        from-label="Registered From"
        to-label="Registered To"
        :loading="downloadingReport"
        @close="showReportModal = false"
        @download="handleDownloadReport"
      />

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
                <th
                  class="px-5 py-3 text-left w-3/12 sm:px-6 cursor-pointer"
                  @click="() => handleSort('name')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Name</p>
                    <span class="ml-2">
                      <SortArrowIcon v-if="sortBy === 'name'" :direction="sortOrder" />
                    </span>
                  </div>
                </th>
                <th class="px-5 py-3 text-left w-3/12 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    Phone Number
                  </p>
                </th>
                <th class="px-5 py-3 text-left w-3/12 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Email</p>
                </th>
                <th
                  class="px-5 py-3 text-left w-2/12 sm:px-6 cursor-pointer"
                  @click="() => handleSort('createdAt')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      Registered At
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
              <TableSkeleton v-if="loading && visitors.length === 0" :rows="5" :columns="5" />

              <!-- Empty state -->
              <tr v-else-if="!loading && visitors.length === 0">
                <td :colspan="5">
                  <EmptyState
                    message="No visitors found"
                    description="Try adjusting your search or filter criteria."
                  />
                </td>
              </tr>

              <!-- Data rows -->
              <tr
                v-else
                v-for="(visitor, index) in visitors"
                :key="visitor.id"
                class="border-t border-gray-100 dark:border-gray-800"
              >
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ index + 1 }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ visitor.name }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ visitor.phoneNumber }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ visitor.email || '-' }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ formatDateTime(visitor.createdAt) }}
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
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import PageTitle from '@/components/common/PageTitle.vue'
import SortArrowIcon from '@/icons/SortArrowIcon.vue'
import { useVisitorStore, useOrganizationStore } from '@/stores'
import { storeToRefs } from 'pinia'

dayjs.extend(utc)
import { showApiErrorToast, showSuccessToast } from '@/helpers/sweetalert'
import ComponentCard from '@/components/common/ComponentCard.vue'
import PaginationBarAdmin from '@/components/common/PaginationBarAdmin.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TableSkeleton from '@/components/common/TableSkeleton.vue'
import StatusSelect from '@/components/common/StatusSelect.vue'
import DownloadReportModal from '@/components/common/DownloadReportModal.vue'

const currentPageTitle = ref('Visitor List')
const visitorStore = useVisitorStore()
const { visitors, loading, pagination, downloadingReport } = storeToRefs(visitorStore)
const { fetchVisitors, downloadReport } = visitorStore

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

const searchableList = ref([
  { name: 'Name', param: 'name' },
  { name: 'Phone Number', param: 'phoneNumber' },
  { name: 'Email', param: 'email' },
])

const showReportModal = ref(false)

const loadVisitors = (page = 1) => {
  fetchVisitors({
    page,
    search: searchQuery.value,
    searchBy: searchBy.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    organizationId: organizationId.value || '',
  })
}

const handleSearch = (params) => {
  searchQuery.value = params.query
  searchBy.value = params.by
  loadVisitors()
}

const handleSort = (newSortBy) => {
  if (sortBy.value === newSortBy) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = newSortBy
    sortOrder.value = 'asc'
  }
  loadVisitors(pagination.value.page)
}

const goToPage = (page) => {
  loadVisitors(page)
}

const formatDateTime = (value) => (value ? dayjs.utc(value).format('DD MMM YYYY, HH:mm') : '-')

const handleDownloadReport = async ({ startDate, endDate }) => {
  try {
    const payload = {
      startDate,
      endDate,
      organizationId: organizationId.value || '',
    }
    if (searchQuery.value && searchBy.value) {
      payload[searchBy.value] = searchQuery.value
    }
    await downloadReport(payload)
    showSuccessToast('Report downloaded')
  } catch (error) {
    showApiErrorToast(error, 'Gagal mengunduh laporan pengunjung.')
  } finally {
    showReportModal.value = false
  }
}

onMounted(() => {
  fetchOrganizations({ pagination: false, sortBy: 'name', sortOrder: 'asc' })
  loadVisitors()
})
</script>
