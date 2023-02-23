<template>
  <div v-if="gameOverStatus">
    <GameInfo v-if="awaitingAuction" class="await-auction">
      <p>AWAITING AUCTION</p>
    </GameInfo>
    <GameInfo v-else-if="auctionStarted" class="auction-price">
      <p>AUCTION PRICE: {{ contractInfo?.currentPrice }} ETH</p>
    </GameInfo>
    <GameInfo v-else-if="NFTSold" class="nft-sold">
      <p>ACQUIRED FOR: {{ contractInfo?.currentPrice }} ETH</p>
    </GameInfo>
    <GameInfo v-else>
      <p>GAME OVER</p>
    </GameInfo>
  </div>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/game'
import { GameOverStatus } from '@/types'
import { computed } from 'vue'

export default {
  setup() {
    const gameStore = useGameStore()
    const gameOverStatus = computed(() => gameStore.gameOverStatus)
    const NFTSold = computed(
      () => gameOverStatus.value === GameOverStatus.Acquired
    )
    const auctionStarted = computed(
      () => gameOverStatus.value === GameOverStatus.AllowSale
    )
    const awaitingAuction = computed(
      () => gameOverStatus.value === GameOverStatus.AwaitSale
    )
    const contractInfo = computed(() => gameStore.contractInfo)
    return {
      contractInfo,
      gameOverStatus,
      NFTSold,
      auctionStarted,
      awaitingAuction,
    }
  },
}
</script>

<style lang="scss" scoped>
.await-auction {
  background-color: rgba(255, 87, 48, 0.804);
}
.auction-price {
  background-color: rgba(8, 180, 57, 0.804);
}
.nft-sold {
  background-color: rgb(209, 2, 50, 0.804);
}
</style>
