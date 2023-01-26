<template>
  <MainLayout v-if="player.username">
    <template v-slot:top>
      <InteractionInfo />
    </template>
    <template v-slot:main>
      <div class="float">
        <div class="game-info">
          <GameOverCountdown />
          <GameInfo
            ><p>@{{ player.username }}</p></GameInfo
          >
        </div>
        <MintInformation />
      </div>
      <PixelBoard />
    </template>
    <template v-slot:bottom>
      <GameActions
        @openMintModal="openModal('mint')"
        @addNetwork="addPolygonNetwork"
      />
    </template>
    <template v-slot:bottom-2>
      <PanelSlider :showPanel="player.showPalettePanel">
        <DrawingPalette />
      </PanelSlider>
    </template>
  </MainLayout>

  <ModalDialog
    :show="modalStore.modal.visible"
    v-on:close="modalStore.closeModal"
  >
    <GameOverModal v-if="modalStore.modals.gameOver" />
    <ModalExport v-if="modalStore.modals.export" />
    <ModalMint v-if="modalStore.modals.mint" />
  </ModalDialog>
</template>

<script>
import { useStore } from '@/stores/player'
import { useLocalStore } from '@/stores/local'
import { useModalStore } from '@/stores/modal'
import { useGameStore } from '@/stores/game'
import { ModalKey } from '@/types'
import { onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { useWeb3 } from '../composables/useWeb3'
import { POLLER_MILLISECONDS } from '@/constants'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const player = useStore()
    const localStore = useLocalStore()
    const gameStore = useGameStore()
    const router = useRouter()
    const modalStore = useModalStore()
    const web3WittyCreatures = useWeb3()
    let playerInfoPoller = null
    // TODO: HANDLE END OF GAME
    onBeforeMount(async () => {
      const token = await localStore.getToken()
      if (!token) {
        await player.authorize({ key: router.currentRoute.value.params.id })
        modalStore.openModal(ModalKey.export)
      } else {
        await player.getPlayerInfo()
        if (
          player.id &&
          router.currentRoute.value.params.id &&
          player.id !== router.currentRoute.value.params.id
        ) {
          await player.interact({ key: router.currentRoute.value.params.id })
        }
        if (gameStore.gameOver) {
          await localStore.getMintInfo()
          if (localStore.minted) {
            // TODO: get token info
          }
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
      modalStore,
      player,
      addPolygonNetwork: web3WittyCreatures.addPolygonNetwork,
    }
  },
}
</script>
<style lang="scss">
.float {
  position: absolute;
  max-width: 700px;
  z-index: 20;
  width: 100%;
  .game-info {
    margin: 16px;
    display: grid;
    grid-template-rows: max-content max-content;
    grid-gap: 8px;
    justify-content: space-between;
    grid-template-rows: 1fr;
  }
}
</style>
