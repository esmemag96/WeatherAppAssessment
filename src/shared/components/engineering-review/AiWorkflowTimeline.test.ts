import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { AiWorkflowStageData } from '@/content/artifacts/types'
import AiWorkflowTimeline from './AiWorkflowTimeline.vue'

const stages: AiWorkflowStageData[] = [
  {
    id: 'discovery',
    label: 'Discovery',
    aiContribution: ['Generated discovery questions'],
    engineerResponsibility: ['Defined project scope'],
  },
  {
    id: 'research',
    label: 'Research',
    aiContribution: ['Summarized competitors'],
    engineerResponsibility: ['Evaluated trade-offs'],
  },
]

describe('AiWorkflowTimeline', () => {
  it('reveals AI and engineer details when a stage is selected', async () => {
    const wrapper = mount(AiWorkflowTimeline, {
      props: { stages, activeId: 'discovery' },
    })

    expect(wrapper.text()).toContain('Generated discovery questions')
    expect(wrapper.text()).toContain('Defined project scope')

    const researchButton = wrapper.findAll('button').find((b) => b.text().includes('Research'))
    await researchButton!.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual(['research'])
  })
})
