<template>
  <tr v-for="row in rows" :key="row" class="border-t border-gray-100 dark:border-gray-800">
    <td v-for="col in columns" :key="col" class="px-5 py-4 sm:px-6">
      <div
        class="h-4 rounded animate-pulse bg-gray-200 dark:bg-gray-700"
        :style="{ width: colWidth(col) }"
      ></div>
    </td>
  </tr>
</template>

<script setup>
const props = defineProps({
  rows: {
    type: Number,
    default: 5,
  },
  columns: {
    type: Number,
    required: true,
  },
})

const colWidth = (col) => {
  if (col === 1) return '20%'
  if (col === props.columns) return '30%'
  return col % 2 === 0 ? '70%' : '85%'
}
</script>
