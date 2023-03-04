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
          How to withdraw your {{ paintedPixels }} $ETH
        </h3>
        <div class="mt-2">
          <p class="text-sm text-black mb-2">
            The WittyPixels 1-of-1 canvas NFT has been sold for
            {{ contractInfo?.currentPrice }} $ETH.
          </p>
          <p class="text-sm text-black mb-2">
            {{ contractInfo?.currentPrice / 2 }} $ETH has been donated to the
            Ukraine Emergency Response Fund through TheGivingBlock.
          </p>
          <p class="text-sm text-black mb-2">
            {{ contractInfo?.currentPrice / 2 }} is now withrdrawable by the
            players, proportional to how much $WPX they own (i.e. how many
            pixels they got into the final artwork).
          </p>
          <p class="text-sm text-black mb-2">
            You currently own {{ paintedPixels }} $WPX. You can now burn your
            $WPX to withdraw {{ paintedPixels }} $ETH.
          </p>

          <p class="text-sm text-black mb-2">
            Burn {{ paintedPixels }} $WPX to withdraw {{ paintedPixels }} $ETH
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
import { useStore } from '@/stores/player'
export default {
  setup() {
    const gameStore = useGameStore()
    const player = useStore()
    onBeforeMount(() => {
      gameStore.getGameStats()
    })
    const contractInfo = computed(() => {
      return gameStore.contractInfo
    })
    const totalPixelsDrawn = computed(() => gameStore.gameStats?.totalPixels)
    const paintedPixels = computed(() => player.score)
    const ownershipPercentage = computed(
      () => (paintedPixels.value * 100) / totalPixelsDrawn.value
    )
    return {
      ownershipPercentage,
      paintedPixels,
      totalPixelsDrawn,
      contractInfo,
    }
  },
}
</script>
