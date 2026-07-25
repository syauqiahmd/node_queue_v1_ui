<template>
  <div class="w-full select-none touch-manipulation">
    <!-- Numeric keypad (phone number) -->
    <div v-if="mode === 'numeric'" class="grid grid-cols-3 gap-2">
      <button
        v-for="key in ['1', '2', '3', '4', '5', '6', '7', '8', '9']"
        :key="key"
        type="button"
        @click="pressKey(key)"
        class="h-14 rounded-lg bg-white/10 border border-white/10 text-white text-xl font-medium hover:bg-white/20 active:scale-95 transition touch-manipulation"
      >
        {{ key }}
      </button>
      <button
        type="button"
        @click="backspace"
        class="h-14 rounded-lg bg-white/10 border border-white/10 text-white text-lg hover:bg-white/20 active:scale-95 transition touch-manipulation"
      >
        ⌫
      </button>
      <button
        type="button"
        @click="pressKey('0')"
        class="h-14 rounded-lg bg-white/10 border border-white/10 text-white text-xl font-medium hover:bg-white/20 active:scale-95 transition touch-manipulation"
      >
        0
      </button>
      <button
        type="button"
        @click="$emit('done')"
        class="h-14 rounded-lg bg-emerald-500/30 border border-emerald-400/50 text-white text-sm font-medium hover:bg-emerald-500/40 active:scale-95 transition touch-manipulation"
      >
        Selesai
      </button>
    </div>

    <!-- QWERTY keyboard (name / email) -->
    <div v-else class="space-y-1.5">
      <div class="grid grid-cols-10 gap-1.5">
        <button
          v-for="key in row1"
          :key="key"
          type="button"
          @click="pressKey(key)"
          class="h-12 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/20 active:scale-95 transition touch-manipulation"
        >
          {{ displayKey(key) }}
        </button>
      </div>
      <div class="grid grid-cols-10 gap-1.5 px-3">
        <button
          v-for="key in row2"
          :key="key"
          type="button"
          @click="pressKey(key)"
          class="h-12 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/20 active:scale-95 transition touch-manipulation"
        >
          {{ displayKey(key) }}
        </button>
      </div>
      <div class="flex gap-1.5">
        <button
          type="button"
          @click="shift = !shift"
          :class="[
            'flex-[1.5] h-12 rounded-lg border text-sm font-medium transition active:scale-95 touch-manipulation',
            shift
              ? 'bg-emerald-500/30 border-emerald-400/50 text-white'
              : 'bg-white/10 border-white/10 text-white hover:bg-white/20',
          ]"
        >
          ⇧
        </button>
        <button
          v-for="key in row3"
          :key="key"
          type="button"
          @click="pressKey(key)"
          class="flex-1 h-12 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/20 active:scale-95 transition touch-manipulation"
        >
          {{ displayKey(key) }}
        </button>
        <button
          type="button"
          @click="backspace"
          class="flex-[1.5] h-12 rounded-lg bg-white/10 border border-white/10 text-white text-base hover:bg-white/20 active:scale-95 transition touch-manipulation"
        >
          ⌫
        </button>
      </div>
      <div class="flex gap-1.5">
        <button
          type="button"
          @click="pressKey('@')"
          class="flex-[1.5] h-12 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/20 active:scale-95 transition touch-manipulation"
        >
          @
        </button>
        <button
          type="button"
          @click="pressKey(' ')"
          class="flex-[5] h-12 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/20 active:scale-95 transition touch-manipulation"
        >
          Spasi
        </button>
        <button
          type="button"
          @click="pressKey('.')"
          class="flex-[1.5] h-12 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/20 active:scale-95 transition touch-manipulation"
        >
          .
        </button>
        <button
          type="button"
          @click="$emit('done')"
          class="flex-[2] h-12 rounded-lg bg-emerald-500/30 border border-emerald-400/50 text-white text-sm font-medium hover:bg-emerald-500/40 active:scale-95 transition touch-manipulation"
        >
          Selesai
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  mode: { type: String, default: 'text' }, // 'text' | 'numeric'
})

const emit = defineEmits(['update:modelValue', 'done'])

const shift = ref(false)

const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm']

const displayKey = (key) => (shift.value ? key.toUpperCase() : key)

const pressKey = (key) => {
  const char = props.mode === 'numeric' ? key : displayKey(key)
  emit('update:modelValue', (props.modelValue || '') + char)
}

const backspace = () => {
  emit('update:modelValue', (props.modelValue || '').slice(0, -1))
}
</script>
