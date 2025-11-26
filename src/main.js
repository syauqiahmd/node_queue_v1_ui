import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'
import Swal from 'sweetalert2'
import './assets/adminMain.css'
import 'swiper/swiper-bundle.css'
import 'flatpickr/dist/flatpickr.css'

router.beforeEach(async (to, from, next) => {
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
