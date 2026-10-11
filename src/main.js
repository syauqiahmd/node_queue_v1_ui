import './helpers/polyfills'
import { initObservability, attachVueErrorHandler } from './helpers/observability'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/adminMain.css'
import 'flatpickr/dist/flatpickr.css'

// Start before anything else so errors during app setup are captured.
initObservability()

const app = createApp(App)
attachVueErrorHandler(app)

app.use(createPinia())
app.use(router)

app.mount('#app')
