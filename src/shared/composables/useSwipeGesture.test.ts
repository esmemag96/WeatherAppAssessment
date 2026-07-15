import { describe, expect, it, vi } from 'vitest'

import { useSwipeGesture } from './useSwipeGesture'

/**
 * jsdom doesn't implement the `PointerEvent` constructor, so this builds
 * a minimal stand-in exposing only what `useSwipeGesture` reads
 * (`clientX`/`clientY`/`pointerType`/`button`/`target`) plus a no-op
 * `preventDefault`.
 */
function pointerEvent(clientX: number, clientY = 0, target: Element | null = null): PointerEvent {
  return {
    clientX,
    clientY,
    pointerType: 'touch',
    button: 0,
    target,
    preventDefault: () => {},
  } as unknown as PointerEvent
}

describe('useSwipeGesture', () => {
  it('calls onSwipeLeft when the horizontal drag exceeds the threshold to the left', () => {
    const onSwipeLeft = vi.fn()
    const gesture = useSwipeGesture({ onSwipeLeft, thresholdPx: 50 })

    gesture.onPointerDown(pointerEvent(200))
    gesture.onPointerMove(pointerEvent(130))
    gesture.onPointerUp(pointerEvent(120))

    expect(onSwipeLeft).toHaveBeenCalledTimes(1)
  })

  it('calls onSwipeRight when the horizontal drag exceeds the threshold to the right', () => {
    const onSwipeRight = vi.fn()
    const gesture = useSwipeGesture({ onSwipeRight, thresholdPx: 50 })

    gesture.onPointerDown(pointerEvent(100))
    gesture.onPointerMove(pointerEvent(170))
    gesture.onPointerUp(pointerEvent(180))

    expect(onSwipeRight).toHaveBeenCalledTimes(1)
  })

  it('does not fire a swipe callback when the drag stays under the threshold', () => {
    const onSwipeLeft = vi.fn()
    const onSwipeRight = vi.fn()
    const gesture = useSwipeGesture({ onSwipeLeft, onSwipeRight, thresholdPx: 50 })

    gesture.onPointerDown(pointerEvent(100))
    gesture.onPointerMove(pointerEvent(120))
    gesture.onPointerUp(pointerEvent(125))

    expect(onSwipeLeft).not.toHaveBeenCalled()
    expect(onSwipeRight).not.toHaveBeenCalled()
  })

  it('treats a predominantly vertical drag as a scroll and ignores it, even past the horizontal threshold', () => {
    const onSwipeLeft = vi.fn()
    const gesture = useSwipeGesture({ onSwipeLeft, thresholdPx: 50 })

    gesture.onPointerDown(pointerEvent(200, 100))
    gesture.onPointerMove(pointerEvent(130, 250))
    gesture.onPointerUp(pointerEvent(120, 260))

    expect(onSwipeLeft).not.toHaveBeenCalled()
  })

  it('resets tracking state on pointer cancel so a stray pointerup does not trigger a swipe', () => {
    const onSwipeLeft = vi.fn()
    const gesture = useSwipeGesture({ onSwipeLeft, thresholdPx: 50 })

    gesture.onPointerDown(pointerEvent(200))
    gesture.onPointerMove(pointerEvent(130))
    gesture.onPointerCancel()
    gesture.onPointerUp(pointerEvent(100))

    expect(onSwipeLeft).not.toHaveBeenCalled()
  })

  it('ignores a gesture that starts inside an element matching ignoreSelector', () => {
    const onSwipeLeft = vi.fn()
    const gesture = useSwipeGesture({ onSwipeLeft, thresholdPx: 50, ignoreSelector: '[data-swipe-ignore]' })

    const container = document.createElement('div')
    container.setAttribute('data-swipe-ignore', '')
    document.body.appendChild(container)

    gesture.onPointerDown(pointerEvent(200, 0, container))
    gesture.onPointerMove(pointerEvent(130))
    gesture.onPointerUp(pointerEvent(120))

    expect(onSwipeLeft).not.toHaveBeenCalled()
    container.remove()
  })

  it('tracks dragOffsetPx live while a horizontal swipe is in progress, and resets it after release', () => {
    const gesture = useSwipeGesture({ thresholdPx: 50 })

    gesture.onPointerDown(pointerEvent(200))
    gesture.onPointerMove(pointerEvent(150))
    expect(gesture.dragOffsetPx.value).toBe(-50)

    gesture.onPointerUp(pointerEvent(150))
    expect(gesture.dragOffsetPx.value).toBe(0)
  })
})
