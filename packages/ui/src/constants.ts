import {
  type ColorsFromIndex,
  type ColorFromHex,
  type NetworkMap,
  TokenStatus,
  ColorHexMap,
  TxType,
} from '@/types'

export const ERC721_ADDRESS =
  import.meta.env.VITE_ERC721_ADDRESS ||
  '0xc0ffee3c6F66dE5a0adcCEc65Dc6bB20C8C6A454'

export const OPENSEA_BASE_URL =
  import.meta.env.VITE_OPENSEA_BASE_URL ||
  'https://opensea.io/assets/0x855BCa56D00F3f550D0c610BBF562FEBF6540bc6'

export const EXPLORER_BASE_URL =
  import.meta.env.VITE_EXPLORER_BASE_URL || 'https://polygonscan.com/tx/'

export const PAGINATION_LIMIT = 10

export const NETWORKS: NetworkMap = {
  137: {
    name: 'Polygon Mainnet',
    id: 137,
    contractAddress: import.meta.env.VITE_POLYGON_MAINNET_CONTRACT_ADDRESS,
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com'],
    marketplace: 'https://opensea.io/assets/matic',
    marketplaceName: 'OpenSea',
    confirmationCount: 3,
  },
  1030: {
    name: 'Conflux eSpace Mainnet',
    id: 1030,
  },
  25: {
    name: 'Cronos Mainnet',
    id: 25,
  },
  321: {
    name: 'KCC Mainnet',
    id: 321,
  },
  1: {
    name: 'Ethereum Mainnet',
    id: '1',
    contractAddress: import.meta.env.VITE_ETHEREUM_MAINNET_CONTRACT_ADDRESS,
    rpcUrls: ['https://eth-mainnet.public.blastapi.io'],
    blockExplorerUrls: ['https://etherscan.io'],
    marketplace: 'https://opensea.io/assets/ethereum',
    marketplaceName: 'OpenSea',
    confirmationCount: 3,
  },
  82: {
    name: 'Meter Mainnet',
    id: 82,
  },
  1088: {
    name: 'Metis Mainnet',
    id: 1088,
  },
  66: {
    name: 'OKXChain Mainnet',
    id: 66,
  },
  71: {
    name: 'Conflux eSpace Testnet',
    id: 71,
  },
  338: {
    name: 'Cronos Testnet',
    id: 338,
  },
  322: {
    name: 'KCC Testnet',
    id: 322,
  },
  5: {
    name: 'Ethereum Goerli',
    id: 5,
  },
  83: {
    name: 'Meter Testnet',
    id: 83,
  },
  588: {
    name: 'Metis Stardust Testnet',
    id: 588,
  },
  65: {
    name: 'OKXChain Testnet',
    id: 65,
  },
  80001: {
    name: 'Polygon Mumbai',
    id: 80001,
    contractAddress: import.meta.env.VITE_POLYGON_MUMBAI_CONTRACT_ADDRESS,
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    marketplace: 'https://testnets.opensea.io/assets/mumbai',
    marketplaceName: 'OpenSea',
    confirmationCount: 3,
  },
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ERC721_TOKEN_ID = 1

export const CURRENT_NETWORK = import.meta.env.VITE_CURRENT_NETWORK || 80001

export const VITE_TEST = import.meta.env.VITE_TEST || false

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:4000'

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'https://wittypixels.com'

export const ATTRIBUTES = {}

export const COLORS: ColorsFromIndex = {
  0: ColorHexMap.white,
  1: ColorHexMap.black,
  2: ColorHexMap.orange,
  3: ColorHexMap.yellow,
  4: ColorHexMap.green,
  5: ColorHexMap.blue,
  6: ColorHexMap.red,
  7: ColorHexMap.purple,
}
export const COLOR_FROM_HEX: ColorFromHex = {
  [ColorHexMap.white]: 0,
  [ColorHexMap.black]: 1,
  [ColorHexMap.orange]: 2,
  [ColorHexMap.yellow]: 3,
  [ColorHexMap.green]: 4,
  [ColorHexMap.blue]: 5,
  [ColorHexMap.red]: 6,
  [ColorHexMap.purple]: 7,
}
export const TOKEN_STATUS: Record<number, TokenStatus> = {
  0: TokenStatus.Void,
  1: TokenStatus.Launching,
  2: TokenStatus.Minting,
  3: TokenStatus.Fractionalized,
  4: TokenStatus.Acquired,
}
export const TX_ACTION_COPY: Record<TxType, string> = {
  [TxType.Redeem]: 'Redeem ownership',
  [TxType.Buy]: 'Buy NFT',
  [TxType.Withdraw]: 'Withdraw',
}
export const TX_ACTION_PROGRESS_COPY: Record<TxType, string> = {
  [TxType.Redeem]: 'Redeeming...',
  [TxType.Buy]: 'Buying...',
  [TxType.Withdraw]: 'Withdrawing...',
}
export const TIMEZONE = 'America/Denver'
export const CANVAS_WIDTH = import.meta.env.CANVAS_WIDTH
  ? parseInt(import.meta.env.VITE_CANVAS_WIDTH)
  : 250
export const CANVAS_HEIGHT = import.meta.env.CANVAS_HEIGHT
  ? parseInt(import.meta.env.VITE_CANVAS_HEIGHT)
  : 250
export const SCALE_BY = 1.01

export const POLLER_MILLISECONDS = import.meta.env.VITE_POLLER_MILLISECONDS
  ? parseInt(import.meta.env.VITE_POLLER_MILLISECONDS)
  : 5000

export const TIME_TO_REDEEM_MILLISECONDS = import.meta.env
  .VITE_TIME_TO_REDEEM_MILLISECONDS
  ? parseInt(import.meta.env.VITE_TIME_TO_REDEEM_MILLISECONDS)
  : 60000

export const GAME_ENDS_TIMESTAMP = import.meta.env.VITE_GAME_ENDS_TIMESTAMP
  ? parseInt(import.meta.env.VITE_GAME_ENDS_TIMESTAMP)
  : 1677891600000 // Fri, 3 March 2023 18:00 GMT-7,

// export const GAME_ENDS_TIMESTAMP = new Date().getTime() + 6000

export const PLAYER_MAINNET_TIMESTAMP = import.meta.env.PLAYER_MAINNET_TIMESTAMP
  ? parseInt(import.meta.env.VITE_PLAYER_MAINNET_TIMESTAMP)
  : 1677218400000 // Thu, 24 February 2023 0:00 GMT-7
