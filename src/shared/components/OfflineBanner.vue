<!--
  OfflineBanner
  -------------
  Purpose:
    Slim, persistent banner surfaced above page content to signal a
    degraded/offline state without taking over the whole screen (lighter
    weight than ErrorState). Controlled by a boolean prop - detecting
    actual connectivity is a feature/composable concern, not this
    component's job.

  Props:
    - visible (boolean, required).
    - message (string, default "You're offline. Data already loaded this session may still be available.").
    - icon (string, default 'cloud_off').
    - retryLabel (string, optional): renders an inline retry action.

  Events:
    - retry: retry action pressed.

  Usage:
    <OfflineBanner :visible="isOffline" retry-label="Retry" @retry="refetch" />
-->
<script setup lang="ts">
import Icon from '@/shared/ui/Icon.vue'

interface Props {
  visible: boolean
  message?: string
  icon?: string
  retryLabel?: string
}

const {
  message = "You're offline. Data already loaded this session may still be available.",
  icon = 'cloud_off',
} = defineProps<Props>()

defineEmits<{ retry: [] }>()
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-swift"
    leave-active-class="transition-all duration-200 ease-swift"
    enter-from-class="-translate-y-2 opacity-0"
    leave-to-class="-translate-y-2 opacity-0"
  >
    <div
      v-if="visible"
      role="status"
      class="flex items-center gap-3 rounded-xl border border-tertiary/20 bg-tertiary/10 px-4 py-3 text-tertiary"
    >
      <Icon :name="icon" size="sm" />
      <p class="flex-1 font-body-md text-body-md">{{ message }}</p>
      <button
        v-if="retryLabel"
        type="button"
        class="font-label-caps text-label-caps uppercase underline-offset-2 hover:underline"
        @click="$emit('retry')"
      >
        {{ retryLabel }}
      </button>
    </div>
  </Transition>
</template>
