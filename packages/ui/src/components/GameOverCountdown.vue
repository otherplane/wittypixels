<template>
  <div>
    <GameInfo v-if="!gameStore.gameOver">
      <p>
        <span>GAME ENDS IN: </span>
        <TimeLeft
          class="time-left"
          :timestamp="gameStore.gameOverTimeMilli"
          :seconds="true"
          @clear-timestamp="getTokenStatus"
        />
      </p>
    </GameInfo>
    <GameInfo v-if="gameStore.gameOver">
      <p class="game-over bold">GAME OVER</p>
    </GameInfo>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/stores/player'
import { useLocalStore } from '@/stores/local'
import { useGameStore } from '@/stores/game'
import { useModalStore } from '@/stores/modal'
import { formatNumber } from '../utils'
import { useWeb3 } from '../composables/useWeb3'
import { onMounted, onBeforeUnmount, computed, watch, reactive } from 'vue'
import { POLLER_MILLISECONDS } from '@/constants.js'
import { TokenStatus, ModalKey } from '@/types'
export default {
  setup() {
    let tokenStatusPoller: any
    let mintConfirmationStatusPoller: any
    const player = useStore()
    const gameStore = useGameStore()
    const localStore = useLocalStore()
    const modalStore = useModalStore()
    const web3WittyCreatures = useWeb3()
    const txHash = computed(() => localStore.mintInfo?.txHash)
    const getTokenStatus = async () => {
      if (gameStore.isGameOver) {
        gameStore.gameOver = true
        modalStore.openModal(ModalKey.gameOver)
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
      if (gameStore.gameOver) {
        tokenStatusPoller = await setInterval(async () => {
          await web3WittyCreatures.getTokenStatus()
        }, POLLER_MILLISECONDS)
        await web3WittyCreatures.enableProvider()
      }
    })
    const getGameOverInfo = async () => {
      clearInterval(mintConfirmationStatusPoller)
      if (
        localStore.mintInfo?.txHash &&
        !localStore.mintInfo?.mintConfirmation
      ) {
        mintConfirmationStatusPoller = await setInterval(async () => {
          await web3WittyCreatures.getConfirmationStatus()
        }, POLLER_MILLISECONDS)
      }
    }
    const tokenStatus = computed(() => gameStore?.tokenStatus)
    const redeemConfirmation = computed(
      () => localStore.mintInfo?.mintConfirmation
    )
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
      gameStore,
      formatNumber,
      TokenStatus,
      modalStore,
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
