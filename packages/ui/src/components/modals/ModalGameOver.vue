<template>
  <div class="bg-beige px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div class="sm:flex sm:items-start">
      <div
        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-beige sm:mx-0 sm:h-10 sm:w-10"
      >
        <WittyPixelsIcon />
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg leading-6 font-medium text-black" id="modal-title">
          GG, witty fren!
        </h3>
        <div class="mt-2">
          <p class="text-sm text-black mb-2">
            The WittyPixels 1-of-1 canvas NFT will shortly be minted on Ethereum
            mainnet, fractionalized into $WPX tokens, and become ready for
            auctioning.
          </p>

          <p class="text-sm text-black mb-2">
            This process is powered and secured by the Witnet Multichain
            Decentralized Oracle, which is used to move the player data and
            general game state from the offchain backend into the smart
            contract.
          </p>

          <p class="text-sm text-black mb-2">
            Because you got {{ paintedPixels }} pixels into the final artwork,
            you are eligible to redeem {{ paintedPixels }} $WPX. The $WPX acts
            as the onchain representation of your pixels, and once the NFT is
            auctioned and sold, it will give you access to a share of the
            collected $ETH.
          </p>

          <p class="text-sm text-black mb-2">
            The fractionalization process will be over soon. Please come back
            later to redeem your $WPX.
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-beige px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
      @click="$parent?.$emit('close')"
      type="button"
      class="mt-3 w-full inline-flex justify-center rounded-full border-primary shadow-sm px-4 py-2 bg-transparent text-base font-medium modal-text-2 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Close
    </button>
  </div>
</template>

<script>
import { onBeforeMount, computed } from 'vue'
import { useGameStore } from '@/stores/game'

export default {
  setup() {
    const gameStore = useGameStore()
    onBeforeMount(() => {
      gameStore.getGameStats()
    })
    const totalPixelsDrawn = computed(() => gameStore.gameStats?.totalPixels)
    const activePlayers = computed(() => gameStore.gameStats?.totalPlayers)
    return { activePlayers, totalPixelsDrawn }
  },
}
</script>
