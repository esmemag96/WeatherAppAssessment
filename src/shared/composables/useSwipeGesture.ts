/**
 * Minimal horizontal swipe-gesture detector, built on Pointer Events -
 * the same event family `useFavoritesPage`'s reorder-drag already uses,
 * so this follows an established codebase convention instead of adding
 * a new gesture-library dependency for a single interaction.
 *
 * Vertical intent (page scroll) is detected and left alone: only once a
 * move is clearly more horizontal than vertical does it call
 * `preventDefault` and start tracking a swipe, so this can be bound
 * directly on a page's main content without breaking scroll.
 */
import { type Ref, ref } from 'vue'

export interface UseSwipeGestureOptions {
  /** Minimum horizontal distance (px) to count as a swipe rather than a tap. Default 60. */
  thresholdPx?: number
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  /**
   * CSS selector for nested regions that own their own horizontal
   * scrolling (e.g. the hourly forecast strip) - a gesture starting
   * inside one of these is ignored entirely, so it never fights the
   * element's native scroll for the same pointer drag.
   */
  ignoreSelector?: string
}

export interface UseSwipeGesture {
  /** 0 while idle, otherwise the current horizontal drag offset in px - usable for a live drag-following transform. */
  dragOffsetPx: Ref<number>
  onPointerDown(event: PointerEvent): void
  onPointerMove(event: PointerEvent): void
  onPointerUp(event: PointerEvent): void
  onPointerCancel(): void
}

const DIRECTION_LOCK_THRESHOLD_PX = 10

export function useSwipeGesture(options: UseSwipeGestureOptions = {}): UseSwipeGesture {
  const { thresholdPx = 60, ignoreSelector } = options

  const dragOffsetPx = ref(0)
  let startX = 0
  let startY = 0
  let tracking = false
  /** null = direction not yet decided, true = horizontal swipe, false = vertical scroll (ignore for the rest of this gesture). */
  let isHorizontal: boolean | null = null

  function onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (ignoreSelector && (event.target as Element | null)?.closest(ignoreSelector)) return

    startX = event.clientX
    startY = event.clientY
    tracking = true
    isHorizontal = null
    dragOffsetPx.value = 0
  }

  function onPointerMove(event: PointerEvent): void {
    if (!tracking) return

    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY

    if (isHorizontal === null) {
      if (Math.abs(deltaX) < DIRECTION_LOCK_THRESHOLD_PX && Math.abs(deltaY) < DIRECTION_LOCK_THRESHOLD_PX) return
      isHorizontal = Math.abs(deltaX) > Math.abs(deltaY)
      if (!isHorizontal) {
        tracking = false
        return
      }
    }

    event.preventDefault()
    dragOffsetPx.value = deltaX
  }

  function reset(): void {
    tracking = false
    isHorizontal = null
    dragOffsetPx.value = 0
  }

  function onPointerUp(event: PointerEvent): void {
    if (!tracking || !isHorizontal) {
      reset()
      return
    }

    const deltaX = event.clientX - startX
    reset()

    if (deltaX <= -thresholdPx) options.onSwipeLeft?.()
    else if (deltaX >= thresholdPx) options.onSwipeRight?.()
  }

  return { dragOffsetPx, onPointerDown, onPointerMove, onPointerUp, onPointerCancel: reset }
}
