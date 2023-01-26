<template>
  <div>
    <p v-if="!player.gameOver" class="counter">
      <span>GAME ENDS IN: </span>
      <TimeLeft
        class="time-left"
        :timestamp="player.gameOverTimeMilli"
        :seconds="true"
        @clear-timestamp="getTokenStatus"
      />
    </p>
    <p
      v-if="
        player.gameOver &&
        player.tokenStatus &&
        player.tokenStatus == TokenStatus.Minting
      "
      class="game-over bold"
    >
      GAME OVER
    </p>
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
          await web3WittyCreatures.getMintConfirmationStatus()
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
.time-container {
  width: 100%;
  background-color: var(--primary-color-opacity-2);
  color: var(--primary-color);
  font-weight: 600;
  padding: 0px 8px;
  border-radius: 4px;
  display: grid;
  grid-template-columns: max-content 130px;
  justify-content: left;
  align-items: center;
}
.bonus-title {
  text-align: left;
  font-size: 16px;
  color: var(--primary-color);
  margin-right: 8px;
  font-weight: bold;
  .highlight {
    color: var(--primary-color);
  }
}
.time-left {
  padding-left: 8px;
  width: max-content;
  overflow: hidden;
  text-align: left;
  font-size: 12px;
}
</style>
