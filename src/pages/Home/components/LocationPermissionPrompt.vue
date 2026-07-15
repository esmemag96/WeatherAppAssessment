<!--
  LocationPermissionPrompt
  -------------------------
  Purpose:
    Asks, once, whether to use the device's current location to load a
    forecast - shown on first landing on the dashboard when no location
    is otherwise known (see `useWeatherDashboard`). Composed entirely
    from the shared `Modal` + `Button` + `Icon`; owns no geolocation/
    store logic itself, only presentation + the allow/dismiss choice.

  Props:
    - open (boolean, required): controlled visibility.
    - loading (boolean, default false): disables dismissal and shows a
      spinner on the primary action while a position request is in flight.
    - errorMessage (string | null, optional): shown inline so the user
      can retry or fall back to search without the modal silently closing.

  Events:
    - allow: "Use My Location" pressed.
    - dismiss: "Not Now" pressed, or the modal was closed (backdrop/Escape).

  Usage:
    <LocationPermissionPrompt
      :open="showLocationPrompt"
      :loading="isLocating"
      :error-message="locationError"
      @allow="allowLocation"
      @dismiss="dismissLocationPrompt"
    />
-->
<script setup lang="ts">
import { Modal } from '@/shared/components'
import { Button, Icon } from '@/shared/ui'

interface Props {
  open: boolean
  loading?: boolean
  errorMessage?: string | null
}

const { loading = false } = defineProps<Props>()

defineEmits<{ allow: []; dismiss: [] }>()
</script>

<template>
  <Modal :open="open" title="Use your location?" :dismissible="!loading" @close="$emit('dismiss')">
    <div class="flex flex-col items-center gap-4 text-center">
      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Icon name="my_location" size="lg" class="text-primary" />
      </div>
      <p class="font-body-md text-body-md leading-snug text-on-surface-variant sm:font-body-lg sm:text-body-lg sm:leading-normal">
        See the forecast for where you are right now? Your browser will ask for permission - you can always search
        for a city instead.
      </p>
      <p v-if="errorMessage" class="font-body-md text-body-md text-error">{{ errorMessage }}</p>
    </div>

    <template #footer>
      <Button variant="ghost" :disabled="loading" @click="$emit('dismiss')">Not Now</Button>
      <Button variant="primary" :loading="loading" @click="$emit('allow')">
        <template #icon-left><Icon name="my_location" /></template>
        Use My Location
      </Button>
    </template>
  </Modal>
</template>
