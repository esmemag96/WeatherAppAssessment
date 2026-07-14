<!--
  FavoriteButton
  --------------
  Purpose:
    Star-toggle control for marking a location as a favorite. Purely
    presentational/controlled - it has no knowledge of `useFavoritesStore`;
    the parent feature component wires the actual persistence.

  Props:
    - modelValue (boolean, required): whether the location is favorited.
    - size ('sm' | 'md' | 'lg', default 'md').
    - showLabel (boolean, default false): renders a visible label beside the
      star ("Add to favorites" / "Remove from favorites") in addition to the
      accessible name.
    - label (string, optional): accessible name override. Defaults to
      "Add to favorites" / "Remove from favorites" based on modelValue.

  Events:
    - update:modelValue (boolean): supports v-model.
    - toggle: emitted alongside update:modelValue, no payload - convenient
      for callers that just want to react without reading the new value.

  Usage:
    <FavoriteButton v-model="isFavorite" @toggle="persist" />
-->
<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/shared/utils'
import Icon from './Icon.vue'

interface Props {
  modelValue: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
}

const { modelValue, size = 'md', showLabel = false, label } = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  toggle: []
}>()

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

const accessibleLabel = computed(
  () => label ?? (modelValue ? 'Remove from favorites' : 'Add to favorites'),
)

const visibleLabel = computed(() =>
  modelValue ? 'Remove from favorites' : 'Add to favorites',
)

const starClasses = computed(() =>
  cn(
    'shrink-0 transition-colors duration-200 ease-swift',
    modelValue ? 'text-tertiary' : 'text-on-surface-variant group-hover:text-on-surface',
  ),
)

const buttonClasses = computed(() =>
  cn(
    'group inline-flex items-center justify-center rounded-full transition-all duration-200 ease-swift active:scale-90',
    showLabel
      ? 'gap-1.5 px-1 py-1 text-on-surface-variant hover:text-on-surface'
      : cn(
          modelValue ? 'text-tertiary' : 'text-on-surface-variant hover:text-on-surface',
          sizeClasses[size],
        ),
  ),
)

function handleClick(): void {
  emit('update:modelValue', !modelValue)
  emit('toggle')
}
</script>

<template>
  <button
    type="button"
    :aria-label="accessibleLabel"
    :aria-pressed="modelValue"
    :class="buttonClasses"
    @click="handleClick"
  >
    <Icon name="star" :filled="modelValue" :class="showLabel ? starClasses : undefined" size="lg" />
    <span v-if="showLabel" class="text-body-md text-on-surface-variant/80">{{ visibleLabel }}</span>
  </button>
</template>
