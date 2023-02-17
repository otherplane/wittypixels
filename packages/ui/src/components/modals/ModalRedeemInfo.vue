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
          Redeem your {{ ownershipPercentage }}% of ownership
        </h3>
        <div class="mt-2">
          <p class="text-sm text-black mb-2">
            You painted 3000px out of {{ totalPixelsDrawn }}. Now you can claim
            your {{ ownershipPercentage }}% of ownership of the collectively
            created NFT. Make sure you are connected to a web3 provider
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
    const totalPixelsDrawn = computed(() => gameStore.gameStats?.totalPixels)
    const paintedPixels = computed(() => player.score)
    const ownershipPercentage = computed(
      () => (paintedPixels.value * 100) / totalPixelsDrawn.value
    )
    return { ownershipPercentage, paintedPixels, totalPixelsDrawn }
  },
}
</script>
