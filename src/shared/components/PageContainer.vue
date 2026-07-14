<!--
  PageContainer
  -------------
  Purpose:
    Consistent per-page content wrapper: centers content in the mobile
    app-shell width, applies the design system's container padding, and
    reserves room above/below for the fixed AppShell header and bottom
    navigation bar. Every page mounts its content inside this instead of
    re-declaring `max-w-*`/padding, keeping AppShell itself free of
    page-specific spacing decisions.

  Props:
    - width ('app' | 'wide', default 'app'): 'app' matches the mobile
      shell (448px), 'wide' lifts the cap for the future desktop dashboard.
    - gutter (boolean, default true): applies vertical spacing between
      direct children sections (matches the mockups' `space-y-gutter`).

  Slots:
    - default: page content.

  Usage:
    <PageContainer>
      <SectionHeader title="Hourly Forecast" />
      ...
    </PageContainer>
-->
<script setup lang="ts">
import { cn } from '@/shared/utils'

interface Props {
  width?: 'app' | 'wide'
  gutter?: boolean
}

const { width = 'app', gutter = true } = defineProps<Props>()

const widthClasses: Record<NonNullable<Props['width']>, string> = {
  app: 'max-w-app',
  wide: 'max-w-app-wide',
}
</script>

<template>
  <div
    :class="
      cn(
        'mx-auto w-full px-container-padding pt-container-padding pb-32',
        widthClasses[width],
        gutter && 'space-y-gutter',
      )
    "
  >
    <slot />
  </div>
</template>
