<script setup lang="ts">
defineProps<{
  text: string
  logoDarkMode: string
  logoLightMode: string
  isDark: boolean
  compact?: boolean
}>()
</script>

<template>
  <div
    class="er-coherent-attribution"
    :class="compact ? 'er-coherent-attribution--compact' : 'er-coherent-attribution--full'"
  >
    <img
      :src="isDark ? logoDarkMode : logoLightMode"
      alt="Coherent Solutions"
      class="er-coherent-attribution__logo"
      width="140"
      height="28"
      loading="lazy"
      decoding="async"
    />
    <p class="er-coherent-attribution__text ax-muted">{{ text }}</p>
  </div>
</template>
