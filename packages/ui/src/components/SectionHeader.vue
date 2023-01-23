<template>
  <h3 class="title-section">{{ title }}</h3>
</template>

<script>
import { importSvg } from '@/composables/importSvg.js'
import { useStore } from '@/stores/player'
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const player = useStore()
    return { player, importSvg }
  },
}
</script>

<style scoped lang="scss">
.title-section {
  font-family: 'Road Store', sans-serif;
  font-size: 24px;
  font-weight: bold;
  color: $black;
}
</style>
