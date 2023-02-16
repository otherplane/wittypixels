<template>
  <MainLayout :hideNavBar="true">
    <template v-slot:main>
      <div class="cover">
        <h2 class="title">
          Participate in the biggest collaborative act of NFT creation to date!
        </h2>
        <div class="background">
          <ProviderConnected class="float" />
          <PixelBoard />
        </div>
      </div>
    </template>
    <template v-slot:bottom>
      <router-link v-if="!gameOver" to="/disclaimer">
        <CustomButton type="primary"> Play now </CustomButton>
      </router-link>
      <ConnectToProvider v-if="redeemCountdownOver" />
      <CreateTransaction v-if="redeemCountdownOver" :txType="TxType.Buy" />
    </template>
  </MainLayout>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/game'
import { computed, onMounted } from 'vue'
import { TxType } from '@/types'
export default {
  setup() {
    const gameStore = useGameStore()
    onMounted(() => {
      if (gameStore.isGameOver) {
        gameStore.setGameOver()
      }
      if (gameStore.isRedeemCountdownOver) {
        gameStore.setRedeemCountdownOver()
      }
    })
    const gameOver = computed(() => gameStore.gameOver)
    const redeemCountdownOver = computed(() => gameStore.redeemCountdownOver)
    return { gameOver, redeemCountdownOver, TxType }
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
  .background {
    width: 100%;
    border-top: 2px solid $black;
    background-position: center;
    background-size: cover;
    height: 100%;
    .float {
      margin: 16px;
      position: absolute;
      max-width: 700px;
      z-index: 20;
      width: 90vw;
    }
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
