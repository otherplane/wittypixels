<template>
  <div
    class="color"
    :class="{ selected, ['disabled']: !points }"
    :style="{ 'background-color': color }"
    @click="selectColor"
  >
    <p class="text" :class="{ [color]: color, ['disabled']: !points }">
      {{ points ? `${points}x` : '' }}
    </p>
  </div>
</template>
<script>
import { useStore } from '@/stores/player'
import { computed } from 'vue'
export default {
  props: {
    color: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const store = useStore()

    const selected = computed(() => {
      return store.selectedColor == props.color
    })

    function selectColor() {
      if (props.points > 0) {
        store.selectColor(props.color)
      } else {
        store.selectColor(null)
      }
    }

    return { selectColor, selected }
  },
}
</script>
<style scoped lang="scss">
.color {
  height: 30px;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  cursor: pointer;
  .text {
    font-size: 14px;
    font-weight: bold;
    color: $black;
  }
  .black {
    color: $white;
  }
  &.disabled {
    opacity: 0.5;
  }
}
.selected {
  border: 2px solid $black;
}
</style>
