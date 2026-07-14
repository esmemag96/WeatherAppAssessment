<script setup lang="ts">
import { ref } from 'vue'

import type { RoadmapItemData } from '@/content/artifacts/types'

import RoadmapItem from './RoadmapItem.vue'

defineProps<{
  items: RoadmapItemData[]
}>()

const expandedId = ref<string | null>(null)

function toggle(id: string): void {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <div class="space-y-3">
    <RoadmapItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      :expanded="expandedId === item.id"
      @toggle="toggle(item.id)"
    />
  </div>
</template>
