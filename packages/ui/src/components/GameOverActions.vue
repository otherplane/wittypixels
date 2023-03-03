<template>
  <div v-if="gameStore.redeemCountdownOver">
    <WalletInfo class="connected-provider" id="wallet-info" />
    <ConnectToProvider id="connect-to-provider" />
    <CreateTransaction
      id="transaction-action"
      v-if="gameOverStatus && !fractionalizing && !networkError"
      :txType="txType"
    />
  </div>
  <CustomButton
    v-if="
      (!gameStore.redeemCountdownOver || fractionalizing) &&
      !gameStore.errors.web3WrongNetwork
    "
    id="allowing-redeem"
    type="disable"
    :slim="true"
  >
    <p class="disabled-text">
      <span v-if="gameStore.gameOverStatus || !gameStore.redeemCountdownOver">
        Awaiting fractional mint
      </span>
      <span v-if="!gameStore.redeemCountdownOver">
        <TimeLeft
          v-if="!gameStore.redeemCountdownOver"
          class="time-left"
          :timestamp="gameStore.timeToRedeemInMilli"
          :seconds="true"
          @clear-timestamp="gameStore.setRedeemCountdownOver()"
        />
      </span>
      ...
    </p>
  </CustomButton>
</template>

<script lang="ts">
import { useLocalStore } from '@/stores/local'
import { useGameStore } from '@/stores/game'
import { useModalStore } from '@/stores/modal'
import { ModalKey, TxType, GameOverStatus, TokenStatus } from '@/types'
import { NETWORKS, CURRENT_NETWORK } from '@/constants.js'
import { onMounted, computed, watch } from 'vue'
export default {
  setup(_props) {
    const localStore = useLocalStore()
    const modalStore = useModalStore()
    const gameStore = useGameStore()
    const gameOverStatus = computed(() => gameStore.gameOverStatus)
    const networkError = computed(
      () =>
        gameStore.errors.web3Disconnected || gameStore.errors.web3WrongNetwork
    )
    const txType = computed(() => localStore.txInfo?.txType)
    onMounted(() => {
      localStore.getTxInfo()
    })
    const showRedeemCompleteInfo = computed(
      () =>
        (gameOverStatus.value === GameOverStatus.AwaitSale ||
          gameOverStatus.value === GameOverStatus.AllowSale ||
          gameOverStatus.value === GameOverStatus.AllowWithdraw) &&
        !gameStore.errors.web3WrongNetwork
    )
    const fractionalizing = computed(() => {
      return (
        !gameOverStatus.value ||
        gameOverStatus.value == GameOverStatus.Fractionalizing ||
        gameStore.tokenStatus == TokenStatus.Minting
      )
    })
    watch(fractionalizing, value => {
      if (gameStore.isGameOver) {
        if (value) {
          modalStore.openModal(ModalKey.gameOver)
        }
      }
    })
    watch(gameOverStatus, value => {
      if (value == GameOverStatus.AllowRedeem) {
        modalStore.openModal(ModalKey.redeem)
        localStore.saveTxInfo({ txType: TxType.Redeem })
      } else if (
        // Auth users are not allow to buy
        // Do not allow redeem again
        value == GameOverStatus.AllowSale &&
        (localStore.txInfo?.txType === TxType.Buy || !localStore.txInfo?.txHash)
      ) {
        localStore.saveTxInfo({})
      } else if (value == GameOverStatus.AllowWithdraw) {
        localStore.saveTxInfo({ txType: TxType.Withdraw })
      } else if (value == GameOverStatus.AlreadyWithdrawn) {
        modalStore.openModal(ModalKey.alreadyWithdrawn)
      } else if (value == GameOverStatus.Acquired) {
        localStore.saveTxInfo({})
      }
    })

    return {
      networkError,
      showRedeemCompleteInfo,
      gameStore,
      NETWORKS,
      CURRENT_NETWORK,
      txType,
      fractionalizing,
      gameOverStatus,
      GameOverStatus,
    }
  },
}
</script>

<style lang="scss">
.connected-provider {
  margin-bottom: 8px;
}
.await-sale {
  width: 100% !important;
  margin-bottom: 16px;
}
</style>
