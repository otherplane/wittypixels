import { mount } from '@vue/test-utils'
import ModalHowToBuy from '../modals/ModalHowToBuy.vue'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

describe('ModalHowToBuy.vue', () => {
  it('Renders ModalHowToBuy', () => {
    const wrapper = mount(ModalHowToBuy, {
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

    expect(wrapper.find('#modal-title').text()).toBe(
      'How to buy the 1-of-1 canvas NFT'
    )
  })
})
