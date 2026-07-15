<script setup lang="ts">
defineProps<{
  workedWell: string[]
  wouldImprove: string[]
  wouldDoNext: string[]
}>()
</script>

<template>
  <div class="er-retro-grid">
    <div class="er-retro-column">
      <h3 class="ax-emerald-heading">What went well</h3>
      <ul class="mt-4 space-y-3">
        <li v-for="item in workedWell" :key="item" class="text-sm leading-relaxed ax-muted">{{ item }}</li>
      </ul>
    </div>
    <div class="er-retro-column">
      <h3 class="ax-amber-heading">What I'd improve</h3>
      <ul class="mt-4 space-y-3">
        <li v-for="item in wouldImprove" :key="item" class="text-sm leading-relaxed ax-muted">{{ item }}</li>
      </ul>
    </div>
    <div class="er-retro-column">
      <h3 class="er-text-primary font-semibold text-sm uppercase tracking-widest">What I'd do next</h3>
      <ul class="mt-4 space-y-3">
        <li v-for="item in wouldDoNext" :key="item" class="text-sm leading-relaxed ax-muted">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>
