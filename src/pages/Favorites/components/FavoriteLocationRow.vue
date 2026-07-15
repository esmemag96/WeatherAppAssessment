<script setup lang="ts">
import type { FavoriteWeatherStatus } from '../useFavoritesPage'

import { Card, FavoriteButton, Icon, LoadingSkeleton } from '@/shared/ui'
import { cn } from '@/shared/utils'

interface Props {
  name: string
  reorderIndex: number
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
  reorderIndex,
  weatherStatus = 'idle',
  iconColorClass = 'text-on-surface-variant',
  dragging = false,
  dragOver = false,
} = defineProps<Props>()

const emit = defineEmits<{
  select: []
  remove: []
  'reorder-start': [number]
  'reorder-move': [PointerEvent]
  'reorder-end': []
}>()

function onHandlePointerDown(event: PointerEvent): void {
  if (event.pointerType === 'mouse' && event.button !== 0) return

  const handle = event.currentTarget as HTMLElement
  handle.setPointerCapture(event.pointerId)
  emit('reorder-start', reorderIndex)
}

function onHandlePointerMove(event: PointerEvent): void {
  emit('reorder-move', event)
}

function onHandlePointerEnd(event: PointerEvent): void {
  const handle = event.currentTarget as HTMLElement
  if (handle.hasPointerCapture(event.pointerId)) {
    handle.releasePointerCapture(event.pointerId)
  }
  emit('reorder-end')
}
</script>

<template>
  <div :data-reorder-index="reorderIndex">
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
    >
    <button
      type="button"
      aria-label="Reorder favorite"
      class="flex h-10 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-overlay-hover hover:text-on-surface active:cursor-grabbing"
      @click.stop
      @pointerdown="onHandlePointerDown"
      @pointermove="onHandlePointerMove"
      @pointerup="onHandlePointerEnd"
      @pointercancel="onHandlePointerEnd"
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
  </div>
</template>
