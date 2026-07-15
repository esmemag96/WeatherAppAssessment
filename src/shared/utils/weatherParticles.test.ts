import { describe, expect, it } from 'vitest'

import { buildWeatherParticles } from './weatherParticles'

const RANGES = { durationSeconds: [2, 5] as [number, number], driftPx: [-10, 10] as [number, number] }

describe('buildWeatherParticles', () => {
  it('returns exactly `count` particles with sequential ids', () => {
    const particles = buildWeatherParticles(5, RANGES)
    expect(particles).toHaveLength(5)
    expect(particles.map((p) => p.id)).toEqual([0, 1, 2, 3, 4])
  })

  it('keeps every value within its expected range', () => {
    const particles = buildWeatherParticles(20, RANGES)
    for (const particle of particles) {
      expect(particle.leftPercent).toBeGreaterThanOrEqual(0)
      expect(particle.leftPercent).toBeLessThanOrEqual(100)
      expect(particle.durationSeconds).toBeGreaterThanOrEqual(2)
      expect(particle.durationSeconds).toBeLessThanOrEqual(5)
      expect(particle.driftPx).toBeGreaterThanOrEqual(-10)
      expect(particle.driftPx).toBeLessThanOrEqual(10)
      expect(particle.scale).toBeGreaterThanOrEqual(0.6)
      expect(particle.scale).toBeLessThanOrEqual(1.4)
      expect(particle.delaySeconds).toBeLessThanOrEqual(0)
    }
  })

  it('is deterministic for a given seed - same seed produces the same layout', () => {
    const a = buildWeatherParticles(8, RANGES, 42)
    const b = buildWeatherParticles(8, RANGES, 42)
    expect(a).toEqual(b)
  })

  it('produces a different layout for a different seed', () => {
    const a = buildWeatherParticles(8, RANGES, 1)
    const b = buildWeatherParticles(8, RANGES, 2)
    expect(a).not.toEqual(b)
  })

  it('returns an empty array for a count of 0', () => {
    expect(buildWeatherParticles(0, RANGES)).toEqual([])
  })
})
