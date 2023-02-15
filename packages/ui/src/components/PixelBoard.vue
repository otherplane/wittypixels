<template>
  <div class="pixel-board" ref="targetBoard">
    <LoadingSpinner v-if="!konvaPixelMapImage" />
    <v-stage
      ref="stage"
      class="stage"
      :config="stageConfig"
      @wheel="zoom"
      @touchmove="touchmove"
      @touchend="touchend"
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
    const lastCenter = ref()
    const lastDist = ref(0)
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
      if (store.selectedColor) {
        pixelSelection.attrs.fill = COLORS[store.selectedColor]
      } else if (store.selectedPixelInfo?.owner) {
        pixelSelection.attrs.fill = COLORS[store.selectedPixelInfo?.color]
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
    function touchmove(e: any) {
      e.evt.preventDefault()
      const touch1 = e.evt.touches[0]
      const touch2 = e.evt.touches[1]

      if (touch1 && touch2) {
        // if the stage was under Konva's drag&drop
        // we need to stop it, and implement our own pan logic with two pointers
        if (stageNode.value.isDragging()) {
          stageNode.value.stopDrag()
        }

        const p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        }
        const p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        }

        if (!lastCenter.value) {
          lastCenter.value = getCenter(p1, p2)
          return
        }
        const newCenter = getCenter(p1, p2)

        const dist = getDistance(p1, p2)

        if (!lastDist.value) {
          lastDist.value = dist
        }

        // local coordinates of center point
        const pointTo = {
          x: (newCenter.x - stageNode.value.x()) / stageNode.value.scaleX(),
          y: (newCenter.y - stageNode.value.y()) / stageNode.value.scaleX(),
        }

        const scale = stage.value.scaleX() * (dist / lastDist.value)

        stageNode.value.scaleX(scale)
        stageNode.value.scaleY(scale)

        // calculate new position of the stage
        const dx = newCenter.x - lastCenter.value.x
        const dy = newCenter.y - lastCenter.value.y

        const newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        }

        stageNode.value.position(newPos)

        lastDist.value = dist
        lastCenter.value = newCenter
        stageNode.value.batchDraw()
      }
    }
    function touchend() {
      lastDist.value = 0
      lastCenter.value = null
    }
    function getDistance(p1: any, p2: any) {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    }

    function getCenter(p1: any, p2: any) {
      return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
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
      touchmove,
      touchend,
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
