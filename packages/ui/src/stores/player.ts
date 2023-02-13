import { defineStore } from 'pinia'
import { ApiService } from '@/api'
import router from '../router'
import {
  type PalettePoints,
  type PixelDB,
  type Errors,
  type InteractionInfo,
  type SelectedPixel,
  ErrorKey,
} from '@/types'
import { PAGINATION_LIMIT } from '@/constants'
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
      color: 7 as number,
      bonus: null as number | null,
      interactionInfo: null,
      interactionIn: null as InteractionInfo | null,
      interactionOut: null as InteractionInfo | null,
      history: [],
      playersGlobalStats: [],
      errors: {} as Errors,
      selectedColor: null as number | null,
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
        this.setError(ErrorKey.canvas, request.error)
      } else {
        if (this.checkpoint !== request.checkpoint) {
          if (!this.pixelImageUpdated) {
            this.pixelMapImage = request.canvas
          }
          this.checkpoint = request.checkpoint
        }
        this.clearError(ErrorKey.canvas)
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
        this.setError(ErrorKey.pixel, request.error)
      } else {
        this.selectedPixelInfo = request
        this.clearError(ErrorKey.pixel)
      }
    },
    async paintPixel() {
      if (this.pixelToPaint && this.selectedColor) {
        const tokenInfo = this.localStore.getToken()
        const params = {
          x: this.pixelToPaint.x,
          y: this.pixelToPaint.y,
          color: this.selectedColor ? this.selectedColor : this.pixelToPaint.c,
          token: tokenInfo.token,
        }
        console.log('pixel params', params)
        const request = await this.api.drawPixel(params)
        if (request.error) {
          this.setError(ErrorKey.paint, request.error)
        } else {
          this.pixelMapImage = request.canvas
          this.pixelImageUpdated = true
          this.clearError(ErrorKey.paint)
        }
      }
    },
    setPixelToPaint(pixel: PixelDB) {
      this.pixelToPaint = pixel
    },
    clearPixelToPaint() {
      this.pixelToPaint = null
      this.selectedColor = null
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
    //Bonus
    async addBonus({ url }: any) {
      const tokenInfo = this.localStore.getToken()
      const request = await this.api.bonus({
        token: tokenInfo.token,
        url,
      })

      if (request.error) {
        this.setError(ErrorKey.bonus, request.error)
        router.push('/init-game')
      } else {
        this.clearError(ErrorKey.bonus)
        this.bonus = request.bonusEndsAt
        router.push('/init-game')
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
    async getInteractionHistory(offset = 0, limit = PAGINATION_LIMIT) {
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
    async getGlobalStats(offset = 0, limit = PAGINATION_LIMIT) {
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
