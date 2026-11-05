<template>
  <div class="block">
    <form
      @submit.prevent
      class="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4"
    >
      <div class="flex items-center w-full md:w-auto">
        <div
          v-if="searchableList && searchableList.length > 0"
          class="flex w-full rounded-lg border border-gray-200 dark:border-gray-800 overflow-visible"
        >
          <!-- Custom category dropdown -->
          <div class="relative shrink-0" ref="categoryRef">
            <button
              type="button"
              @click="isCategoryOpen = !isCategoryOpen"
              class="h-11 flex items-center gap-2 px-3 text-sm text-gray-800 dark:text-white/90 bg-transparent border-r border-gray-200 dark:border-gray-800 rounded-l-lg hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none whitespace-nowrap transition"
            >
              {{ currentLabel }}
              <svg
                class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0"
                :class="{ 'rotate-180': isCategoryOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="isCategoryOpen"
                class="absolute z-50 top-full left-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden min-w-[140px]"
              >
                <div
                  v-for="item in searchableList"
                  :key="item.param"
                  @click="selectCategory(item.param)"
                  :class="[
                    'px-4 py-2.5 text-sm cursor-pointer',
                    searchBy === item.param
                      ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400 font-medium'
                      : 'text-gray-800 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-white/5',
                  ]"
                >
                  {{ item.name }}
                </div>
              </div>
            </Transition>
          </div>

          <!-- Search input -->
          <div class="relative flex-grow">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                class="fill-gray-400 dark:fill-gray-500"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                />
              </svg>
            </span>
            <input
              type="text"
              v-model="searchQuery"
              @input="debounceSearch"
              placeholder="Pencarian..."
              class="h-11 w-full bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:text-white/90 dark:placeholder:text-white/30 rounded-r-lg md:w-[250px] lg:w-[300px]"
            />
          </div>
        </div>
      </div>

      <router-link
        v-if="showAddButton"
        :to="`${$route.fullPath}/create`"
        class="w-full md:w-auto inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
      >
        {{ addButtonText }}
      </router-link>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  searchableList: { type: Array, default: () => [] },
  showAddButton: { type: Boolean, default: false },
  addButtonText: { type: String, default: 'Tambah Data' },
})

const emit = defineEmits(['perform-search'])

const searchQuery = ref('')
const searchBy = ref(props.searchableList?.[0]?.param || '')
const isCategoryOpen = ref(false)
const categoryRef = ref(null)

const currentLabel = computed(
  () => props.searchableList.find((i) => i.param === searchBy.value)?.name ?? '',
)

const selectCategory = (param) => {
  searchBy.value = param
  isCategoryOpen.value = false
  if (searchQuery.value) performSearch()
}

const handleClickOutside = (e) => {
  if (categoryRef.value && !categoryRef.value.contains(e.target)) {
    isCategoryOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))

let debounceTimeout

const performSearch = () => {
  emit('perform-search', { query: searchQuery.value, by: searchBy.value })
}

const debounceSearch = () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(performSearch, 500)
}

watch(
  () => props.searchableList,
  (newList) => {
    if (newList?.length > 0 && !searchBy.value) {
      searchBy.value = newList[0].param
    }
  },
  { immediate: true },
)
</script>
