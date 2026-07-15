<script setup lang="ts">
import ProposalInsightGrid from './ProposalInsightGrid.vue'
import SectionHeader from './SectionHeader.vue'
import TechnicalDetails from './TechnicalDetails.vue'

defineProps<{
  title: string
  summary: string
  why: string
  decision: string
  benefits: string[]
  technicalLabel?: string
  accent?: 'primary' | 'secondary' | 'tertiary' | 'neutral'
  compact?: boolean
}>()
</script>

<template>
  <div class="space-y-8">
    <SectionHeader :title="title" :accent="accent">
      <p v-if="!compact" class="max-w-3xl font-body-lg text-body-lg leading-relaxed ax-body">{{ summary }}</p>
    </SectionHeader>

    <slot v-if="$slots.preview" name="preview" />

    <slot />

    <TechnicalDetails :label="technicalLabel ?? 'Reasoning & technical details'">
      <p v-if="compact" class="mb-6 max-w-3xl font-body-lg text-body-lg leading-relaxed ax-body">{{ summary }}</p>
      <ProposalInsightGrid :why="why" :decision="decision" :benefits="benefits" />
      <div v-if="$slots.technical" class="mt-6">
        <slot name="technical" />
      </div>
    </TechnicalDetails>
  </div>
</template>
