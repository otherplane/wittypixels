<template>
  <div class="witnet-logo">
    <a href="https://witnet.io/" target="_blank">
      <svgImage class="logo" :svg="wittyLogo" />
    </a>
    <p class="witnet-subtitle">THE MULTICHAIN DECENTRALIZED ORACLE</p>
  </div>
</template>
<script>
import wittyLogo from '@/assets/witnet-logo.svg?raw'
export default {
  setup() {
    return { wittyLogo }
  },
}
</script>
<style lang="scss" scoped>
.witnet-logo {
  background-color: $black;
  color: white;
  height: max-content;
  position: relative;
  text-align: end;
  top: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 100px 150px;
  justify-content: space-between;
  .logo {
    position: relative;
    top: 8px;
  }
  .witnet-subtitle {
    font-size: 10px;
    position: relative;
    font-family: Roboto, sans-serif;
    font-weight: 600;
  }
  &::before {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 0;
    width: 0;
    height: 0;
    border-right: 100vw solid transparent;
    border-top: 16px solid $black;
    z-index: 10;
  }
}
</style>
