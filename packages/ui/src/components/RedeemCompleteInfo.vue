<template>
  <GameInfo
    v-if="(walletInfo?.wpxBalance ?? 0) > 0"
    class="redeem-complete-info"
  >
    <p>Balance: {{ walletInfo?.wpxBalance }} WPX</p>
  </GameInfo>
  <GameInfo v-if="ownership > 0" class="redeem-complete-info">
    <p>Ownership: {{ ownership }}%</p>
  </GameInfo>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'

export default {
  setup() {
    const gameStore = useGameStore()
    const walletInfo = computed(() => gameStore.walletInfo)
    const ownership = computed(
      () => (walletInfo.value?.wpxShare10000 ?? 0) / 100
    )
    return { walletInfo, ownership }
  },
}
</script>

<style lang="scss" scoped>
.redeem-complete-info {
  margin-bottom: 8px;
  &:first-of-type {
    margin-top: 16px;
  }
  &:last-of-type {
    margin-bottom: 0px;
  }
}
</style>
