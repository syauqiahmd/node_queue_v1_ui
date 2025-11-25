<template>
  <div class="row">
    <div v-for="ad in ads" :key="ad.id" class="col-md-6">
      <div class="relative image-anime mt-10">
        <img class="aspect-ratio-img" :src="ad.imageUrl" :alt="ad.id" />
        <a
          v-if="(ad.linkUrl !== '' || ad.linkUrl !== '#') && ad.customCta"
          :href="ad.linkUrl"
          target="_blank"
          class="overlay-btn theme-btn1"
        >
          {{ ad.customCta }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  ads: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
.overlay-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.aspect-ratio-img {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  border-radius: 12px;
}
</style>
