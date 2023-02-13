<template>
  <GameInfo
    v-if="gameStore.redeemCountdownOver && blockExplorerTxUrl"
    class="provider-container"
  >
    <p>Transaction hash</p>
    <p class="link bold">
      <a :href="blockExplorerTxUrl" target="_blank"
        >{{ cropMiddle(`${localStore.txInfo?.txHash}`, 11) }}
      </a>
      <SvgImage class="external-link-icon" :svg="externalLink" />
    </p>
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
.provider-container {
  width: 100%;
  padding: 16px;
  margin-bottom: 8px;
  .link {
    text-decoration: underline;
    line-break: anywhere;
    font-weight: bold;
    padding-bottom: 4px;
    font-size: 16px;
  }
  .external-link-icon {
    width: 12px;
    margin-left: 4px;
    display: inline-block;
  }
}
</style>
