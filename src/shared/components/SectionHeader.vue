<!--
  SectionHeader
  -------------
  Purpose:
    Smaller heading for a content section within a page, optionally paired
    with a trailing link/action (e.g. "Hourly Forecast" + "Full Report",
    or "Recent Searches" + "Clear All").

  Props:
    - title (string, required).
    - uppercase (boolean, default false): renders the compact
      `label-caps` treatment used for dense module headers ("UNITS & DATA",
      "ATMOSPHERIC DISTRIBUTION") instead of the default `title-lg` style.

  Slots:
    - action: trailing interactive content (button/link).
    - icon: optional leading icon.

  Usage:
    <SectionHeader title="Hourly Forecast">
      <template #action>
        <button class="text-primary">Full Report</button>
      </template>
    </SectionHeader>

    <SectionHeader title="Units & Data" uppercase />
-->
<script setup lang="ts">
interface Props {
  title: string
  uppercase?: boolean
}

const { title, uppercase = false } = defineProps<Props>()
</script>

<template>
  <div class="flex items-center justify-between gap-4 px-1">
    <h2
      v-if="uppercase"
      class="font-label-caps text-label-caps text-primary dark:text-secondary-fixed uppercase tracking-widest"
    >
      <slot name="icon" />
      {{ title }}
    </h2>
    <h2 v-else class="flex items-center gap-2 font-title-lg text-title-lg text-on-surface">
      <slot name="icon" />
      {{ title }}
    </h2>
    <slot name="action" />
  </div>
</template>
