<template>
  <div class="row">
    <div
      class="col-12 m-auto aos-init aos-animate"
      data-aos="fade-up"
      data-aos-delay="100"
      data-aos-duration="400"
    >
      <div class="theme-pagination theme-pagination2 text-center">
        <ul>
          <li>
            <a
              href="#"
              @click.prevent="$emit('previous-page')"
              :class="{ 'disabled-link': !hasPrevious || loading }"
            >
              <i class="fa-solid fa-angle-left"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              @click.prevent="$emit('next-page')"
              :class="{ 'disabled-link': !hasNext || loading }"
            >
              <i class="fa-solid fa-angle-right"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  hasPrevious: {
    type: Boolean,
    required: true
  },
  hasNext: {
    type: Boolean,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
})

defineEmits(['next-page', 'previous-page'])
</script>

<style scoped>
.disabled-link {
  pointer-events: none;
  opacity: 0.5;
}
</style>
