import { describe, expect, it } from 'vitest'

import { REVIEW_SECTIONS, STITCH_NAV_SECTIONS, resolveStitchNavSection } from '@/content/artifacts/review'

describe('engineering review content', () => {
  it('defines stitch sidebar navigation', () => {
    expect(STITCH_NAV_SECTIONS.map((s) => s.label)).toEqual([
      'Starting Point',
      'Audience',
      'Technical Direction',
      'Build Process',
    ])
  })

  it('defines all in-page section anchors', () => {
    expect(REVIEW_SECTIONS.length).toBeGreaterThan(STITCH_NAV_SECTIONS.length)
  })

  it('maps scroll sections to stitch nav groups', () => {
    expect(resolveStitchNavSection('uncertainty')).toBe('uncertainty')
    expect(resolveStitchNavSection('competitors')).toBe('audience')
    expect(resolveStitchNavSection('architecture')).toBe('architecture')
    expect(resolveStitchNavSection('deployment')).toBe('implementation')
  })
})
