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
import { useWeb3 } from '@/composables/useWeb3'
import { POLLER_MILLISECONDS, NETWORKS, CURRENT_NETWORK } from '@/constants.js'
import { onMounted, onBeforeUnmount, computed, watch } from 'vue'
export default {
  setup(_props) {
    let tokenStatusPoller: any

    const gameStore = useGameStore()
    const web3WittyPixels = useWeb3()

    const web3Disconnected = computed(() => gameStore.errors.web3Disconnected)
    const web3WrongNetwork = computed(() => gameStore.errors.web3WrongNetwork)

    onMounted(async () => {
      startTokenStatusPoller()
    })
    onBeforeUnmount(() => {
      clearPoller()
    })

    watch(web3Disconnected, value => {
      if (value) {
        clearPoller()
      } else {
        startTokenStatusPoller()
      }
    })
    watch(web3WrongNetwork, value => {
      if (value) {
        clearPoller()
      } else {
        startTokenStatusPoller()
      }
    })

    async function startTokenStatusPoller() {
      await web3WittyPixels.enableProvider()
      if (
        !tokenStatusPoller &&
        !web3Disconnected.value &&
        !web3WrongNetwork.value
      ) {
        // start polling when provider is the correct one
        tokenStatusPoller = await setInterval(async () => {
          await web3WittyPixels.checkTokenStatus()
        }, POLLER_MILLISECONDS)
      }
    }
    function addNetwork() {
      web3WittyPixels.addNetwork()
    }
    function clearPoller() {
      clearInterval(tokenStatusPoller)
      tokenStatusPoller = null
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
