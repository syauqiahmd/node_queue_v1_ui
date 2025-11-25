<template>
  <div class="sidebar-widget_1 _recent-posts mt-40">
    <h3 class="mb-16">Berita Populer</h3>
    <CardNewsSmall
      v-for="(item, index) in popularArticles"
      :key="index"
      :title="item.title"
      :publishAt="item.publishAt"
      :slug="item.slug"
      :thumbnailUrl="item.thumbnailUrl"
    />
  </div>
</template>

<script setup>
import CardNewsSmall from './CardNewsSmall.vue'

defineProps({
  popularArticles: {
    type: Array,
    required: true,
  },
})
</script>
