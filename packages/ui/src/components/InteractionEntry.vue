<template>
  <div class="interaction-container">
    <ColorContainer
      :color="color"
      :direction="from ? Position.left : Position.right"
    >
      <p class="points bold">+{{ points }}px</p>
    </ColorContainer>
    <p v-if="from" class="origin">
      from
      <span class="name">{{ from }}</span>
    </p>
    <p v-if="to" class="origin">
      to
      <span class="name">{{ to }}</span>
    </p>
    <p class="interaction-label date">
      {{ time }}
    </p>
  </div>
</template>

<script lang="ts">
import { formatDistanceToNow } from '@/utils'
import { Position } from '@/types'
import { computed } from 'vue'
export default {
  props: {
    points: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      default: null,
    },
    from: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const time = computed(() => {
      return formatDistanceToNow(props.timestamp)
    })
    return {
      time,
      Position,
    }
  },
}
</script>

<style lang="scss" scoped>
.interaction-container {
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  color: $black;
  justify-content: center;
  align-items: center;
  padding: 16px;
  font-size: 12px;
  grid-gap: 16px;
  font-weight: bold;
}
.points {
  font-weight: bolder;
}
.date {
  font-size: 10px;
}
.origin {
  display: grid;
  text-align: left;
}
</style>
