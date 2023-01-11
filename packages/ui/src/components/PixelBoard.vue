<template>
  <div class="pixel-board">
    {{ currentSelection }}
    <v-stage
      ref="stage"
      :config="configKonva"
      @wheel="zoom"
      @dragStart="changeDragCursor"
      @mouseleave="currentPixel = null"
    >
      <v-layer ref="layer">
        <v-rect
          v-for="pixel in Object.values(pixelMap)"
          :ref="`${pixel.x}:${pixel.y}`"
          :key="`${pixel.x}:${pixel.y}`"
          :config="pixel"
          @mouseover="previewPixel({ x: pixel.x, y: pixel.y })"
          @tap="updatePixel({ x: pixel.x, y: pixel.y })"
        ></v-rect>
        <v-rect
          v-if="currentPixel"
          :config="currentPixel"
          @click="updatePixel({ x: currentPixel.x, y: currentPixel.y })"
        ></v-rect>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/stores/player'
export default {
  setup() {
    const store = useStore()
    const PIXEL_SIZE = 16
    const CANVAS_WIDTH = 700
    const CANVAS_HEIGHT = 600
    const SCALE_BY = 1.01
    const pixel = ref()
    const stage = ref()
    const pixelMap = ref({})
    const configKonva = {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    }
    const currentPixel = ref(null)

    onMounted(() => {
      drawGrid()
      stageNode.value.draggable(true)
    })

    const selectedColor = computed(() => {
      return store.selectedColor
    })
    const stageNode = computed(() => {
      return stage.value.getNode()
    })
    const currentSelection = computed(() => {
      return `Current Selection is x: ${
        standardizePixelCoordinates(currentPixel.value?.x) ?? 0
      } y: ${standardizePixelCoordinates(currentPixel.value?.y) ?? 0}`
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
          pixelMap.value[generateId(x, y)] = generatePixel(x, y, 'lightgrey')
        }
      }
    }
    function standardizePixelCoordinates(coordinate) {
      return coordinate > 0 ? coordinate / PIXEL_SIZE : coordinate
    }
    function generateId(x, y) {
      return `${x}:${y}`
    }
    function generatePixel(x, y, color) {
      return {
        x: x,
        y: y,
        width: PIXEL_SIZE,
        height: PIXEL_SIZE,
        fill: color,
        strokeWidth: 1,
        stroke: color,
      }
    }
    function previewPixel({ x, y }) {
      if (
        !currentPixel.value ||
        generateId(currentPixel.value.x, currentPixel.value.y) !==
          generateId(x, y)
      ) {
        currentPixel.value = {
          x: x,
          y: y,
          width: PIXEL_SIZE,
          height: PIXEL_SIZE,
          fill: selectedColor,
          strokeWidth: 1,
          stroke: 'black',
        }
      }
      stageContainer.value.style.cursor = 'pointer'
    }
    function changeDragCursor() {
      stageContainer.value.style.cursor = 'move'
    }
    function updatePixel({ x, y }) {
      if (selectedColor.value) {
        pixelMap.value[generateId(x, y)] = generatePixel(
          x,
          y,
          selectedColor.value
        )
        console.log('updated pixel', pixelMap.value[generateId(x, y)])
      }
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
      updatePixel,
      previewPixel,
      currentPixel,
      stage,
      zoom,
      changeDragCursor,
      currentSelection,
    }
  },
}
</script>
<style>
.pixel-board {
  max-width: 90vw;
  overflow: hidden;
}
</style>
