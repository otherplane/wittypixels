<template>
  <div class="palette-container" ref="targetBoard">
    <div v-if="pixelToPaint" class="selected-pixel" @click="closePanel">
      <div
        class="pixel-color"
        :style="{ 'background-color': pixelToPaint?.fill ?? 'lightgrey' }"
      ></div>
      <div class="pixel-info">
        <div class="info-top">
          <div class="coordinates">
            <p class="dark-text">
              x {{ standardizePixelCoordinates(pixelToPaint?.x) }}
            </p>
            <p class="dark-text">
              y {{ standardizePixelCoordinates(pixelToPaint?.y) }}
            </p>
          </div>
          <p class="light-text time">
            {{ formatDistanceToNow(pixelToPaint?.timestamp) }}
          </p>
        </div>
        <p v-if="pixelToPaint?.author" class="dark-text">
          @{{ pixelToPaint?.author }}
        </p>
      </div>
    </div>
    <div class="palette">
      <ColorSelector
        v-for="color in colors"
        :key="color"
        :color="color.color"
        :points="color.points"
      />
    </div>
    <p class="light-text copy">
      Remember: you can get more paints by getting your pendant scanned by other
      players!
    </p>
    <CustomButton type="primary" :slim="true" @click="paintPixel">
      Paint pixel
    </CustomButton>
  </div>
</template>

<script>
import { COLORS } from '@/constants'
import { computed } from 'vue'
import { useStore } from '@/stores/player'
import { standardizePixelCoordinates, formatDistanceToNow } from '@/utils'
export default {
  setup() {
    const store = useStore()

    const palette = computed(() => store.palettePoints)
    const colors = computed(() => {
      return Object.keys(COLORS).map(key => {
        return {
          points: palette.value[key] ?? 0,
          color: COLORS[key],
        }
      })
    })
    const pixelToPaint = computed(() => store.pixelToPaint)
    function paintPixel() {
      store.paintPixel()
    }
    function closePanel() {
      store.togglePalettePanel(false)
    }
    return {
      colors,
      paintPixel,
      pixelToPaint,
      standardizePixelCoordinates,
      formatDistanceToNow,
      closePanel,
    }
  },
}
</script>
<style scoped lang="scss">
.palette-container {
  font-size: 14px;
  display: grid;
  grid-gap: 16px;
}
.selected-pixel {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: 16px;
  border-bottom: 2px solid $lightgrey;
  padding: 4px 8px 16px 8px;
  align-items: center;
  justify-content: center;
  .pixel-color {
    border: 2px solid $black;
    display: flex;
    width: 48px;
    height: 48px;
    justify-content: center;
    align-items: center;
  }
  .pixel-info {
    cursor: pointer;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-gap: 8px;
    text-align: left;
    width: 100%;
    .info-top {
      display: grid;
      grid-template-columns: max-content max-content;
      justify-content: space-between;
      .coordinates {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 70px;
        grid-gap: 4px;
      }
      .time {
        height: 100%;
        align-self: flex-end;
      }
    }
  }
}
.palette {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, 60px);
  grid-gap: 8px;
}
</style>
