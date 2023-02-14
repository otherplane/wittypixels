<template>
  <div
    class="color"
    :class="{ selected, ['disabled']: !points }"
    :style="{ 'background-color': background }"
    @click="selectColor"
  >
    <p class="text" :class="{ [color]: color, ['disabled']: !points }">
      {{ points ? `${points}x` : '' }}
    </p>
  </div>
</template>
<script>
import { useStore } from '@/stores/player'
import { getColor } from '@/composables/getColor'
import { computed } from 'vue'
export default {
  props: {
    color: {
      type: Number,
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
      return store.selectedColor == props.color && props.points > 0
    })

    function selectColor() {
      if (props.points > 0) {
        store.selectColor(props.color)
      } else {
        store.selectColor(null)
      }
    }
    return { selectColor, selected, background: getColor(props.color, 3) }
  },
}
</script>
<style scoped lang="scss">
.color {
  height: 24px;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  cursor: pointer;
  .text {
    font-size: 12px;
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
  border: 1.5px solid $black;
}
</style>
