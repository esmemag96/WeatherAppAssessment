<!--
  HourlyForecastSection
  ---------------------
  Purpose:
    "Hourly Forecast" module of the Weather dashboard: a section title
    over the horizontally-scrolling strip of `ForecastHourlyCard` tiles.
    Purely a composition wrapper - all data is pre-formatted by
    `useWeatherDashboard`; this component owns no domain/store logic.

  Props:
    - items (HourlyForecastItem[], required): pre-formatted tiles, see
      `ForecastHourlyCard`'s own prop contract for each entry's shape.
-->
<script setup lang="ts">
import { ForecastHourlyCard, SectionHeader } from '@/shared/components'

export interface HourlyForecastItem {
  timeLabel: string
  icon: string
  temperatureLabel: string
  active?: boolean
}

defineProps<{ items: HourlyForecastItem[] }>()
</script>

<template>
  <section v-if="items.length">
    <SectionHeader title="Hourly Forecast" />
    <div class="-mx-1 mt-4 flex gap-4 overflow-x-auto px-1 pb-2">
      <ForecastHourlyCard
        v-for="(item, index) in items"
        :key="`${item.timeLabel}-${index}`"
        :time-label="item.timeLabel"
        :icon="item.icon"
        :temperature-label="item.temperatureLabel"
        :active="item.active"
      />
    </div>
  </section>
</template>
