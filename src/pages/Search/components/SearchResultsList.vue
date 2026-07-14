<!--
  SearchResultsList
  ------------------
  Purpose:
    Renders a list of selectable locations as `SearchSuggestion` rows -
    reused identically for live geocoding results and recent searches
    (same as the mockups' treatment). Every row is a real, Tab-reachable
    `<button>` already; this component layers ArrowUp/Down/Home/End
    roving focus on top as a progressive keyboard enhancement, per "if
    practical" - it degrades to plain Tab order if JS/focus behaves
    unexpectedly, it never traps focus.

  Props:
    - items (Location[], required).
    - icon (string, default 'location_on'): leading icon for every row
      (callers pass 'history' for recent searches).

  Events:
    - select (Location): a row was activated (click or Enter/Space,
      handled natively by the underlying button).
-->
<script setup lang="ts">
import { useTemplateRef } from 'vue'

import type { Location } from '@/entities/location'
import { SearchSuggestion } from '@/shared/components'
import { formatLocationSubtitle } from '@/shared/utils'

interface Props {
  items: Location[]
  icon?: string
}

const { icon = 'location_on' } = defineProps<Props>()
defineEmits<{ select: [Location] }>()

const listRef = useTemplateRef<HTMLDivElement>('list')

function focusRowAt(index: number): void {
  const rows = listRef.value?.querySelectorAll<HTMLButtonElement>('button')
  if (!rows || rows.length === 0) return
  const nextIndex = (index + rows.length) % rows.length
  rows[nextIndex]?.focus()
}

function handleKeydown(event: KeyboardEvent): void {
  const rows = listRef.value?.querySelectorAll<HTMLButtonElement>('button')
  if (!rows || rows.length === 0) return

  const activeIndex = Array.from(rows).indexOf(document.activeElement as HTMLButtonElement)

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusRowAt(activeIndex + 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusRowAt(activeIndex - 1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    focusRowAt(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    focusRowAt(rows.length - 1)
  }
}
</script>

<template>
  <div ref="list" class="space-y-2" @keydown="handleKeydown">
    <SearchSuggestion
      v-for="location in items"
      :key="location.id"
      :name="location.name"
      :subtitle="formatLocationSubtitle(location)"
      :icon="icon"
      @select="$emit('select', location)"
    />
  </div>
</template>
