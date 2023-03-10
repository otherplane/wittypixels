<template>
  <CustomButton
    v-show="web3WrongNetwork"
    @click="addNetwork()"
    type="dark"
    :slim="true"
  >
    Switch to {{ NETWORKS[CURRENT_NETWORK].name }}
  </CustomButton>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/game'
import { useLocalStore } from '@/stores/local'
import { NETWORKS, CURRENT_NETWORK } from '@/constants.js'
import { onMounted, onBeforeUnmount, computed, watch, ref } from 'vue'
export default {
  setup(_props) {
    let tokenStatusPoller: any

    const gameStore = useGameStore()
    const localStore = useLocalStore()
    const web3WittyPixels = gameStore.web3
    const isPollerActive = ref()
    const statusPollerMilliseconds = computed(() =>
      isTransactionInProgress.value ? 6000 : 60000
    )
    const web3Disconnected = computed(() => gameStore.errors.web3Disconnected)
    const web3WrongNetwork = computed(() => gameStore.errors.web3WrongNetwork)
    const isTransactionInProgress = computed(
      () =>
        localStore.txInfo?.txHash &&
        localStore.txInfo?.blockNumber &&
        !localStore.txInfo?.txConfirmation &&
        !localStore.txInfo?.externalConfirmation
    )

    onMounted(async () => {
      startTokenStatusPoller()
      if (!web3Disconnected.value && !web3WrongNetwork.value) {
        isPollerActive.value = true
      }
    })
    onBeforeUnmount(() => {
      clearPoller()
    })

    watch(web3Disconnected, value => {
      if (value) {
        clearPoller()
      } else if (!isPollerActive.value) {
        startTokenStatusPoller()
      }
    })
    watch(web3WrongNetwork, value => {
      if (value) {
        clearPoller()
      } else if (!isPollerActive.value) {
        startTokenStatusPoller()
      }
    })

    watch(isTransactionInProgress, () => {
      clearPoller()
      startTokenStatusPoller()
    })

    async function startTokenStatusPoller() {
      await web3WittyPixels.enableProvider()
      if (!web3Disconnected.value && !web3WrongNetwork.value) {
        isPollerActive.value = true
        await web3WittyPixels.checkTokenStatus()
        // start polling when provider is the correct one
        tokenStatusPoller = await setInterval(async () => {
          await web3WittyPixels.checkTokenStatus()
        }, statusPollerMilliseconds.value)
      }
    }
    function addNetwork() {
      web3WittyPixels.addNetwork()
    }
    async function clearPoller() {
      isPollerActive.value = false
      clearInterval(tokenStatusPoller)
    }
    return {
      addNetwork,
      gameStore,
      web3Disconnected,
      web3WrongNetwork,
      NETWORKS,
      CURRENT_NETWORK,
    }
  },
}
</script>
