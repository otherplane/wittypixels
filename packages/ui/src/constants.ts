import {
  type ColorShade,
  type ColorMap,
  type NetworkMap,
  TokenStatus,
  TxType,
} from '@/types'

export const MAX_ERROR_COUNTER = 2

export const ERC721_ADDRESS =
  import.meta.env.VITE_ERC721_ADDRESS ||
  '0xc0FFee029589de1082f8e14d7809F27f452e5191'

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

export const RED_SHADES: ColorShade = {
  0: [255, 219, 227],
  1: [254, 147, 172],
  2: [253, 75, 117],
  3: [234, 3, 58],
  4: [180, 2, 45],
  5: [108, 1, 27],
  6: [36, 0, 9],
}
export const ORANGE_SHADES: ColorShade = {
  0: [255, 225, 219],
  1: [255, 166, 146],
  2: [255, 107, 73],
  3: [255, 87, 48],
  4: [182, 34, 0],
  5: [109, 21, 0],
  6: [36, 7, 0],
}
export const YELLOW_SHADES: ColorShade = {
  0: [254, 252, 220],
  1: [251, 246, 150],
  2: [248, 240, 80],
  3: [245, 234, 10],
  4: [175, 167, 7],
  5: [105, 100, 4],
  6: [35, 33, 1],
}
export const GREEN_SHADES: ColorShade = {
  0: [228, 246, 228],
  1: [175, 227, 173],
  2: [121, 209, 119],
  3: [86, 197, 83],
  4: [48, 136, 46],
  5: [29, 82, 28],
  6: [10, 27, 9],
}
export const BLUE_SHADES: ColorShade = {
  0: [219, 232, 255],
  1: [146, 185, 255],
  2: [73, 138, 255],
  3: [92, 150, 255],
  4: [0, 65, 182],
  5: [0, 39, 109],
  6: [0, 13, 36],
}
export const PURPLE_SHADES: ColorShade = {
  0: [231, 219, 255],
  1: [183, 146, 255],
  2: [135, 73, 255],
  3: [141, 82, 255],
  4: [62, 0, 182],
  5: [37, 0, 109],
  6: [12, 0, 36],
}
export const WHITE_RGBA = [255, 255, 255]
export const BLACK_RGBA = [0, 0, 0]

export const COLORS: ColorMap = {
  0: RED_SHADES,
  1: ORANGE_SHADES,
  2: YELLOW_SHADES,
  3: GREEN_SHADES,
  4: BLUE_SHADES,
  5: PURPLE_SHADES,
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
