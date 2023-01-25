<template>
  <div class="color-container">
    <PaintSvg
      v-if="direction == Position.right"
      class="color"
      :color="color"
      :direction="direction"
    />
    <div class="index-container"><slot></slot></div>
    <PaintSvg
      v-if="direction == Position.left"
      class="color"
      :color="color"
      :direction="direction"
    />
  </div>
</template>

<script lang="ts">
import { Position } from '@/types'
export default {
  props: {
    direction: {
      type: String,
      default: Position.right,
    },
    color: {
      type: String,
      default: 'lightgrey',
    },
  },
  setup() {
    return { Position }
  },
}
</script>

<style lang="scss">
.color-container {
  position: relative;
  display: grid;
  grid-template-columns: max-content max-content;
  justify-content: flex-start;
}
.color {
  height: 32px;
}
.index-container {
  border: 2px solid $black;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 32px;
  height: 32px;
  padding: 0 4px;
}
</style>
