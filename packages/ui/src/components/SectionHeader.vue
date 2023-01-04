<template>
  <div class="header">
    <router-link to="/">
      <div class="back-container">
        <p>BACK</p>
      </div>
    </router-link>
    <router-link to="/"> </router-link>
    <h3 class="title-section">{{ title }}</h3>
  </div>
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
.header {
  display: grid;
  justify-items: center;
  grid-template-rows: max-content 1fr;
  align-items: center;
  column-gap: 24px;
  .back-container {
    position: absolute;
    display: flex;
    top: 24px;
    left: 16px;
    font-weight: 600;
    color: var(--primary-color);
  }
  .angle {
    margin-right: 8px;
    width: 10px;
  }
  .ranch-img {
    width: 138px;
    height: 100px;
    margin-bottom: 8px;
  }
  .title-section {
    font-family: 'Road Store', sans-serif;
    font-size: 24px;
    font-weight: bold;
    color: var(--primary-color);
  }
}
</style>
