<template>
  <GameInfo v-if="gameStore.redeemCountdownOver" class="provider-container">
    <p>
      {{ network ? `Connected to ${network}` : 'No web3 provider connected' }}
    </p>
    <p>{{ cropMiddle(`${address ?? ''}`, 20) }}</p>
  </GameInfo>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/game'
import { cropMiddle } from '@/utils'
import { computed } from 'vue'

export default {
  setup() {
    const gameStore = useGameStore()
    const network = computed(() => gameStore.provider.network)
    const address = computed(() => gameStore.provider.address)
    return {
      gameStore,
      network,
      address,
      cropMiddle,
    }
  },
}
</script>

<style lang="scss" scoped>
.provider-container {
  width: 100%;
  padding: 16px;
}
</style>
