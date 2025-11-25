<template>
  <div class="blog4-single-box mb-4">
    <div class="row align-items-center">
      <div class="col-lg-4">
        <div class="image image-anime _relative">
          <img
            :src="thumbnailUrl || '@/assets/img/blog/blog4-box-image1.png'"
            alt="interview9.id"
            class="thumbnail-image"
          />
        </div>
      </div>
      <div class="col-lg-8">
        <div class="content-area">
          <div class="author-area3">
            <img src="@/assets/img/icons/date1.svg" alt="interview9.id" /> {{ createdDate }}
          </div>
          <div class="heading4">
            <h4>
              <router-link :to="`/post/${slug}`">{{ title }}</router-link>
            </h4>
            <div class="mt-3">
              <div
                v-for="(category, index) in categories"
                v-bind:key="index"
                class="button-category"
              >
                {{ category.name }}
              </div>
            </div>
            <router-link :to="`/post/${slug}`" class="learn"
              >Read More <span><i class="fa-regular fa-arrow-right"></i></span
            ></router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  createdDate: String,
  title: String,
  slug: String,
  thumbnailUrl: String,
  categories: Array,
})
</script>

<style scoped>
.thumbnail-image {
  width: 100%;
  aspect-ratio: 3/2;
  object-fit: cover;
}
</style>
