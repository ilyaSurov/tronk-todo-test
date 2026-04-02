<template>
  <div class="min-h-full bg-gray-50">
    <div v-if="ui.isLoading" class="h-1 w-full bg-blue-600/20">
      <div class="h-1 w-1/3 animate-pulse bg-blue-600" />
    </div>
    <header class="border-b border-gray-200 bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-lg bg-black text-white grid place-items-center font-semibold">
            TD
          </div>
          <div>
            <div class="text-sm font-semibold text-gray-900">To-Do List</div>
            <div class="text-xs text-gray-500">Управляй задачами эффективно</div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div v-if="auth.user" class="hidden sm:block text-right">
            <div class="text-sm text-gray-900">{{ auth.user.email }}</div>
            <div class="text-xs text-gray-500">
              Роль: <span class="font-medium">{{ auth.user.role }}</span>
            </div>
          </div>
          <button
            v-if="auth.isAuthenticated"
            class="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
            @click="onLogout"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const ui = useUiStore()

async function onLogout() {
  auth.logout()
  await navigateTo('/login')
}
</script>

