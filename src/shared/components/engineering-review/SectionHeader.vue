<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}>()
</script>

<template>
  <header :class="align === 'center' ? 'text-center' : 'text-left'">
    <h2 class="text-2xl font-semibold tracking-tight ax-heading sm:text-3xl">{{ title }}</h2>
    <p v-if="subtitle" class="mt-2 max-w-2xl text-sm ax-muted" :class="{ 'mx-auto': align === 'center' }">
      {{ subtitle }}
    </p>
  </header>
</template>
