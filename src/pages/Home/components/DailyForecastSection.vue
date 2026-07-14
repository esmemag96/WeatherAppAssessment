<!--
  DailyForecastSection
  --------------------
  Purpose:
    "7-Day Forecast" module of the Weather dashboard: a section title
    over the divided list of `ForecastDailyRow` rows. Purely a
    composition wrapper - all data is pre-formatted by
    `useWeatherDashboard`; this component owns no domain/store logic.

  Props:
    - items (DailyForecastItem[], required): pre-formatted rows, see
      `ForecastDailyRow`'s own prop contract for each entry's shape.
-->
<script setup lang="ts">
import { ForecastDailyRow, SectionHeader } from '@/shared/components'

export interface DailyForecastItem {
  dayLabel: string
  icon: string
  iconColorClass?: string
  precipitationLabel?: string
  lowLabel: string
  highLabel: string
  rangeStart: number
  rangeEnd: number
  highlighted?: boolean
}

defineProps<{ items: DailyForecastItem[] }>()
</script>

<template>
  <section v-if="items.length">
    <SectionHeader title="7-Day Forecast" />
    <div class="mt-2 divide-y divide-divider">
      <ForecastDailyRow
        v-for="(item, index) in items"
        :key="`${item.dayLabel}-${index}`"
        :day-label="item.dayLabel"
        :icon="item.icon"
        :icon-color-class="item.iconColorClass"
        :precipitation-label="item.precipitationLabel"
        :low-label="item.lowLabel"
        :high-label="item.highLabel"
        :range-start="item.rangeStart"
        :range-end="item.rangeEnd"
        :highlighted="item.highlighted"
      />
    </div>
  </section>
</template>
