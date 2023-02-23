<template>
  <MainLayout v-if="player.username">
    <template v-slot:top>
      <InteractionInfo />
    </template>
    <template v-slot:main>
      <transition name="fade">
        <div class="game-info" v-if="!player.showPalettePanel">
          <GameOverCountdown />
          <GameOverStatus />
          <BonusCountdown v-if="player.bonus" />
          <GameInfo>
            <p>@{{ player.username }}</p></GameInfo
          >
          <GameInfo v-if="!redeemCountdownOver">
            <p>{{ player.score }} WPX</p></GameInfo
          >
        </div>
      </transition>
      <PixelBoard />
    </template>
    <template v-slot:bottom>
      <GameActions />
    </template>
    <template v-slot:bottom-2>
      <PanelSlider :showPanel="player.showPalettePanel">
        <DrawingPalette />
      </PanelSlider>
    </template>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { useGameStore } from '@/stores/game'
import { useLocalStore } from '@/stores/local'
import { useModalStore } from '@/stores/modal'
import { ModalKey, CallApiKey } from '@/types'
import { onBeforeMount, onMounted, onBeforeUnmount, computed } from 'vue'
import { POLLER_MILLISECONDS } from '@/constants'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const player = useStore()
    const localStore = useLocalStore()
    const gameStore = useGameStore()
    const router = useRouter()
    const modalStore = useModalStore()
    let playerInfoPoller = null

    onBeforeMount(async () => {
      const token = await localStore.getToken()
      if (!token) {
        await player.authorize({ key: router.currentRoute.value.params.id })
        if (!player.errors[CallApiKey.auth]) {
          modalStore.openModal(ModalKey.export)
        }
      } else {
        await player.getPlayerInfo()
        if (
          player.id &&
          router.currentRoute.value.params.id &&
          player.id !== router.currentRoute.value.params.id
        ) {
          await player.interact({ key: router.currentRoute.value.params.id })
        }
      }
    })
    onMounted(() => {
      playerInfoPoller = setInterval(async () => {
        await player.getPlayerInfo()
      }, POLLER_MILLISECONDS)
    })
    onBeforeUnmount(() => {
      clearInterval(playerInfoPoller)
    })
    const redeemCountdownOver = computed(() => gameStore.redeemCountdownOver)
    return {
      redeemCountdownOver,
      player,
    }
  },
}
</script>
<style lang="scss">
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.game-info {
  position: absolute;
  max-width: max-content;
  z-index: 20;
  margin: 16px;
  display: grid;
  grid-template-rows: max-content max-content max-content;
  grid-template-columns: 1fr;
  grid-gap: 8px;
  justify-content: space-between;
  grid-template-rows: 1fr;
  .provider-info {
    max-width: 670px;
    width: 90vw;
  }
}
</style>
