import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'
import Swal from 'sweetalert2'

// Function to load CSS
const loadCSS = (href, id) => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  link.id = id
  if (!document.getElementById(id)) {
    document.head.appendChild(link)
  }
}

// Function to unload CSS
const unloadCSS = (id) => {
  const link = document.getElementById(id)
  if (link) {
    link.parentNode.removeChild(link)
  }
}

const adminCSS = [
  { href: '/src/assets/adminMain.css', id: 'admin-main-css' },
  { href: '/node_modules/swiper/swiper-bundle.min.css', id: 'swiper-css' },
  { href: '/node_modules/jsvectormap/dist/jsvectormap.css', id: 'jsvectormap-css' },
  { href: '/node_modules/flatpickr/dist/flatpickr.css', id: 'flatpickr-css' },
]

const publicCSS = [
  { href: '/node_modules/bootstrap/dist/css/bootstrap.min.css', id: 'bootstrap-css' },
  { href: '/src/assets/css/fontawesome.css', id: 'fontawesome-css' },
  { href: '/src/assets/css/mobile-menu.css', id: 'mobile-menu-css' },
  { href: '/src/assets/css/utility.css', id: 'utility-css' },
  { href: '/src/assets/css/main.css', id: 'main-css' },
]

router.beforeEach(async (to, from, next) => {
  const isAdminRoute =
    to.path.startsWith('/admin') ||
    to.path.startsWith('/auth') ||
    to.path.startsWith('/login') ||
    to.path.startsWith('/ticket') ||
    to.path.startsWith('/monitor') ||
    to.name === 'NotFound'

  if (isAdminRoute) {
    publicCSS.forEach((css) => unloadCSS(css.id))
    adminCSS.forEach((css) => loadCSS(css.href, css.id))
  } else {
    adminCSS.forEach((css) => unloadCSS(css.id))
    publicCSS.forEach((css) => loadCSS(css.href, css.id))
  }

  if (to.path.startsWith('/admin')) {
    if (!localStorage.getItem('access_token')) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'Please log in to access this page.',
      })
      return next({ path: '/login' })
    }
  }
  next()
})

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(router)
app.use(head)

app.mount('#app')
