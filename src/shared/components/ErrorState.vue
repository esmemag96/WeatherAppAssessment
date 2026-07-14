<!--
  ErrorState
  ----------
  Purpose:
    Full-page failure state (e.g. "Connection Lost" when the forecast
    request fails). Icon with soft glow, title/description, a primary
    retry action, an optional secondary action, and optional diagnostic
    chips for debugging context.

  Props:
    - title (string, required).
    - description (string, optional).
    - icon (string, default 'signal_disconnected').
    - retryLabel (string, default 'Retry').
    - secondaryLabel (string, optional): renders a secondary button when set.
    - diagnostics (string[], optional): short diagnostic codes rendered as
      pill badges (e.g. ["ERR_TIMEOUT_408", "NODE_US_EAST"]).
    - retrying (boolean, default false): shows a loading state on retry.

  Events:
    - retry: primary action pressed.
    - secondary: secondary action pressed.

  Usage:
    <ErrorState
      title="Connection Lost"
      description="Unable to retrieve weather data. Please check your connection."
      secondary-label="Offline Settings"
      :diagnostics="['ERR_TIMEOUT_408', 'NODE_US_EAST']"
      @retry="refetch"
    />
-->
<script setup lang="ts">
import Badge from '@/shared/ui/Badge.vue'
import Button from '@/shared/ui/Button.vue'
import Icon from '@/shared/ui/Icon.vue'

interface Props {
  title: string
  description?: string
  icon?: string
  retryLabel?: string
  secondaryLabel?: string
  diagnostics?: string[]
  retrying?: boolean
}

const { icon = 'signal_disconnected', retryLabel = 'Retry', retrying = false } = defineProps<Props>()

defineEmits<{ retry: []; secondary: [] }>()
</script>

<template>
  <div class="flex flex-col items-center px-container-padding py-16 text-center">
    <div class="relative mb-8">
      <div class="absolute inset-0 scale-150 rounded-full bg-tertiary/20 blur-3xl" />
      <div class="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border-subtle bg-surface-container-low/80 shadow-xl backdrop-blur-md">
        <Icon :name="icon" size="2xl" class="text-tertiary" :weight="200" />
      </div>
    </div>

    <div class="mb-10 space-y-4">
      <h2 class="font-headline-lg text-headline-lg text-on-surface">{{ title }}</h2>
      <p v-if="description" class="mx-auto max-w-[280px] font-body-lg text-body-lg text-on-surface-variant">
        {{ description }}
      </p>
    </div>

    <div class="w-full max-w-sm space-y-4">
      <Button variant="primary" size="lg" block :loading="retrying" @click="$emit('retry')">
        <template #icon-left><Icon name="refresh" /></template>
        {{ retryLabel }}
      </Button>
      <Button v-if="secondaryLabel" variant="ghost" size="lg" block @click="$emit('secondary')">
        {{ secondaryLabel }}
      </Button>
    </div>

    <div v-if="diagnostics?.length" class="mt-12 flex flex-wrap justify-center gap-2">
      <Badge v-for="code in diagnostics" :key="code" variant="neutral">{{ code }}</Badge>
    </div>
  </div>
</template>
