<template>
  <GameInfo v-if="gameStore.redeemCountdownOver" class="provider-container">
    <p>
      {{ network ? `Connected to ${network}` : 'No web3 provider connected' }}
    </p>
    <p class="address">{{ cropMiddle(`${address ?? ''}`, 22) }}</p>
    <RedeemCompleteInfo
      id="redeem-complete-info"
      class="wallet-info"
      v-if="
        !gameStore.errors.web3WrongNetwork &&
        (gameStore.gameOverStatus === GameOverStatus.AwaitSale ||
          gameStore.gameOverStatus === GameOverStatus.AllowSale)
      "
    />
    <WithdrawInfo
      class="wallet-info"
      v-if="
        !gameStore.errors.web3WrongNetwork &&
        gameStore.gameOverStatus === GameOverStatus.AllowWithdraw
      "
    />
    <TransactionHash class="transaction-info" v-if="txHash" />
  </GameInfo>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/game'
import { useLocalStore } from '@/stores/local'
import { cropMiddle } from '@/utils'
import { computed } from 'vue'
import { GameOverStatus } from '@/types'

export default {
  setup() {
    const gameStore = useGameStore()
    const localStore = useLocalStore()
    const network = computed(() => gameStore.provider.network)
    const address = computed(() => gameStore.provider.address)
    const txHash = computed(() => localStore.txInfo?.txHash)
    return {
      gameStore,
      txHash,
      network,
      address,
      cropMiddle,
      GameOverStatus,
    }
  },
}
</script>

<style lang="scss" scoped>
.provider-container {
  width: 100%;
  padding: 16px;
  .address {
    font-family: 'Roboto Mono', monospace;
  }
  .wallet-info {
    margin-top: 16px;
    max-width: 70vw;
  }
  .transaction-info {
    margin-top: 8px;
  }
}
</style>
