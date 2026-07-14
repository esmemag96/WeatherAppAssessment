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
    class="ax-focus min-h-11 whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
    :class="active ? 'ax-interactive-selected' : 'ax-interactive'"
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>
