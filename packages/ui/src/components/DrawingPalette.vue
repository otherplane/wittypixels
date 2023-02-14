<template>
  <div class="palette-container">
    <div v-if="selectedPixelInfo" class="selected-pixel" @click="closePanel">
      <div
        class="pixel-color"
        :style="{ background: getColor(selectedPixelInfo?.color, 3).value }"
      ></div>
      <div class="pixel-info">
        <div class="info-top">
          <div class="coordinates">
            <p class="dark-text">x {{ selectedPixelInfo?.x }}</p>
            <p class="dark-text">y {{ selectedPixelInfo?.y }}</p>
          </div>
          <p v-if="selectedPixelInfo?.timestamp" class="light-text time">
            {{ formatDistanceToNow(selectedPixelInfo?.timestamp) }}
          </p>
        </div>
        <p v-if="selectedPixelInfo?.owner" class="dark-text">
          @{{ selectedPixelInfo?.owner }}
        </p>
      </div>
    </div>
    <div v-if="!gameOver" class="colors-container">
      <div class="palette">
        <ColorSelector
          v-for="color in colors"
          :key="color"
          :color="color.color"
          :points="color.points"
        />
      </div>
      <div class="total">
        <p>Wpx</p>
        <div class="total-points">
          <p class="text">{{ score }}x</p>
        </div>
      </div>
    </div>
    <transition name="slide">
      <div class="shades-selector" v-if="selectedColor && !gameOver">
        <ShadeSelector
          v-for="shade in shades"
          class="shade-box"
          :key="shade"
          :shade="shade"
        />
      </div>
    </transition>
    <p v-if="!gameOver" class="light-text copy">
      Remember: you can get more paints by getting your pendant scanned by other
      players!
    </p>
    <CustomButton
      v-if="!gameOver"
      type="primary"
      :slim="true"
      @click="paintPixel"
    >
      Paint pixel
    </CustomButton>
  </div>
</template>

<script>
import { COLORS } from '@/constants'
import { getColor } from '@/composables/getColor'
import { computed } from 'vue'
import { useStore } from '@/stores/player'
import { useGameStore } from '@/stores/game'
import { formatDistanceToNow, getRgbaColor } from '@/utils'
export default {
  setup() {
    const store = useStore()
    const game = useGameStore()

    const palette = computed(() => store.palettePoints)
    const colors = computed(() => {
      return Object.keys(COLORS)
        .map(key => {
          if (key !== '0' && key !== '1') {
            return {
              points: palette.value[key] ?? 0,
              color: Number(key),
            }
          }
        })
        .filter(value => !!value)
    })
    const selectedPixelInfo = computed(() => {
      return store.selectedPixelInfo
    })
    const shades = computed(() => {
      return Object.keys(COLORS[selectedColor.value]).map(key => {
        const shadeData = COLORS[selectedColor.value][key]
        return {
          key,
          color: getRgbaColor(shadeData[0], shadeData[1], shadeData[2]),
        }
      })
    })
    const score = computed(() => store.score)
    const selectedColor = computed(() => store.selectedColor)
    function selectShade(shade) {
      store.selectedShade = shade.key
    }
    function paintPixel() {
      store.paintPixel()
    }
    function closePanel() {
      store.clearPixelToPaint()
      store.togglePalettePanel(false)
    }
    // TODO: Does this avoid re-render?
    const gameOver = computed(() => game.gameOver)
    return {
      game,
      selectShade,
      gameOver,
      selectedColor,
      colors,
      paintPixel,
      selectedPixelInfo,
      formatDistanceToNow,
      closePanel,
      score,
      shades,
      getColor,
    }
  },
}
</script>
<style scoped lang="scss">
.slide-enter-active {
  transition-duration: 0.2s;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave {
  opacity: 1;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
}
.palette-container {
  font-size: 14px;
  display: grid;
  grid-gap: 16px;
}
.selected-pixel {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: 16px;
  padding: 4px 8px;
  align-items: center;
  justify-content: center;
  .pixel-color {
    border: 1.5px solid $black;
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
        grid-template-columns: max-content max-content;
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
.shades-selector {
  display: grid;
  border-radius: 24px;
  align-items: center;
  width: 100%;
  grid-template-columns: repeat(auto-fill, 48px);
  grid-gap: 0;
  .shade-box {
    height: 24px;
    cursor: pointer;
    &:first-child {
      border-top-left-radius: 24px;
      border-bottom-left-radius: 24px;
    }
    &:last-child {
      border-top-right-radius: 24px;
      border-bottom-right-radius: 24px;
    }
  }
}
.colors-container {
  display: grid;
  grid-template-columns: 1fr max-content;
  border-top: 1px solid $lightgrey;
  padding-top: 16px;
  .palette {
    display: grid;
    align-items: center;
    width: 100%;
    grid-template-columns: repeat(auto-fill, 60px);
    grid-gap: 8px;
  }
  .total {
    display: grid;
    .total-points {
      height: 24px;
      min-width: 80px;
      padding: 0 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 24px;
      border: 1.5px solid $black;
      .text {
        font-size: 12px;
        color: $black;
      }
    }
  }
}
</style>
