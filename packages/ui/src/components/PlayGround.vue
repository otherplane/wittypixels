<template>
  <div class="main-content">
    <GameCountdowns />
    <InteractionInfo />
    <NFTPreview />
    <MintInformation />
    <PixelBoard />
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { computed } from 'vue'
export default {
  setup(_props) {
    const player = useStore()
    // TODO: HANDLE END OF GAME
    const mintStatus = computed(() =>
      player.mintInfo.blockHash ? 'minted' : 'pending'
    )
    return {
      player,
      mintStatus,
    }
  },
}
</script>

<style lang="scss" scoped>
.main-content {
  height: 100%;
}
</style>
