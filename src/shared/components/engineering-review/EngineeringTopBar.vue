<script setup lang="ts">
defineProps<{
  breadcrumb: string
  authorInitial: string
  isDark: boolean
}>()

const emit = defineEmits<{
  toggleTheme: []
}>()
</script>

<template>
  <header class="er-topbar">
    <div class="flex min-w-0 items-center gap-3">
      <span class="hidden text-sm font-bold ax-faint md:inline">/</span>
      <span class="truncate font-title-lg text-title-lg er-text-primary">{{ breadcrumb }}</span>
    </div>

    <div class="flex shrink-0 items-center gap-1 sm:gap-2">
      <button
        type="button"
        class="er-topbar-icon ax-focus"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="emit('toggleTheme')"
      >
        <span class="material-symbols-outlined text-xl" aria-hidden="true">{{
          isDark ? 'light_mode' : 'dark_mode'
        }}</span>
      </button>
      <div class="er-topbar-avatar hidden h-8 w-8 items-center justify-center rounded-full text-xs font-bold sm:flex">
        {{ authorInitial }}
      </div>
    </div>
  </header>
</template>
