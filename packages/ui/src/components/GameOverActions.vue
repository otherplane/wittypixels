<template>
  <div v-if="gameStore.redeemCountdownOver">
    <WalletInfo class="connected-provider" />
    <ConnectToProvider id="connect-to-provider" />
    <CreateTransaction
      id="transaction-action"
      v-if="txType && !gameStore.errors.web3WrongNetwork"
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
    const gameOver = computed(() => gameStore.gameOver)
    const gameOverStatus = computed(() => gameStore.gameOverStatus)
    const txType = computed(() => localStore.txInfo?.txType)
    onMounted(() => localStore.getTxInfo())
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

    watch(gameOverStatus, value => {
      if (value == GameOverStatus.AllowRedeem) {
        modalStore.openModal(ModalKey.redeem)
        localStore.saveTxInfo({ txType: TxType.Redeem })
      } else if (value == GameOverStatus.AllowSale) {
        localStore.saveTxInfo({ txType: TxType.Buy })
      } else if (value == GameOverStatus.AllowWithdraw) {
        localStore.saveTxInfo({ txType: TxType.Withdraw })
      } else if (value == GameOverStatus.AlreadyWithdrawn) {
        modalStore.openModal(ModalKey.alreadyWithdrawn)
      }
    })
    watch(gameOver, value => {
      if (value) {
        modalStore.openModal(ModalKey.gameOver)
      }
    })

    return {
      showRedeemCompleteInfo,
      gameStore,
      NETWORKS,
      CURRENT_NETWORK,
      txType,
      fractionalizing,
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
