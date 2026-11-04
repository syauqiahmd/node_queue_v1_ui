<template>
  <PageTitle :pageTitle="currentPageTitle" />
  <div class="space-y-5 sm:space-y-6">
    <ComponentCard
      :isTableData="true"
      :searchableList="searchableList"
      @handle-search="handleSearch"
      :show-add-button="isAdmin"
      add-button-text="Add User"
      @add-new="goToCreatePage"
    >
      <!-- Filter chips -->
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          @click="setStatusFilter('')"
          :class="
            statusFilter === ''
              ? 'bg-brand-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-300'
          "
          class="px-3 py-1.5 text-xs font-medium rounded-full transition"
        >
          All
        </button>
        <button
          @click="setStatusFilter(true)"
          :class="
            statusFilter === true
              ? 'bg-success-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-300'
          "
          class="px-3 py-1.5 text-xs font-medium rounded-full transition"
        >
          Active
        </button>
        <button
          @click="setStatusFilter(false)"
          :class="
            statusFilter === false
              ? 'bg-error-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-300'
          "
          class="px-3 py-1.5 text-xs font-medium rounded-full transition"
        >
          Inactive
        </button>
      </div>

      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="max-w-full overflow-auto max-h-[440px] custom-scrollbar">
          <table class="min-w-full">
            <thead class="sticky top-0 z-10 bg-white dark:bg-gray-900">
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-5 py-3 text-left w-1/20 sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">#</p>
                </th>
                <th
                  class="px-5 py-3 text-left w-2/11 sm:px-6 cursor-pointer"
                  @click="() => handleSort('userName')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      Username
                    </p>
                    <span class="ml-2">
                      <SortArrowIcon v-if="sortBy === 'userName'" :direction="sortOrder" />
                    </span>
                  </div>
                </th>
                <th
                  class="px-5 py-3 text-left w-2/11 sm:px-6 cursor-pointer"
                  @click="() => handleSort('fullName')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      Full Name
                    </p>
                    <span class="ml-2">
                      <SortArrowIcon v-if="sortBy === 'fullName'" :direction="sortOrder" />
                    </span>
                  </div>
                </th>
                <th
                  class="px-5 py-3 text-left w-2/11 sm:px-6 cursor-pointer"
                  @click="() => handleSort('role')"
                >
                  <div class="flex items-center">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Role</p>
                    <span class="ml-2">
                      <SortArrowIcon v-if="sortBy === 'role'" :direction="sortOrder" />
                    </span>
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
              <!-- Skeleton loading rows -->
              <TableSkeleton v-if="loading && users.length === 0" :rows="5" :columns="6" />

              <!-- Empty state -->
              <tr v-else-if="!loading && users.length === 0">
                <td :colspan="6">
                  <EmptyState
                    message="No users found"
                    description="Try adjusting your search or filter criteria."
                  />
                </td>
              </tr>

              <!-- Data rows -->
              <tr
                v-else
                v-for="(user, index) in users"
                :key="user.id"
                class="border-t border-gray-100 dark:border-gray-800"
              >
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ index + 1 }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ user.userName }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p
                    class="text-gray-500 text-theme-sm dark:text-gray-400 truncate max-w-[200px]"
                    :title="user.fullName"
                  >
                    {{ user.fullName }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                    {{ user.role }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-theme-xs font-medium capitalize',
                      {
                        'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                          user.isActive,
                        'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500':
                          !user.isActive,
                      },
                    ]"
                  >
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <div class="flex items-center space-x-2">
                    <router-link
                      v-if="isAdmin"
                      :to="`/admin/users/${user.id}/edit`"
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
                      @click="() => handleDelete(user.id, user.userName)"
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
import { useUserStore, useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'
import {
  showConfirmationDialog,
  showSuccessToast,
  showErrorToast,
  showApiErrorToast,
} from '@/helpers/sweetalert'
import ComponentCard from '@/components/common/ComponentCard.vue'
import PaginationBarAdmin from '@/components/common/PaginationBarAdmin.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TableSkeleton from '@/components/common/TableSkeleton.vue'

const router = useRouter()
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)
const currentPageTitle = ref('User List')
const userStore = useUserStore()
const { users, loading, pagination } = storeToRefs(userStore)
const { fetchUsers, deleteUser } = userStore

const searchQuery = ref('')
const searchBy = ref('userName')
const sortBy = ref('userName')
const sortOrder = ref('asc')
const statusFilter = ref('')

const searchableList = ref([
  { name: 'Username', param: 'userName' },
  { name: 'Full Name', param: 'fullName' },
  { name: 'Role', param: 'role' },
])

const loadUsers = (page = 1) => {
  fetchUsers({
    page,
    search: searchQuery.value,
    searchBy: searchBy.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    isActive: statusFilter.value,
  })
}

const setStatusFilter = (value) => {
  statusFilter.value = value
  loadUsers()
}

const ROLES = ['ADMIN', 'USER']

const handleSearch = (params) => {
  let query = params.query
  // The API only accepts an exact role, so map partial input ("adm") to the role it starts with.
  if (params.by === 'role' && query.trim()) {
    const role = ROLES.find((r) => r.startsWith(query.trim().toUpperCase()))
    if (!role) {
      showErrorToast('Role must be ADMIN or USER.')
      return
    }
    query = role
  }
  searchQuery.value = query
  searchBy.value = params.by
  loadUsers()
}

const handleSort = (newSortBy) => {
  // Same column toggles the direction; a new column starts ascending.
  const toggled = sortOrder.value === 'asc' ? 'desc' : 'asc'
  sortOrder.value = sortBy.value === newSortBy ? toggled : 'asc'
  sortBy.value = newSortBy
  loadUsers(pagination.value.page)
}

const handleDelete = async (id, name) => {
  const confirmed = await showConfirmationDialog(name)
  if (confirmed) {
    try {
      await deleteUser(id)
      showSuccessToast('User deleted successfully!')
      loadUsers(pagination.value.page)
    } catch (error) {
      showApiErrorToast(error, 'Failed to delete user.')
      console.error('Error deleting user:', error)
    }
  }
}

const goToPage = (page) => {
  loadUsers(page)
}

const goToCreatePage = () => {
  router.push('/admin/users/create')
}

onMounted(() => {
  loadUsers()
})
</script>
