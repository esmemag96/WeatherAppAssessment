<script setup lang="ts">
import type { OwnershipMatrixRow } from '@/content/artifacts/types'

import { Icon } from '@/shared/ui'

defineProps<{
  rows: OwnershipMatrixRow[]
}>()
</script>

<template>
  <div class="ax-card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="er-ownership-table w-full min-w-[32rem] text-left text-sm">
        <caption class="sr-only">
          Decision ownership matrix showing AI assistance versus human decision authority
        </caption>
        <thead>
          <tr class="ax-border border-b">
            <th scope="col" class="px-5 py-3 ax-label">Activity</th>
            <th scope="col" class="px-5 py-3 text-center ax-label">AI Assisted</th>
            <th scope="col" class="px-5 py-3 text-center ax-label">Human Decision</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.activity"
            class="ax-border border-b last:border-b-0"
          >
            <th scope="row" class="px-5 py-3 font-medium ax-heading">{{ row.activity }}</th>
            <td class="px-5 py-3 text-center">
              <span v-if="row.aiAssisted" class="inline-flex items-center justify-center ax-emerald-text">
                <Icon name="check" size="sm" label="AI assisted" />
              </span>
              <span v-else class="ax-faint" aria-label="Not AI assisted">—</span>
            </td>
            <td class="px-5 py-3 text-center">
              <span v-if="row.humanDecision" class="inline-flex items-center justify-center ax-emerald-text">
                <Icon name="check" size="sm" label="Human decision" />
              </span>
              <span v-else class="ax-faint" aria-label="No human decision">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
