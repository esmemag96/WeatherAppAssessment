<!--
  PageHeader
  ----------
  Purpose:
    Large page-level title block used at the top of a page's content (e.g.
    "Favorites" / "Manage your tracked global destinations."). Distinct
    from AppShell's persistent app bar - this scrolls with the page.

  Props:
    - title (string, required).
    - subtitle (string, optional).

  Slots:
    - actions: optional trailing content aligned with the title (a button,
      badge, etc.).

  Usage:
    <PageHeader title="Favorites" subtitle="Manage your tracked global destinations." />
-->
<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <header class="flex items-start justify-between gap-4">
    <div>
      <h1 class="font-headline-lg text-headline-lg text-on-surface">{{ title }}</h1>
      <p v-if="subtitle" class="mt-1 text-body-md text-on-surface-variant">{{ subtitle }}</p>
    </div>
    <slot name="actions" />
  </header>
</template>
