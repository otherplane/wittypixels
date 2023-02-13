import { shallowMount } from '@vue/test-utils'
import GameOverActions from '../GameOverActions.vue'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { GameOverStatus, TxType } from '@/types'

describe('GameOverActions.vue', () => {
  describe('Redeeem countdown running', () => {
    it('Renders correctly the actions allowed', () => {
      const wrapper = shallowMount(GameOverActions, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: true,
                  redeemCountdownOver: false,
                  gameOverStatus: GameOverStatus.Fractionalizing,
                  errors: {
                    web3WrongNetwork: false,
                  },
                },
                localStore: {
                  txInfo: null,
                },
              },
              stubActions: false,
              createSpy: vi.fn,
            }),
          ],
        },
      })
      expect(expect(wrapper.find('#allowing-redeem').exists()).toBe(true))
      expect(expect(wrapper.find('#connect-to-provider').exists()).toBe(false))
      expect(expect(wrapper.find('#transaction-action').exists()).toBe(false))
    })
  })
  describe('Redeeem countdown over', () => {
    it('GameOverStatus: Fractionalizing but redeem countdown is over', () => {
      const wrapper = shallowMount(GameOverActions, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: true,
                  redeemCountdownOver: true,
                  gameOverStatus: GameOverStatus.Fractionalizing,
                  errors: {
                    web3WrongNetwork: false,
                  },
                },
                localStore: {
                  txInfo: null,
                },
              },
              stubActions: false,
              createSpy: vi.fn,
            }),
          ],
        },
      })
      expect(expect(wrapper.find('#allowing-redeem').exists()).toBe(true))
      expect(expect(wrapper.find('#connect-to-provider').exists()).toBe(true))
      expect(expect(wrapper.find('#transaction-action').exists()).toBe(false))
    })
    it('GameOverStatus: AllowRedeem and txType Redeem is saved', () => {
      const wrapper = shallowMount(GameOverActions, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: true,
                  redeemCountdownOver: true,
                  gameOverStatus: GameOverStatus.AllowRedeem,
                  errors: {
                    web3WrongNetwork: false,
                  },
                },
                localStore: {
                  txInfo: { txType: TxType.Redeem },
                },
              },
              stubActions: false,
              createSpy: vi.fn,
            }),
          ],
        },
      })
      expect(expect(wrapper.find('#allowing-redeem').exists()).toBe(false))
      expect(expect(wrapper.find('#connect-to-provider').exists()).toBe(true))
      expect(expect(wrapper.find('#transaction-action').exists()).toBe(true))
    })
  })
})
