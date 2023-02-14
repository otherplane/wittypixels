<template>
  <div
    :class="{ selected }"
    :style="{ 'background-color': shade.color }"
    @click="selectShade"
  ></div>
</template>
<script>
import { useStore } from '@/stores/player'
import { computed } from 'vue'
export default {
  props: {
    shade: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore()

    const selected = computed(() => {
      return store.selectedShade == props.shade.key
    })

    function selectShade() {
      store.selectedShade = props.shade.key
    }

    return { selectShade, selected }
  },
}
</script>

<style lang="scss" scoped>
.selected {
  border: 1.5px solid $black;
  border-radius: 0px;
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}
</style>
