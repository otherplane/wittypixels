<template>
  <div v-if="player.mintInfo" class="mint-content">
    <LabelMintStatus v-if="player.mintInfo" :status="mintStatus" />
    <p v-if="mintStatus === 'error'">Try claiming your NFTs again</p>
    <p class="label">TRANSACTION HASH</p>
    <div class="mint-status" v-if="player?.mintInfo?.transactionHash">
      <div class="info address">
        <a
          :href="`${explorerBaseUrl}/${player.mintInfo.transactionHash}`"
          target="_blank"
          >{{ player.mintInfo.transactionHash }}
        </a>
        <svgImage class="external-link-icon" :svg="externalLink" />
      </div>
    </div>
  </div>
</template>
<script>
import { useStore } from '@/stores/player'
import { computed } from 'vue'
import externalLink from '@/assets/external-black.svg?raw'
import { EXPLORER_BASE_URL, OPENSEA_BASE_URL } from '../constants'
export default {
  setup() {
    const player = useStore()
    const mintStatus = computed(() => {
      if (player.mintInfo.blockHash && player.minted) {
        return 'minted'
      } else if (player.mintInfo.blockHash && !player.minted) {
        return 'error'
      } else {
        return 'pending'
      }
    })
    return {
      explorerBaseUrl: EXPLORER_BASE_URL,
      openseaBaseUrl: OPENSEA_BASE_URL,
      player,
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
