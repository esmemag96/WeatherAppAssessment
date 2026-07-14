<script setup lang="ts">
import type { AiPrincipleData } from '@/content/artifacts/types'

import { Icon } from '@/shared/ui'

defineProps<{
  principle: AiPrincipleData
}>()
</script>

<template>
  <div class="ax-card p-5">
    <div class="flex gap-3">
      <span class="shrink-0 ax-muted" aria-hidden="true">
        <Icon :name="principle.icon" size="md" />
      </span>
      <p class="text-sm ax-body">{{ principle.text }}</p>
    </div>
  </div>
</template>
