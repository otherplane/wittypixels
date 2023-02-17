/* eslint-disable @typescript-eslint/no-explicit-any */
import { onMounted, ref } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Web3 from 'web3/dist/web3.min.js'
import { useLocalStore } from '@/stores/local'
import {
  ERC721_TOKEN_ID,
  ERC721_ADDRESS,
  NETWORKS,
  CURRENT_NETWORK,
  ZERO_ADDRESS,
  TOKEN_STATUS,
} from '../constants'
import {
  GameOverErrorKey,
  ERC20Status,
  type RedeemPlayerInfo,
  type ERC20ContractInfo,
  type ERC20WalletInfo,
  GameOverStatus,
  TxType,
  TokenStatus,
} from '@/types'
//ERC721
import WittyPixelsTokenInterface from '../WpxTokenUI.json'
//ERC20
import WittyPixelsTokenVaultInterface from '../WpxTokenVaultUI.json'
import { useGameStore } from '@/stores/game'
import { useStore } from '@/stores/player'

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
const errorTransactionMessage = `There was an error creating the transaction`
const errorTokenStatus = `Error getting contract status`
const errorTokenVault = `Error getting ERC20 contract address`

export function useWeb3() {
  let web3: Web3
  const localStore = useLocalStore()
  const gameStore = useGameStore()
  const player = useStore()
  const network = ref(NETWORKS[CURRENT_NETWORK])
  const checkIfExist = ref()
  let erc721Contract: any
  let erc20Contract: any

  onMounted(async () => {
    if (window.ethereum && !web3) {
      web3 = new Web3(window.ethereum || 'ws://localhost:8545')
      // detect account change
      window.ethereum.on('accountsChanged', (accounts: any) => {
        gameStore.setProvider({
          network: gameStore.provider.network,
          address: accounts[0],
        })
        enableProvider()
      })
      // detect network change
      window.ethereum.on('chainChanged', (networkId: any) => {
        gameStore.setProvider({
          network: NETWORKS[networkId]?.name ?? 'wrong network',
          address: gameStore.provider.address,
        })
        enableProvider()
      })
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
        const currentProvider: number = await web3.eth.net.getId()
        gameStore.setProvider({
          network: NETWORKS[currentProvider]?.name ?? 'wrong network',
          address: accounts[0],
        })
        if (currentProvider !== Number(network.value?.id)) {
          gameStore.setError(
            GameOverErrorKey.web3WrongNetwork,
            createErrorMessage(errorNetworkMessage)
          )
        } else {
          // The player is connected to the correct provider
          gameStore.clearError(GameOverErrorKey.web3WrongNetwork)
          if (!erc721Contract) {
            erc721Contract = new web3.eth.Contract(
              WittyPixelsTokenInterface,
              ERC721_ADDRESS
            )
          }
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
    if (web3) {
      let accounts: Array<string>
      try {
        accounts = await requestAccounts(web3)
        await window.ethereum
          .request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.toHex(network.value.id) }],
          })
          .then(() => {
            gameStore.clearError(GameOverErrorKey.web3WrongNetwork)
            gameStore.clearError(GameOverErrorKey.web3Disconnected)
          })
          .catch(async (error: any) => {
            console.log('Error switching networks', error)
            const currentProvider: number = await web3.eth.net.getId()
            gameStore.setProvider({
              network: NETWORKS[currentProvider]?.name ?? 'wrong network',
              address: accounts[0],
            })
            gameStore.setError(
              GameOverErrorKey.web3WrongNetwork,
              createErrorMessage(errorNetworkMessage)
            )
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
                .then(() => {
                  gameStore.clearError(GameOverErrorKey.web3WrongNetwork)
                  gameStore.clearError(GameOverErrorKey.web3Disconnected)
                })
                .catch((error: any) => {
                  console.log('Error adding network', error)
                  gameStore.setError(
                    GameOverErrorKey.web3WrongNetwork,
                    createErrorMessage(errorNetworkMessage)
                  )
                })
            }
          })
      } catch (err) {
        gameStore.setError(
          GameOverErrorKey.web3Disconnected,
          createErrorMessage(errorWeb3Disconnected)
        )
      }
    }
  }

  async function getTokenVaultAddress() {
    try {
      return await erc721Contract.methods.getTokenVault(ERC721_TOKEN_ID).call()
    } catch (err) {
      console.error('Error getting ERC20 contract address', err)
      gameStore.setError(
        GameOverErrorKey.tokenVault,
        createErrorMessage(errorTokenVault)
      )
      return
    }
  }

  async function checkTokenStatus() {
    try {
      const result = await erc721Contract.methods
        .getTokenStatusString(ERC721_TOKEN_ID)
        .call()
      if (
        result == TokenStatus.Fractionalized ||
        result == TokenStatus.Acquired
      ) {
        if (!erc20Contract) {
          const erc20ContractAddress = await getTokenVaultAddress()
          erc20Contract = new web3.eth.Contract(
            WittyPixelsTokenVaultInterface,
            erc20ContractAddress
          )
        }
      } else {
        gameStore.setGameOverStatus(GameOverStatus.Fractionalizing)
      }
      gameStore.setTokenStatus(result)
      if (erc20Contract) {
        const erc20PlayerInfo: RedeemPlayerInfo | null =
          await getRedeemPlayerInfo()
        const erc20Info: ERC20ContractInfo | null = await getERC20ContractInfo()
        if (erc20PlayerInfo?.playerAddress === ZERO_ADDRESS) {
          gameStore.setGameOverStatus(GameOverStatus.AllowRedeem)
        } else {
          if (erc20Info?.status == ERC20Status.Acquired) {
            gameStore.setGameOverStatus(GameOverStatus.AllowWithdraw)
          } else if (erc20Info?.status == ERC20Status.Auctioning) {
            gameStore.setGameOverStatus(GameOverStatus.AllowSale)
          } else {
            gameStore.setGameOverStatus(GameOverStatus.AwaitSale)
            //GET REDEEM INFO
          }
        }
      }
    } catch (err) {
      console.error('Error getting contract status', err)
      gameStore.setError(
        GameOverErrorKey.tokenStatus,
        createErrorMessage(errorTokenStatus)
      )
    }
  }

  async function getERC20ContractInfo() {
    // Status and stats from ERC20 contract
    try {
      const ERC20ContractInfo: ERC20ContractInfo = await erc20Contract.methods
        .getInfo()
        .call()
      const currentPrice = await web3.utils.fromWei(
        ERC20ContractInfo.currentPrice
      )
      return {
        ...ERC20ContractInfo,
        currentPrice,
      }
    } catch (err) {
      console.log('Error getting ERC20 Contract information', err)
    }
    return null
  }

  async function getRedeemPlayerInfo() {
    // Player information once redeem
    try {
      const playerInfo: RedeemPlayerInfo = await erc20Contract.methods
        .getPlayerInfo(player.creationIndex)
        .call()
      return playerInfo
    } catch (err) {
      console.log('Error getting redeem player info', err)
    }
    return null
  }

  async function getWalletInfo({ walletAddress }: { walletAddress: string }) {
    try {
      const balance = await erc20Contract.methods
        .balanceOf(walletAddress)
        .call()
      const standardizeBalance = await web3.utils.fromWei(balance)
      const ERC20WalletInfo: ERC20WalletInfo = await erc20Contract.methods
        .getWalletInfo(walletAddress)
        .call()
      return {
        ...ERC20WalletInfo,
        balance: standardizeBalance,
      }
    } catch (err) {
      console.log('Error getting wallet info', err)
    }
  }

  async function redeemOwnership() {
    const from = gameStore.provider.address
    const redeemArgs = await gameStore.getContractArgs(from)
    const gasPrice = await web3.eth.getGasPrice()
    const fromTxCount = await web3.eth.getTransactionCount(from)
    try {
      erc20Contract.methods
        .redeem(redeemArgs.deeds)
        .send({ from, gasPrice })
        .on('error', (error: any) => {
          gameStore.setError(
            GameOverErrorKey.transaction,
            createErrorMessage(errorTransactionMessage)
          )
          console.error(error)
        })
        .on('transactionHash', function (txHash: string) {
          localStore.saveTxInfo({
            txType: TxType.Redeem,
            from,
            txHash,
            fromTxCount,
          })
        })
    } catch (error) {
      gameStore.setError(
        GameOverErrorKey.transaction,
        createErrorMessage(errorTransactionMessage)
      )
      console.error('Error redeeming ownership', error)
    }
  }

  async function buyNFT() {
    // Buy Witty Pixels fractionalized NFT
    const from = gameStore.provider.address
    const gasPrice = await web3.eth.getGasPrice()
    const fromTxCount = await web3.eth.getTransactionCount(from)
    try {
      return await erc20Contract.methods
        .acquire(gameStore.provider.address)
        .send({ from, gasPrice })
        .on('error', (error: any) => {
          gameStore.setError(
            GameOverErrorKey.transaction,
            createErrorMessage(errorTransactionMessage)
          )
          console.error(error)
        })
        .on('transactionHash', function (txHash: string) {
          localStore.saveTxInfo({
            txType: TxType.Buy,
            from,
            txHash,
            fromTxCount,
          })
        })
    } catch (err) {
      console.log('Error buying Witty Pixels NFT', err)
      gameStore.setError(
        GameOverErrorKey.transaction,
        createErrorMessage(errorTransactionMessage)
      )
    }
  }

  async function withdrawNFTOwnership() {
    // Withdraw NFT ownership if the NFT has been bought
    const from = gameStore.provider.address
    const gasPrice = await web3.eth.getGasPrice()
    const fromTxCount = await web3.eth.getTransactionCount(from)
    try {
      return await erc20Contract.methods
        .withdraw(gameStore.provider.address)
        .send({ from, gasPrice })
        .on('error', (error: any) => {
          gameStore.setError(
            GameOverErrorKey.transaction,
            createErrorMessage(errorTransactionMessage)
          )
          console.error(error)
        })
        .on('transactionHash', function (txHash: string) {
          localStore.saveTxInfo({
            txType: TxType.Withdraw,
            from,
            txHash,
            fromTxCount,
          })
        })
    } catch (err) {
      console.log('Error withdrawing Witty Pixels NFT', err)
      gameStore.setError(
        GameOverErrorKey.transaction,
        createErrorMessage(errorTransactionMessage)
      )
    }
  }

  async function checkTransactionStatus() {
    if (gameStore.provider?.address && !gameStore.errors.web3WrongNetwork) {
      if (localStore.txInfo?.blockNumber && localStore.txInfo?.blockHash) {
        const actualBlockHash = (
          await web3.eth.getBlock(localStore.txInfo?.blockNumber)
        ).hash
        if (actualBlockHash === localStore.txInfo?.blockHash) {
          const txConfirmations =
            (await web3.eth.getBlockNumber()) - localStore.txInfo?.blockNumber
          if (txConfirmations < 0) {
            // Chain rollback. Force getting a new transaction receipt
            localStore.clearTxBlockInfo()
          } else if (
            txConfirmations >= (network.value.confirmationCount ?? 2)
          ) {
            // Transaction confirmed
            localStore.saveTxInfo({
              ...localStore.txInfo,
              txConfirmation: true,
            })
          }
        } else {
          gameStore.setError(
            GameOverErrorKey.transaction,
            createErrorMessage('Chain rollback detected, please try again')
          )
          localStore.clearTxBlockInfo()
        }
      } else {
        const receipt = await web3.eth.getTransactionReceipt(
          localStore?.txInfo?.txHash
        )
        if (receipt) {
          if (receipt.status) {
            // The transaction is being confirmed
            localStore.saveTxInfo({
              ...localStore.txInfo,
              blockNumber: receipt.blockNumber,
              blockHash: receipt.blockHash,
            })
          } else {
            // Receipt status is false
            gameStore.setError(
              GameOverErrorKey.transaction,
              createErrorMessage(
                'The transaction was reverted, please try again'
              )
            )
            localStore.saveTxInfo({ txType: localStore?.txInfo?.txType })
          }
        } else {
          // No receipt yet for transaction hash
          try {
            const externalConfirmation =
              (localStore.txInfo?.txType == TxType.Redeem &&
                gameStore.gameOverStatus !== GameOverStatus.AllowRedeem) ||
              (localStore.txInfo?.txType == TxType.Buy &&
                gameStore.gameOverStatus !== GameOverStatus.AllowSale) ||
              (localStore.txInfo?.txType == TxType.Withdraw &&
                gameStore.gameOverStatus !== GameOverStatus.AllowWithdraw)
            if (externalConfirmation) {
              localStore.saveTxInfo({
                externalConfirmation: true,
              })
            } else {
              // The tx count has changed when waiting for the transaction to be resolved
              const fromTxCount = await web3.eth.getTransactionCount(
                localStore.txInfo?.from
              )
              if (fromTxCount !== localStore.txInfo?.fromTxCount) {
                gameStore.setError(
                  GameOverErrorKey.transaction,
                  createErrorMessage(
                    'The transaction was cancelled, please try again'
                  )
                )
                localStore.saveTxInfo({ txType: localStore?.txInfo?.txType })
              }
            }
          } catch (err) {
            gameStore.setError(
              GameOverErrorKey.transaction,
              createErrorMessage('Error getting block number from the contract')
            )
          }
        }
      }
    }
  }

  return {
    enableProvider,
    addNetwork,
    checkTokenStatus,
    checkTransactionStatus,
    redeemOwnership,
    withdrawNFTOwnership,
    getRedeemPlayerInfo,
    buyNFT,
    getWalletInfo,
    getERC20ContractInfo,
  }
}
