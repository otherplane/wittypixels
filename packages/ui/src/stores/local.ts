import { defineStore } from 'pinia'
import type { TxInfo } from '@/types'

export const useLocalStore = defineStore('localStore', {
  state: () => ({
    txInfo: null as TxInfo | null,
  }),
  actions: {
    // Mint info
    getTxInfo() {
      const txStored = localStorage.getItem('wpxTxInfo')
      const txInfo = txStored
        ? JSON.parse(localStorage.getItem('wpxTxInfo'))
        : null
      if (txInfo) {
        this.txInfo = txInfo
      }
    },
    saveTxInfo(info: TxInfo) {
      localStorage.setItem('wpxTxInfo', JSON.stringify({ ...info }))
      this.txInfo = info
    },
    clearTxInfo() {
      localStorage.removeItem('wpxTxInfo')
      this.txInfo = null
    },
    clearTxBlockInfo() {
      this.txInfo = {
        ...this.txInfo,
        blockNumber: 0,
        blockHash: '0',
      }
      localStorage.setItem('wpxTxInfo', JSON.stringify(this.txInfo))
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
