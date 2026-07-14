<script setup lang="ts">
defineProps<{
  label: string
  value: string
  description: string
}>()
</script>

<template>
  <div class="ax-card p-5 text-left">
    <p class="ax-label">{{ label }}</p>
    <p class="er-stat-value mt-1">{{ value }}</p>
    <p class="mt-1 text-xs ax-faint">{{ description }}</p>
  </div>
</template>
