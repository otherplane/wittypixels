<template>
  <div class="loading-container" :style="{ height: `${vheight}vh` }">
    <div class="loading"></div>
    <p class="text">Loading</p>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    vheight: {
      type: Number,
      default: 60,
    },
  },
}
</script>

<style lang="scss">
.loading-container {
  max-width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: grid;
  justify-content: center;
  grid-template-rows: max-content max-content;
  grid-gap: 16px;
  align-content: center;
  align-items: center;
  text-align: center;
  text-justify: center;
  .text {
    width: max-content;
    display: flex;
  }
  .loading {
    animation: 5s spinnow infinite linear;
    height: 24px;
    width: 24px;
    margin: 0 auto;
    border: 2px solid $black;
  }
}
@keyframes spinnow {
  100% {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}
</style>
