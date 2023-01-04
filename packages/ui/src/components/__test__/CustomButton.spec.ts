import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import CustomButton from '../CustomButton.vue'

describe('CustomButton', () => {
  it('renders properly', () => {
    const wrapper = mount(CustomButton, {
      slots: { default: 'Default Button' },
    })

    expect(wrapper.text()).toContain('Default Button')
  })
})
