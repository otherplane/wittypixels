<template>
  <div class="header" @click="clearPixelToPaint()">
    <router-link to="/">
      <svgImage class="logo" :svg="wittyLogo" />
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
import { useStore } from '@/stores/player'
export default {
  props: {
    hideNavBar: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore()
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
    function clearPixelToPaint() {
      store.clearPixelToPaint()
      store.togglePalettePanel(false)
    }
    return {
      wittyLogo,
      openModal,
      closeModal,
      clearPixelToPaint,
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
  margin: 16px;
  display: grid;
  grid-template-columns: max-content max-content;
  grid-template-rows: max-content;
  justify-content: space-between;
  .logo {
    height: 10vh;
    position: relative;
    cursor: pointer;
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
      height: 120px;
      padding: 16px 0px;
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
