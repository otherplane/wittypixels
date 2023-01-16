import { defineStore } from 'pinia'
import type { MintInfo } from '@/types'

export const useLocalStore = defineStore('localStore', {
  state: () => ({
    mintInfo: null as MintInfo | null,
  }),
  getters: {
    mintStatus(): string {
      return this.mintInfo?.blockHash ? 'minted' : 'pending'
    },
    minted(): boolean {
      if (this.mintInfo && this.mintInfo.events && this.mintInfo.events[1]) {
        return true
      } else {
        return false
      }
    },
  },
  actions: {
    // Mint info
    getMintInfo() {
      const mintInfo = JSON.parse(localStorage.getItem('mintInfo') ?? '')
      if (mintInfo) {
        this.mintInfo = mintInfo
      }
    },
    saveMintInfo(info: any) {
      localStorage.setItem('mintInfo', JSON.stringify({ ...info }))
      this.mintInfo = info
    },
    // Token Info
    getToken() {
      const tokenInfo = localStorage.getItem('tokenInfo')
      if (tokenInfo) {
        return JSON.parse(tokenInfo)
      }
    },
    clearTokenInfo() {
      localStorage.removeItem('tokenInfo')
    },
    saveTokenInfo(info: any) {
      localStorage.setItem(
        'tokenInfo',
        JSON.stringify({ ...this.getToken(), ...info })
      )
    },
  },
})
