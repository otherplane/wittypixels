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
    <ModalTransactionConfirmed v-if="modalStore.modals.txConfirmation" />
    <ModalTransactionError v-if="modalStore.modals.txError" />
  </ModalDialog>
</template>

<script lang="ts">
import { useModalStore } from '@/stores/modal'
export default {
  setup() {
    const modalStore = useModalStore()
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
