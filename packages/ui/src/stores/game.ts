import { defineStore } from 'pinia'
import { ApiService } from '@/api'
import { useLocalStore } from './local'
import { isMainnetTime } from '@/utils'
import type { TokenStatus, GameOverErrors, GameOverErrorKey } from '@/types'
import { TIME_TO_REDEEM_MILLISECONDS, GAME_ENDS_TIMESTAMP } from '../constants'

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    api: new ApiService(),
    localStore: useLocalStore(),
    gameOverTimeMilli: GAME_ENDS_TIMESTAMP,
    timeToRedeemInMilli: GAME_ENDS_TIMESTAMP + TIME_TO_REDEEM_MILLISECONDS,
    gameOver: false as boolean,
    redeemAllow: false as boolean,
    tokenStatus: 'Minting' as TokenStatus | null,
    mintParams: null,
    tokenIds: null,
    errors: {} as GameOverErrors,
  }),
  getters: {
    isGameOver(): boolean {
      //FIXME: make it reactive
      return this.gameOverTimeMilli < Date.now()
    },
    isMainnetTime() {
      return isMainnetTime()
    },
  },
  actions: {
    // Web3
    // TODO: get minted nft
    async getMintedAwardsImages() {
      // To Be Implemented
    },
    // TODO: get preview
    async getPreviews() {
      // To Be Implemented
    },
    async getContractArgs(address: string) {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.getContractArgs({
        address,
        token: tokenInfo.token,
      })

      return request
    },
    notify(payload: any) {
      const app = (this as any).app
      app.config.globalProperties.$notify(payload)
    },
    setError(name: GameOverErrorKey, error: any) {
      this.errors[name] = error.response?.data?.message || error.toString()
      this.notify({ message: this.errors[name] })
    },
    clearError(error: GameOverErrorKey) {
      this.errors[error] = null
    },
  },
})
