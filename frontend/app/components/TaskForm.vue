<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div>
      <label class="block text-sm font-medium text-gray-700">Название</label>
      <input
        v-model.trim="form.title"
        class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        placeholder="Например: Подготовить отчёт"
      />
      <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Описание</label>
      <textarea
        v-model.trim="form.description"
        rows="3"
        class="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        placeholder="Необязательно"
      />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="block text-sm font-medium text-gray-700">Дедлайн</label>
        <input
          v-model="form.dueDate"
          type="date"
          class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <p v-if="errors.dueDate" class="mt-1 text-sm text-red-600">{{ errors.dueDate }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Статус</label>
        <select
          v-model="form.isCompleted"
          class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option :value="false">Активная</option>
          <option :value="true">Выполнена</option>
        </select>
      </div>
    </div>

    <div v-if="apiError" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
      {{ apiError }}
    </div>

    <div class="flex items-center justify-end gap-2 pt-2">
      <button
        type="button"
        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        @click="$emit('cancel')"
      >
        Отмена
      </button>
      <button
        type="submit"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="loading"
      >
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Task } from '~/types/tasks'

const props = defineProps<{
  modelValue: Omit<Task, 'id'>
  submitLabel: string
  loading?: boolean
  apiError?: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: Omit<Task, 'id'>): void
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const form = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const apiError = computed(() => props.apiError)
const loading = computed(() => Boolean(props.loading))

const errors = reactive<{ title?: string; dueDate?: string }>({})

function validate() {
  errors.title = undefined
  errors.dueDate = undefined

  if (!form.value.title) errors.title = 'Название обязательно'
  if (!form.value.dueDate) errors.dueDate = 'Дедлайн обязателен'
  else {
    const d = new Date(form.value.dueDate)
    if (isNaN(d.getTime())) errors.dueDate = 'Некорректная дата'
  }
  return !errors.title && !errors.dueDate
}

function onSubmit() {
  if (!validate()) return
  emit('submit')
}
</script>

