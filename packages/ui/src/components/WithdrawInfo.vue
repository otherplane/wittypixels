<template>
  <GameInfo class="redeem-complete-info">
    <p>Withdrawable funds: {{ walletInfo?.withdrawableEth }} ETH</p>
  </GameInfo>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'

export default {
  setup() {
    const gameStore = useGameStore()
    const walletInfo = computed(() => gameStore.walletInfo)
    const contractInfo = computed(() => gameStore.contractInfo)
    return { walletInfo, contractInfo }
  },
}
</script>

<style lang="scss" scoped>
.provider-container {
  width: 100%;
  padding: 16px;
  margin-bottom: 8px;
  .link {
    text-decoration: underline;
    line-break: anywhere;
    font-weight: bold;
    padding-bottom: 4px;
    font-size: 16px;
  }
  .external-link-icon {
    width: 12px;
    margin-left: 4px;
    display: inline-block;
  }
}
</style>
