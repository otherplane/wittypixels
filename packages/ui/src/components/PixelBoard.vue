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
          v-for="pixel in pixelList"
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

<script lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/stores/player'
import type { Pixel, Coordinates, GeneratePixelArgs } from '@/types'
import { CANVAS_WIDTH, CANVAS_HEIGHT, PIXEL_SIZE, SCALE_BY } from '@/constants'
export default {
  setup() {
    const store = useStore()
    const pixel = ref()
    const stage = ref()
    const targetBoard = ref()
    let configKonva = ref({})

    onMounted(() => {
      drawGrid()
      configKonva.value = {
        width: targetBoard.value.clientWidth,
        height: targetBoard.value.clientHeight,
        draggable: true,
      }
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
    const pixelList = computed(() => {
      return pixelMap.value ? Object.values(pixelMap.value) : []
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
          store.pixelMap[generateId({ x, y })] = generatePixel({
            x,
            y,
            color: '#8a8a8a3d',
          })
        }
      }
    }
    function generateId({ x, y }: Coordinates): string {
      return `${x}:${y}`
    }
    function generatePixel({
      x,
      y,
      color,
      strokeColor = color,
    }: GeneratePixelArgs): Pixel {
      return {
        id: generateId({ x, y }),
        author: null,
        timestamp: null,
        x: x,
        y: y,
        width: PIXEL_SIZE,
        height: PIXEL_SIZE,
        fill: color,
        strokeWidth: 1,
        stroke: strokeColor,
      }
    }
    function showPanel() {
      store.togglePalettePanel(true)
    }
    function previewPixelAndShowPanel({ x, y }: Coordinates) {
      showPanel()
      previewPixel({ x, y })
    }
    function previewPixel({ x, y }: Coordinates) {
      if (
        !pixelToPaint.value ||
        generateId({ x: pixelToPaint.value.x, y: pixelToPaint.value.y }) !==
          generateId({ x, y })
      ) {
        store.setPixelToPaint(
          generatePixel({
            x,
            y,
            color: selectedColor.value ?? '#8a8a8a3d',
            strokeColor: 'black',
          })
        )
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
    function zoom(e: any) {
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
      pixelList,
    }
  },
}
</script>
<style>
.pixel-board {
  max-width: 100%;
  height: 100%;
  max-height: 90vh;
  overflow: hidden;
}
</style>
