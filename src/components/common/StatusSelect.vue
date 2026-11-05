<template>
  <div class="relative" ref="containerRef">
    <!-- Trigger -->
    <button
      type="button"
      @click="toggle"
      :disabled="disabled"
      :class="[
        'h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-left flex items-center justify-between gap-2 transition focus:outline-none focus:ring-3 focus:ring-brand-500/10',
        disabled
          ? 'cursor-not-allowed opacity-50 border-gray-200 dark:border-gray-700'
          : 'cursor-pointer border-gray-300 hover:border-brand-300 focus:border-brand-300 dark:border-gray-700 dark:hover:border-brand-700 dark:focus:border-brand-800',
      ]"
    >
      <span v-if="selected" class="flex items-center gap-2.5 min-w-0">
        <span
          v-if="showStatus"
          :class="selected.isActive ? 'bg-success-500' : 'bg-error-400'"
          class="shrink-0 w-2 h-2 rounded-full"
        />
        <span class="truncate text-gray-800 dark:text-white/90">{{ selected.label }}</span>
      </span>
      <span v-else class="text-gray-400 dark:text-gray-500">{{ placeholder }}</span>
      <svg
        class="shrink-0 w-4 h-4 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
      >
        <!-- Clear / placeholder option -->
        <div
          @click="handleSelect(null)"
          class="flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
        >
          {{ placeholder }}
        </div>

        <div class="border-t border-gray-100 dark:border-gray-800" />

        <div class="max-h-52 overflow-y-auto">
          <div
            v-for="option in options"
            :key="option.value"
            @click="isSelectable(option) ? handleSelect(option.value) : null"
            :class="[
              'flex items-center gap-2.5 px-4 py-2.5 text-sm',
              isSelectable(option)
                ? option.value === modelValue
                  ? 'cursor-pointer bg-brand-50 dark:bg-brand-500/10'
                  : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5'
                : 'cursor-not-allowed opacity-50',
            ]"
          >
            <span
              v-if="showStatus"
              :class="option.isActive ? 'bg-success-500' : 'bg-error-400'"
              class="shrink-0 w-2 h-2 rounded-full"
            />
            <span
              :class="[
                'truncate',
                option.value === modelValue
                  ? 'text-brand-500 dark:text-brand-400 font-medium'
                  : 'text-gray-800 dark:text-white/90',
              ]"
              >{{ option.label }}</span
            >
            <span
              v-if="showStatus && option.isActive === false"
              class="ml-auto shrink-0 text-xs text-error-400 dark:text-error-500"
              >Inactive</span
            >
          </div>

          <div v-if="!options.length" class="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
            No options available
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { default: null },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '-- Select --' },
  disabled: { type: Boolean, default: false },
  showStatus: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const containerRef = ref(null)

const selected = computed(() => props.options.find((o) => o.value === props.modelValue) ?? null)

// When showStatus is off, all options are selectable regardless of isActive
const isSelectable = (option) => !props.showStatus || option.isActive !== false

const toggle = () => {
  if (!props.disabled) isOpen.value = !isOpen.value
}

const handleSelect = (value) => {
  emit('update:modelValue', value)
  isOpen.value = false
}

const handleClickOutside = (e) => {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>
