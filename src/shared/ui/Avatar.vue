<!--
  Avatar
  ------
  Purpose:
    Circular avatar for a user profile photo or a small location thumbnail
    (Settings profile row, Favorites city thumbnails). Falls back to
    initials, then to a generic person icon, so it never renders empty.

  Props:
    - src (string, optional): image URL.
    - alt (string, optional): accessible description of the image.
    - initials (string, optional): shown when `src` is absent/fails to load.
    - size ('sm' | 'md' | 'lg' | 'xl', default 'md').
    - ring (boolean, default false): adds the soft primary ring used around
      the Settings profile photo.

  Slots:
    - default: fully overrides the fallback content (icon/initials).

  Events: none.

  Usage:
    <Avatar :src="user.photoUrl" alt="Professional User" size="lg" ring />
    <Avatar initials="JS" size="sm" />
-->
<script setup lang="ts">
import { ref, watch } from 'vue'

import { cn } from '@/shared/utils'
import Icon from './Icon.vue'

interface Props {
  src?: string
  alt?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  ring?: boolean
}

const { src, alt = '', initials, size = 'md', ring = false } = defineProps<Props>()

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-base',
  xl: 'h-20 w-20 text-lg',
}

const hasImageError = ref(false)
watch(() => src, () => {
  hasImageError.value = false
})
</script>

<template>
  <div
    :class="
      cn(
        'relative shrink-0 overflow-hidden rounded-full bg-surface-container-highest text-on-surface-variant',
        'flex items-center justify-center font-headline-md',
        sizeClasses[size],
        ring && 'ring-2 ring-primary/30',
      )
    "
  >
    <img
      v-if="src && !hasImageError"
      :src="src"
      :alt="alt"
      class="h-full w-full object-cover"
      @error="hasImageError = true"
    />
    <slot v-else>
      <span v-if="initials">{{ initials }}</span>
      <Icon v-else name="person" size="lg" />
    </slot>
  </div>
</template>
