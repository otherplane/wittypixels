<template>
  <transition name="fade">
    <div class="info">
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
export default {
  setup() {
    const player = useStore()
    return { player }
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
  width: max-content;
  overflow: hidden;
  text-align: left;
  font-size: 18px;
}
</style>
