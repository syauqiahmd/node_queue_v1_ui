<template>
  <ThemeProvider>
    <div class="min-h-screen xl:flex">
      <app-sidebar />
      <BaseBackdrop />
      <div
        class="flex-1 transition-all duration-300 ease-in-out"
        :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
      >
        <app-header />
        <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <router-view />
        </div>
      </div>
    </div>
  </ThemeProvider>
</template>

<script setup>
import '@/assets/adminMain.css'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import BaseBackdrop from './BaseBackdrop.vue'
import ThemeProvider from './ThemeProvider.vue'
import { useSidebarProvider } from '@/composables/useSidebar'

const { isExpanded, isHovered } = useSidebarProvider()
</script>
