<template>
  <MainLayout :hideNavBar="fromAuth">
    <template v-slot:main>
      <div class="container">
        <SectionHeader title="Settings" />
        <label class="form-label">Name</label>
        <CustomInput
          class="field"
          type="text"
          label="name"
          v-model="username"
        />
        <SectionHeader title="Instructions" />
        <p class="paragraph">
          To <span class="bold orange">send color pixels</span> to somebody, you
          just need to <span class="bold green">scan their QR code</span>.
        </p>
        <p class="paragraph">
          These are the <span class="bold">rules</span> for sending and
          receiving colors:
        </p>
        <ul class="list-container">
          <li class="list">Scanning takes 5 minutes.</li>
          <li class="list">
            You can’t start scanning somebody’s QR while you are scanning
            someone else's — you need to wait until the counter is over.
          </li>
          <li class="list">
            You can scan each player’s QR's only once every 2 hours.
          </li>
          <li class="list">
            Scanning somebody’s QR's gives more pixels if that is the first time
            interacting with that player.
          </li>
        </ul>
        <p class="paragraph">
          Right after the closing ceremony, you will be able to
          <span class="bold blue">claim your ownership</span> percentance of the
          <span class="bold purple">fractionalized NFT</span>collectively
          created.
        </p>
        <p class="paragraph">
          The more pixels painted in the board, the more percentace of the
          fractionalized NFT you will get.
        </p>
      </div>
    </template>
    <template v-slot:bottom>
      <router-link v-if="fromAuth" to="/">
        <CustomButton type="secondary" :slim="true"> Continue</CustomButton>
      </router-link>
    </template>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { ref, computed } from 'vue'
import router from '../router'
import { importSvg } from '@/composables/importSvg.js'

import debounce from 'lodash.debounce'

export default {
  setup() {
    const player = useStore()
    const updateName = debounce(val => {
      if (val !== player.username) {
        player.updateName({ name: val })
      }
    }, 1200)
    const username = computed({
      get() {
        return player.username
      },
      set: updateName,
    })

    const fromAuth = ref(!!router.currentRoute.value.params?.id)
    return { player, importSvg, fromAuth, username }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 16px;
  text-align: left;
  font-size: 18px;
  .title {
    font-size: 24px;
  }
  .list {
    list-style-type: square;
    color: $black;
    &::marker {
      color: var(--primary-color);
    }
  }
  .paragraph {
    color: $black;
    margin-bottom: 8px;
  }
  .field {
    margin-bottom: 24px;
  }
  .link {
    color: var(--primary-color);
    text-decoration: underline;
    font-weight: bold;
  }
  .list-container {
    padding-left: 24px;
  }
}
</style>
