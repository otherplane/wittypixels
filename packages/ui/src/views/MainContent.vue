<template>
  <MainLayout v-if="player.username">
    <template v-slot:top>
      <InteractionInfo />
    </template>
    <template v-slot:main>
      <ProviderConnected class="provider-info" />
      <div class="float">
        <div class="game-info">
          <GameOverCountdown />
          <BonusCountdown v-if="player.bonus" />
          <GameInfo>
            <p>@{{ player.username }}</p></GameInfo
          >
        </div>
      </div>
      <MintInformation />
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
import { useLocalStore } from '@/stores/local'
import { useModalStore } from '@/stores/modal'
import { ModalKey, ErrorKey } from '@/types'
import { onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { POLLER_MILLISECONDS } from '@/constants'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const player = useStore()
    const localStore = useLocalStore()
    const router = useRouter()
    const modalStore = useModalStore()
    let playerInfoPoller = null

    onBeforeMount(async () => {
      const token = await localStore.getToken()
      if (!token) {
        await player.authorize({ key: router.currentRoute.value.params.id })
        if (!player.errors[ErrorKey.auth]) {
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
    return {
      player,
    }
  },
}
</script>
<style lang="scss">
.float {
  position: absolute;
  max-width: max-content;
  z-index: 20;
  .game-info {
    margin: 16px;
    display: grid;
    grid-template-rows: max-content max-content;
    grid-template-columns: 1fr;
    grid-gap: 8px;
    justify-content: space-between;
    grid-template-rows: 1fr;
  }
}
.provider-info {
  position: relative;
  max-width: 700px;
  z-index: 20;
  width: 100%;
  margin: 0 auto;
  margin-top: 16px;
  top: 0px;
}
</style>
