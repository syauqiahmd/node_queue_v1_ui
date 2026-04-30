import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/ticket',
      name: 'Get Ticket',
      component: () => import('../views/Ticket/GetTicket.vue'),
      meta: {
        title: 'Get Ticket',
      },
    },
    {
      path: '/monitor',
      name: 'Monitor Queue',
      component: () => import('../views/Monitor/GetLastQueue.vue'),
      meta: {
        title: 'Monitor Queue',
      },
    },
    {
      path: '/admin',
      component: () => import('../components/layout/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'Beranda',
          component: () => import('../views/Dashboard/AdminDashboard.vue'),
          meta: {
            title: 'Beranda',
          },
        },
        {
          path: 'organizations',
          name: 'Organizations',
          component: () => import('../views/Organization/OrganizationTable.vue'),
          meta: {
            title: 'Organization',
          },
        },
        {
          path: 'organizations/create',
          name: 'CreateOrganization',
          component: () => import('../views/Organization/OrganizationForm.vue'),
          meta: {
            title: 'Add Organization',
            requiresAdmin: true,
          },
        },
        {
          path: 'organizations/:id/edit',
          name: 'EditOrganization',
          component: () => import('../views/Organization/OrganizationForm.vue'),
          meta: {
            title: 'Edit Organization',
            requiresAdmin: true,
          },
        },
        {
          path: 'users',
          name: 'Users',
          component: () => import('../views/User/UserTable.vue'),
          meta: {
            title: 'User',
          },
        },
        {
          path: 'users/create',
          name: 'CreateUser',
          component: () => import('../views/User/UserForm.vue'),
          meta: {
            title: 'Add User',
            requiresAdmin: true,
          },
        },
        {
          path: 'users/:id/edit',
          name: 'EditUser',
          component: () => import('../views/User/UserForm.vue'),
          meta: {
            title: 'Edit User',
            requiresAdmin: true,
          },
        },
        {
          path: 'services',
          name: 'Services',
          component: () => import('../views/Service/ServiceTable.vue'),
          meta: {
            title: 'Service',
          },
        },
        {
          path: 'services/create',
          name: 'CreateService',
          component: () => import('../views/Service/ServiceForm.vue'),
          meta: {
            title: 'Add Service',
            requiresAdmin: true,
          },
        },
        {
          path: 'services/:id/edit',
          name: 'EditService',
          component: () => import('../views/Service/ServiceForm.vue'),
          meta: {
            title: 'Edit Service',
            requiresAdmin: true,
          },
        },
        {
          path: 'counters',
          name: 'Counters',
          component: () => import('../views/Counter/CounterTable.vue'),
          meta: {
            title: 'Counter',
          },
        },
        {
          path: 'counters/create',
          name: 'CreateCounter',
          component: () => import('../views/Counter/CounterForm.vue'),
          meta: {
            title: 'Add Counter',
            requiresAdmin: true,
          },
        },
        {
          path: 'counters/:id/edit',
          name: 'EditCounter',
          component: () => import('../views/Counter/CounterForm.vue'),
          meta: {
            title: 'Edit Counter',
            requiresAdmin: true,
          },
        },
        {
          path: 'activity',
          name: 'Activity',
          component: () => import('../views/Activity/CronActivity.vue'),
          meta: {
            title: 'Activity',
          },
        },
        {
          path: 'report',
          name: 'Report',
          component: () => import('../views/Report/ReportPage.vue'),
          meta: {
            title: 'Report',
          },
        },
      ],
    },
    {
      path: '/login',
      component: () => import('../components/layout/BlankLayout.vue'),
      children: [
        {
          path: '',
          name: 'Login',
          component: () => import('../views/Auth/AuthLogin.vue'),
          meta: {
            title: 'Login',
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Not Found',
      },
    },
  ],
})

import { useAuthStore } from '../stores/auth.js'

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const baseTitle = 'QMS'
  const pageTitle = to.meta.title ? `${baseTitle} - ${to.meta.title}` : `${baseTitle}`
  document.title = pageTitle.trim()

  if (to.path.startsWith('/admin')) {
    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }
    const role = authStore.user?.role || authStore.user?.roleName || null
    if (to.meta?.requiresAdmin && role !== 'ADMIN') {
      next('/admin')
      return
    }
    next()
  } else {
    next()
  }
})

export default router
