<template>
  <transition name="fade">
    <p v-if="!player.demoOver" class="countdown">
      <span>DEMO ENDS IN:</span>
      <TimeLeft
        class="time-left"
        :timestamp="player.demoOverTimeMilli"
        :seconds="true"
      />
    </p>
    <p v-else-if="!player.gameOver" class="countdown">
      <span>GAME ENDS IN:</span>
      <TimeLeft
        class="time-left"
        :timestamp="player.gameOverTimeMilli"
        :seconds="true"
      />
    </p>
    <p v-else class="countdown">
      <span>GAME OVER</span>
    </p>
  </transition>
  <transition name="fade">
    <div v-if="!player.mintingAllow && player.previews.length">
      <div class="time-container">
        <p class="bonus-title">Time left to allow minting</p>
        <TimeLeft
          class="time-left"
          :timestamp="player.timeToMintInMilli"
          :seconds="true"
          @clear-timestamp="player.timeToMintInMilli = null"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { useStore } from '@/stores/player'
import { useLocalStore } from '@/stores/local'
import { computed } from 'vue'
import { formatNumber } from '../utils'
export default {
  emits: ['openExportModal'],
  setup(_props) {
    const player = useStore()
    const localStore = useLocalStore()
    const gameOver = player.gameOver
    // TODO: HANDLE END OF GAME
    const mintStatus = computed(() =>
      localStore.mintInfo.blockHash ? 'minted' : 'pending'
    )
    return {
      gameOver,
      player,
      mintStatus,
      formatNumber,
    }
  },
}
</script>

<style lang="scss">
.countdown {
  background-color: $grey;
  width: 100%;
  color: $white;
  font-weight: bold;
  font-size: 14px;
  padding: 4px;
  padding-left: 16px;
}
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
  font-size: 14px;
}
</style>
