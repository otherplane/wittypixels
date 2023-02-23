<template>
  <GameInfo
    v-if="gameStore.redeemCountdownOver"
    class="provider-container"
    id="wallet-info"
  >
    <p id="connected-provider">
      {{ network ? `Connected to ${network}` : 'No web3 provider connected' }}
    </p>
    <p class="address" id="wallet-address">
      {{ cropMiddle(`${address ?? ''}`, 22) }}
    </p>
    <div v-if="showRedeemCompleteInfo" id="redeem-info">
      <RedeemCompleteInfo class="wallet-info" />
    </div>
    <div
      v-if="
        !gameStore.errors.web3WrongNetwork &&
        gameStore.gameOverStatus === GameOverStatus.AllowWithdraw
      "
      id="withdraw-info"
    >
      <WithdrawInfo class="wallet-info" />
    </div>
    <TransactionHash id="tx-hash" class="transaction-info" v-if="txHash" />
  </GameInfo>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/game'
import { useLocalStore } from '@/stores/local'
import { cropMiddle } from '@/utils'
import { computed, type ComputedRef } from 'vue'
import { GameOverStatus } from '@/types'

export default {
  setup() {
    const gameStore = useGameStore()
    const localStore = useLocalStore()
    const showRedeemCompleteInfo: ComputedRef<boolean> = computed(() => {
      return (
        !gameStore.errors.web3WrongNetwork &&
        (gameStore.gameOverStatus === GameOverStatus.AwaitSale ||
          gameStore.gameOverStatus === GameOverStatus.AllowSale)
      )
    })
    const network = computed(() => gameStore.provider.network)
    const address = computed(() => gameStore.provider.address)
    const txHash = computed(() => localStore.txInfo?.txHash)
    return {
      gameStore,
      showRedeemCompleteInfo,
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
