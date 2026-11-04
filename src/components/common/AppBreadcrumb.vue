<template>
  <nav
    v-if="breadcrumbs.length"
    aria-label="Breadcrumb"
    class="flex items-center flex-wrap gap-x-1.5 gap-y-1 text-sm mb-4"
  >
    <template v-for="(crumb, i) in breadcrumbs" :key="i">
      <router-link
        v-if="crumb.to"
        :to="crumb.to"
        class="text-gray-400 hover:text-brand-500 dark:text-gray-500 dark:hover:text-brand-400 transition-colors"
      >
        {{ crumb.label }}
      </router-link>
      <span v-else class="text-gray-700 dark:text-white/80 font-medium">
        {{ crumb.label }}
      </span>
      <svg
        v-if="i < breadcrumbs.length - 1"
        class="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </template>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const RESOURCE_MAP = {
  organizations: { label: 'Organizations', path: '/admin/organizations' },
  users: { label: 'Users', path: '/admin/users' },
  services: { label: 'Services', path: '/admin/services' },
  counters: { label: 'Counters', path: '/admin/counters' },
  report: { label: 'Report', path: '/admin/report' },
  activity: { label: 'Activity', path: '/admin/activity' },
}

const breadcrumbs = computed(() => {
  const afterAdmin = route.path
    .replace(/^\/admin\/?/, '')
    .split('/')
    .filter(Boolean)

  // Dashboard — no breadcrumb
  if (!afterAdmin.length) return []

  const resource = RESOURCE_MAP[afterAdmin[0]]
  if (!resource) return []

  const crumbs = [{ label: 'Dashboard', to: '/admin' }]

  if (afterAdmin.length === 1) {
    // List page — current, not a link
    crumbs.push({ label: resource.label, to: null })
    return crumbs
  }

  // Create / edit — parent is a link, current uses route meta title
  crumbs.push({ label: resource.label, to: resource.path })
  crumbs.push({ label: route.meta?.title || afterAdmin.slice(1).join('/'), to: null })
  return crumbs
})
</script>
