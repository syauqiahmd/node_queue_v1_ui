import { ref } from 'vue'

const isDark = ref(localStorage.getItem('admin-theme') === 'dark')

export function useTheme() {
  const toggle = () => {
    isDark.value = !isDark.value
    localStorage.setItem('admin-theme', isDark.value ? 'dark' : 'light')
  }
  return { isDark, toggle }
}
