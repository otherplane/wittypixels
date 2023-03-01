<template>
  <MainLayout :hideNavBar="true">
    <template v-slot:main>
      <div class="cover">
        <h2 class="title">The largest collaborative NFT creation to date!</h2>
        <div class="background">
          <GameOverStatus class="game-status" />
          <PixelBoard />
        </div>
      </div>
    </template>
    <template v-slot:bottom>
      <router-link v-if="!gameOver" to="/disclaimer">
        <CustomButton type="primary"> Play now </CustomButton>
      </router-link>
      <WalletInfo v-if="redeemCountdownOver" class="connected-provider" />
      <ConnectToProvider v-if="redeemCountdownOver" />
      <CreateTransaction
        v-if="redeemCountdownOver && !networkError && !isFractionalizing"
        :txType="TxType.Buy"
      />
    </template>
  </MainLayout>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/game'
import { useLocalStore } from '@/stores/local'
import { GameOverStatus } from '@/types'
import { computed, onMounted, watch } from 'vue'
import { TxType } from '@/types'
export default {
  setup() {
    const gameStore = useGameStore()
    const localStore = useLocalStore()
    onMounted(() => {
      if (gameStore.isGameOver) {
        gameStore.setGameOver()
      }
      if (gameStore.isRedeemCountdownOver) {
        gameStore.setRedeemCountdownOver()
      }
    })
    const networkError = computed(
      () =>
        gameStore.errors.web3Disconnected || gameStore.errors.web3WrongNetwork
    )
    const gameOverStatus = computed(() => gameStore.gameOverStatus)
    const isFractionalizing = computed(
      () => gameOverStatus.value === GameOverStatus.Fractionalizing
    )
    watch(gameOverStatus, value => {
      if (value == GameOverStatus.AllowSale) {
        localStore.saveTxInfo({ txType: TxType.Buy })
      }
    })
    const gameOver = computed(() => gameStore.gameOver)
    const redeemCountdownOver = computed(() => gameStore.redeemCountdownOver)
    return {
      networkError,
      isFractionalizing,
      gameOverStatus,
      gameOver,
      redeemCountdownOver,
      TxType,
    }
  },
}
</script>

<style lang="scss" scoped>
.cover {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .title {
    padding-bottom: 16px;
  }
  .game-status {
    position: absolute;
    margin: 16px;
    z-index: 20;
  }
  .background {
    width: 100%;
    border-top: 2px solid $black;
    background-position: center;
    background-size: cover;
    height: 100%;
  }
}
@media (max-width: 600px) {
  .cover {
    .title {
      padding: 0 16px 16px 16px;
    }
  }
}
</style>
