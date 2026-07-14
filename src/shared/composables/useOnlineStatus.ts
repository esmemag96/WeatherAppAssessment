import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Wraps the browser's connectivity events behind a small reactive
 * composable so components never touch `navigator.onLine` /
 * `window.addEventListener` directly - mirrors `useDarkMode`. Feeds
 * `OfflineBanner`'s `visible` prop; detecting connectivity is this
 * composable's job, deciding what "offline" should look like is the
 * design system component's.
 */
export function useOnlineStatus() {
  const isOffline = ref(typeof navigator === 'undefined' ? false : !navigator.onLine)

  function handleOnline(): void {
    isOffline.value = false
  }

  function handleOffline(): void {
    isOffline.value = true
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })

  return { isOffline }
}
