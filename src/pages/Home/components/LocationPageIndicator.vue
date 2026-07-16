<!--
  LocationPageIndicator
  ----------------------
  Purpose:
    Apple Weather-style row of page dots for the swipe-between-locations
    carousel on the Weather dashboard. Fixed near the bottom of the
    screen (fixed above the bottom navigation, similar to `OfflineBanner`)
    `BottomNavigation`) so it stays visible regardless of scroll
    position, and only rendered by the caller when there's more than
    one location to swipe between.

    Mobile-only (`md:hidden`) - swiping isn't a mouse interaction, so
    from the `md` breakpoint up `LocationCarouselArrows` takes over as
    the discoverable way to move between pages instead.

  Props:
    - count (number, required): total number of locations/pages.
    - activeIndex (number, required).
    - labels (string[], optional): per-dot accessible names (location
      names) - falls back to "Location N" when omitted.

  Events:
    - select: [index] - a specific dot was tapped.

  Usage:
    <LocationPageIndicator :count="3" :active-index="1" :labels="['London', 'Paris']" @select="goToCarouselIndex" />
-->
<script setup lang="ts">
const props = defineProps<{
  count: number
  activeIndex: number
  labels?: string[]
}>()

defineEmits<{ select: [index: number] }>()

function labelFor(index: number): string {
  return props.labels?.[index] ?? `Location ${index + 1}`
}
</script>

<template>
  <div
    class="fixed bottom-24 left-1/2 z-40 flex w-fit -translate-x-1/2 items-center gap-2 rounded-full border border-border-subtle bg-glass-fill/80 px-3 py-2 shadow-nav backdrop-blur-xl md:hidden dark:bg-surface/80"
    role="tablist"
    aria-label="Saved locations"
  >
    <button
      v-for="index in count"
      :key="index - 1"
      type="button"
      role="tab"
      :aria-selected="index - 1 === activeIndex"
      :aria-label="labelFor(index - 1)"
      class="h-2 rounded-full transition-all duration-300 ease-swift"
      :class="index - 1 === activeIndex ? 'w-5 bg-primary dark:bg-secondary-fixed' : 'w-2 bg-outline/50 hover:bg-outline'"
      @click="$emit('select', index - 1)"
    />
  </div>
</template>
