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

  <ModalDialog :show="modal.visible.value" v-on:close="closeModal">
    <ModalExport v-if="modals.export" />
    <GameOverModal v-if="modals.gameOver" />
    <ModalMint v-if="modals.mint" />
  </ModalDialog>
</template>

<script>
import { useStore } from '@/stores/player'
import { useLocalStore } from '@/stores/local'
import { onBeforeMount, onMounted, onBeforeUnmount, reactive } from 'vue'
import { useModal } from '@/composables/useModal'
import { useWeb3 } from '../composables/useWeb3'
import { POLLER_MILLISECONDS } from '@/constants'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const modal = useModal()
    const player = useStore()
    const localStore = useLocalStore()
    const router = useRouter()
    const web3WittyCreatures = useWeb3()
    const modals = reactive({
      mint: false,
      export: false,
      preview: false,
      gameOver: false,
    })
    let playerInfoPoller = null
    // TODO: HANDLE END OF GAME
    onBeforeMount(async () => {
      const token = await localStore.getToken()
      if (!token) {
        await player.authorize({ key: router.currentRoute.value.params.id })
        openModal('export')
      } else {
        await player.getPlayerInfo()
        if (
          player.id &&
          router.currentRoute.value.params.id &&
          player.id !== router.currentRoute.value.params.id
        ) {
          await player.interact({ key: router.currentRoute.value.params.id })
        }
        if (player.gameOver) {
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
    function openModal(name) {
      const needProvider = name === 'mint'
      if (!web3WittyCreatures.isProviderConnected.value && needProvider) {
        modals['gameOver'] = true
      } else {
        modals[name] = true
      }
      modal.showModal()
    }
    function closeModal() {
      modals.mint = false
      modals.export = false
      modals.preview = false
      modals.gameOver = false
      modal.hideModal()
    }
    return {
      player,
      closeModal,
      openModal,
      modal,
      modals,
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
