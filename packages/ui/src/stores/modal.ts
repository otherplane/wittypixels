import { defineStore } from 'pinia'
import { ModalKey, type Modals } from '@/types'
import { useModal } from '@/composables/useModal'

export const useModalStore = defineStore('modalStore', {
  state: () => ({
    modal: useModal(),
    modals: {} as Modals,
  }),
  getters: {
    defaultModals() {
      return Object.values(ModalKey)
    },
  },
  actions: {
    // Mint info
    openModal(name: ModalKey) {
      this.closeModal()
      this.modals[name] = true
      this.modal.showModal()
    },
    closeModal() {
      this.modals = {}
      this.modal.hideModal()
    },
  },
})
