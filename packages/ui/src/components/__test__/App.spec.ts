import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import ModalHowToBuy from '../modals/ModalHowToBuy.vue'
import ModalAlreadyWithdrawn from '../modals/ModalAlreadyWithdrawn.vue'

describe('App.vue', () => {
  it('renders ModalHowToBuy', () => {
    const wrapper = shallowMount(ModalHowToBuy, {
      props: {},
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              modalStore: {
                modals: {
                  buyInfo: true,
                  export: false,
                  preview: false,
                  gameOver: false,
                  redeem: false,
                  txConfirmation: false,
                  txError: false,
                  alreadyWithdrawn: false,
                  fractionalizing: false,
                },
              },
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(
      expect(wrapper.find('#modal-title').text()).toBe(
        'How to buy the 1-of-1 canvas NFT'
      )
    )
  })

  it('renders ModalAlreadyWithdrawn', () => {
    const wrapper = shallowMount(ModalAlreadyWithdrawn, {
      props: {},
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              modalStore: {
                modals: {
                  buyInfo: false,
                  export: false,
                  preview: false,
                  gameOver: false,
                  redeem: false,
                  txConfirmation: false,
                  txError: false,
                  alreadyWithdrawn: true,
                  fractionalizing: false,
                },
              },
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(
      expect(wrapper.find('#modal-title').text()).toBe(
        'You just swapped your $WPX for $ETH'
      )
    )
  })
})
