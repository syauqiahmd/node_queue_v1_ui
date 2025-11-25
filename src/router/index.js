import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      component: () => import('../layouts/PublicLayout.vue'),
      children: [
        {
          path: '',
          name: 'Monitor Queue',
          component: () => import('../views/public/HomeView.vue'),
          meta: {
            title: 'Monitor Queue',
          },
        },
      ],
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
          },
        },
        {
          path: 'organizations/:id/edit',
          name: 'EditOrganization',
          component: () => import('../views/Organization/OrganizationForm.vue'),
          meta: {
            title: 'Edit Organization',
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
          },
        },
        {
          path: 'users/:id/edit',
          name: 'EditUser',
          component: () => import('../views/User/UserForm.vue'),
          meta: {
            title: 'Edit User',
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
          },
        },
        {
          path: 'services/:id/edit',
          name: 'EditService',
          component: () => import('../views/Service/ServiceForm.vue'),
          meta: {
            title: 'Edit Service',
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
          },
        },
        {
          path: 'counters/:id/edit',
          name: 'EditCounter',
          component: () => import('../views/Counter/CounterForm.vue'),
          meta: {
            title: 'Edit Counter',
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
import { validateToken } from '../helpers/authApi.js'

export default router
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const baseTitle = 'QMS'
  const pageTitle = to.meta.title ? `${baseTitle} - ${to.meta.title}` : `${baseTitle}`
  document.title = pageTitle.trim()

  if (to.path.startsWith('/admin')) {
    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }
    const isValid = await validateToken()
    if (!isValid) {
      authStore.logout()
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})
