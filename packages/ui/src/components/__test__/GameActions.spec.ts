import { shallowMount, mount } from '@vue/test-utils'
import GameActions from '../GameActions.vue'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

describe('GameActions.vue', () => {
  describe('is GameOver', () => {
    it('Renders correctly the actions allowed', () => {
      const wrapper = shallowMount(GameActions, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: true,
                },
              },
              stubActions: false,
              createSpy: vi.fn,
            }),
          ],
        },
      })
      expect(expect(wrapper.find('#game-over-actions').exists()).toBe(true))
      expect(expect(wrapper.find('#game-actions').exists()).toBe(false))
    })
  })
  describe('NOT GameOver', () => {
    it('Renders correctly the actions allowed', () => {
      const wrapper = shallowMount(GameActions, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: false,
                },
              },
              stubActions: false,
              createSpy: vi.fn,
            }),
          ],
        },
      })
      expect(expect(wrapper.find('#game-over-actions').exists()).toBe(false))
      expect(expect(wrapper.find('#game-actions').exists()).toBe(true))
    })
    it('Renders enabled scan action', () => {
      const wrapper = mount(GameActions, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: false,
                },
                player: {
                  interactionOut: null,
                },
              },
              stubActions: false,
              createSpy: vi.fn,
            }),
          ],
        },
      })
      expect(expect(wrapper.find('#scan-action-text').exists()).toBe(true))
      expect(expect(wrapper.find('#disabled-scan-text').exists()).toBe(false))
    })
    it('Renders disabled scan action', () => {
      const wrapper = mount(GameActions, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                gameStore: {
                  gameOver: false,
                },
                player: {
                  interactionOut: {
                    ends: 1000,
                  },
                },
              },
              stubActions: false,
              createSpy: vi.fn,
            }),
          ],
        },
      })
      expect(expect(wrapper.find('#scan-action-text').exists()).toBe(false))
      expect(expect(wrapper.find('#disabled-scan-text').exists()).toBe(true))
    })
  })
})
