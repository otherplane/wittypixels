<template>
  <div v-if="!player.gameOver" class="button-container">
    <router-link
      v-if="!player.showPalettePanel"
      class="btn"
      :to="type === 'disable' ? '' : '/scan'"
    >
      <CustomButton type="dark" :slim="true">Scan</CustomButton>
    </router-link>
  </div>
  <div class="btn" v-if="player.gameOver">
    <CustomButton
      v-if="player.mintingAllow && !minted"
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
</template>

<script>
import { useStore } from '@/stores/player'
import { useLocalStore } from '@/stores/local'
import { computed } from 'vue'
export default {
  emits: ['openMintModal', 'addNetwork'],
  setup(_props, { emit }) {
    const player = useStore()
    const localStore = useLocalStore()
    const minted = computed(() => {
      return localStore.minted
    })
    const type = computed(() =>
      // TODO: update player.incubating naming when contracts are available
      player.incubating || (player.data && parseInt(player.data.tokenId) < 0)
        ? 'disable'
        : 'primary'
    )
    function mint() {
      if (type.value !== 'disable') {
        console.log(`openModal('mint')`)
        emit('openMintModal')
      }
    }
    function addPolygonNetwork() {
      console.log('emit add network')
      emit('addNetwork')
    }
    return {
      mint,
      player,
      minted,
      type,
      addPolygonNetwork,
    }
  },
}
</script>

<style lang="scss" scoped>
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
</style>
