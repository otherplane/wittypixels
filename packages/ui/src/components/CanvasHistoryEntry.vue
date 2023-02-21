<template>
  <div class="interaction-container">
    <ColorContainer
      :color="color"
      :direction="stolenFrom ? Position.right : Position.left"
    >
      <p class="points bold">{{ x }}:{{ y }}</p>
    </ColorContainer>
    <p v-if="stolenFrom === owner" class="origin">Pixel overpainted</p>
    <p v-else-if="stolenFrom" class="origin">
      Pixel stolen by
      <span class="name">@{{ owner }}</span>
    </p>
    <p v-else-if="stolenTo" class="origin">
      Pixel stolen to
      <span class="name">@{{ stolenTo }}</span>
    </p>
    <p v-else class="origin">Pixel painted</p>
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
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      default: null,
    },
    stolenTo: {
      type: String,
      default: null,
    },
    stolenFrom: {
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
