<template>
  <transition name="fade">
    <div v-if="interactionIn" class="counter">
      <div class="incubation-info">
        <p>
          Receiving +{{ interactionIn?.quantity || '' }}px from
          {{ interactionIn?.fromName || '' }}
        </p>
        <TimeLeft
          v-if="interactionIn?.ends"
          class="time-left"
          :timestamp="interactionIn?.ends"
          :seconds="true"
          @clear-timestamp="clearTimestamp('interactionIn')"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from '@/stores/player'
import { importSvg } from '@/composables/importSvg.js'
export default {
  setup() {
    const player = useStore()
    const show = ref(false)
    const clearTimestamp = interactionType => {
      player[interactionType] = null
    }
    const interactionIn = computed(() => player.interactionIn)
    return { player, show, importSvg, clearTimestamp, interactionIn }
  },
}
</script>

<style lang="scss" scoped>
.fade-enter-from,
.fade-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
}
.fade-enter-to,
.fade-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.counter {
  border-bottom: 1px solid $white;
  color: $white;
  display: grid;
  grid-template-columns: 1fr;
  background-color: $black;
  max-width: 700px;
  margin: 0 auto;
  justify-content: center;
  column-gap: 4px;
  text-align: left;
  grid-template-rows: max-content;
  .incubation-info {
    padding: 8px 16px;
    display: grid;
    grid-template-rows: max-content 1fr;
    align-items: center;
  }
  .time-left {
    width: max-content;
    overflow: hidden;
    text-align: left;
    padding: 0;
  }
}
</style>
