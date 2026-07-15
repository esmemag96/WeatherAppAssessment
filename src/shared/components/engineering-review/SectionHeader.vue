<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  accent?: 'primary' | 'secondary' | 'tertiary' | 'neutral'
}>()
</script>

<template>
  <header :class="align === 'center' ? 'text-center' : 'text-left'">
    <div v-if="accent" class="er-section-heading">
      <div
        class="er-section-accent"
        :class="{
          'er-section-accent-primary': accent === 'primary',
          'er-section-accent-secondary': accent === 'secondary',
          'er-section-accent-tertiary': accent === 'tertiary',
          'er-section-accent-neutral': accent === 'neutral',
        }"
        aria-hidden="true"
      />
      <h2 class="font-headline-lg text-headline-lg ax-heading">{{ title }}</h2>
    </div>
    <h2 v-else class="text-2xl font-semibold tracking-tight ax-heading sm:text-3xl">{{ title }}</h2>
    <p
      v-if="subtitle"
      class="mt-2 max-w-2xl text-sm ax-muted"
      :class="{ 'mx-auto': align === 'center', 'ml-14': accent && align !== 'center' }"
    >
      {{ subtitle }}
    </p>
    <div
      v-if="$slots.default"
      class="mt-3"
      :class="{ 'mx-auto max-w-2xl': align === 'center', 'ml-14': accent && align !== 'center' }"
    >
      <slot />
    </div>
  </header>
</template>
