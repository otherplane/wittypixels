import { mount } from '@vue/test-utils'
import ModalFractionalizingInfo from '../modals/ModalFractionalizingInfo.vue'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

describe('ModalFractionalizing.vue', () => {
  it('Renders ModalFractionalizingInfo', () => {
    const wrapper = mount(ModalFractionalizingInfo, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              localStore: {
                player: {
                  score: 1000,
                },
              },
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
      },
    })

    expect(wrapper.find('#modal-title').text()).toBe('GG, witty fren!')
  })
})
