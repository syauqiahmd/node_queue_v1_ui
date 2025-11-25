<template>
  <div class="sidebar-widget_1 _recent-posts">
    <h3>Berita Utama</h3>
    <div class="mt-30">
      <div class="thumbnail image-anime relative">
        <img
          :src="headlineArticle.thumbnailUrl"
          class="rounded thumbnail-image"
          alt="interview9.id"
        />
      </div>
      <div class="heading1 mt-30">
        <h4>
          <router-link :to="`/post/${headlineArticle.slug}`">
            {{ headlineArticle.title }}
          </router-link>
        </h4>
        <p class="mt-16">
          {{ truncateContent(headlineArticle.content, 100) }}
        </p>
        <br />
        <img src="@/assets/img/icons/date1.svg" alt="interview9.id" />
        {{ formatDayDate(headlineArticle.publishAt) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { formatDayDate } from '@/helpers/dayjs'

defineProps({
  headlineArticle: {
    type: Object,
    default: () => ({
      title: '',
      thumbnailUrl: '',
      content: '',
      slug: '',
      publishAt: new Date(),
    }),
  },
})

const truncateContent = (htmlContent, maxLength) => {
  if (!htmlContent) return ''
  const strippedContent = htmlContent.replace(/<[^>]*>/g, '') // Remove HTML tags
  if (strippedContent.length > maxLength) {
    return strippedContent.substring(0, maxLength) + '...'
  } else {
    return strippedContent
  }
}
</script>

<style scoped>
.thumbnail-image {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}
.ql-editor {
  padding: 0;
  color: #6b7280 !important;
}
</style>
