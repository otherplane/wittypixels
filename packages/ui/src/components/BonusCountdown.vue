<template>
  <GameInfo>
    <p>
      <span>BONUS ENDS IN: </span>
      <TimeLeft
        class="time-left"
        :timestamp="player.bonus"
        :seconds="true"
        @clear-timestamp="setBonusOver"
      />
    </p>
  </GameInfo>
</template>

<script lang="ts">
import { useStore } from '@/stores/player'
import { formatNumber } from '@/utils'

export default {
  setup() {
    const player = useStore()
    function setBonusOver() {
      if (player.isBonusOver) {
        player.setBonusOver()
      }
    }
    return {
      setBonusOver,
      player,
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
