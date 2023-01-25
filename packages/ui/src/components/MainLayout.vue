<template>
  <div class="background">
    <div class="witnet-logo-strip">
      <slot name="top" />
      <WitnetMarquee />
      <AppHeader :hideNavBar="hideNavBar" />
    </div>
    <div ref="playGroundRef" class="layout">
      <slot name="main" />
      <div class="sticky-bottom">
        <div class="action-container">
          <slot name="bottom" />
        </div>
        <slot name="bottom-2" />
      </div>
    </div>
  </div>
</template>
<script>
import { useStore } from '@/stores/player'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
export default {
  props: {
    hideNavBar: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const player = useStore()
    const playGroundRef = ref(null)
    onClickOutside(playGroundRef, () => {
      player.clearPixelToPaint()
      player.togglePalettePanel(false)
    })
    return {
      player,
      playGroundRef,
    }
  },
}
</script>
<style scoped lang="scss">
.sticky-bottom {
  width: 100%;
  text-align: center;
  position: fixed;
  max-width: 700px;
  bottom: 0px;
  display: grid;
  grid-template-rows: max-content max-content;
  justify-items: center;
  .action-container {
    padding: 16px;
    width: 100%;
  }
}
.cover-bottom {
  width: 100%;
  text-align: center;
  bottom: 0px;
  display: grid;
  grid-template-rows: max-content max-content;
  justify-items: center;
}
.background {
  height: 100vh;
  display: grid;
  grid-template-rows: max-content 1fr;
  left: 0;
  right: 0;
  z-index: 3;
  background-color: $white;
  background: $white;
}
.witnet-logo-strip {
  position: relative;
  background-color: $white;
  z-index: 12;
}

.layout {
  z-index: 7;
  width: 100%;
  max-width: 700px;
  margin-top: 32px;
  margin: 0 auto;
  overflow-y: auto;
  grid-template-rows: 1fr;
}
.padding {
  padding: 8px 16px;
}
</style>
