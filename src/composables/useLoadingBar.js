import { ref } from 'vue'

const loading = ref(false)
let pendingCount = 0

export function useLoadingBar() {
  const start = () => {
    pendingCount++
    loading.value = true
  }

  const finish = () => {
    pendingCount = Math.max(0, pendingCount - 1)
    if (pendingCount === 0) loading.value = false
  }

  return { loading, start, finish }
}
