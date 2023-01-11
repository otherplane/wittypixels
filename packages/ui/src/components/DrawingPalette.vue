<template>
  <div class="palette">
    <ColorSelector
      v-for="color in colors"
      :key="color"
      :color="color.color"
      :points="color.points"
    />
  </div>
</template>
<script>
import { COLORS } from '@/constants'
import { computed } from 'vue'
export default {
  setup() {
    const colors = computed(() => {
      return Object.values(COLORS).map(color => {
        return {
          points: 0,
          color: color,
        }
      })
    })
    return { colors }
  },
}
</script>
<style scoped land="scss">
.palette {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, 40px);
  grid-gap: 16px;
}
</style>
