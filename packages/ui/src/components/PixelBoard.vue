<template>
  <div class="pixel-board" ref="targetBoard">
    <LoadingSpinner v-if="!konvaPixelMapImage" />
    <v-stage
      ref="stage"
      class="stage"
      :config="stageConfig"
      @wheel="zoom"
      @dragstart="changeToMoveCursor"
      @dragend="changeToPointerCursor"
    ></v-stage>
  </div>
</template>

<script lang="ts">
import {
  COLORS,
  SCALE_BY,
  POLLER_MILLISECONDS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from '@/constants'
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import { useStore } from '@/stores/player'
import Konva from 'konva'
import { ColorHexMap, type Coordinates } from '@/types'

export default {
  setup() {
    let pixelMapPoller: any = null
    const store = useStore()
    const stage = ref()
    const targetBoard = ref()
    const stageConfig = ref()
    const pixelColor = ref()
    const layer = new Konva.Layer()
    const gridGroup = new Konva.Group()
    const pixelGroup = new Konva.Group()
    const pixelMapImage = new Image()
    const pixelSelection = new Konva.Rect({
      author: null,
      timestamp: null,
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      fill: 'transparent',
      strokeWidth: 0.1,
      stroke: 'transparent',
    })
    const konvaPixelMapImage = ref()
    onMounted(() => {
      stageConfig.value = {
        width: targetBoard.value.clientWidth,
        height: targetBoard.value.clientHeight,
        pixelRatio: 1,
        draggable: true,
        colorSpace: 'display-p3',
      }
      pixelMapPoller = setInterval(async () => {
        await store.getPixelMapImage()
      }, POLLER_MILLISECONDS)
      if (store.pixelMapImage) {
        buildCanvas()
      }
    })
    onBeforeUnmount(() => {
      clearInterval(pixelMapPoller)
    })
    const pixelMapBase64 = computed(() => {
      return store.pixelMapImage
    })
    const selectedColor = computed(() => {
      return store.selectedColor
    })
    const isPanelClosed = computed(() => {
      return !store.showPalettePanel
    })
    const selectedPixelInfo = computed(() => store.selectedPixelInfo)
    const stageNode = computed(() => stage.value.getNode())
    watch(pixelMapBase64, value => {
      if (value) {
        buildCanvas()
      }
    })
    watch(selectedColor, value => {
      if (value) {
        setSelectedPixelColor()
      } else {
        setSelectedPixelToDefault()
      }
    })
    watch(selectedPixelInfo, value => {
      if (value) {
        setSelectedPixelColor()
      } else {
        setSelectedPixelToDefault()
      }
    })
    watch(isPanelClosed, isClosed => {
      if (isClosed) {
        setSelectedPixelToDefault()
      }
    })
    function changeToMoveCursor() {
      stage.value.getStage().container().style.cursor = 'move'
    }
    function changeToDefaultCursor() {
      stage.value.getStage().container().style.cursor = 'auto'
    }
    function changeToPointerCursor() {
      stage.value.getStage().container().style.cursor = 'pointer'
    }
    function pixelId({ x, y }: Coordinates): string {
      return `${x}:${y}`
    }
    function onClick() {
      //If authorized Player show panel to paint
      if (store.username) {
        const relativePointerPosition =
          konvaPixelMapImage.value.getRelativePointerPosition()
        const pixelCoordinates = {
          x: Math.floor(relativePointerPosition.x),
          y: Math.floor(relativePointerPosition.y),
        }
        pixelSelection.position(pixelCoordinates)
        layer.batchDraw()
        store.togglePalettePanel(true)
        setSelectedPixel(pixelCoordinates)
      }
    }
    function setSelectedPixel({ x, y }: Coordinates) {
      if (
        !store.pixelToPaint ||
        pixelId({ x: store.pixelToPaint.x, y: store.pixelToPaint.y }) !==
          pixelId({ x, y })
      ) {
        store.getPixelInfo(x, y)
        store.setPixelToPaint({
          x: x,
          y: y,
          c: store.selectedColor ?? 0,
        })
      }
    }
    function buildCanvas() {
      loadImages()
      gridGroup.removeChildren()
      gridGroup.add(konvaPixelMapImage.value)
      if (stageNode.value.children.length) {
        layer.batchDraw()
      } else {
        pixelGroup.add(pixelSelection)
        layer.add(gridGroup)
        layer.add(pixelGroup)
        stageNode.value.add(layer)
        stageNode.value.scale({ x: 16, y: 16 })
      }
      gridGroup.on('click tap', onClick)
      gridGroup.on('mouseover', changeToPointerCursor)
      gridGroup.on('mouseout', changeToDefaultCursor)
    }
    function setSelectedPixelColor() {
      if (store.selectedPixelInfo?.owner) {
        pixelSelection.attrs.fill = COLORS[store.selectedPixelInfo?.color]
      } else if (store.selectedColor) {
        pixelSelection.attrs.fill = COLORS[store.selectedColor]
      } else {
        pixelSelection.attrs.fill = ColorHexMap.white
      }
      pixelSelection.attrs.stroke = ColorHexMap.black
      layer.batchDraw()
    }
    function setSelectedPixelToDefault() {
      pixelSelection.attrs.fill = 'transparent'
      pixelSelection.attrs.stroke = 'transparent'
      layer.batchDraw()
    }
    function avoidBlurryCanvas() {
      const ctx = layer.getContext()
      ctx._context.imageSmoothingEnabled = false
    }
    function loadImages() {
      if (pixelMapBase64.value) {
        pixelMapImage.onload = function () {
          avoidBlurryCanvas()
          konvaPixelMapImage.value.image(pixelMapImage)
        }
        pixelMapImage.src = pixelMapBase64.value
        konvaPixelMapImage.value = new Konva.Image({
          image: pixelMapImage,
          x: 0,
          y: 0,
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        })
      }
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
      targetBoard,
      stageConfig,
      stage,
      pixelColor,
      zoom,
      onClick,
      konvaPixelMapImage,
      changeToMoveCursor,
      changeToPointerCursor,
    }
  },
}
</script>
<style lang="scss">
.pixel-board {
  max-width: 100%;
  height: 100%;
  max-height: 90vh;
  overflow: hidden;
}
</style>
