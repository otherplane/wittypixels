<template>
  <div v-if="mintInfo" class="mint-content">
    <LabelMintStatus v-if="mintInfo" :status="mintStatus" />
    <p v-if="mintStatus === 'error'">Try claiming your NFTs again</p>
    <p class="label">TRANSACTION HASH</p>
    <div class="mint-status" v-if="mintInfo?.transactionHash">
      <div class="address">
        <a
          :href="`${explorerBaseUrl}/${mintInfo.transactionHash}`"
          target="_blank"
          >{{ mintInfo.transactionHash }}
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
    const mintInfo = computed(() => {
      return localStore.mintInfo
    })
    const mintStatus = computed(() => {
      if (localStore.mintInfo.blockHash && localStore.minted) {
        return 'minted'
      } else if (localStore.mintInfo.blockHash && !localStore.minted) {
        return 'error'
      } else {
        return 'pending'
      }
    })
    return {
      explorerBaseUrl: EXPLORER_BASE_URL,
      openseaBaseUrl: OPENSEA_BASE_URL,
      mintInfo,
      externalLink,
      mintStatus,
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
