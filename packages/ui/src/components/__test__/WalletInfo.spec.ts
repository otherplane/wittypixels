import { shallowMount } from '@vue/test-utils'
import WalletInfo from '../WalletInfo.vue'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { TxType, GameOverStatus } from '@/types'

describe('WalletInfo.vue', () => {
  it('Renders wallet info when redeem countdown is over', () => {
    const wrapper = shallowMount(WalletInfo, {
      props: {
        txType: TxType.Redeem,
      },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              localStore: {
                txInfo: {
                  txType: TxType.Redeem,
                },
              },
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(expect(wrapper.find('#wallet-info').exists()).toBe(true))
  })
  it('Does not render wallet info when redeem countdown is not over', () => {
    const wrapper = shallowMount(WalletInfo, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              localStore: {
                txInfo: {
                  txType: TxType.Redeem,
                  txConfirmation: true,
                },
              },
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(expect(wrapper.find('#wallet-info').exists()).toBe(false))
  })
  it('Renders wallet connected network and address when redeem countdown over', () => {
    const wrapper = shallowMount(WalletInfo, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              localStore: {
                txInfo: {
                  txType: TxType.Redeem,
                  externalConfirmation: true,
                },
              },
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(expect(wrapper.find('#connected-provider').exists()).toBe(true))
    expect(expect(wrapper.find('#wallet-address').exists()).toBe(true))
  })
  it('Renders transaction hash when transaction in progress', () => {
    const wrapper = shallowMount(WalletInfo, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              gameStore: {
                errors: {},
              },
              localStore: {
                txInfo: {
                  txType: TxType.Redeem,
                  txHash: 'txHash',
                },
              },
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(expect(wrapper.find('#tx-hash').exists()).toBe(true))
  })
  it('Does not render tx hash when no txHash saved', () => {
    const wrapper = shallowMount(WalletInfo, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              gameStore: {
                errors: {
                  transaction: 'transaction error',
                },
              },
              localStore: {
                txInfo: {
                  txType: TxType.Redeem,
                },
              },
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(expect(wrapper.find('#tx-hash').exists()).toBe(false))
  })
  it('AwaitSale', () => {
    const wrapper = shallowMount(WalletInfo, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              gameStore: {
                gameOverStatus: GameOverStatus.AwaitSale,
              },
              localStore: {
                txInfo: {
                  txType: TxType.Redeem,
                },
              },
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(expect(wrapper.find('#redeem-complete-info').exists()).toBe(true))
    expect(expect(wrapper.find('#withdraw-info').exists()).toBe(false))
  })
  it('AllowSale', () => {
    const wrapper = shallowMount(WalletInfo, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              gameStore: {
                gameOverStatus: GameOverStatus.AllowSale,
              },
              localStore: {
                txInfo: {
                  txType: TxType.Buy,
                  txHash: 'txHash',
                },
              },
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(expect(wrapper.find('#redeem-complete-info').exists()).toBe(true))
    expect(expect(wrapper.find('#withdraw-info').exists()).toBe(false))
  })
  it('AllowWithdraw', () => {
    const wrapper = shallowMount(WalletInfo, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              gameStore: {
                gameOverStatus: GameOverStatus.AllowWithdraw,
              },
              localStore: {
                txInfo: {
                  txType: TxType.Withdraw,
                },
              },
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(expect(wrapper.find('#redeem-complete-info').exists()).toBe(false))
    expect(expect(wrapper.find('#withdraw-info').exists()).toBe(true))
  })
  it('AlreadyWithdrawn', () => {
    const wrapper = shallowMount(WalletInfo, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              gameStore: {
                gameOverStatus: GameOverStatus.AlreadyWithdrawn,
              },
              localStore: {
                txInfo: {
                  txType: TxType.Withdraw,
                  txHash: 'txHash',
                },
              },
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(expect(wrapper.find('#withdraw-info').exists()).toBe(false))
    expect(expect(wrapper.find('#redeem-complete-info').exists()).toBe(false))
    expect(expect(wrapper.find('#tx-hash').exists()).toBe(true))
  })
})
