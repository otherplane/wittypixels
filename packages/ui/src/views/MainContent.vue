<template>
  <MainLayout v-if="player.username">
    <template v-slot:main>
      <PlayGround />
    </template>
    <template v-slot:bottom>
      <GameActions
        @openMintModal="openModal('mint')"
        @addNetwork="addPolygonNetwork"
      />
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
import { onBeforeMount, onMounted, onBeforeUnmount, reactive } from 'vue'
import { useModal } from '@/composables/useModal'
import { useWeb3 } from '../composables/useWeb3'
import { POLLER_MILLISECONDS } from '@/constants.js'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const modal = useModal()
    const player = useStore()
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
      const token = await player.getToken()
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
          await player.getMintInfo()
          await player.getPreviews()
          if (player.minted) {
            await web3WittyCreatures.getTokenIds()
            await player.getMintedAwardsImages()
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
