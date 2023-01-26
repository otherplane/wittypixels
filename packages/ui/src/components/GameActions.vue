<template>
  <div v-if="!player.gameOver" class="button-container">
    <router-link class="btn" :to="type === 'disable' ? '' : '/scan'">
      <CustomButton :type="type" :slim="true">
        <p v-if="type == 'dark'">Scan</p>
        <p class="disabled-text" v-else>
          Allow new scan in
          <TimeLeft
            v-if="player.interactionOut?.ends"
            class="time-left"
            :timestamp="player.interactionOut?.ends"
            :seconds="true"
            @clear-timestamp="clearTimestamp('interactionOut')"
          />
        </p>
      </CustomButton>
    </router-link>
  </div>
  <div class="btn" v-if="player.gameOver">
    <CustomButton
      v-if="!player.redeemAllow && !minted"
      type="disable"
      :slim="true"
    >
      <p class="disabled-text">
        Allowing redeem in
        <TimeLeft
          class="time-left"
          :timestamp="player.timeToRedeemInMilli"
          :seconds="true"
          @clear-timestamp="allowRedeem"
        />...
      </p>
    </CustomButton>
    <CustomButton
      v-if="player.redeemAllow && !minted"
      @click="mint"
      type="dark"
      :slim="true"
    >
      Redeem ownership
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
      player.interactionOut ||
      (player.data && parseInt(player.data.tokenId) < 0)
        ? 'disable'
        : 'dark'
    )
    const clearTimestamp = interactionType => {
      player[interactionType] = null
    }
    function allowRedeem() {
      player.redeemAllow = true
    }
    function mint() {
      if (type.value !== 'disable') {
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
      clearTimestamp,
      addPolygonNetwork,
      allowRedeem,
    }
  },
}
</script>

<style lang="scss" scoped>
.btn {
  width: 100%;
}
.disabled-text {
  font-size: 18px;
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
