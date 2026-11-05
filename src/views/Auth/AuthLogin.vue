<template>
  <div class="flex min-h-screen">
    <!-- ── Left: Form panel ───────────────────────────── -->
    <div
      class="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-white sm:px-10 lg:px-16"
    >
      <!-- Mobile-only logo -->
      <div class="mb-8 lg:hidden">
        <img src="@/assets/square-logo.png" class="w-14 h-14 mx-auto" alt="Logo" />
      </div>

      <div class="w-full max-w-[400px]">
        <!-- Heading -->
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-900 sm:text-3xl">Selamat Datang</h1>
          <p class="mt-2 text-sm text-gray-500">Masukan username dan password untuk melanjutkan</p>
        </div>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="space-y-5">
            <!-- Username -->
            <div>
              <label for="username" class="mb-1.5 block text-sm font-medium text-gray-700">
                Username <span class="text-error-500">*</span>
              </label>
              <input
                ref="usernameRef"
                v-model="userName"
                @input="errors.userName = ''"
                type="text"
                id="username"
                name="username"
                placeholder="Masukan username"
                autocomplete="username"
                :class="[
                  'h-11 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-3 transition',
                  errors.userName
                    ? 'border-error-400 focus:border-error-400 focus:ring-error-500/10'
                    : 'border-gray-300 focus:border-brand-400 focus:ring-brand-500/10',
                ]"
              />
              <p
                v-if="errors.userName"
                class="mt-1.5 text-xs text-error-500 flex items-center gap-1"
              >
                <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ errors.userName }}
              </p>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700">
                Password <span class="text-error-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  placeholder="Masukan password"
                  autocomplete="current-password"
                  @input="errors.password = ''"
                  :class="[
                    'h-11 w-full rounded-lg border bg-white py-2.5 pl-4 pr-11 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-3 transition',
                    errors.password
                      ? 'border-error-400 focus:border-error-400 focus:ring-error-500/10'
                      : 'border-gray-300 focus:border-brand-400 focus:ring-brand-500/10',
                  ]"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabindex="-1"
                >
                  <svg
                    v-if="!showPassword"
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                </button>
              </div>
              <p
                v-if="errors.password"
                class="mt-1.5 text-xs text-error-500 flex items-center gap-1"
              >
                <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ errors.password }}
              </p>
            </div>

            <!-- API error -->
            <div
              v-if="authStore.error"
              class="flex items-start gap-3 rounded-lg bg-error-50 border border-error-200 px-4 py-3 text-sm text-error-600"
            >
              <svg class="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ authStore.error }}</span>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="authStore.loading"
              class="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-brand-500 text-sm font-medium text-white shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-3 focus:ring-brand-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg
                v-if="authStore.loading"
                class="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              {{ authStore.loading ? 'Masuk...' : 'Masuk' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <p class="mt-10 text-xs text-gray-400 text-center">
        &copy; {{ year }} QueueFlow. Sistem Manajemen Antrian.
      </p>
    </div>

    <!-- ── Right: Brand panel ─────────────────────────── -->
    <div
      class="relative hidden lg:flex lg:w-[45%] xl:w-1/2 flex-col items-center justify-center overflow-hidden bg-brand-950"
    >
      <!-- Decorative grid dots -->
      <div class="absolute inset-0" aria-hidden="true">
        <svg
          class="absolute inset-0 w-full h-full opacity-[0.07]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <!-- Glow blobs -->
      <div
        class="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl"
      />
      <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl" />

      <!-- Brand content -->
      <div class="relative z-10 flex flex-col items-center text-center px-10 xl:px-16">
        <div class="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
          <img src="@/assets/square-logo.png" class="w-20 h-20 object-contain" alt="QueueFlow" />
        </div>
        <h2 class="text-3xl xl:text-4xl font-bold text-white tracking-tight mb-4">QueueFlow</h2>
        <p class="text-white/50 text-base leading-relaxed max-w-xs">
          Sistem manajemen antrian modern untuk layanan publik yang efisien dan transparan
        </p>

        <!-- Feature pills -->
        <div class="mt-10 flex flex-wrap justify-center gap-3">
          <span
            v-for="feat in features"
            :key="feat"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 text-white/60 text-xs font-medium"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
            {{ feat }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import { showSuccessToast } from '@/helpers/sweetalert'

const year = new Date().getFullYear()
const features = ['Real-time Queue', 'Smart Monitor', 'Kiosk Tiket', 'Laporan Harian']

const userName = ref('')
const password = ref('')
const showPassword = ref(false)
const errors = reactive({ userName: '', password: '' })
const usernameRef = ref(null)

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  usernameRef.value?.focus()
})

const validate = () => {
  errors.userName = ''
  errors.password = ''
  let valid = true
  if (!userName.value.trim()) {
    errors.userName = 'Username wajib diisi.'
    valid = false
  }
  if (!password.value.trim()) {
    errors.password = 'Password wajib diisi.'
    valid = false
  }
  return valid
}

const handleSubmit = async () => {
  if (!validate()) return
  authStore.error = null
  const success = await authStore.login({ userName: userName.value, password: password.value })
  if (success) {
    const name = authStore.user?.fullName || authStore.user?.userName || 'there'
    showSuccessToast(`Selamat datang, ${name}! 👋`)
    router.push('/admin')
  }
}
</script>
