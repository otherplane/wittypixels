<template>
  <div class="pixel-board" ref="targetBoard">
    <v-stage
      ref="stage"
      :config="configKonva"
      @wheel="zoom"
      @dragStart="changeDragCursor"
    >
      <v-layer ref="layer">
        <v-rect
          v-for="pixel in Object.values(pixelMap)"
          :ref="`${pixel.x}:${pixel.y}`"
          :key="`${pixel.x}:${pixel.y}`"
          :config="pixel"
          @click="previewPixelAndShowPanel({ x: pixel.x, y: pixel.y })"
          @tap="previewPixelAndShowPanel({ x: pixel.x, y: pixel.y })"
        ></v-rect>
        <v-rect
          v-if="pixelToPaint"
          :config="pixelToPaint"
          @click="showPanel()"
        ></v-rect>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/stores/player'
import { CANVAS_WIDTH, CANVAS_HEIGHT, PIXEL_SIZE, SCALE_BY } from '@/constants'
export default {
  setup() {
    const store = useStore()
    const pixel = ref()
    const stage = ref()
    const targetBoard = ref()
    const configKonva = {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    }

    onMounted(() => {
      drawGrid()
      stageNode.value.draggable(true)
    })

    const selectedColor = computed(() => {
      return store.selectedColor
    })
    const pixelMap = computed(() => {
      return store.pixelMap
    })
    const pixelToPaint = computed(() => {
      return store.pixelToPaint
    })
    const stageNode = computed(() => {
      return stage.value.getNode()
    })
    const stageContainer = computed(() => {
      return stage.value.getStage().container()
    })

    function drawGrid() {
      for (
        let xCell = 0;
        xCell < Math.round(CANVAS_WIDTH / PIXEL_SIZE);
        xCell++
      ) {
        for (
          let yCell = 0;
          yCell < Math.round(CANVAS_HEIGHT / PIXEL_SIZE);
          yCell++
        ) {
          const x = xCell * PIXEL_SIZE
          const y = yCell * PIXEL_SIZE
          store.paintDefaultPixel({
            key: generateId(x, y),
            pixel: generatePixel(x, y, 'lightgrey'),
          })
        }
      }
    }
    function generateId(x, y) {
      return `${x}:${y}`
    }
    function generatePixel(x, y, color) {
      return {
        id: generateId(x, y),
        author: null,
        timestamp: null,
        x: x,
        y: y,
        width: PIXEL_SIZE,
        height: PIXEL_SIZE,
        fill: color,
        strokeWidth: 1,
        stroke: color,
      }
    }
    function showPanel() {
      store.togglePalettePanel(true)
    }
    function previewPixelAndShowPanel({ x, y }) {
      this.showPanel()
      this.previewPixel({ x, y })
    }
    function previewPixel({ x, y }) {
      if (
        !pixelToPaint.value ||
        generateId(pixelToPaint.value.x, pixelToPaint.value.y) !==
          generateId(x, y)
      ) {
        store.setPixelToPaint({
          id: generateId(x, y),
          x: x,
          y: y,
          width: PIXEL_SIZE,
          height: PIXEL_SIZE,
          fill: selectedColor.value,
          strokeWidth: 1,
          stroke: 'black',
        })
      }
      stageContainer.value.style.cursor = 'pointer'
    }
    function clearPixelToPaint() {
      store.clearPixelToPaint()
      store.togglePalettePanel(false)
    }
    function changeDragCursor() {
      stageContainer.value.style.cursor = 'move'
    }
    function zoom(e) {
      e.evt.preventDefault()
      // Scale
      let direction = e.evt.deltaY > 0 ? 1 : -1
      const pointerPosition = stageNode.value.getPointerPosition()
      const prevScale = stageNode.value.scaleX()
      const nextScale =
        direction > 0 ? prevScale * SCALE_BY : prevScale / SCALE_BY
      const mousePointTo = {
        x: (pointerPosition.x - stageNode.value.x()) / prevScale,
        y: (pointerPosition.y - stageNode.value.y()) / prevScale,
      }
      const newPos = {
        x: pointerPosition.x - mousePointTo.x * nextScale,
        y: pointerPosition.y - mousePointTo.y * nextScale,
      }

      // Zoom on trackpad
      if (e.evt.ctrlKey) direction = -direction
      stageNode.value.scale({ x: nextScale, y: nextScale })
      stageNode.value.position(newPos)
      stageNode.value.batchDraw()
    }
    return {
      pixel,
      configKonva,
      pixelMap,
      previewPixel,
      pixelToPaint,
      stage,
      zoom,
      changeDragCursor,
      clearPixelToPaint,
      targetBoard,
      previewPixelAndShowPanel,
      showPanel,
    }
  },
}
</script>
<style>
.pixel-board {
  max-width: 100vw;
  height: 90vh;
  overflow: hidden;
}
</style>
