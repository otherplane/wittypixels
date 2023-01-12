<template>
  <div class="background">
    <div class="witnet-logo-strip">
      <AppHeader />
    </div>
    <div class="layout">
      <slot name="main" />
      <slot name="bottom" />
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue-demi'
import { useStore } from '@/stores/player'
export default defineComponent({
  setup() {
    const player = useStore()
    return {
      player,
    }
  },
})
</script>
<style scoped lang="scss">
.background {
  height: 100vh;
  display: grid;
  grid-template-rows: max-content 1fr;
  left: 0;
  right: 0;
  z-index: 3;
  background-color: $white;
  background: $white;
}
.witnet-logo-strip {
  position: relative;
  background-color: $white;
  z-index: 12;
}

.layout {
  overflow: auto;
  z-index: 7;
  width: 100%;
  max-width: 700px;
  margin-top: 32px;
  margin: 0 auto;
  grid-template-rows: 1fr;
}
</style>
