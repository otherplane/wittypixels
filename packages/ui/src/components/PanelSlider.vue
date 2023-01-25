<template>
  <transition name="slide">
    <div v-if="showPanel" class="slide-up">
      <div class="line-container" @click="closePanel">
        <hr class="line" />
      </div>
      <slot></slot>
    </div>
  </transition>
</template>

<script>
import { useStore } from '@/stores/player'
export default {
  props: {
    showPanel: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const player = useStore()
    function closePanel() {
      player.togglePalettePanel(false)
    }
    return { closePanel }
  },
}
</script>

<style scoped lang="scss">
.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
  transform-origin: bottom;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
  transform-origin: bottom;
}
.line-container {
  padding: 8px;
  cursor: pointer;
  width: 50px;
  margin: 0 auto;
}
.line {
  height: 4px;
  height: 2px;
  background-color: $grey;
  border: 1px solid $grey;
  border-radius: 7px 7px 7px 7px;
}

.slide-up {
  position: absolute;
  bottom: 0;
  z-index: 20;
  width: 100%;
  padding: 0 16px 16px 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: $white;
  border-top: 2px solid $grey;
  border-left: 2px solid $grey;
  border-right: 2px solid $grey;
}
</style>
