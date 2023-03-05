<template>
  <router-view />
  <GameNotification />
  <ModalDialog
    :show="modalStore.modal.visible"
    v-on:close="modalStore.closeModal"
  >
    <ModalGameOver v-if="modalStore.modals.gameOver" />
    <ModalExport v-if="modalStore.modals.export" />
    <ModalRedeemInfo v-if="modalStore.modals.redeem" />
    <ModalWithdraw v-if="modalStore.modals.allowWithdraw" />
    <ModalTransactionConfirmed v-if="modalStore.modals.txConfirmation" />
    <ModalTransactionError v-if="modalStore.modals.txError" />
    <ModalAlreadyWithdrawn v-if="modalStore.modals.alreadyWithdrawn" />
    <ModalHowToBuy v-if="modalStore.modals.buyInfo" />
    <ModalWeb3ProviderNotFound v-if="modalStore.modals.web3ProviderNotFound" />
  </ModalDialog>
</template>

<script lang="ts">
import { useModalStore } from '@/stores/modal'
import { onBeforeMount } from 'vue'
import { useWeb3 } from './composables/useWeb3'
import { ModalKey } from './types'
export default {
  setup() {
    const modalStore = useModalStore()
    const web3 = useWeb3()

    onBeforeMount(async () => {
      const existsWeb3Provider = await web3.existWeb3Provider()
      if (!existsWeb3Provider) {
        modalStore.openModal(ModalKey.web3ProviderNotFound)
      }
    })

    return { modalStore }
  },
}
</script>

<style lang="scss">
#app {
  font-family: Lexend, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: grid;
  grid-template-rows: max-content 1fr;
  height: -webkit-fill-available;
  overflow: hidden;
}
</style>
