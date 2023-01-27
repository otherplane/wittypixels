/* eslint-disable @typescript-eslint/no-explicit-any */
import { onMounted, ref } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Web3 from 'web3/dist/web3.min.js'
import { useLocalStore } from '@/stores/local'
import { CONTRACT_ADDRESS, NETWORKS, CURRENT_NETWORK } from '../constants'
import { GameOverErrorKey, TokenStatus } from '@/types'
import WittyPixelsTokenInterface from '../IWittyPixelsToken.json'
import { useGameStore } from '@/stores/game'
// import WittyPixelsTokenVaultInterface from '../IWittyPixelsTokenVault.json'

declare global {
  interface Window {
    ethereum?: any
  }
}

async function requestAccounts(web3: Web3) {
  return await web3.givenProvider.request({ method: 'eth_requestAccounts' })
}

function createErrorMessage(message: string) {
  return {
    response: {
      data: {
        message,
      },
    },
  }
}

const errorNetworkMessage = `Your web3 provider should be connected to the ${NETWORKS[CURRENT_NETWORK].name} network`
const errorWeb3Disconnected = `There is no web3 provider connected`
const errorRedeemMessage = `There was an error minting your NFT.`
// const errorPreviewMessage = `There was an error showing the preview of your NFT.`

export function useWeb3() {
  let web3: Web3
  const localStore = useLocalStore()
  const gameStore = useGameStore()
  const isProviderConnected = ref(false)
  const mintedAddress = ref('')
  const preview = ref('')
  const network = ref(NETWORKS[CURRENT_NETWORK])

  onMounted(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum || 'ws://localhost:8545')
    }
  })

  async function enableProvider() {
    gameStore.clearError(GameOverErrorKey.web3WrongNetwork)
    gameStore.clearError(GameOverErrorKey.web3Disconnected)
    if (web3) {
      let accounts
      try {
        accounts = await requestAccounts(web3)
      } catch (err) {
        gameStore.setError(
          GameOverErrorKey.web3Disconnected,
          createErrorMessage(errorWeb3Disconnected)
        )
      }
      if (accounts[0]) {
        isProviderConnected.value = true
        if ((await web3.eth.net.getId()) !== Number(network.value?.id)) {
          gameStore.setError(
            GameOverErrorKey.web3WrongNetwork,
            createErrorMessage(errorNetworkMessage)
          )
        } else {
          gameStore.clearError(GameOverErrorKey.web3WrongNetwork)
        }
      } else {
        gameStore.setError(
          GameOverErrorKey.web3Disconnected,
          createErrorMessage(errorWeb3Disconnected)
        )
      }
    } else {
      gameStore.setError(
        GameOverErrorKey.web3Disconnected,
        createErrorMessage(errorWeb3Disconnected)
      )
    }
  }

  async function addNetwork() {
    gameStore.clearError(GameOverErrorKey.web3WrongNetwork)
    gameStore.clearError(GameOverErrorKey.web3Disconnected)
    isProviderConnected.value = true
    await window.ethereum
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(network.value.id) }],
      })
      .catch(async (error: any) => {
        if (error.code === 4902) {
          await window.ethereum
            .request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: web3.utils.toHex(network.value.id),
                  chainName: network.value.name,
                  rpcUrls: network.value.rpcUrls,
                  blockExplorerUrls: network.value.rpcUrls,
                },
              ],
            })
            .catch((error: any) => {
              console.log(error)
              return gameStore.setError(
                GameOverErrorKey.web3ErrorSwitchingNetworks,
                createErrorMessage(errorNetworkMessage)
              )
            })
        }
      })
  }

  async function getTokenStatus() {
    //TODO: get token status
    // call WITTY_PIXELS_TOKEN_VAULT
    const tokenStatus: TokenStatus = TokenStatus.Fractionalized
    gameStore.tokenStatus = tokenStatus
  }

  async function getConfirmationStatus() {
    // TODO: get confirmation status
  }

  async function getTokenIds() {
    // if ((await web3.eth.net.getId()) !== Number(NETWORK)) {
    //   return player.setError('network', createErrorMessage(errorNetworkMessage))
    // } else {
    //   try {
    //     const contract = new web3.eth.Contract(jsonInterface, CONTRACT_ADDRESS)
    //     const result = await contract.methods
    //       .getFarmerTokens(player.farmerId)
    //       .call()
    //     gameOverStore.setTokenIds(result)
    //     return result
    //   } catch (err) {
    //     console.error(err)
    //     player.setError('contractData', createErrorMessage(errorDataMessage))
    //   }
    // }
  }

  async function mint() {
    if ((await web3.eth.net.getId()) !== Number(network.value.id)) {
      return gameStore.setError(
        GameOverErrorKey.web3WrongNetwork,
        createErrorMessage(errorNetworkMessage)
      )
    } else {
      const contract = new web3.eth.Contract(
        WittyPixelsTokenInterface,
        CONTRACT_ADDRESS
      )
      const from = (await requestAccounts(web3))[0]
      const mintArgs = await gameStore.getContractArgs(from)
      const playerAwards = mintArgs.data.farmerAwards.map((medal: any) =>
        Object.values(medal)
      )

      contract.methods
        .mintFarmerAwards(
          mintArgs.data.address,
          mintArgs.data.playerId,
          mintArgs.data.playerScore,
          mintArgs.data.playerName,
          playerAwards,
          `0x${mintArgs.envelopedSignature.signature}`
        )
        .send({ from })
        .on('error', (error: any) => {
          gameStore.setError(
            GameOverErrorKey.redeem,
            createErrorMessage(errorRedeemMessage)
          )
          console.error(error)
        })
        .on('transactionHash', function (transactionHash: string) {
          localStore.saveMintInfo({ transactionHash })
        })
        .on('confirmation', (_confirmationNumber: any, receipt: any) => {
          localStore.saveMintInfo(receipt)
        })
        .then((newContractInstance: any) => {
          console.log('newContractInstance', newContractInstance)
          console.log('Witmon minted: ', newContractInstance.transactionHash)
        })
    }
  }

  return {
    isProviderConnected,
    preview,
    enableProvider,
    addNetwork,
    mint,
    mintedAddress,
    open,
    getTokenIds,
    getTokenStatus,
    getConfirmationStatus,
  }
}
