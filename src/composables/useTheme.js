import { ref, watchEffect } from 'vue'

const isDark = ref(localStorage.getItem('admin-theme') === 'dark')

// Mirror the toggle onto <html> too. ThemeProvider only puts `.dark` on an inner
// wrapper div, but portalled UI (flatpickr's calendar, appended to <body>) sits
// outside that div and would otherwise never match the `.dark *` variant.
watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
})

export function useTheme() {
  const toggle = () => {
    isDark.value = !isDark.value
    localStorage.setItem('admin-theme', isDark.value ? 'dark' : 'light')
  }
  return { isDark, toggle }
}
