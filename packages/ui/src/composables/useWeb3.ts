/* eslint-disable @typescript-eslint/no-explicit-any */
import { onMounted, ref } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Web3 from 'web3/dist/web3.min.js'
import { useStore } from '@/stores/player'
import { useLocalStore } from '@/stores/local'
import { CONTRACT_ADDRESS, NETWORK } from '../constants'
import { ErrorKey } from '@/types'
import WittyPixelsTokenInterface from '../IWittyPixelsToken.json'
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

function networkById(id: string) {
  switch (id) {
    case '137':
      return 'Polygon Mainnet'
    case '80001':
      return 'Polygon Mumbai'
  }
}

const errorNetworkMessage = `Your web3 provider should be connected to the ${networkById(
  NETWORK
)} network`
const errorRedeemMessage = `There was an error minting your NFT.`
// const errorPreviewMessage = `There was an error showing the preview of your NFT.`

export function useWeb3() {
  let web3: Web3
  const player = useStore()
  const localStore = useLocalStore()
  const isProviderConnected = ref(false)
  const mintedAddress = ref('')
  const preview = ref('')

  async function enableProvider() {
    const accounts = await requestAccounts(web3)
    if (accounts[0]) {
      isProviderConnected.value = true
      if ((await web3.eth.net.getId()) !== Number(NETWORK)) {
        return player.setError(
          ErrorKey.network,
          createErrorMessage(errorNetworkMessage)
        )
      }
    }
  }

  async function addPolygonNetwork() {
    await window.ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            rpcUrls: ['https://polygon-rpc.com/'],
            blockExplorerUrls: ['https://polygonscan.com'],
          },
        ],
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  onMounted(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum || 'ws://localhost:8545')
      if (player.gameOver) {
        enableProvider()
      }
    }
  })

  async function getTokenStatus() {
    //TODO: get token status
    // call WITTY_PIXELS_TOKEN_VAULT
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
    //     player.setTokenIds(result)
    //     return result
    //   } catch (err) {
    //     console.error(err)
    //     player.setError('contractData', createErrorMessage(errorDataMessage))
    //   }
    // }
  }

  async function mint() {
    if ((await web3.eth.net.getId()) !== Number(NETWORK)) {
      return player.setError(
        ErrorKey.network,
        createErrorMessage(errorNetworkMessage)
      )
    } else {
      const contract = new web3.eth.Contract(
        WittyPixelsTokenInterface,
        CONTRACT_ADDRESS
      )
      const from = (await requestAccounts(web3))[0]
      const mintArgs = await player.getContractArgs(from)
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
          player.setError(
            ErrorKey.redeem,
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
    mint,
    mintedAddress,
    isProviderConnected,
    preview,
    enableProvider,
    addPolygonNetwork,
    open,
    getTokenIds,
    getTokenStatus,
  }
}
