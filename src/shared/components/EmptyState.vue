<!--
  EmptyState
  ----------
  Purpose:
    Generic "nothing here yet" placeholder (empty favorites list, no
    recent searches, placeholder pages). Neutral/calm treatment - distinct
    from ErrorState, which is reserved for failures.

  Props:
    - title (string, required).
    - description (string, optional).
    - icon (string, default 'cloud'): decorative leading icon.

  Slots:
    - actions: optional call-to-action button(s).

  Usage:
    <EmptyState title="No favorites yet" description="Save a city to see it here.">
      <template #actions><Button @click="goToSearch">Search cities</Button></template>
    </EmptyState>
-->
<script setup lang="ts">
import Icon from '@/shared/ui/Icon.vue'

interface Props {
  title: string
  description?: string
  icon?: string
}

const { icon = 'cloud' } = defineProps<Props>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-subtle p-8 text-center">
    <Icon :name="icon" size="2xl" class="text-outline-variant" />
    <p class="font-title-lg text-title-lg text-on-surface">{{ title }}</p>
    <p v-if="description" class="font-body-md text-body-md text-on-surface-variant">{{ description }}</p>
    <div v-if="$slots.actions" class="mt-2">
      <slot name="actions" />
    </div>
  </div>
</template>
