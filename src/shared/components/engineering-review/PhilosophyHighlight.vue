<script setup lang="ts">
defineProps<{
  title: string
  paragraphs: string[]
}>()
</script>

<template>
  <div class="ax-panel-blue p-6">
    <h3 class="text-sm font-semibold ax-heading">{{ title }}</h3>
    <p v-for="(paragraph, index) in paragraphs" :key="index" class="mt-3 text-sm ax-body">
      {{ paragraph }}
    </p>
  </div>
</template>
