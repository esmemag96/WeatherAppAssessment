import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DecisionCard from './DecisionCard.vue'
import { decisionsContent } from '@/content/artifacts/decisions'

describe('DecisionCard', () => {
  it('expands to show tabbed decision details', async () => {
    const record = decisionsContent.records[0]!
    const wrapper = mount(DecisionCard, { props: { record } })

    expect(wrapper.text()).not.toContain('Alternatives')
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Context')
    expect(wrapper.text()).toContain(record.context)
  })
})
