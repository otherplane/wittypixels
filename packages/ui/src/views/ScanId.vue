<template>
  <MainLayout :hideNavBar="player.username ? false : true">
    <template v-slot:main>
      <StreamBarcodeReader class="qr-code" @decode="onDecode" />
      <CustomButton
        class="btn"
        color="black"
        @click="onDecode('/a17b86baba0cb804')"
      >
        Import player id
      </CustomButton>
      <ModalDialog :show="modal.visible.value" v-on:close="modal.hideModal">
        <ModalClaimConfirmation v-on:claim="register" />
      </ModalDialog>
    </template>
  </MainLayout>
</template>

<script>
import { ref } from 'vue'
import { useStore } from '@/stores/player'
import { useLocalStore } from '@/stores/local'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import { useRouter } from 'vue-router'
import { useModal } from '@/composables/useModal'

export default {
  components: {
    StreamBarcodeReader,
  },
  setup() {
    const modal = useModal()
    const player = useStore()
    const localStore = useLocalStore()
    const playerKey = ref(null)
    const decodedString = ref('')

    const router = useRouter()
    const previousRoute = ref('')

    function submitAndRedirect() {
      router.push({ name: 'main', params: { id: playerKey.value } })
    }

    function onDecode(value) {
      if (value) {
        decodedString.value = value
        if (!localStore.getToken()) {
          modal.showModal()
        } else {
          register()
        }
      }
    }

    function register() {
      const chunks = decodedString.value.split('/')
      const key = chunks[chunks.length - 1]
      if (key) {
        // TODO: Add scanned key from QR
        playerKey.value = key
        submitAndRedirect()
      }
    }

    return {
      player,
      playerKey,
      submitAndRedirect,
      onDecode,
      previousRoute,
      register,
      modal,
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.previousRoute = from.path
    })
  },
}
</script>

<style lang="scss" scoped>
.qr-code {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  height: -webkit-fill-available;
  width: 100vw;
  z-index: 8;
  div {
    height: -webkit-fill-available;
    .overlay-element {
      display: none;
      height: -webkit-fill-available;
    }
  }
}
.btn {
  position: fixed;
  top: 20vh;
  z-index: 400;
  left: 0;
  color: black;
  background: white;
}
.pl-4 {
  padding-bottom: 0;
  padding-right: 0;
  padding-left: 0;
}
.content {
  color: white;
  width: 100vw;
  top: 10vh;
  left: 0px;
  position: fixed;
  text-align: center;
  z-index: 0;
}
</style>
