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
          Export information
        </h3>
        <div class="mt-2">
          <p class="text-sm text-black mb-2">
            Copy the link to import your creature in another browser:
          </p>
          <p class="import-link text-xs text-red">{{ importLink }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-beige px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
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
      Play
    </button>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { createImportLink } from '@/services/exportInformation'
import { copyTextToClipboard } from '@/services/copyToClipboard'
import { useStore } from '@/stores/player'
export default defineComponent({
  setup() {
    const instance = getCurrentInstance()
    const importLink = createImportLink()
    const player = useStore()
    return {
      exportInfo() {
        instance.parent.emit('close')
      },
      player,
      importLink,
      async copyToClipboard() {
        await copyTextToClipboard(importLink)
        player.notify({ message: 'Copied', icon: 'none' })
        instance.parent.emit('close')
      },
    }
  },
})
</script>

<style scoped>
.import-link {
  word-break: break-all;
  word-wrap: anywhere;
}
</style>
