<template>
  <a :href="marketplaceUrl" target="_blank">
    <CustomButton type="dark" :slim="true">
      Check on {{ marketplaceName }}
    </CustomButton>
  </a>
</template>

<script lang="ts">
import {
  NETWORKS,
  CURRENT_NETWORK,
  ERC721_ADDRESS,
  ERC721_TOKEN_ID,
} from '@/constants.js'
import { computed } from 'vue'
export default {
  setup() {
    const marketplaceUrl = computed(
      () =>
        `${NETWORKS[CURRENT_NETWORK].marketplace}/${ERC721_ADDRESS}/${ERC721_TOKEN_ID}`
    )
    const marketplaceName = computed(
      () => NETWORKS[CURRENT_NETWORK].marketplaceName
    )
    return {
      marketplaceUrl,
      marketplaceName,
    }
  },
}
</script>
