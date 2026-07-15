<!--
  LocationCarouselArrows
  ----------------------
  Purpose:
    Desktop/tablet counterpart to the swipe gesture + `LocationPageIndicator`
    dots used on mobile for the "swipe between saved locations" carousel
    (see `useWeatherDashboard`). A touch swipe isn't a discoverable
    interaction with a mouse, so from the `md` breakpoint up this renders
    previous/next arrow buttons straddling the hero card instead - the
    dots stay mobile-only (`md:hidden` on `LocationPageIndicator`), so the
    two never show at once.

  Props:
    - hasPrevious (boolean, required): disables the left arrow at the first page.
    - hasNext (boolean, required): disables the right arrow at the last page.

  Events:
    - previous, next.

  Usage:
    <div class="relative">
      <WeatherHeroCard ... />
      <LocationCarouselArrows :has-previous="..." :has-next="..." @previous="..." @next="..." />
    </div>
-->
<script setup lang="ts">
import Icon from '@/shared/ui/Icon.vue'
import IconButton from '@/shared/ui/IconButton.vue'

defineProps<{ hasPrevious: boolean; hasNext: boolean }>()

defineEmits<{ previous: []; next: [] }>()
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-20 hidden items-center justify-between px-3 md:flex">
    <IconButton
      label="Previous location"
      variant="glass"
      size="lg"
      :disabled="!hasPrevious"
      class="pointer-events-auto"
      @click="$emit('previous')"
    >
      <Icon name="chevron_left" />
    </IconButton>
    <IconButton
      label="Next location"
      variant="glass"
      size="lg"
      :disabled="!hasNext"
      class="pointer-events-auto"
      @click="$emit('next')"
    >
      <Icon name="chevron_right" />
    </IconButton>
  </div>
</template>
