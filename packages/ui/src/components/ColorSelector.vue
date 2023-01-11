<template>
  <div
    class="color"
    :class="{ selected }"
    :style="{ 'background-color': color }"
    @click="selectColor"
  >
    <p v-if="points">{{ points }}x</p>
    <p v-else>x</p>
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
      store.selectColor(props.color)
    }

    return { selectColor, selected }
  },
}
</script>
<style scoped lang="scss">
.color {
  padding: 4px 8px;
  border: 1px solid $black-secondary;
  border-radius: 4px;
  cursor: pointer;
}
.selected {
  border: 2px solid $black;
}
</style>
