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
          How to connect your wallet
        </h3>
        <div class="mt-2">
          <p class="text-sm text-black mb-2">
            A Web3-enabled browser is needed to redeem your $WPX, withdraw your
            $ETH, or bid for the 1-of-1 canvas NFT.
          </p>
          <p v-if="paintedPixels" class="text-sm text-black mb-2">
            Please copy the backup URL below and paste it into a Web3 browser,
            such as MEW Wallet or Metamask on your phone, or your regular
            browser on your computer with the Metamask add-on installed:
          </p>

          <p v-if="paintedPixels" class="import-link text-xs text-red">
            {{ importLink }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-beige px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
      v-if="paintedPixels"
      @click="copyToClipboard"
      type="button"
      class="w-full inline-flex justify-center rounded-full border border-primary shadow-sm px-4 py-2 bg-primary text-base font-medium modal-text hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Copy to clipboard
    </button>

    <button
      @click="$parent.$emit('close')"
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
import { copyTextToClipboard } from '@/services/copyToClipboard'
import { getCurrentInstance } from 'vue'
import { createImportLink } from '@/services/exportInformation'

export default {
  setup() {
    const instance = getCurrentInstance()
    const gameStore = useGameStore()
    const player = useStore()

    const importLink = createImportLink()

    onBeforeMount(() => {
      gameStore.getGameStats()
    })
    const paintedPixels = computed(() => player.score)

    return {
      importLink,
      paintedPixels,
      async copyToClipboard() {
        await copyTextToClipboard(importLink)
        player.notify({ message: 'Copied', icon: 'none' })
        instance.parent.emit('close')
      },
    }
  },
}
</script>

<style scoped>
.import-link {
  word-break: break-all;
  word-wrap: anywhere;
}
</style>
