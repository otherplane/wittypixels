import { defineStore } from 'pinia'
import type { ModalKey } from '@/types'
import { useModal } from '@/composables/useModal'

export const useModalStore = defineStore('modalStore', {
  state: () => ({
    modal: useModal(),
    modals: {
      mint: false,
      export: false,
      preview: false,
      gameOver: false,
    },
  }),
  actions: {
    // Mint info
    openModal(name: ModalKey) {
      this.modals[name] = true
      this.modal.showModal()
    },
    closeModal() {
      this.modals = {
        mint: false,
        export: false,
        preview: false,
        gameOver: false,
      }
      this.modal.hideModal()
    },
  },
})
