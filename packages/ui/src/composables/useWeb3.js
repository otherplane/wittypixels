import { onMounted, ref } from 'vue'
import Web3 from 'web3/dist/web3.min.js'

import { useStore } from '@/stores/player'
import { useLocalStore } from '@/stores/local'
import jsonInterface from '../UI.abi.json'
import { CONTRACT_ADDRESS, NETWORK } from '../constants'

async function requestAccounts(web3) {
  return await web3.givenProvider.request({ method: 'eth_requestAccounts' })
}

function createErrorMessage(message) {
  return {
    response: {
      data: {
        message,
      },
    },
  }
}

function networkById(id) {
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
const errorDataMessage = `There was an error getting the NFT data`
const errorMintMessage = `There was an error minting your NFT.`
// const errorPreviewMessage = `There was an error showing the preview of your NFT.`

export function useWeb3() {
  let web3
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
          'network',
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
      .catch(error => {
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

  async function getTokenIds() {
    if ((await web3.eth.net.getId()) !== Number(NETWORK)) {
      return player.setError('network', createErrorMessage(errorNetworkMessage))
    } else {
      try {
        const contract = new web3.eth.Contract(jsonInterface, CONTRACT_ADDRESS)
        const result = await contract.methods
          .getFarmerTokens(player.farmerId)
          .call()
        player.setTokenIds(result)
        return result
      } catch (err) {
        console.error(err)
        player.setError('contractData', createErrorMessage(errorDataMessage))
      }
    }
  }

  async function mint() {
    if ((await web3.eth.net.getId()) !== Number(NETWORK)) {
      return player.setError('network', createErrorMessage(errorNetworkMessage))
    } else {
      const contract = new web3.eth.Contract(jsonInterface, CONTRACT_ADDRESS)
      const from = (await requestAccounts(web3))[0]
      const mintArgs = await player.getContractArgs(from)
      const playerAwards = mintArgs.data.farmerAwards.map(medal =>
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
        .on('error', error => {
          player.setError('mint', createErrorMessage(errorMintMessage))
          console.error(error)
        })
        .on('transactionHash', function (transactionHash) {
          localStore.saveMintInfo({ transactionHash })
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          localStore.saveMintInfo(receipt)
          const data = player.getMintedAwardsImages()
          player.setData(data)
        })
        .then(newContractInstance => {
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
  }
}
