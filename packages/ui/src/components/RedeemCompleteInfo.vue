<template>
  <GameInfo class="redeem-complete-info">
    <p>Balance: {{ walletInfo?.wpxBalance }} WPX</p>
    <p>Ownership: {{ walletInfo?.wpxShare10000 / 10000 }}%</p>
    <p>CurrentPrice: {{ contractInfo?.currentPrice }} ETH</p>
  </GameInfo>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/game'
import { onMounted, ref } from 'vue'

export default {
  setup() {
    const gameStore = useGameStore()
    const web3WittyPixels = gameStore.web3
    const walletInfo = ref()
    const contractInfo = ref()
    onMounted(async () => {
      walletInfo.value = await web3WittyPixels.getWalletInfo({
        walletAddress: gameStore.provider.address,
      })
      contractInfo.value = await web3WittyPixels.getERC20ContractInfo()
      console.log(walletInfo.value)
    })
    return { walletInfo, contractInfo }
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
