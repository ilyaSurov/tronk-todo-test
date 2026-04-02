<template>
  <span
    class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
    :class="pillClass"
  >
    <span class="inline-block h-1.5 w-1.5 rounded-full" :class="dotClass" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ isCompleted: boolean; overdue?: boolean }>()

const label = computed(() => {
  if (props.isCompleted) return 'Выполнена'
  if (props.overdue) return 'Просрочена'
  return 'Активная'
})

const pillClass = computed(() => {
  if (props.isCompleted) return 'bg-green-50 text-green-700 ring-1 ring-green-200'
  if (props.overdue) return 'bg-red-50 text-red-700 ring-1 ring-red-200'
  return 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
})

const dotClass = computed(() => {
  if (props.isCompleted) return 'bg-green-600'
  if (props.overdue) return 'bg-red-600'
  return 'bg-gray-500'
})
</script>

