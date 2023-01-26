<template>
  <div>
    <GameInfo v-if="!player.gameOver">
      <p>
        <span>GAME ENDS IN: </span>
        <TimeLeft
          class="time-left"
          :timestamp="player.gameOverTimeMilli"
          :seconds="true"
          @clear-timestamp="getTokenStatus"
        />
      </p>
    </GameInfo>
    <GameInfo v-if="player.gameOver">
      <p class="game-over bold">GAME OVER</p>
    </GameInfo>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/stores/player'
import { formatNumber } from '../utils'
import { useWeb3 } from '../composables/useWeb3'
import { onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { POLLER_MILLISECONDS } from '@/constants.js'
import { TokenStatus } from '@/types'
export default {
  setup() {
    let tokenStatusPoller: any
    let mintConfirmationStatusPoller: any
    const player = useStore()
    const web3WittyCreatures = useWeb3()
    const txHash = computed(() => player.mintInfo?.txHash)
    const getTokenStatus = async () => {
      if (player.isGameOver) {
        player.gameOver = true
        await web3WittyCreatures.getTokenStatus()
        tokenStatusPoller = setInterval(async () => {
          await web3WittyCreatures.getTokenStatus()
        }, POLLER_MILLISECONDS)
      }
    }
    onBeforeUnmount(() => {
      clearInterval(tokenStatusPoller)
      clearInterval(mintConfirmationStatusPoller)
    })
    onMounted(async () => {
      await player.getPlayerInfo()
      if (player.gameOver) {
        tokenStatusPoller = await setInterval(async () => {
          await web3WittyCreatures.getTokenStatus()
        }, POLLER_MILLISECONDS)
        await web3WittyCreatures.enableProvider()
      }
    })
    const getGameOverInfo = async () => {
      clearInterval(mintConfirmationStatusPoller)
      if (player.mintInfo?.txHash && !player.mintInfo?.mintConfirmation) {
        mintConfirmationStatusPoller = await setInterval(async () => {
          await web3WittyCreatures.getConfirmationStatus()
        }, POLLER_MILLISECONDS)
      }
    }
    const tokenStatus = computed(() => player?.tokenStatus)
    const redeemConfirmation = computed(() => player.mintInfo?.mintConfirmation)
    watch(tokenStatus, () => {
      getGameOverInfo()
    })
    watch(txHash, () => {
      getGameOverInfo()
    })
    watch(redeemConfirmation, () => {
      getGameOverInfo()
    })
    return {
      getTokenStatus,
      player,
      formatNumber,
      TokenStatus,
    }
  },
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
