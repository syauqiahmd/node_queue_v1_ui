'''
<template>
  <div class="block">
    <form
      @submit.prevent
      class="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4"
    >
      <div class="flex items-center space-x-2 w-full md:w-auto">
        <div
          v-if="searchableList && searchableList.length > 0"
          class="flex rounded-md shadow-sm w-full"
        >
          <select
            v-model="searchBy"
            class="h-11 block w-auto rounded-none rounded-l-lg border border-gray-200 bg-transparent py-2.5 px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          >
            <option v-for="item in searchableList" :key="item.param" :value="item.param">
              {{ item.name }}
            </option>
          </select>
          <div class="relative flex-grow">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                class="fill-gray-500 dark:fill-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  fill=""
                />
              </svg>
            </span>
            <input
              type="text"
              v-model="searchQuery"
              @input="debounceSearch"
              placeholder="Pencarian..."
              :class="[
                'dark:bg-dark-900 h-11 w-full border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 md:w-[250px] lg:w-[300px]',
                searchableList && searchableList.length > 0 ? 'rounded-r-lg' : 'rounded-lg',
              ]"
            />
          </div>
        </div>
      </div>

      <router-link
        :to="`${$route.fullPath}/create`"
        class="w-full md:w-auto inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
      >
        Tambah Data
      </router-link>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  searchableList: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['perform-search'])

const searchQuery = ref('')
const searchBy = ref(props.searchableList?.[0]?.param || '')

let debounceTimeout

const performSearch = () => {
  emit('perform-search', { query: searchQuery.value, by: searchBy.value })
}

const debounceSearch = () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    performSearch()
  }, 500) // 500ms debounce
}

watch(
  () => props.searchableList,
  (newList) => {
    if (newList && newList.length > 0 && !searchBy.value) {
      searchBy.value = newList[0].param
    }
  },
  { immediate: true },
)

watch(searchBy, () => {
  if (searchQuery.value) {
    performSearch()
  }
})
</script>
''
