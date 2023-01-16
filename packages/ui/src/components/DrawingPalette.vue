<template>
  <div class="palette-container" ref="targetBoard">
    <div v-if="pixelToPaint" class="selected-pixel">
      <div
        class="pixel-color"
        :style="{ 'background-color': pixelToPaint?.fill ?? 'lightgrey' }"
      ></div>
      <div class="pixel-info">
        <p class="dark-text">
          x {{ standardizePixelCoordinates(pixelToPaint?.x) }}
        </p>
        <p class="dark-text">
          y {{ standardizePixelCoordinates(pixelToPaint?.y) }}
        </p>
        <p v-if="pixelToPaint?.author" class="dark-text double-col">
          @{{ pixelToPaint?.author }}
        </p>
      </div>
      <p class="light-text time">
        {{ formatTimestamp(pixelToPaint?.timestamp) }}
      </p>
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
      Remember: you can get more paints into your pallete by getting your
      pendant scanned by other players!
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
import { standardizePixelCoordinates, formatTimestamp } from '@/utils'
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
    return {
      colors,
      paintPixel,
      pixelToPaint,
      standardizePixelCoordinates,
      formatTimestamp,
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
  grid-template-columns: max-content 1fr max-content;
  grid-gap: 16px;
  border-bottom: 2px solid $lightgrey;
  padding: 0 8px 16px 8px;
  align-items: center;
  .pixel-color {
    border: 2px solid $black;
    display: flex;
    width: 50px;
    height: 40px;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
  }
  .pixel-info {
    display: grid;
    grid-template-columns: max-content max-content;
    grid-template-rows: 1fr 1fr;
    justify-items: flex-start;
    grid-gap: 8px;
    .double-col {
      grid-column: 1 / span 2;
    }
  }
}
.palette {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, 40px);
  grid-gap: 16px;
}
</style>
