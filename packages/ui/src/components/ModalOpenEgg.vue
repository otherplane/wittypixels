<template>
  <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div class="sm:flex sm:items-start">
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3
          class="text-lg leading-6 font-medium text-gray-900"
          id="modal-title"
        >
          Hatch your Witty Creature
        </h3>
        <div class="mt-2">
          <p class="text-sm text-gray-900">
            This is a preview of the NFT, click the 'Mint' button to receive
            your Witty Creature NFT.
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
      @click="mint"
      type="button"
      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Open
    </button>
    <button
      @click="$parent.$emit('close')"
      type="button"
      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Cancel
    </button>
    <a
      ref="download"
      :href="downloadLink"
      name="information.json"
      download="information.json"
      style="display: none"
    />
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { useWeb3Witmon } from '../composables/useWeb3Witmon'
import { useStore } from '@/stores/player'

export default defineComponent({
  setup() {
    const instance = getCurrentInstance()
    const w3Witmon = useWeb3Witmon()
    const player = useStore()

    return {
      player,
      mint() {
        w3Witmon.open()
        instance.parent.emit('close')
      },
    }
  },
})
</script>
