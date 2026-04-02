<template>
  <div class="space-y-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Задачи</h2>
        <p class="text-sm text-gray-600">Сортировка, фильтры, поиск и управление задачами.</p>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          @click="openCreate"
        >
          + Создать
        </button>
        <button
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
          :disabled="tasks.loading"
          @click="tasks.fetchAll()"
        >
          Обновить
        </button>
      </div>
    </div>

    <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <div class="grid gap-3 md:grid-cols-12">
        <div class="md:col-span-5">
          <label class="block text-xs font-medium text-gray-600">Поиск</label>
          <input
            v-model="queryInput"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Название, описание, автор..."
          />
        </div>

        <div class="md:col-span-3">
          <label class="block text-xs font-medium text-gray-600">Статус</label>
          <select
            class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            :value="tasks.filters.status"
            @change="tasks.setFilter('status', ($event.target as HTMLSelectElement).value as any)"
          >
            <option value="all">Все</option>
            <option value="active">Только активные</option>
            <option value="completed">Выполненные</option>
            <option value="overdue">Просроченные</option>
          </select>
        </div>

        <div class="md:col-span-4">
          <label class="block text-xs font-medium text-gray-600">Автор</label>
          <select
            class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            :value="tasks.filters.createdBy"
            @change="tasks.setFilter('createdBy', ($event.target as HTMLSelectElement).value as any)"
          >
            <option value="all">Все</option>
            <option v-for="a in tasks.authors" :key="a" :value="a">{{ a }}</option>
          </select>
        </div>

        <div class="md:col-span-3">
          <label class="block text-xs font-medium text-gray-600">Дедлайн от</label>
          <input
            type="date"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            :value="tasks.filters.dueFrom"
            @input="tasks.setFilter('dueFrom', ($event.target as HTMLInputElement).value as any)"
          />
        </div>

        <div class="md:col-span-3">
          <label class="block text-xs font-medium text-gray-600">Дедлайн до</label>
          <input
            type="date"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            :value="tasks.filters.dueTo"
            @input="tasks.setFilter('dueTo', ($event.target as HTMLInputElement).value as any)"
          />
        </div>

        <div class="md:col-span-3">
          <label class="block text-xs font-medium text-gray-600">Сортировка</label>
          <div class="mt-1 grid grid-cols-3 gap-2">
            <button class="sort-btn" @click="tasks.setSort('created')">
              Создано <span class="opacity-60">{{ sortArrow('created') }}</span>
            </button>
            <button class="sort-btn" @click="tasks.setSort('dueDate')">
              Дедлайн <span class="opacity-60">{{ sortArrow('dueDate') }}</span>
            </button>
            <button class="sort-btn" @click="tasks.setSort('status')">
              Статус <span class="opacity-60">{{ sortArrow('status') }}</span>
            </button>
          </div>
        </div>

        <div class="md:col-span-3">
          <label class="block text-xs font-medium text-gray-600">Размер страницы</label>
          <select
            class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            :value="tasks.pageSize"
            @change="onPageSize(($event.target as HTMLSelectElement).value)"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <div class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700">
            <tr>
              <th class="px-4 py-3">Название</th>
              <th class="px-4 py-3">Автор</th>
              <th class="px-4 py-3">Дедлайн</th>
              <th class="px-4 py-3">Статус</th>
              <th class="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>

          <tbody v-if="tasks.emptyReason === null">
            <tr v-for="t in tasks.paged" :key="t.id" class="border-b border-gray-100">
              <td class="px-4 py-3">
                <div class="font-medium text-gray-900">{{ t.title }}</div>
                <div v-if="t.description" class="mt-0.5 max-w-[44rem] truncate text-xs text-gray-500">
                  {{ t.description }}
                </div>
              </td>
              <td class="px-4 py-3 text-gray-700">{{ t.createdBy }}</td>
              <td class="px-4 py-3 text-gray-700">
                <div>{{ t.dueDate }}</div>
                <div v-if="isOverdue(t)" class="text-xs text-red-600">Просрочено</div>
              </td>
              <td class="px-4 py-3">
                <TaskStatusPill :is-completed="t.isCompleted" :overdue="isOverdue(t)" />
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <button
                    class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                    :disabled="!canEdit(t)"
                    @click="openEdit(t)"
                    title="Редактировать"
                  >
                    Ред.
                  </button>
                  <button
                    class="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                    :disabled="!canEdit(t)"
                    @click="openDelete(t)"
                    title="Удалить"
                  >
                    Удал.
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="tasks.emptyReason !== null" class="p-8">
        <div v-if="tasks.emptyReason === 'loading'" class="text-sm text-gray-600">Загрузка...</div>
        <div v-else-if="tasks.emptyReason === 'error'" class="space-y-2">
          <div class="text-sm text-red-700">{{ tasks.error }}</div>
          <button
            class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            @click="tasks.fetchAll()"
          >
            Повторить
          </button>
        </div>
        <div v-else-if="tasks.emptyReason === 'empty'" class="text-sm text-gray-600">
          Пока нет задач. Нажмите «Создать», чтобы добавить первую.
        </div>
        <div v-else-if="tasks.emptyReason === 'no-results'" class="text-sm text-gray-600">
          Результаты не найдены.
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 text-sm">
        <div class="text-gray-600">
          Страница <span class="font-medium text-gray-900">{{ tasks.page }}</span> из
          <span class="font-medium text-gray-900">{{ tasks.totalPages }}</span>
          · Найдено: <span class="font-medium text-gray-900">{{ tasks.sorted.length }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50"
            :disabled="tasks.page <= 1"
            @click="tasks.setPage(tasks.page - 1)"
          >
            Назад
          </button>
          <button
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50"
            :disabled="tasks.page >= tasks.totalPages"
            @click="tasks.setPage(tasks.page + 1)"
          >
            Вперёд
          </button>
        </div>
      </div>
    </div>

    <UiModal v-model="createOpen">
      <template #title>Создать задачу</template>
      <TaskForm
        v-model="draft"
        submit-label="Создать"
        :loading="saving"
        :api-error="modalError"
        @cancel="createOpen = false"
        @submit="submitCreate"
      />
    </UiModal>

    <UiModal v-model="editOpen">
      <template #title>Редактировать задачу</template>
      <TaskForm
        v-model="draft"
        submit-label="Сохранить"
        :loading="saving"
        :api-error="modalError"
        @cancel="editOpen = false"
        @submit="submitEdit"
      />
    </UiModal>

    <UiModal v-model="deleteOpen">
      <template #title>Удалить задачу?</template>
      <div class="space-y-4">
        <p class="text-sm text-gray-700">
          Удалить задачу <span class="font-semibold">{{ selected?.title }}</span>?
        </p>
        <div v-if="modalError" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {{ modalError }}
        </div>
        <div class="flex items-center justify-end gap-2">
          <button
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            @click="deleteOpen = false"
          >
            Отмена
          </button>
          <button
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            :disabled="saving"
            @click="submitDelete"
          >
            Удалить
          </button>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/tasks'
import type { SortKey } from '~/app/stores/tasks'
import { useDebounceFn } from '@vueuse/core'

definePageMeta({ layout: 'default' })

const auth = useAuthStore()
const tasks = useTasksStore()

const queryInput = ref('')
const applyQuery = useDebounceFn((q: string) => tasks.setQuery(q), 350)
watch(queryInput, (q) => applyQuery(q))

const createOpen = ref(false)
const editOpen = ref(false)
const deleteOpen = ref(false)

const selected = ref<Task | null>(null)
const draft = ref<Omit<Task, 'id'>>({
  title: '',
  description: '',
  dueDate: new Date().toISOString().slice(0, 10),
  isCompleted: false,
  createdBy: auth.user?.email || 'anonymous',
})

const saving = ref(false)
const modalError = ref<string | null>(null)

onMounted(async () => {
  auth.init()
  await tasks.fetchAll()
})

function sortArrow(key: SortKey) {
  if (tasks.sortKey !== key) return '↕'
  return tasks.sortDir === 'asc' ? '↑' : '↓'
}

function isOverdue(t: Task) {
  if (t.isCompleted) return false
  const d = new Date(t.dueDate)
  if (isNaN(d.getTime())) return false
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return d < now
}

function canEdit(t: Task) {
  if (!auth.user) return false
  return auth.isAdmin || t.createdBy === auth.user.email
}

function resetDraftForCreate() {
  draft.value = {
    title: '',
    description: '',
    dueDate: new Date().toISOString().slice(0, 10),
    isCompleted: false,
    createdBy: auth.user?.email || 'anonymous',
  }
}

function openCreate() {
  modalError.value = null
  selected.value = null
  resetDraftForCreate()
  createOpen.value = true
}

function openEdit(t: Task) {
  modalError.value = null
  selected.value = t
  draft.value = {
    title: t.title,
    description: t.description || '',
    dueDate: t.dueDate,
    isCompleted: t.isCompleted,
    createdBy: t.createdBy,
  }
  editOpen.value = true
}

function openDelete(t: Task) {
  modalError.value = null
  selected.value = t
  deleteOpen.value = true
}

async function submitCreate() {
  saving.value = true
  modalError.value = null
  try {
    await tasks.createTask({
      ...draft.value,
      createdBy: auth.user?.email || draft.value.createdBy,
    })
    createOpen.value = false
  } catch (e: any) {
    modalError.value = e?.statusMessage || e?.message || 'Не удалось создать задачу'
  } finally {
    saving.value = false
  }
}

async function submitEdit() {
  if (!selected.value) return
  saving.value = true
  modalError.value = null
  try {
    await tasks.updateTask(selected.value.id, {
      ...draft.value,
      createdBy: selected.value.createdBy,
    })
    editOpen.value = false
  } catch (e: any) {
    modalError.value = e?.statusMessage || e?.message || 'Не удалось сохранить изменения'
  } finally {
    saving.value = false
  }
}

async function submitDelete() {
  if (!selected.value) return
  saving.value = true
  modalError.value = null
  try {
    await tasks.deleteTask(selected.value.id)
    deleteOpen.value = false
  } catch (e: any) {
    modalError.value = e?.statusMessage || e?.message || 'Не удалось удалить задачу'
  } finally {
    saving.value = false
  }
}

function onPageSize(v: string) {
  const n = Number(v)
  tasks.pageSize = Number.isFinite(n) && n > 0 ? n : 10
  tasks.setPage(1)
}
</script>

<style scoped>
.sort-btn {
  @apply rounded-lg border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 hover:bg-gray-50;
}
</style>

