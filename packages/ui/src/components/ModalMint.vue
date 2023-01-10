<template>
  <div class="bg-beige px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div class="sm:flex sm:items-start">
      <div
        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-beige sm:mx-0 sm:h-10 sm:w-10"
      >
        <SvgImage :svg="playerMainImage" />
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3
          class="text-lg leading-6 font-medium text-gray-900"
          id="modal-title"
        >
          Mint now your awards as NFTs
        </h3>
        <div class="mt-2">
          <p class="text-sm text-gray-900">
            You are about to bequeath to posterity your perfomance in the Witty
            Creatures social game that took place during EthCC 2022. The minting
            process will occur in the Polygon mainnet and it is powered by the
            Witnet Random Number Generator (RNG) functionality.
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-beige px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
      @click="mint"
      type="button"
      class="w-full inline-flex justify-center rounded-md border border-primary shadow-sm px-4 py-2 bg-primary text-base font-bold text-pink hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
    >
      CONTINUE
    </button>
    <button
      @click="$parent.$emit('close')"
      type="button"
      class="mt-3 w-full inline-flex justify-center rounded-md border-primary shadow-sm px-4 py-2 bg-transparent text-base font-bold text-brown hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      CANCEL
    </button>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { useWeb3 } from '../composables/useWeb3'
import playerMainImage from '@/assets/egg.svg?raw'
import { useStore } from '@/stores/player'
export default defineComponent({
  setup() {
    const instance = getCurrentInstance()
    const w3Witmon = useWeb3()
    const player = useStore()
    return {
      player,
      playerMainImage,
      mint() {
        w3Witmon.mint()
        instance.parent.emit('close')
      },
    }
  },
})
</script>
