<script setup lang="ts">
defineProps<{
  open: boolean
}>()
</script>

<template>
  <div v-if="open" class="ax-border border-t">
    <slot />
  </div>
</template>
