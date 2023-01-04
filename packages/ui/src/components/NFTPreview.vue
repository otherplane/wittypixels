<template>
  <div class="nft-container" v-if="player.previews.length >= 1">
    <p class="nft-title">{{ title }}</p>
    <div class="nft-container">
      {{ nft }}
    </div>
  </div>
</template>

<script>
import { importSvg } from '@/composables/importSvg.js'
import { computed } from 'vue'
import { useStore } from '@/stores/player'
import { OPENSEA_BASE_URL } from '../constants'
export default {
  setup() {
    const player = useStore()
    const title = computed(() => {
      return player.mintedAwards ? 'NFT AWARDS' : 'NFT AWARDS (PREVIEW)'
    })
    const nft = computed(() => {
      if (player.mintedAwards.length) {
        return player.mintedAwards
      } else {
        return player.previews
      }
    })
    return { importSvg, title, player, OPENSEA_BASE_URL, nft }
  },
}
</script>

<style lang="scss" scoped>
.nft-container {
  width: 700px;
}
.nft-container {
  overflow: hidden;
  display: grid;
  border-radius: 4px;
  margin: 16px 0px;
  justify-content: center;
}
.nft-title {
  font-weight: bold;
  font-family: Zilla Slab, sans-serif;
  font-size: 12px;
  color: var(--primary-color);
}
@media (max-width: 600px) {
  .nft-container {
    width: 90vw;
  }
}
</style>
