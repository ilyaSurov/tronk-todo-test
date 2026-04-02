<template>
  <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
    <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <h1 class="text-2xl font-semibold text-gray-900">To-Do List</h1>
      <p class="mt-1 text-sm text-gray-600">Управляй задачами эффективно</p>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model.trim="email"
            type="email"
            autocomplete="email"
            class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="user@test.com"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Пароль</label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="••••••"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 text-sm text-gray-700 select-none">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Запомнить меня
          </label>
        </div>

        <div v-if="apiError" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {{ apiError }}
        </div>

        <button
          type="submit"
          class="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
        >
          <span v-if="!loading">Войти</span>
          <span v-else>Входим...</span>
        </button>
      </form>
    </section>

    <section class="hidden lg:block">
      <div class="rounded-2xl bg-gradient-to-br from-gray-900 to-black p-8 text-white shadow-sm">
        <div class="text-sm text-gray-300">Подсказка</div>
        <div class="mt-2 text-lg font-semibold">Тестовые аккаунты</div>
        <ul class="mt-4 space-y-3 text-sm text-gray-200">
          <li class="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            <div class="font-medium">Пользователь</div>
            <div class="text-gray-300">user@test.com / 123456</div>
          </li>
          <li class="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            <div class="font-medium">Пользователь 2</div>
            <div class="text-gray-300">user-2@test.com / 123456</div>
          </li>
          <li class="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            <div class="font-medium">Админ</div>
            <div class="text-gray-300">admin@test.com / admin123</div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const auth = useAuthStore()

const email = ref('user@test.com')
const password = ref('123456')
const rememberMe = ref(true)

const loading = ref(false)
const apiError = ref<string | null>(null)
const errors = reactive<{ email?: string; password?: string }>({})

onMounted(async () => {
  auth.init()
  if (auth.isAuthenticated) {
    await navigateTo('/')
  }
})

function validate() {
  errors.email = undefined
  errors.password = undefined
  apiError.value = null

  if (!email.value) errors.email = 'Email обязателен'
  else if (!/^\S+@\S+\.\S+$/.test(email.value)) errors.email = 'Некорректный email'
  if (!password.value) errors.password = 'Пароль обязателен'

  return !errors.email && !errors.password
}

async function onSubmit() {
  if (!validate()) return
  loading.value = true
  try {
    auth.setRememberMe(rememberMe.value)
    await auth.login(email.value, password.value)
    await navigateTo('/')
  } catch (e: any) {
    apiError.value = e?.data?.error || e?.message || 'Ошибка авторизации'
  } finally {
    loading.value = false
  }
}
</script>

