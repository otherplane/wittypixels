<template>
  <MainLayout v-if="player.username">
    <NavBar class="navbar" @openExportModal="openModal('export')" />
    <div class="main-content">
      <div class="header">
        <div class="player-info">
          <p class="subtitle player-id">{{ player.username.toUpperCase() }}</p>
          <p class="subtitle">
            <span class="points-bold">{{ formatNumber(player.score) }}</span>
            points
          </p>
          <p class="subtitle">
            <span class="subtitle label">ID: </span>{{ player.id }}
          </p>

          <p v-if="!player.demoOver" class="subtitle">
            <span class="subtitle label">DEMO ENDS IN:</span>
            <TimeLeft
              class="time-left"
              :timestamp="player.demoOverTimeMilli"
              :seconds="true"
            />
          </p>
          <p v-else-if="!player.gameOver" class="subtitle">
            <span class="subtitle label">GAME ENDS IN:</span>
            <TimeLeft
              class="time-left"
              :timestamp="player.gameOverTimeMilli"
              :seconds="true"
            />
          </p>
          <p v-else class="subtitle">
            <span class="subtitle label">GAME OVER</span>
          </p>
        </div>
      </div>
      <CountdownToAllowMint
        v-if="!player.mintingAllow && player.previews.length"
      />
      <InteractionInfo />
      <NFTPreview />
      <MintInformation />
      <PixelBoard />
      <div class="sticky-btn" v-if="!player.gameOver">
        <router-link class="btn" :to="type === 'disable' ? '' : '/scan'">
          <CustomButton type="dark" :slim="true"> INTERACTION </CustomButton>
        </router-link>
        <DrawingPalette />
      </div>
      <div class="btn" v-if="player.gameOver">
        <CustomButton
          v-if="player.mintingAllow && !player.minted"
          @click="mint"
          type="dark"
          :slim="true"
        >
          CLAIM NFT AWARDS
        </CustomButton>
        <a
          v-if="player.errors.network"
          @click="addPolygonNetwork()"
          class="add-polygon"
        >
          Switch to Polygon Network
        </a>
      </div>
    </div>
  </MainLayout>

  <ModalDialog :show="modal.visible.value" v-on:close="closeModal">
    <ModalExport v-if="modals.export" />
    <GameOverModal v-if="modals.gameOver" />
    <ModalMint v-if="modals.mint" />
  </ModalDialog>
</template>

<script>
import { useStore } from '@/stores/player'
import {
  computed,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  reactive,
} from 'vue'
import egg from '@/assets/egg.svg?raw'
import { useModal } from '@/composables/useModal'
import { useWeb3 } from '../composables/useWeb3'
import { formatNumber } from '../utils'
import { EXPLORER_BASE_URL, OPENSEA_BASE_URL } from '../constants'
import { POLLER_MILLISECONDS } from '@/constants.js'
import { importSvg } from '@/composables/importSvg.js'
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
    const gameOver = player.gameOver
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
    const type = computed(() =>
      // TODO: update player.incubating naming when contracts are available
      player.incubating || (player.data && parseInt(player.data.tokenId) < 0)
        ? 'disable'
        : 'primary'
    )
    const mintStatus = computed(() =>
      player.mintInfo.blockHash ? 'minted' : 'pending'
    )
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
    function mint() {
      if (type.value !== 'disable') {
        openModal('mint')
      }
    }
    return {
      etherscanBaseUrl: EXPLORER_BASE_URL,
      openseaBaseUrl: OPENSEA_BASE_URL,
      mint,
      gameOver,
      player,
      type,
      closeModal,
      openModal,
      modal,
      modals,
      mintStatus,
      enableProvider: web3WittyCreatures.enableProvider,
      addPolygonNetwork: web3WittyCreatures.addPolygonNetwork,
      isProviderConnected: web3WittyCreatures.isProviderConnected,
      importSvg,
      egg,
      formatNumber,
    }
  },
}
</script>

<style lang="scss" scoped>
.time-left {
  margin-left: 4px;
}
.header {
  display: grid;
  grid-template-columns: max-content 1fr;
  justify-content: space-between;
  grid-gap: 16px;
  justify-items: flex-end;
  align-items: flex-end;
  margin-bottom: 8px;
  .logo {
    align-self: center;
    width: 150px;
    height: 148px;
  }
  .player-id {
    width: max-content;
    font-size: 18px;
    color: var(--primary-color);
    font-weight: bold;
  }
  .points-bold {
    font-weight: bold;
    font-size: 18px;
  }
  .trait-icon {
    width: 16px;
    display: inline-block;
  }
}
.placeholder {
  opacity: 0.3;
}
.main-img {
  width: 100%;
  height: 100%;
  padding: 0 10vh 10vh 10vh;
}
.sticky-btn {
  position: sticky;
  bottom: 16px;
  text-align: center;
  display: grid;
  grid-template-rows: max-content max-content;
  grid-gap: 8px;
  justify-items: center;
  .btn {
    width: 100%;
  }
  .add-polygon {
    width: max-content;
    color: $white;
    cursor: pointer;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: var(--secondary-color);
    display: flex;
    .metamask {
      margin-right: 4px;
      width: 16px;
    }
  }
}
.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: max-content;
  justify-self: center;
  grid-template-rows: auto auto;
  grid-gap: 16px;
  .center-item {
    grid-column: 1 / span 2;
    align-self: center;
    width: max-content;
    justify-self: center;
  }
}
@media (max-width: 330px) {
  .header {
    grid-template-columns: 1fr;
    justify-items: flex-start;
    align-items: flex-start;
    .logo {
      grid-row: 1;
      width: 150px;
      margin-top: 28px;
      justify-self: center;
    }
  }
}
</style>
