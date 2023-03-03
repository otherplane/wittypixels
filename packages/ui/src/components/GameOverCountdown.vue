<template>
  <div v-if="!gameStore.gameOverStatus">
    <GameInfo v-if="!gameStore.gameOver">
      <p>
        <span>GAME ENDS IN: </span>
        <TimeLeft
          class="time-left"
          :timestamp="gameStore.gameOverTimeMilli"
          :seconds="true"
          @clear-timestamp="setGameOver"
        />
      </p>
    </GameInfo>
    <GameInfo v-if="gameStore.gameOver">
      <p class="game-over bold">GAME OVER</p>
    </GameInfo>
  </div>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/game'
import { ModalKey } from '@/types'
import { formatNumber } from '@/utils'
import { useModalStore } from '@/stores/modal'

export default {
  setup() {
    const gameStore = useGameStore()
    const modalStore = useModalStore()
    function setGameOver() {
      if (gameStore.isGameOver) {
        if (!gameStore.isRedeemCountdownOver) {
          modalStore.openModal(ModalKey.gameOver)
        }
        gameStore.setGameOver()
      }
    }
    return {
      setGameOver,
      gameStore,
      formatNumber,
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
