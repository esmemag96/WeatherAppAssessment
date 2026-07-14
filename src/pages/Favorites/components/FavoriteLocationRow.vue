<!--
  FavoriteLocationRow
  -------------------
  Purpose:
    A single favorited-location row: drag handle, city name + current
    condition, color-coded icon and temperature, and a remove control.
    Tapping the main area selects it (loads its forecast); dragging the
    handle reorders the list.

  Props:
    - name (string, required): location name, e.g. "London".
    - weatherStatus ('idle' | 'loading' | 'ready' | 'error', default 'idle').
    - conditionLabel (string, optional): e.g. "Cloudy", "Clear Night".
    - temperatureLabel (string, optional): e.g. "12°".
    - icon (string, optional): Material Symbol for the current condition.
    - iconColorClass (string, optional): Tailwind text-color utility shared
      by the icon and temperature.
    - dragging (boolean, default false): dims the row while it is being dragged.
    - dragOver (boolean, default false): highlights the row as a drop target.

  Events:
    - select: the row was activated.
    - remove: the star was pressed to un-favorite this location.
    - drag-start / drag-over / drop / drag-end: reorder gestures.
-->
<script setup lang="ts">
import type { FavoriteWeatherStatus } from '../useFavoritesPage'

import { Card, FavoriteButton, Icon, LoadingSkeleton } from '@/shared/ui'
import { cn } from '@/shared/utils'

interface Props {
  name: string
  weatherStatus?: FavoriteWeatherStatus
  conditionLabel?: string
  temperatureLabel?: string
  icon?: string
  iconColorClass?: string
  dragging?: boolean
  dragOver?: boolean
}

const {
  name,
  weatherStatus = 'idle',
  iconColorClass = 'text-on-surface-variant',
  dragging = false,
  dragOver = false,
} = defineProps<Props>()

const emit = defineEmits<{
  select: []
  remove: []
  'drag-start': [DragEvent]
  'drag-over': [DragEvent]
  drop: []
  'drag-end': []
}>()

function onDragStart(event: DragEvent): void {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', name)
  }
  emit('drag-start', event)
}
</script>

<template>
  <Card
    rounded="xl"
    padding="md"
    :class="
      cn(
        'flex items-center gap-3 transition-all duration-200 ease-swift',
        dragging && 'opacity-50',
        dragOver && 'ring-2 ring-primary/40',
      )
    "
    @dragover="emit('drag-over', $event)"
    @drop.prevent="emit('drop')"
    @dragend="emit('drag-end')"
  >
    <button
      type="button"
      draggable="true"
      aria-label="Reorder favorite"
      class="flex h-10 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-overlay-hover hover:text-on-surface active:cursor-grabbing"
      @click.stop
      @dragstart="onDragStart"
      @dragend="emit('drag-end')"
    >
      <Icon name="drag_indicator" size="sm" />
    </button>

    <button type="button" class="flex min-w-0 flex-1 items-center justify-between gap-4 text-left" @click="$emit('select')">
      <div class="min-w-0">
        <p class="truncate font-title-lg text-title-lg leading-tight text-on-surface">{{ name }}</p>
        <p
          v-if="weatherStatus === 'ready' && conditionLabel"
          class="mt-0.5 font-body-md text-body-md text-on-surface-variant"
        >
          {{ conditionLabel }}
        </p>
        <LoadingSkeleton v-else-if="weatherStatus === 'loading'" width="5rem" height="0.875rem" class="mt-1" />
        <p v-else-if="weatherStatus === 'error'" class="mt-0.5 font-body-md text-body-md text-on-surface-variant">
          Unavailable
        </p>
      </div>

      <div v-if="weatherStatus === 'ready' && icon && temperatureLabel" class="flex shrink-0 items-center gap-2">
        <Icon :name="icon" :class="cn(iconColorClass)" />
        <span :class="cn('font-headline-md text-headline-md tabular-nums', iconColorClass)">{{ temperatureLabel }}</span>
      </div>
      <LoadingSkeleton v-else-if="weatherStatus === 'loading'" shape="pill" width="3.5rem" height="1.75rem" />
    </button>
    <FavoriteButton :model-value="true" size="sm" label="Remove from favorites" @update:model-value="$emit('remove')" />
  </Card>
</template>
