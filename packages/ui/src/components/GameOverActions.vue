<template>
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
      Allowing redeem
      <span v-if="!gameStore.redeemCountdownOver">
        in
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
  <ConnectToProvider
    id="connect-to-provider"
    v-if="gameStore.redeemCountdownOver"
  />
  <CreateTransaction id="transaction-action" v-if="txType" :txType="txType" />
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
    const fractionalizing = computed(() => {
      return (
        !gameOverStatus.value ||
        gameOverStatus.value == GameOverStatus.Fractionalizing ||
        gameStore.tokenStatus == TokenStatus.Minting
      )
    })

    onMounted(async () => {
      if (gameOver.value) {
        modalStore.openModal(ModalKey.gameOver)
      }
    })

    watch(gameOverStatus, value => {
      if (value == GameOverStatus.AllowRedeem) {
        modalStore.openModal(ModalKey.redeem)
        localStore.saveTxInfo({ txType: TxType.Redeem })
      } else if (value == GameOverStatus.AllowSale) {
        localStore.saveTxInfo({ txType: TxType.Buy })
      } else if (value == GameOverStatus.AllowWithdraw) {
        localStore.saveTxInfo({ txType: TxType.Withdraw })
      }
    })
    watch(gameOver, value => {
      if (value) {
        modalStore.openModal(ModalKey.gameOver)
      }
    })

    return {
      gameStore,
      NETWORKS,
      CURRENT_NETWORK,
      txType,
      fractionalizing,
    }
  },
}
</script>
