<template>
  <div class="bg-beige px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div class="sm:flex sm:items-start">
      <div
        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-beige sm:mx-0 sm:h-10 sm:w-10"
      >
        <SvgImage :svg="playerMainImage" />
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg leading-6 font-bold text-black" id="modal-title">
          Register your farmer
        </h3>
        <div class="mt-2">
          <p class="text-sm text-black">
            Do you want to start playing on this browser? If not, create a
            backup using the button in the next page
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-beige px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
      @click="emitClaim"
      type="button"
      class="w-full inline-flex justify-center rounded-md border border-primary shadow-sm px-4 py-2 bg-primary text-base font-bold modal-text hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
    >
      CONTINUE
    </button>
    <button
      @click="$parent.$emit('close')"
      type="button"
      class="mt-3 w-full inline-flex justify-center rounded-md border-primary shadow-sm px-4 py-2 bg-transparent text-base font-bold modal-text-2 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      CANCEL
    </button>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import playerMainImage from '@/assets/game-icon.svg?raw'
export default defineComponent({
  emits: ['claim'],
  setup() {
    const instance = getCurrentInstance()
    return {
      playerMainImage,
      emitClaim() {
        instance.emit('claim')
      },
    }
  },
})
</script>
