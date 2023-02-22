<template>
  <GameInfo v-if="blockExplorerTxUrl">
    <a class="link" :href="blockExplorerTxUrl" target="_blank"
      >Check transaction
      <SvgImage class="external-link-icon" :svg="externalLink" />
    </a>
  </GameInfo>
</template>

<script lang="ts">
import { useLocalStore } from '@/stores/local'
import { useGameStore } from '@/stores/game'
import externalLink from '@/assets/external.svg?raw'
import { cropMiddle } from '@/utils'
import { computed } from 'vue'
import { CURRENT_NETWORK, NETWORKS } from '@/constants'

export default {
  setup() {
    const localStore = useLocalStore()
    const gameStore = useGameStore()
    const blockExplorerUrls = computed(
      () => NETWORKS[CURRENT_NETWORK]?.blockExplorerUrls
    )
    const txHash = computed(() => localStore.txInfo?.txHash)
    const blockExplorerTxUrl = computed(() => {
      if (blockExplorerUrls.value && txHash.value) {
        return `${blockExplorerUrls.value[0]}/tx/${txHash.value}`
      } else {
        return null
      }
    })
    return {
      localStore,
      gameStore,
      cropMiddle,
      blockExplorerTxUrl,
      externalLink,
    }
  },
}
</script>

<style lang="scss" scoped>
.link {
  text-decoration: underline;
  line-break: anywhere;
  font-weight: bold;
  padding-bottom: 4px;
  .external-link-icon {
    width: 10px;
    margin-left: 4px;
    display: inline-block;
  }
}
</style>
