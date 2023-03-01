<template>
  <div v-if="gameOverStatus">
    <GameInfo v-if="awaitingAuction" class="await-auction">
      <p>AWAITING AUCTION</p>
    </GameInfo>
    <div v-else-if="auctionStarted">
      <GameInfo
        class="auction-price"
        :class="{ flicker: showPriceAnimation && nextPriceTimestamp }"
      >
        <p>AUCTION PRICE: {{ contractInfo?.currentPrice }} ETH</p>
        <TimeLeft
          v-if="showTimeLeft && nextPriceTimestamp"
          :timestamp="standardizedNextPriceTimestamp"
          :prev-timestamp="standardizedPrevPriceTimestamp"
          :in-percentage="true"
          @time-ending="togglePriceAnimation"
          @clear-timestamp="getContractInfo"
        />
      </GameInfo>
    </div>
    <GameInfo v-else-if="NFTSold" class="nft-sold">
      <p>ACQUIRED FOR {{ contractInfo?.currentPrice }} ETH</p>
    </GameInfo>
    <GameInfo v-else>
      <p>GAME OVER</p>
    </GameInfo>
  </div>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/game'
import { GameOverStatus } from '@/types'
import { computed, ref, watch } from 'vue'
const AVERAGE_BLOCK_TIME_MILLISECONDS = 15000

export default {
  setup() {
    const prevPriceTimestamp = ref()
    const showTimeLeft = ref(true)
    const showPriceAnimation = ref(false)
    const gameStore = useGameStore()
    const gameOverStatus = computed(() => gameStore.gameOverStatus)
    const NFTSold = computed(
      () =>
        gameOverStatus.value === GameOverStatus.Acquired ||
        gameOverStatus.value === GameOverStatus.AllowWithdraw ||
        gameOverStatus.value === GameOverStatus.AlreadyWithdrawn
    )
    const auctionStarted = computed(
      () => gameOverStatus.value === GameOverStatus.AllowSale
    )
    const awaitingAuction = computed(
      () => gameOverStatus.value === GameOverStatus.AwaitSale
    )
    const nextPriceTimestamp = computed(
      () => contractInfo.value?.nextPriceTimestamp
    )
    // Next price timestamp in milliseconds plus average block time
    const standardizedNextPriceTimestamp = computed(() =>
      nextPriceTimestamp.value && nextPriceTimestamp.value > 0
        ? nextPriceTimestamp.value * 1000 + AVERAGE_BLOCK_TIME_MILLISECONDS
        : 0
    )
    // Prev price timestamp in milliseconds
    const standardizedPrevPriceTimestamp = computed(
      () => prevPriceTimestamp.value * 1000
    )
    const contractInfo = computed(() => {
      return gameStore.contractInfo
    })
    watch(nextPriceTimestamp, (_current: any, prev: any) => {
      showTimeLeft.value = true
      prevPriceTimestamp.value = prev
    })
    function getContractInfo() {
      showTimeLeft.value = false
      gameStore.web3.getERC20ContractInfo()
    }
    function togglePriceAnimation(value: boolean) {
      showPriceAnimation.value = value
    }
    return {
      showPriceAnimation,
      standardizedNextPriceTimestamp,
      standardizedPrevPriceTimestamp,
      showTimeLeft,
      togglePriceAnimation,
      getContractInfo,
      contractInfo,
      nextPriceTimestamp,
      gameOverStatus,
      NFTSold,
      auctionStarted,
      awaitingAuction,
      prevPriceTimestamp,
    }
  },
}
</script>

<style lang="scss" scoped>
@-webkit-keyframes flickerAnimation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
@keyframes flickerAnimation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
.flicker {
  -webkit-animation: flickerAnimation 0.6s infinite;
  animation: flickerAnimation 0.6s infinite;
}
.await-auction {
  background-color: rgba(255, 87, 48, 0.804);
}
.auction-price {
  background-color: rgba(8, 180, 57, 0.804);
}
.next-auction-price {
  margin-top: 8px;
}
.nft-sold {
  background-color: rgb(209, 2, 50, 0.804);
}
</style>
