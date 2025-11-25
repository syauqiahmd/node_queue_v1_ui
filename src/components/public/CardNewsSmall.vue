<template>
  <div class="blog1-recent-box mb-16 mt-16">
    <div class="">
      <div class="recent-thumb image-anime relative">
        <img
          :src="thumbnailUrl || '@/assets/img/blog/blog1-recent1.png'"
          alt="interview9.id"
          class="thumbnail-image"
        />
      </div>
    </div>
    <div class="heading">
      <h5>
        <router-link :to="`/post/${slug}`">{{ title }}</router-link>
      </h5>
      <span class="date"
        ><img src="@/assets/img/icons/date1.svg" alt="interview9.id" />
        {{ formatDayDate(publishAt) }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { formatDayDate } from '@/helpers/dayjs'

defineProps({
  publishAt: String,
  title: String,
  slug: String,
  thumbnailUrl: String,
})
</script>

<style scoped>
.thumbnail-image {
  border-radius: 4px;
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}
</style>
