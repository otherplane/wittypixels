export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  '0xE41D6D1cFe55A0fc2035dD663D873D15f21d93c2'

export const OPENSEA_BASE_URL =
  import.meta.env.VITE_OPENSEA_BASE_URL ||
  'https://opensea.io/assets/0x855BCa56D00F3f550D0c610BBF562FEBF6540bc6'

export const EXPLORER_BASE_URL =
  import.meta.env.VITE_EXPLORER_BASE_URL || 'https://polygonscan.com/tx/'

export const NETWORK = import.meta.env.VITE_NETWORK || 137

export const VITE_TEST = import.meta.env.VITE_TEST || false

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:4000'

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'https://wittypixels.com'

export const ATTRIBUTES = {}

export const COLORS = {
  0: 'red',
  1: 'orange',
  2: 'yellow',
  3: 'green',
  4: 'blue',
  5: 'purple',
}
export const TIMEZONE = 'America/Denver'
export const PIXEL_SIZE = 16
export const CANVAS_WIDTH = 1000
export const CANVAS_HEIGHT = 1000
export const SCALE_BY = 1.01

export const POLLER_MILLISECONDS = import.meta.env.VITE_POLLER_MILLISECONDS
  ? parseInt(import.meta.env.VITE_POLLER_MILLISECONDS)
  : 5000

export const TIME_TO_MINT_MILLISECONDS = import.meta.env
  .VITE_TIME_TO_MINT_MILLISECONDS
  ? parseInt(import.meta.env.VITE_TIME_TO_MINT_MILLISECONDS)
  : 60000

export const DEMO_ENDS_TIMESTAMP = import.meta.env.VITE_DEMO_ENDS_TIMESTAMP
  ? parseInt(import.meta.env.VITE_DEMO_ENDS_TIMESTAMP)
  : 1658241429000 // Tue Jul 19 2022 16:37:09 GMT+0200 (Central European Summer Time)

export const GAME_ENDS_TIMESTAMP = import.meta.env.VITE_GAME_ENDS_TIMESTAMP
  ? parseInt(import.meta.env.VITE_GAME_ENDS_TIMESTAMP)
  : 1658241429000 // Tue Jul 19 2022 16:37:09 GMT+0200 (Central European Summer Time)

export const PLAYER_MAINNET_TIMESTAMP = import.meta.env.PLAYER_MAINNET_TIMESTAMP
  ? parseInt(import.meta.env.VITE_PLAYER_MAINNET_TIMESTAMP)
  : 1658241429000 // Tue Jul 19 2022 16:37:09 GMT+0200 (Central European Summer Time)
