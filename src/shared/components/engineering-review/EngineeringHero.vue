<script setup lang="ts">
defineProps<{
  title: string
  badge: string
  description: string
}>()
</script>

<template>
  <section id="summary" class="er-section !pt-0">
    <div class="glass-card er-hero-card er-fade-in">
      <div class="relative z-10 max-w-3xl">
        <span class="er-badge">{{ badge }}</span>
        <h1 class="mt-4 font-display-metrics text-display-metrics-sm leading-none ax-heading sm:text-display-metrics">
          {{ title }}
        </h1>
        <p class="mt-4 max-w-2xl font-body-lg text-body-lg ax-body">{{ description }}</p>
      </div>
    </div>
  </section>
</template>
