<template>
  <draggable
    v-model="localMenus"
    item-key="id"
    class="space-y-4"
    :group="group"
    @end="onDragEnd"
    ghost-class="menu-ghost"
    chosen-class="menu-chosen"
  >
    <template #item="{ element }">
      <div class="px-4 py-2 border rounded-lg transition-all duration-200 ease-in-out">
        <div class="flex justify-between items-center">
          <span>{{ element.name }}</span>
          <div class="flex space-x-2">
            <router-link :to="`/admin/menus/${element.id}/edit`" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </router-link>
            <button @click="$emit('delete', element.id)" class="text-red-500 hover:text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <div v-if="element.children && element.children.length" class="ml-8 mt-4">
          <NestedDraggable :menus="element.children" @update:menus="element.children = $event" :group="{ name: 'menus-' + element.id }" @delete="$emit('delete', $event)" />
        </div>
      </div>
    </template>
  </draggable>
</template>

<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
  menus: {
    type: Array,
    required: true
  },
  group: {
    type: Object,
    default: () => ({ name: 'menus-root' })
  }
})

const emit = defineEmits(['update:menus', 'delete'])

const localMenus = ref(props.menus)

watch(() => props.menus, (newVal) => {
  localMenus.value = newVal
})

const onDragEnd = () => {
  emit('update:menus', localMenus.value)
}

</script>

<script>
export default {
  name: 'NestedDraggable'
}
</script>

<style scoped>
.menu-ghost {
  opacity: 0.5;
  background: #f0f0f0; /* Light grey background */
  border: 1px dashed #ccc; /* Dashed border */
}

.menu-chosen {
  cursor: grabbing;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  background-color: #e0f2fe; /* Light blue background */
}
</style>