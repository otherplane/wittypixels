import { defineStore } from 'pinia'
import { ApiService } from '@/api'
import router from '../router'
import {
  type Pixel,
  type PalettePoints,
  type PixelMap,
  type Errors,
  ErrorKey,
} from '@/types'
import { TIME_TO_MINT_MILLISECONDS, GAME_ENDS_TIMESTAMP } from '../constants'
import { isMainnetTime } from '@/utils'
import { useLocalStore } from './local'
export const useStore = defineStore('player', {
  state: () => {
    return {
      api: new ApiService(),
      localStore: useLocalStore(),
      id: null,
      nft: [],
      username: '',
      selectedColor: null as string | null,
      palettePoints: {} as PalettePoints,
      showPalettePanel: false as boolean,
      pixelToPaint: null as Pixel | null,
      pixelMap: {} as PixelMap,
      bonus: null,
      interactionInfo: null,
      interactionIn: null,
      interactionOut: null,
      //TODO: make gameOverTimeMilli take GAME_ENDS_TIMESTAMP value when gameOver is defined
      gameOverTimeMilli: GAME_ENDS_TIMESTAMP,
      timeToMintInMilli: GAME_ENDS_TIMESTAMP + TIME_TO_MINT_MILLISECONDS,
      previews: [],
      mintedAwards: [],
      history: [],
      mintParams: null,
      color: 0 as number,
      tokenIds: null,
      score: null,
      playersGlobalStats: [],
      errors: {} as Errors,
    }
  },
  getters: {
    gameOver(): boolean {
      //FIXME: make it reactive
      return this.gameOverTimeMilli < Date.now()
    },
    mintingAllow(): boolean {
      //FIXME: make it reactive
      return this.timeToMintInMilli < Date.now()
    },
    isMainnetTime() {
      return isMainnetTime()
    },
  },
  actions: {
    paintPixel() {
      if (
        this.pixelMap &&
        this.selectedColor &&
        this.pixelToPaint &&
        !this.pixelMap[this.pixelToPaint.id].author
      ) {
        this.pixelMap[this.pixelToPaint.id] = {
          ...this.pixelToPaint,
          author: this.username,
          timestamp: new Date().getTime(),
          stroke: this.pixelToPaint.fill,
        }
      }
    },
    setPixelToPaint(pixel: Pixel) {
      if (this.pixelMap && this.pixelMap[pixel.id].author) {
        if (this.pixelMap) {
          this.pixelToPaint = {
            ...this.pixelMap[pixel.id],
            stroke: pixel.stroke,
          }
        }
      } else {
        this.pixelToPaint = {
          ...pixel,
          stroke: pixel.stroke,
        }
      }
    },
    clearPixelToPaint() {
      this.pixelToPaint = null
      this.selectedColor = null
    },
    togglePalettePanel(value: boolean) {
      this.showPalettePanel = value
    },
    selectColor(color: string) {
      this.selectedColor = color
    },
    notify(payload: any) {
      const app = (this as any).app
      app.config.globalProperties.$notify(payload)
    },
    // TODO: set NFT preview data
    setPreviewData(preview: any) {
      console.log(preview)
    },
    // Errors
    clearError(error: ErrorKey) {
      this.errors[error] = null
    },
    setError(name: ErrorKey, error: any) {
      this.errors[name] = error.response?.data?.message || error.toString()
      this.notify({ message: this.errors[name] })
    },

    async authorize({ key }: any) {
      const request = await this.api.authorize({ key })
      if (request.error) {
        router.push('/init-game')
        this.setError(ErrorKey.auth, request.error)
      } else if (request.token) {
        await this.localStore.saveTokenInfo(request)
        this.clearError(ErrorKey.auth)
        await this.getPlayerInfo()
        await this.getGlobalStats()
        router.push(`/settings/${key}`)
      }
    },
    async interact({ key }: any) {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.interact({
        token: tokenInfo.token,
        to: key,
      })

      if (request.error) {
        this.setError(ErrorKey.interaction, request.error)
        router.push('/init-game')
      } else {
        this.clearError(ErrorKey.interaction)
        this.interactionInfo = request
        router.push('/init-game')
        this.getPlayerInfo()
      }
    },
    // History
    async getInteractionHistory(offset = 0, limit = 25) {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.getInteractionHistory({
        token: tokenInfo && tokenInfo.token,
        id: tokenInfo && tokenInfo.key,
        offset,
        limit,
      })
      if (request.error) {
        router.push('/init-game')
        this.setError(ErrorKey.history, request.error)
      } else {
        this.clearError(ErrorKey.history)
        return {
          result: request.interactions?.interactions,
          total: request.interactions?.total,
        }
      }
    },
    // Leaderboard
    async getGlobalStats(offset = 0, limit = 25) {
      await this.getPlayerInfo()
      const request = await this.api.getLeaderboardInfo({
        offset,
        limit,
      })
      if (request.error) {
        this.setError(ErrorKey.getLeaderboardInfo, request.error)
      } else {
        this.clearError(ErrorKey.getLeaderboardInfo)
        return {
          result: request.players.players,
          total: request.players.total,
        }
      }
    },
    // Player Info
    async getPlayerInfo() {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.getInfo({
        token: tokenInfo && tokenInfo.token,
        id: tokenInfo && tokenInfo.key,
      })
      if (request.error) {
        router.push({ name: 'init-game' })
        this.setError(ErrorKey.info, request.error)
      } else {
        this.clearError(ErrorKey.info)
        const { key, username, score, color } = request.player
        this.id = key
        this.username = username
        this.score = score
        this.palettePoints = {
          0: 5000,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 5000,
        }
        this.color = color
        if (request.lastInteractionIn) {
          this.interactionIn = request.lastInteractionIn
        }
        if (request.lastInteractionOut) {
          this.interactionOut = request.lastInteractionOut
        }
      }
    },
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
  },
})
