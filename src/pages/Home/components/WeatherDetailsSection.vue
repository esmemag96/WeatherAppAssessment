<!--
  WeatherDetailsSection
  ---------------------
  Purpose:
    "Weather Details" bento grid of `WeatherMetricCard` tiles (UV Index,
    Humidity, Wind, Visibility - whichever metrics `useWeatherDashboard`
    finds available on the current forecast; UV Index only appears once
    the independently-loaded air-quality reading arrives). One data-driven
    loop fills each
    card's `#visual` slot with the same small progress-bar treatment
    instead of hand-writing three near-identical `WeatherMetricCard`
    blocks, per the "avoid duplicated markup" guidance.

  Props:
    - items (WeatherDetailItem[], required): pre-formatted metric tiles.
-->
<script setup lang="ts">
import { SectionHeader, WeatherMetricCard } from '@/shared/components'

export interface WeatherDetailItem {
  key: string
  label: string
  icon: string
  value: string
  description?: string
  /** 0-100 fill for the tile's visual progress bar (values outside this range are clamped). */
  percent: number
}

const props = defineProps<{ items: WeatherDetailItem[] }>()

function clampPercent(percent: number): number {
  return Math.min(100, Math.max(0, percent))
}
</script>

<template>
  <section v-if="props.items.length">
    <SectionHeader title="Weather Details" uppercase />
    <div class="mt-2 grid grid-cols-2 gap-4">
      <WeatherMetricCard
        v-for="item in props.items"
        :key="item.key"
        :label="item.label"
        :icon="item.icon"
        :value="item.value"
        :description="item.description"
      >
        <template #visual>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
            <div
              class="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              :style="{ width: `${clampPercent(item.percent)}%` }"
            />
          </div>
        </template>
      </WeatherMetricCard>
    </div>
  </section>
</template>
