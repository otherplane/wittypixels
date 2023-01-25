<template>
  <svg
    :width="width"
    :class="{ paint: direction == Position.left }"
    :height="height"
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      v-if="direction == Position.right"
      d="M7.50993 0.676514V6.82357H14.1766V0.676514H7.50993ZM20.8433 0.676514V6.82357H27.5099V12.9706H20.8433V25.2648H14.1766V31.4118H27.5099H30.8433V6.82357V0.676514H20.8433ZM10.8433 12.9706V19.1177H17.5099V12.9706H10.8433ZM0.843262 19.1177V25.2648H7.50993V19.1177H0.843262Z"
      :fill="color"
    />
    <path
      v-if="direction == Position.left"
      d="M24.4785 30.7501L24.445 24.6031L17.7785 24.6393L17.8119 30.7863L24.4785 30.7501ZM11.1453 30.8225L11.1119 24.6756L4.44533 24.7118L4.4119 18.5649L11.0785 18.5286L11.0116 6.23467L17.6782 6.19843L17.6448 0.0514583L4.31164 0.123951L0.978356 0.142075L1.11204 24.7299L1.14546 30.8769L11.1453 30.8225ZM21.0783 18.4742L21.0449 12.3273L14.3783 12.3635L14.4118 18.5105L21.0783 18.4742ZM31.0448 12.2729L31.0113 6.12593L24.3448 6.16218L24.3782 12.3091L31.0448 12.2729Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { computed } from 'vue'
import { Position } from '@/types'
export default {
  props: {
    color: {
      type: String,
      default: 'lightgrey',
    },
    direction: {
      type: String,
      default: Position.right,
    },
  },
  setup(props) {
    const viewBox = computed(() => {
      return props.direction == Position.right ? '0 0 31 32' : '0 0 32 31'
    })
    const height = computed(() => {
      return props.direction == Position.right ? '32' : '31'
    })
    const width = computed(() => {
      return props.direction == Position.right ? '31' : '32'
    })
    return { viewBox, Position, height, width }
  },
}
</script>

<style>
.paint {
  margin-left: -1px;
}
</style>
