<template>
  <div v-if="txInfo" class="mint-content">
    <LabelMintStatus v-if="txInfo" :status="txStatus" />
    <p v-if="txStatus === 'error'">Try claiming your NFTs again</p>
    <p class="label">TRANSACTION HASH</p>
    <div class="mint-status" v-if="txInfo?.transactionHash">
      <div class="address">
        <a
          :href="`${explorerBaseUrl}/${txInfo.transactionHash}`"
          target="_blank"
          >{{ txInfo.transactionHash }}
        </a>
        <svgImage class="external-link-icon" :svg="externalLink" />
      </div>
    </div>
  </div>
</template>
<script>
import { useLocalStore } from '@/stores/local'
import { computed } from 'vue'
import externalLink from '@/assets/external-black.svg?raw'
import { EXPLORER_BASE_URL, OPENSEA_BASE_URL } from '../constants'
export default {
  setup() {
    const localStore = useLocalStore()
    const txInfo = computed(() => {
      return localStore.txInfo
    })
    const txStatus = computed(() => {
      if (localStore.txInfo.blockHash && localStore.minted) {
        return 'minted'
      } else if (localStore.txInfo.blockHash && !localStore.minted) {
        return 'error'
      } else {
        return 'pending'
      }
    })
    return {
      explorerBaseUrl: EXPLORER_BASE_URL,
      openseaBaseUrl: OPENSEA_BASE_URL,
      txInfo,
      externalLink,
      txStatus,
    }
  },
}
</script>
<style lang="scss" scoped>
.mint-content {
  background-color: var(--primary-color-opacity-2);
  justify-items: center;
  border-radius: 4px;
  display: grid;
  row-gap: 8px;
  padding: 16px;
  margin-bottom: 32px;
  .label {
    font-weight: bold;
  }
  .opensea {
    font-weight: bold;
  }
  .tokenIds {
    text-align: center;
    .token {
      margin-right: 8px;
    }
  }
  .info {
    font-size: 16px;
    color: $black;
    justify-content: center;
    text-decoration: underline;
    line-break: anywhere;
    .external-link-icon {
      margin-left: 4px;
      display: inline-block;
    }
  }
}
</style>
