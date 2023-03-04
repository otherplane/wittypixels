import { shallowMount } from '@vue/test-utils'
import ModalFractionalizingInfo from '../modals/ModalFractionalizingInfo.vue'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import ModalHowToBuy from '../modals/ModalHowToBuy.vue'
import ModalAlreadyWithdrawn from '../modals/ModalAlreadyWithdrawn.vue'

describe('App.vue', () => {
  it('renders ModalFractionalizingInfo', () => {
    const wrapper = shallowMount(ModalFractionalizingInfo, {
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
                  alreadyWithdrawn: false,
                  fractionalizing: true,
                },
              },
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(expect(wrapper.find('#modal-title').text()).toBe('GG, witty fren!'))
  })

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
        'You just swapped your WPX for ETH'
      )
    )
  })
  // it('Renders correct elements for Transaction confirmed', () => {
  //   const wrapper = shallowMount(CreateTransaction, {
  //     props: {
  //       txType: TxType.Redeem,
  //     },
  //     global: {
  //       plugins: [
  //         createTestingPinia({
  //           initialState: {
  //             localStore: {
  //               txInfo: {
  //                 txType: TxType.Redeem,
  //                 txConfirmation: true,
  //               },
  //             },
  //           },
  //           stubActions: false,
  //           createSpy: vi.fn,
  //         }),
  //       ],
  //     },
  //   })
  //   expect(expect(wrapper.find('#transaction-button').exists()).toBe(false))
  //   expect(expect(wrapper.find('#marketplace-button').exists()).toBe(true))
  // })
  // it('Renders correct elements for Transaction externally confirmed', () => {
  //   const wrapper = shallowMount(CreateTransaction, {
  //     props: {
  //       txType: TxType.Redeem,
  //     },
  //     global: {
  //       plugins: [
  //         createTestingPinia({
  //           initialState: {
  //             localStore: {
  //               txInfo: {
  //                 txType: TxType.Redeem,
  //                 externalConfirmation: true,
  //               },
  //             },
  //           },
  //           stubActions: false,
  //           createSpy: vi.fn,
  //         }),
  //       ],
  //     },
  //   })
  //   expect(expect(wrapper.find('#transaction-button').exists()).toBe(false))
  //   expect(expect(wrapper.find('#marketplace-button').exists()).toBe(true))
  // })
  // it('Renders correct elements for Transaction in progress', () => {
  //   const wrapper = shallowMount(CreateTransaction, {
  //     props: {
  //       txType: TxType.Redeem,
  //     },
  //     global: {
  //       plugins: [
  //         createTestingPinia({
  //           initialState: {
  //             gameStore: {
  //               errors: {},
  //             },
  //             localStore: {
  //               txInfo: {
  //                 txType: TxType.Redeem,
  //                 txHash: 'txHash',
  //               },
  //             },
  //           },
  //           stubActions: false,
  //           createSpy: vi.fn,
  //         }),
  //       ],
  //     },
  //   })
  //   expect(expect(wrapper.find('#transaction-button').exists()).toBe(true))
  //   expect(expect(wrapper.find('#marketplace-button').exists()).toBe(false))
  // })
  // it('Renders correct elements for Transaction error', () => {
  //   const wrapper = shallowMount(CreateTransaction, {
  //     props: {
  //       txType: TxType.Redeem,
  //     },
  //     global: {
  //       plugins: [
  //         createTestingPinia({
  //           initialState: {
  //             gameStore: {
  //               errors: {
  //                 transaction: 'transaction error',
  //               },
  //             },
  //             localStore: {
  //               txInfo: {
  //                 txType: TxType.Redeem,
  //                 txHash: 'txHash',
  //               },
  //             },
  //           },
  //           stubActions: false,
  //           createSpy: vi.fn,
  //         }),
  //       ],
  //     },
  //   })
  //   expect(expect(wrapper.find('#transaction-button').exists()).toBe(true))
  //   expect(expect(wrapper.find('#marketplace-button').exists()).toBe(false))
  // })
})
