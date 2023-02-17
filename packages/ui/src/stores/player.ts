import { defineStore } from 'pinia'
import { ApiService } from '@/api'
import router from '../router'
import { isNumber } from '@/utils'
import {
  type PalettePoints,
  type PixelDB,
  type Errors,
  type InteractionInfo,
  type SelectedPixel,
  CallApiKey,
} from '@/types'
import { PAGINATION_LIMIT, MAX_ERROR_COUNTER } from '@/constants'
import { useLocalStore } from './local'
export const useStore = defineStore('player', {
  state: () => {
    return {
      api: new ApiService(),
      localStore: useLocalStore(),
      id: null,
      creationIndex: null as number | null,
      username: '',
      score: null,
      color: 5 as number,
      bonus: null as number | null,
      interactionInfo: null,
      interactionIn: null as InteractionInfo | null,
      interactionOut: null as InteractionInfo | null,
      canvasHistory: [],
      interactionHistory: [],
      playersGlobalStats: [],
      errors: {} as Errors,
      errorCounter: {} as Errors,
      loadings: {} as Record<CallApiKey, boolean>,
      selectedColor: null as number | null,
      selectedShade: 3 as number,
      palettePoints: {} as PalettePoints,
      showPalettePanel: false as boolean,
      pixelToPaint: null as PixelDB | null,
      pixelMap: [] as Array<Array<PixelDB>>,
      pixelMapImage: null as string | null,
      checkpoint: null,
      selectedPixelInfo: null as SelectedPixel | null,
      pixelImageUpdated: false as boolean,
    }
  },
  getters: {
    isBonusOver(): boolean {
      return this.bonus < Date.now()
    },
  },
  actions: {
    async getPixelMapImage() {
      const request = await this.api.getCanvas({
        checkpoint: this.checkpoint ?? 0,
      })
      if (request.error) {
        this.setError(CallApiKey.canvas, request.error)
      } else {
        if (this.checkpoint !== request.checkpoint) {
          if (!this.pixelImageUpdated) {
            this.pixelMapImage = request.canvas
          }
          this.checkpoint = request.checkpoint
        }
        this.clearError(CallApiKey.canvas)
      }
      this.pixelImageUpdated = false
    },
    async getPixelInfo(x: number, y: number) {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.getPixel({
        x,
        y,
        token: tokenInfo.token,
      })
      if (request.error) {
        this.setError(CallApiKey.pixel, request.error)
      } else {
        this.selectedPixelInfo = request
        this.clearError(CallApiKey.pixel)
      }
    },
    async paintPixel() {
      if (this.pixelToPaint && isNumber(this.selectedColor)) {
        const tokenInfo = this.localStore.getToken()
        const params = {
          x: this.pixelToPaint.x,
          y: this.pixelToPaint.y,
          color: isNumber(this.selectedColor)
            ? this.selectedColor
            : this.pixelToPaint.c,
          shade: this.selectedShade ? this.selectedShade : 3,
          token: tokenInfo.token,
        }
        const request = await this.api.drawPixel(params)
        if (request.error) {
          this.setError(CallApiKey.paint, request.error)
        } else {
          this.notify({
            message: `Pixel (${this.pixelToPaint.x}:${this.pixelToPaint.y}) painted`,
          })
          this.getPixelInfo(this.pixelToPaint.x, this.pixelToPaint.y)
          this.pixelMapImage = request.canvas
          this.pixelImageUpdated = true
          this.clearError(CallApiKey.paint)
        }
      }
    },
    setPixelToPaint(pixel: PixelDB) {
      this.pixelToPaint = pixel
    },
    clearPixelToPaint() {
      this.pixelToPaint = null
      this.selectedColor = null
      this.selectedShade = 3
    },
    togglePalettePanel(value: boolean) {
      this.showPalettePanel = value
    },
    selectColor(color: number) {
      this.selectedColor = color
      if (this.pixelToPaint) {
        this.pixelToPaint.c = color
      }
    },
    setBonusOver() {
      this.bonus = null
    },
    notify(payload: any) {
      const app = (this as any).app
      app.config.globalProperties.$notify(payload)
    },
    // Errors
    clearError(error: CallApiKey) {
      this.errors[error] = null
    },
    setError(name: CallApiKey, error: any) {
      this.errors[name] = error.response?.data?.message || error.toString()
      if (this.errorCounter[name] < MAX_ERROR_COUNTER) {
        this.errorCounter[name] = this.errorCounter[name]
          ? (this.errorCounter[name] += 1)
          : 1
      } else {
        this.errorCounter[name] = 1
      }
      this.notify({ message: this.errors[name] })
    },

    async authorize({ key }: any) {
      const request = await this.api.authorize({ key })
      if (request.error) {
        router.push('/init-game')
        this.setError(CallApiKey.auth, request.error)
      } else if (request.token) {
        await this.localStore.saveTokenInfo(request)
        this.clearError(CallApiKey.auth)
        router.push(`/settings/${key}`)
      }
    },
    //Bonus
    async addBonus({ url }: any) {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.bonus({
        token: tokenInfo.token,
        url,
      })

      if (request.error) {
        this.setError(CallApiKey.bonus, request.error)
        router.push('/')
      } else {
        this.clearError(CallApiKey.bonus)
        this.bonus = request.bonusEndsAt
        router.push('/')
      }
    },
    async interact({ key }: any) {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.interact({
        token: tokenInfo.token,
        to: key,
      })

      if (request.error) {
        this.setError(CallApiKey.interaction, request.error)
        router.push('/')
      } else {
        this.clearError(CallApiKey.interaction)
        this.interactionInfo = request
        router.push('/')
        this.getPlayerInfo()
      }
    },
    // Interactions History
    async getInteractionHistory(offset = 0, limit = PAGINATION_LIMIT) {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.getInteractionHistory({
        token: tokenInfo && tokenInfo.token,
        id: tokenInfo && tokenInfo.key,
        offset,
        limit,
      })
      this.loadings[CallApiKey.history] = true
      if (request.error) {
        if (
          this.errorCounter[CallApiKey.interactionHistory] > MAX_ERROR_COUNTER
        ) {
          router.push('/init-game')
        }
        this.loadings[CallApiKey.interactionHistory] = false
        this.setError(CallApiKey.interactionHistory, request.error)
      } else {
        this.clearError(CallApiKey.interactionHistory)
        this.loadings[CallApiKey.interactionHistory] = false
        return {
          result: request.interactions?.interactions,
          total: request.interactions?.total,
        }
      }
    },
    // Canvas History
    async getCanvasHistory(offset = 0, limit = PAGINATION_LIMIT) {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.getCanvasHistory({
        token: tokenInfo && tokenInfo.token,
        id: tokenInfo && tokenInfo.key,
        offset,
        limit,
      })
      this.loadings[CallApiKey.canvasHistory] = true
      if (request.error) {
        if (this.errorCounter[CallApiKey.canvasHistory] > MAX_ERROR_COUNTER) {
          router.push('/init-game')
        }
        this.setError(CallApiKey.canvasHistory, request.error)
        this.loadings[CallApiKey.canvasHistory] = false
      } else {
        this.clearError(CallApiKey.canvasHistory)
        this.loadings[CallApiKey.canvasHistory] = false
        return {
          result: request.draws?.draws,
          total: request.draws?.total,
        }
      }
    },
    // Leaderboard
    async getGlobalStats(offset = 0, limit = PAGINATION_LIMIT) {
      await this.getPlayerInfo()
      const request = await this.api.getLeaderboardInfo({
        offset,
        limit,
      })
      this.loadings[CallApiKey.getLeaderboardInfo] = true
      if (request.error) {
        this.loadings[CallApiKey.getLeaderboardInfo] = false
        this.setError(CallApiKey.getLeaderboardInfo, request.error)
      } else {
        this.loadings[CallApiKey.getLeaderboardInfo] = false
        this.clearError(CallApiKey.getLeaderboardInfo)
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
        if (this.errorCounter[CallApiKey.info] > MAX_ERROR_COUNTER) {
          router.push({ name: 'init-game' })
        }
        this.setError(CallApiKey.info, request.error)
      } else {
        this.clearError(CallApiKey.info)
        const { key, username, score, color, palette, creationIndex } =
          request.player
        this.id = key
        this.username = username
        this.score = score
        this.palettePoints = palette
        this.color = color
        this.creationIndex = creationIndex
        if (request.lastInteractionIn) {
          this.interactionIn = request.lastInteractionIn
        }
        if (request.lastInteractionOut) {
          this.interactionOut = request.lastInteractionOut
        }
      }
    },
  },
})
