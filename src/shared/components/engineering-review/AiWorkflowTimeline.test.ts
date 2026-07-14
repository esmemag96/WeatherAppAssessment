import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AiWorkflowTimeline from './AiWorkflowTimeline.vue'
import { aiCollaborationContent } from '@/content/artifacts/ai-collaboration'

describe('AiWorkflowTimeline', () => {
  it('reveals AI and engineer cards when a stage is selected', async () => {
    const stages = aiCollaborationContent.workflow.stages
    const wrapper = mount(AiWorkflowTimeline, {
      props: { stages, activeId: 'discovery' },
    })

    expect(wrapper.text()).toContain('Generated discovery questions')
    expect(wrapper.text()).toContain('Defined project scope')

    const researchButton = wrapper.findAll('button').find((b) => b.text() === 'Research')
    await researchButton!.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual(['research'])
  })
})
