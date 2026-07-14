<!--
  ForecastHourlyCard
  ------------------
  Purpose:
    A single tile in the horizontally-scrolling hourly forecast strip:
    time label, condition icon, temperature. The "current hour" tile gets
    a highlighted glass treatment and a filled icon.

  Props:
    - timeLabel (string, required): e.g. "Now", "2 PM".
    - icon (string, required): condition icon name.
    - temperatureLabel (string, required): e.g. "70°".
    - active (boolean, default false): highlights the current-hour tile.

  Slots / Events: none.

  Usage:
    <div class="flex gap-4 overflow-x-auto pb-4">
      <ForecastHourlyCard time-label="Now" icon="filter_drama" temperature-label="68°" active />
      <ForecastHourlyCard time-label="2 PM" icon="wb_sunny" temperature-label="70°" />
    </div>
-->
<script setup lang="ts">
import Card from '@/shared/ui/Card.vue'
import Icon from '@/shared/ui/Icon.vue'
import { cn } from '@/shared/utils'

interface Props {
  timeLabel: string
  icon: string
  temperatureLabel: string
  active?: boolean
}

const { active = false } = defineProps<Props>()
</script>

<template>
  <Card
    rounded="2xl"
    padding="none"
    :class="cn('flex h-32 w-20 shrink-0 flex-col items-center justify-between py-4', active && 'border-primary/30 bg-primary-container/50 shadow-glow-primary')"
  >
    <span :class="cn('font-label-caps text-label-caps', active ? 'text-primary' : 'text-on-surface-variant')">
      {{ timeLabel }}
    </span>
    <Icon :name="icon" :filled="active" :class="active ? 'text-primary' : 'text-on-surface-variant'" />
    <span class="font-numeric-data text-numeric-data text-on-surface">{{ temperatureLabel }}</span>
  </Card>
</template>
