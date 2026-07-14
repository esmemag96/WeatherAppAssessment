<!--
  ForecastDailyRow
  ----------------
  Purpose:
    A single row in the 7-day forecast list: day label, condition icon +
    precipitation chance, and a low/high temperature range bar. Meant to
    be placed inside a `divide-y divide-white/5` list wrapper (see the
    "7-Day Forecast" module in the mockups).

  Props:
    - dayLabel (string, required): e.g. "Today", "Tue".
    - icon (string, required): condition icon name.
    - iconColorClass (string, default "text-on-surface-variant"): Tailwind
      text-color utility, driven by weather condition so mixed-condition
      rows are distinguishable at a glance instead of all rendering the
      same neutral gray icon.
    - precipitationLabel (string, optional): e.g. "20%".
    - lowLabel (string, required): e.g. "56°".
    - highLabel (string, required): e.g. "72°".
    - rangeStart (number, default 25): percent (0-100) where the filled
      bar segment starts - i.e. how this day's low compares to the
      week's overall low/high range.
    - rangeEnd (number, default 75): percent (0-100) where the filled bar
      segment ends.
    - highlighted (boolean, default false): use for the "Today" row.

  Slots / Events: none.

  Usage:
    <div class="divide-y divide-white/5">
      <ForecastDailyRow
        day-label="Today" icon="filter_drama" precipitation-label="20%"
        low-label="56°" high-label="72°" :range-start="25" :range-end="75" highlighted
      />
    </div>
-->
<script setup lang="ts">
import { computed } from 'vue'

import Icon from '@/shared/ui/Icon.vue'
import { cn } from '@/shared/utils'

interface Props {
  dayLabel: string
  icon: string
  iconColorClass?: string
  precipitationLabel?: string
  lowLabel: string
  highLabel: string
  rangeStart?: number
  rangeEnd?: number
  highlighted?: boolean
}

const {
  rangeStart = 25,
  rangeEnd = 75,
  highlighted = false,
  iconColorClass = 'text-on-surface-variant',
} = defineProps<Props>()

const barStyle = computed(() => ({
  left: `${rangeStart}%`,
  right: `${100 - rangeEnd}%`,
}))
</script>

<template>
  <div class="flex h-row-height-md items-center justify-between">
    <span :class="cn('w-12 font-body-md text-body-md', highlighted ? 'text-primary' : 'text-on-surface')">
      {{ dayLabel }}
    </span>
    <div class="flex w-20 items-center gap-3">
      <Icon :name="icon" :filled="highlighted" :class="iconColorClass" />
      <span v-if="precipitationLabel" class="font-label-caps text-label-caps text-on-surface-variant">
        {{ precipitationLabel }}
      </span>
    </div>
    <div class="flex flex-1 items-center gap-3 px-2">
      <span class="w-6 text-right font-numeric-data text-numeric-data text-on-surface-variant">{{ lowLabel }}</span>
      <div class="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-variant">
        <!-- Cold-to-hot gradient (primary=cool blue, tertiary=warm amber) so the
             bar itself reads as a temperature scale, not just a brand accent. -->
        <div class="absolute inset-y-0 rounded-full bg-gradient-to-r from-primary to-tertiary" :style="barStyle" />
      </div>
      <span class="w-6 font-numeric-data text-numeric-data text-on-surface">{{ highLabel }}</span>
    </div>
  </div>
</template>
