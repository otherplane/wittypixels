<template>
  <div v-if="!gameStore.gameOver" class="button-container">
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
            @clear-timestamp="clearTimestamp(InteractionType.interactionOut)"
          />
        </p>
      </CustomButton>
    </router-link>
  </div>
  <div class="btn" v-if="gameStore.gameOver">
    <CustomButton
      v-if="!gameStore.redeemAllow && !minted"
      type="disable"
      :slim="true"
    >
      <p class="disabled-text">
        Allowing redeem in
        <TimeLeft
          class="time-left"
          :timestamp="gameStore.timeToRedeemInMilli"
          :seconds="true"
          @clear-timestamp="allowRedeem"
        />...
      </p>
    </CustomButton>
    <CustomButton
      v-if="web3WrongNetwork"
      @click="addNetwork()"
      type="dark"
      :slim="true"
    >
      Switch to Polygon Network
    </CustomButton>
    <CustomButton
      v-else-if="redeemEnabled"
      @click="redeem"
      :type="web3Disconnected ? 'disable' : 'dark'"
      :slim="true"
    >
      Redeem ownership
    </CustomButton>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/stores/player'
import { useLocalStore } from '@/stores/local'
import { useGameStore } from '@/stores/game'
import { useModalStore } from '@/stores/modal'
import { ModalKey, TokenStatus, InteractionType } from '@/types'
import { useWeb3 } from '@/composables/useWeb3'
import { POLLER_MILLISECONDS } from '@/constants.js'
import { onMounted, onBeforeUnmount, computed, watch } from 'vue'
export default {
  setup(_props) {
    //TODO: refactor
    let tokenStatusPoller: any
    let mintConfirmationStatusPoller: any
    const player = useStore()
    const localStore = useLocalStore()
    const modalStore = useModalStore()
    const gameStore = useGameStore()
    const web3WittyPixels = useWeb3()
    const minted = computed(() => {
      return !!localStore.mintInfo?.txHash
    })
    const gameOver = computed(() => gameStore.gameOver)
    const txHash = computed(() => localStore.mintInfo?.txHash)
    const web3Disconnected = computed(() => {
      return (
        gameStore.redeemAllow &&
        !web3WittyPixels.isProviderConnected.value &&
        !minted.value
      )
    })
    const web3WrongNetwork = computed(() => {
      return (
        gameStore.redeemAllow &&
        gameStore.errors.web3WrongNetwork &&
        !minted.value
      )
    })
    const redeemEnabled = computed(() => {
      return gameStore.redeemAllow && !minted.value
    })
    const tokenVaultStatus = computed(() => gameStore.tokenStatus)
    const type = computed(() => (player.interactionOut ? 'disable' : 'dark'))
    const tokenStatus = computed(() => gameStore?.tokenStatus)
    const redeemConfirmation = computed(
      () => localStore.mintInfo?.mintConfirmation
    )
    onBeforeUnmount(() => {
      clearInterval(tokenStatusPoller)
      clearInterval(mintConfirmationStatusPoller)
    })
    onMounted(async () => {
      await player.getPlayerInfo()
      if (gameStore.gameOver) {
        tokenStatusPoller = await setInterval(async () => {
          await web3WittyPixels.getTokenStatus()
        }, POLLER_MILLISECONDS)
      }
      if (tokenVaultStatus.value == TokenStatus.Fractionalized) {
        connectWeb3()
      }
    })
    watch(gameOver, () => {
      getTokenStatus()
    })
    watch(tokenStatus, () => {
      getGameOverInfo()
    })
    watch(txHash, () => {
      getGameOverInfo()
    })
    watch(redeemConfirmation, () => {
      getGameOverInfo()
    })
    watch(tokenVaultStatus, value => {
      if (value == TokenStatus.Fractionalized) {
        connectWeb3()
      }
    })
    const getTokenStatus = async () => {
      if (gameStore.isGameOver) {
        gameStore.gameOver = true
        modalStore.openModal(ModalKey.gameOver)
        await web3WittyPixels.getTokenStatus()
        tokenStatusPoller = setInterval(async () => {
          await web3WittyPixels.getTokenStatus()
        }, POLLER_MILLISECONDS)
      }
    }
    const getGameOverInfo = async () => {
      clearInterval(mintConfirmationStatusPoller)
      if (
        localStore.mintInfo?.txHash &&
        !localStore.mintInfo?.mintConfirmation
      ) {
        mintConfirmationStatusPoller = await setInterval(async () => {
          await web3WittyPixels.getConfirmationStatus()
        }, POLLER_MILLISECONDS)
      }
    }
    const clearTimestamp = (interactionType: InteractionType) => {
      player[interactionType] = null
    }
    function allowRedeem() {
      gameStore.redeemAllow = true
      modalStore.openModal(ModalKey.redeem)
    }
    function connectWeb3() {
      web3WittyPixels.enableProvider()
    }
    function addNetwork() {
      web3WittyPixels.addNetwork()
    }
    function redeem() {
      if (type.value !== 'disable') {
        // TODO: CALL REDEEM
      }
    }
    return {
      redeem,
      player,
      minted,
      type,
      connectWeb3,
      clearTimestamp,
      addNetwork,
      allowRedeem,
      gameStore,
      web3Disconnected,
      web3WrongNetwork,
      redeemEnabled,
      InteractionType,
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
