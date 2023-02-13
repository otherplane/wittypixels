import { shallowMount } from '@vue/test-utils'
import CreateTransaction from '../CreateTransaction.vue'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { GameOverStatus, TxType } from '@/types'

describe('CreateTransaction.vue', () => {
  it('Renders create transaction component', () => {
    const wrapper = shallowMount(CreateTransaction, {
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
    expect(expect(wrapper.find('#create-transaction').exists()).toBe(true))
  })
  it('Renders correct elements for Transaction confirmed', () => {
    const wrapper = shallowMount(CreateTransaction, {
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
    expect(expect(wrapper.find('#transaction-hash').exists()).toBe(false))
    expect(expect(wrapper.find('#transaction-button').exists()).toBe(false))
    expect(expect(wrapper.find('#marketplace-button').exists()).toBe(true))
  })
  it('Renders correct elements for Transaction externally confirmed', () => {
    const wrapper = shallowMount(CreateTransaction, {
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
    expect(expect(wrapper.find('#transaction-hash').exists()).toBe(false))
    expect(expect(wrapper.find('#transaction-button').exists()).toBe(false))
    expect(expect(wrapper.find('#marketplace-button').exists()).toBe(true))
  })
  it('Renders correct elements for Transaction in progress', () => {
    const wrapper = shallowMount(CreateTransaction, {
      props: {
        txType: TxType.Redeem,
      },
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
    expect(expect(wrapper.find('#transaction-hash').exists()).toBe(true))
    expect(expect(wrapper.find('#transaction-button').exists()).toBe(true))
    expect(expect(wrapper.find('#marketplace-button').exists()).toBe(false))
  })
  it('Renders correct elements for Transaction error', () => {
    const wrapper = shallowMount(CreateTransaction, {
      props: {
        txType: TxType.Redeem,
      },
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
    expect(expect(wrapper.find('#transaction-hash').exists()).toBe(false))
    expect(expect(wrapper.find('#transaction-button').exists()).toBe(true))
    expect(expect(wrapper.find('#marketplace-button').exists()).toBe(false))
  })
})
