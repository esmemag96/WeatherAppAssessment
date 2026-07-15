/**
 * Deterministic particle layout generator for `WeatherAnimationOverlay`.
 * Kept as a pure function (seeded PRNG instead of `Math.random`) so the
 * decorative rain/snow/cloud positions are unit-testable and stable
 * across re-renders of the same particle count - only the CSS
 * `@keyframes` driving each particle need to differ per weather visual,
 * not the layout math itself.
 */
export interface WeatherParticle {
  id: number
  /** Horizontal position within the container, 0-100. */
  leftPercent: number
  /** Negative animation-delay so particles are already mid-flight on mount, not all starting in sync. */
  delaySeconds: number
  durationSeconds: number
  /** Relative size multiplier, 0.6-1.4, for subtle depth variation. */
  scale: number

  driftPx: number
}

/** mulberry32 - tiny, deterministic, good-enough distribution for decorative use (not cryptography). */
function seededRandom(seed: number): () => number {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface WeatherParticleRanges {
  durationSeconds: [number, number]
  driftPx: [number, number]
}

function between(random: () => number, [min, max]: [number, number]): number {
  return min + random() * (max - min)
}

export function buildWeatherParticles(count: number, ranges: WeatherParticleRanges, seed = 1): WeatherParticle[] {
  const random = seededRandom(seed)

  return Array.from({ length: count }, (_, id) => ({
    id,
    leftPercent: Math.round(between(random, [0, 100]) * 10) / 10,
    delaySeconds: Math.round(between(random, [0, ranges.durationSeconds[1]]) * -10) / 10,
    durationSeconds: Math.round(between(random, ranges.durationSeconds) * 10) / 10,
    scale: Math.round(between(random, [0.6, 1.4]) * 100) / 100,
    driftPx: Math.round(between(random, ranges.driftPx)),
  }))
}
