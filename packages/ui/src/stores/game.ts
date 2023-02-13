import { defineStore } from 'pinia'
import { ApiService } from '@/api'
import { useLocalStore } from './local'
import { isMainnetTime } from '@/utils'
import {
  TokenStatus,
  type Errors,
  GameOverErrorKey,
  type Provider,
  TxType,
  TransactionStatus,
  GameOverStatus,
} from '@/types'
import { TIME_TO_REDEEM_MILLISECONDS, GAME_ENDS_TIMESTAMP } from '../constants'

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    api: new ApiService(),
    localStore: useLocalStore(),
    gameOverTimeMilli: GAME_ENDS_TIMESTAMP,
    timeToRedeemInMilli: GAME_ENDS_TIMESTAMP + TIME_TO_REDEEM_MILLISECONDS,
    gameOver: false as boolean,
    redeemCountdownOver: false as boolean,
    gameOverStatus: null as GameOverStatus | null,
    tokenStatus: null as TokenStatus | null,
    provider: {} as Provider,
    mintParams: null,
    tokenIds: null,
    currentTxType: null as TxType | null,
    errors: {} as Errors,
  }),
  getters: {
    isGameOver(): boolean {
      return this.gameOverTimeMilli < Date.now()
    },
    isRedeemCountdownOver(): boolean {
      return this.timeToRedeemInMilli < Date.now()
    },
    isMainnetTime() {
      return isMainnetTime()
    },
    txStatus(): TransactionStatus {
      if (
        this.localStore.txInfo?.txConfirmation ||
        this.localStore.txInfo?.externalConfirmation
      ) {
        return TransactionStatus.Confirmed
      } else if (this.errors.transaction) {
        return TransactionStatus.Error
      } else {
        return TransactionStatus.InProgress
      }
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
    setTokenStatus(status: TokenStatus) {
      this.tokenStatus = status
    },
    setCurrentTxType(type: TxType) {
      this.currentTxType = type
    },
    setGameOverStatus(status: GameOverStatus) {
      this.gameOverStatus = status
    },
    setGameOver() {
      this.gameOver = true
    },
    setRedeemCountdownOver() {
      this.redeemCountdownOver = true
    },
    setProvider(provider: Provider) {
      this.provider = provider
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
