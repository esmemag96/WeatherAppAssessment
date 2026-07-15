import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DecisionCard from './DecisionCard.vue'
import { decisionsContent } from '@/content/artifacts/decisions'

describe('DecisionCard', () => {
  it('shows proposal summary upfront and expands technical ADR tabs', async () => {
    const record = decisionsContent.records[0]!
    const wrapper = mount(DecisionCard, { props: { record } })

    expect(wrapper.text()).toContain('Why')
    expect(wrapper.text()).toContain(record.why)
    expect(wrapper.text()).toContain(record.decisionPlain)
    expect(wrapper.text()).not.toContain('Alternatives')

    await wrapper.get('[aria-expanded="false"]').trigger('click')
    expect(wrapper.text()).toContain('Context')
    expect(wrapper.text()).toContain(record.tabs.context)
  })
})
