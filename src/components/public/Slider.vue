<template>
  <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button
        v-for="(slider, index) in sliders"
        :key="slider.id"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        :data-bs-slide-to="index"
        :class="{ active: index === 0 }"
        :aria-current="index === 0 ? 'true' : undefined"
        :aria-label="'Slide ' + (index + 1)"
      ></button>
    </div>
    <div class="carousel-inner">
      <!-- image slider need to size with ratio 3.5:1 -->
      <div
        v-for="(slider, index) in sliders"
        :key="slider.id"
        class="carousel-item"
        :class="{ active: index === 0 }"
      >
        <img :src="slider.imageUrl" class="d-block w-100" :alt="slider.title" />
        <!-- <a :href="slider.linkUrl" target="_blank">
        </a> -->
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleIndicators"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleIndicators"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<style scoped>
.carousel-item img {
  width: 100%;
  height: auto;
  aspect-ratio: 2.5 / 1;
  object-fit: cover;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/helpers/request'

const sliders = ref([])

const fetchSliders = async () => {
  try {
    const response = await request.get('/public/sliders')
    if (response.data.success) {
      sliders.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch sliders:', error)
  }
}

onMounted(() => {
  fetchSliders()
})
</script>
