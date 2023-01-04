<template>
  <div class="counter">
    <transition name="fade">
      <div v-if="player.interactionOut" class="info left">
        <p class="label">
          Sending
          <span class="highlight">{{
            player.interactionOut?.points || 0
          }}</span>
          points to
          <span class="highlight">{{ player.interactionOut?.to || '' }}</span>
        </p>
        <div class="time-container">
          <TimeLeft
            class="time-left"
            :timestamp="player.interactionOut.ends"
            :seconds="true"
            @clear-timestamp="player.interactionOut = null"
          />
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="player.interactionIn" class="info right">
        <p class="label">
          Receiving
          <span class="highlight">{{
            player.interactionIn?.points || 'null'
          }}</span>
          points from
          <span class="highlight">{{
            player.interactionIn?.from || 'null'
          }}</span>
        </p>
        <div class="time-container">
          <TimeLeft
            class="time-left"
            :timestamp="player.interactionIn.ends"
            :seconds="true"
            @clear-timestamp="player.interactionIn = null"
          />
        </div>
      </div>
    </transition>
    <div></div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from '@/stores/player'
import { importSvg } from '@/composables/importSvg.js'
export default {
  setup() {
    const player = useStore()
    const show = ref(false)
    return { player, show, importSvg }
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

.counter {
  margin-bottom: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  text-align: center;
  grid-template-rows: max-content;
  .time-container {
    width: 100%;
    background-color: var(--primary-color-opacity-2);
    color: var(--primary-color);
    font-weight: 600;
    padding: 0px 8px;
    border-radius: 4px;
    text-align: left;
    display: flex;
  }
  .trait-icon {
    display: inline-block;
    width: 14px;
  }
  .info {
    display: grid;
    grid-template-rows: max-content 1fr;
    align-items: center;
  }
  .left {
    grid-column: 1;
    display: grid;
    grid-template-rows: max-content 1fr;
    align-items: center;
  }
  .right {
    grid-column: 2;
    display: grid;
    grid-template-rows: max-content 1fr;
    align-items: center;
  }
  .label {
    text-align: left;
    margin-bottom: 8px;
    color: var(--primary-color);
    font-weight: bold;
    font-size: 12px;
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
}
</style>
