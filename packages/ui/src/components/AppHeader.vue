<template>
  <div class="header">
    <router-link to="/">
      <WittyPixelsLogo class="logo" />
    </router-link>
    <NavBar
      v-if="!hideNavBar"
      class="navbar"
      @openExportModal="openModal('export')"
    />
  </div>
  <ModalDialog :show="modal.visible.value" v-on:close="closeModal">
    <ModalExport v-if="modals.export" />
  </ModalDialog>
</template>
<script>
import wittyLogo from '@/assets/witty-pixels-logo.svg?raw'
import { reactive } from 'vue'
import { useModal } from '@/composables/useModal'
export default {
  props: {
    hideNavBar: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const modal = useModal()
    const modals = reactive({
      export: false,
    })
    function openModal(name) {
      modals[name] = true
      modal.showModal()
    }
    function closeModal() {
      modals.export = false
      modal.hideModal()
    }
    return {
      wittyLogo,
      openModal,
      closeModal,
      modal,
      modals,
    }
  },
}
</script>
<style lang="scss" scoped>
.header {
  background-color: $white;
  color: white;
  height: max-content;
  position: relative;
  text-align: end;
  top: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-gap: 24px;
  grid-template-rows: max-content;
  justify-content: space-between;
  .logo {
    position: relative;
    cursor: pointer;
    height: 60px;
    display: flex;
    justify-content: flex-start;
  }
  .witnet-subtitle {
    font-size: 10px;
    position: relative;
    font-weight: 600;
  }
}
@media (min-width: 600px) {
  .header {
    margin: 0 auto;
    max-width: 700px;
    .logo {
      width: max-content;
    }
  }
}
@media (max-width: 300px) {
  .header {
    .logo {
      height: auto;
      width: 70vw;
    }
  }
}
</style>
