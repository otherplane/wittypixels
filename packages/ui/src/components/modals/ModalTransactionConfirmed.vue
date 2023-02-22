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
          Transaction confirmed
        </h3>
        <div class="mt-2">
          <p class="text-sm text-black mb-2">
            Your transaction was confirmed check in
          </p>
          <a
            v-if="blockExplorerTxUrl"
            class="link"
            :href="blockExplorerTxUrl"
            target="_blank"
            >block explorer
            <SvgImage class="external-link-icon" :svg="externalLink" />
          </a>
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

<script lang="ts">
import { useLocalStore } from '@/stores/local'
import { useGameStore } from '@/stores/game'
import externalLink from '@/assets/external-black.svg?raw'
import { cropMiddle } from '@/utils'
import { computed } from 'vue'
import { CURRENT_NETWORK, NETWORKS } from '@/constants'

export default {
  setup() {
    const localStore = useLocalStore()
    const gameStore = useGameStore()
    const blockExplorerUrls = computed(
      () => NETWORKS[CURRENT_NETWORK]?.blockExplorerUrls
    )
    const txHash = computed(() => localStore.txInfo?.txHash)
    const blockExplorerTxUrl = computed(() => {
      if (blockExplorerUrls.value && txHash.value) {
        return `${blockExplorerUrls.value[0]}/tx/${txHash.value}`
      } else {
        return null
      }
    })
    return {
      localStore,
      gameStore,
      cropMiddle,
      blockExplorerTxUrl,
      externalLink,
    }
  },
}
</script>

<style lang="scss" scoped>
.link {
  text-decoration: underline;
  font-weight: bold;
  padding-bottom: 4px;
  font-size: 16px;
  .external-link-icon {
    width: 12px;
    margin-left: 4px;
    display: inline-block;
  }
}
</style>
