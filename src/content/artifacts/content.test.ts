import { describe, expect, it } from 'vitest'

import { REVIEW_SECTIONS } from '@/content/artifacts/review'

describe('engineering review content', () => {
  it('defines all required navigation sections', () => {
    const labels = REVIEW_SECTIONS.map((s) => s.label)
    expect(labels).toEqual([
      'Summary',
      'Uncertainty',
      'Research',
      'Decisions',
      'Architecture',
      'Delivery',
      'Quality',
      'Trade-offs',
      'AI',
      'Review',
    ])
  })

  it('has unique section ids', () => {
    const ids = REVIEW_SECTIONS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('includes ai collaboration section', () => {
    expect(REVIEW_SECTIONS.some((s) => s.id === 'ai-collaboration')).toBe(true)
  })
})
