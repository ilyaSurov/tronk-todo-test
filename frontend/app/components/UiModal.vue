<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/40" @click="onClose" />
      <div class="absolute inset-0 grid place-items-center p-4">
        <div class="w-full max-w-xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
          <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h3 class="text-base font-semibold text-gray-900">
              <slot name="title" />
            </h3>
            <button class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900" @click="onClose">
              ✕
            </button>
          </div>
          <div class="px-5 py-4">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

function onClose() {
  emit('update:modelValue', false)
}
</script>

