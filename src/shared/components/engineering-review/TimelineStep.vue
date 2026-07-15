<script setup lang="ts">
defineProps<{
  label: string
  active?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="ax-focus min-h-11 w-full cursor-pointer whitespace-nowrap rounded-lg border px-4 py-2 text-center text-sm font-medium"
    :class="active ? 'ax-interactive-selected' : 'ax-interactive'"
    :aria-pressed="active"
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>
