import { shallowMount } from '@vue/test-utils'
import GameOverStatus from '../GameOverStatus.vue'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { GameOverStatus as GameOverStatusEnum } from '@/types'

describe('GameOverStatus.vue', () => {
  describe('NO Game over status saved', () => {
    it('DO NOT Render game over status compo', () => {
      const wrapper = shallowMount(GameOverStatus, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: true,
                  redeemCountdownOver: false,
                  gameOverStatus: null,
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
      expect(expect(wrapper.find('#game-over-status').exists()).toBe(false))
    })
  })
  describe('Game over status saved', () => {
    it('Render correctly AWAIT AUCTION info', () => {
      const wrapper = shallowMount(GameOverStatus, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: true,
                  redeemCountdownOver: true,
                  gameOverStatus: GameOverStatusEnum.AwaitSale,
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
      expect(expect(wrapper.find('#awaiting-auction').exists()).toBe(true))
      expect(expect(wrapper.find('#auction-started').exists()).toBe(false))
      expect(expect(wrapper.find('#nft-sold').exists()).toBe(false))
      expect(expect(wrapper.find('#default-status').exists()).toBe(false))
    })
    it('Render correctly AUCTION PRICE info', () => {
      const wrapper = shallowMount(GameOverStatus, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: true,
                  redeemCountdownOver: true,
                  gameOverStatus: GameOverStatusEnum.AllowSale,
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
      expect(expect(wrapper.find('#awaiting-auction').exists()).toBe(false))
      expect(expect(wrapper.find('#auction-started').exists()).toBe(true))
      expect(expect(wrapper.find('#nft-sold').exists()).toBe(false))
      expect(expect(wrapper.find('#default-status').exists()).toBe(false))
    })
    it('Render correctly NFT SOLD info Render correctly NFT SOLD info when status is ACQUIRED', () => {
      const wrapper = shallowMount(GameOverStatus, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: true,
                  redeemCountdownOver: true,
                  gameOverStatus: GameOverStatusEnum.Acquired,
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
      expect(expect(wrapper.find('#awaiting-auction').exists()).toBe(false))
      expect(expect(wrapper.find('#auction-started').exists()).toBe(false))
      // expect(expect(wrapper.find('#nft-sold').exists()).toBe(true))
      // expect(expect(wrapper.find('#default-status').exists()).toBe(false))
    })
    it('Render correctly NFT SOLD info when status is ALLOW WITHDRAWN', () => {
      const wrapper = shallowMount(GameOverStatus, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: true,
                  redeemCountdownOver: true,
                  gameOverStatus: GameOverStatusEnum.AllowWithdraw,
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
      expect(expect(wrapper.find('#awaiting-auction').exists()).toBe(false))
      expect(expect(wrapper.find('#auction-started').exists()).toBe(false))
      // expect(expect(wrapper.find('#nft-sold').exists()).toBe(true))
      // expect(expect(wrapper.find('#default-status').exists()).toBe(false))
    })
    it('Render correctly NFT SOLD info when status is ALREADY WITHDRAWN', () => {
      const wrapper = shallowMount(GameOverStatus, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: true,
                  redeemCountdownOver: true,
                  gameOverStatus: GameOverStatusEnum.AlreadyWithdrawn,
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
      expect(expect(wrapper.find('#awaiting-auction').exists()).toBe(false))
      expect(expect(wrapper.find('#auction-started').exists()).toBe(false))
      // expect(expect(wrapper.find('#nft-sold').exists()).toBe(true))
      // expect(expect(wrapper.find('#default-status').exists()).toBe(false))
    })
    it('Render correctly DEFAULT STATUS info', () => {
      const wrapper = shallowMount(GameOverStatus, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: true,
                  redeemCountdownOver: true,
                  gameOverStatus: GameOverStatusEnum.Fractionalizing,
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
      expect(expect(wrapper.find('#awaiting-auction').exists()).toBe(false))
      expect(expect(wrapper.find('#auction-started').exists()).toBe(false))
      expect(expect(wrapper.find('#nft-sold').exists()).toBe(false))
      expect(expect(wrapper.find('#default-status').exists()).toBe(true))
    })
  })
})
