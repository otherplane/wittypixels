<template>
  <MainLayout :hideNavBar="true">
    <template v-slot:main>
      <div class="cover">
        <div class="title">
          <h2>The largest collaborative NFT creation to date!</h2>
          <a
            class="subtitle"
            href="https://witnet.network/search/b9d56f8e178fab41f0d497ac3d2cd6c943d33977f92ca8adfb602512a4eb6975"
            target="_blank"
          >
            Secured by <SvgImage class="logo" :svg="witnetLogo" />
          </a>
        </div>
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
        :txType="txType"
      />
    </template>
  </MainLayout>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/game'
import { useLocalStore } from '@/stores/local'
import { GameOverStatus } from '@/types'
import witnetLogo from '@/assets/witnet-logo-dark.svg?raw'
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
    const txType = computed(() => localStore.txInfo?.txType)
    watch(gameOverStatus, value => {
      if (value == GameOverStatus.AllowSale) {
        localStore.saveTxInfo({ txType: TxType.Buy })
      } else if (value == GameOverStatus.AllowWithdraw) {
        localStore.saveTxInfo({ txType: TxType.Withdraw })
      } else if (!localStore.txInfo?.txHash) {
        localStore.saveTxInfo({})
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
      txType,
      witnetLogo,
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
    .subtitle {
      text-decoration: underline;
      margin-top: 16px;
      font-size: 14px;
      display: flex;
      align-items: center;
      .logo {
        height: 20px;
        width: 80px;
        padding: 0 4px;
        position: inline;
      }
    }
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
