/**
 * Constants. These can be customized through environment variables.
 */

// Byte length of players keys. This can be adjusted for usability vs. security trade-offs.
let playerKeyLengthBytes: number = process.env.PLAYER_KEY_LENGTH_BYTES
  ? parseInt(process.env.PLAYER_KEY_LENGTH_BYTES)
  : 8
// Ensure that player keys byte length is 8 <= x < 30
if (playerKeyLengthBytes < 8 || playerKeyLengthBytes > 30) {
  playerKeyLengthBytes = 8
}
export const PLAYER_KEY_LENGTH_BYTES = playerKeyLengthBytes

// Base string to use for salting the deterministic player key derivation.
export const PLAYER_KEY_SALT: string = process.env.PLAYER_KEY_SALT || ''

// JWT secret to derive tokens
export const JWT_SECRET: string = process.env.JWT_SECRET || 'secret'

// Player interaction duration in millis
export const INTERACTION_DURATION_MILLIS = process.env
  .INTERACTION_DURATION_MILLIS
  ? parseInt(process.env.INTERACTION_DURATION_MILLIS)
  : 2 * 60 * 1000

// Player interaction cooldown in millis
export const INTERACTION_COOLDOWN_MILLIS = process.env
  .INTERACTION_COOLDOWN_MILLIS
  ? Math.max(
      parseInt(process.env.INTERACTION_COOLDOWN_MILLIS),
      INTERACTION_DURATION_MILLIS
    )
  : Math.max(2 * 60 * 60 * 1000, INTERACTION_DURATION_MILLIS)

// Number of different theme colors
export const COLORS_COUNT = 5

// Self interaction points
export const SELF_INTERACTION_COLOR_QUANTITY = process.env
  .SELF_INTERACTION_COLOR_QUANTITY
  ? parseInt(process.env.SELF_INTERACTION_COLOR_QUANTITY)
  : 1

// Interaction base points
export const INTERACTION_COLOR_QUANTITY = process.env.INTERACTION_COLOR_QUANTITY
  ? parseInt(process.env.INTERACTION_COLOR_QUANTITY)
  : 10

// Minimum amount of points that can be rewarded after a interaction
export const INTERACTION_COLOR_QUANTITY_MIN = process.env
  .INTERACTION_COLOR_QUANTITY_MIN
  ? parseInt(process.env.INTERACTION_COLOR_QUANTITY_MIN)
  : 1

// Interaction point divisor to be applied every time the same incubation happens
export const INTERACTION_COLOR_QUANTITY_DIVISOR = process.env
  .INTERACTION_COLOR_QUANTITY_DIVISOR
  ? parseInt(process.env.INTERACTION_COLOR_QUANTITY_DIVISOR)
  : 2

// Secp256k1 private key used for signing in the `signRedemption` endpoint
export const ERC721_TOKEN_CURATOR_PK =
  process.env.ERC721_TOKEN_CURATOR_PK || '0x00'

// Tell how many players to generate
export const PLAYERS_COUNT: number = process.env.PLAYERS_COUNT
  ? parseInt(process.env.PLAYERS_COUNT)
  : 10

// Awards date in millis
// If `ERC20_TOKEN_START_TS=0`, checks are ignored (for testing purposes)
// export const ERC20_TOKEN_START_TS = process.env.ERC20_TOKEN_START_TS
//   ? parseInt(process.env.ERC20_TOKEN_START_TS)
//   : 1677891600 // Fri, 3 March 2023 18:00 GMT-7,

export const ERC20_TOKEN_START_TS = 0

// Web3 provider URL
// export const WEB3_PROVIDER =
//   process.env.WEB3_PROVIDER || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID'

export const WEB3_PROVIDER =
  process.env.WEB3_PROVIDER || 'https://matic-mumbai.chainstacklabs.com/'

// WitmonERC721 contract address
export const WITMON_ERC721_ADDRESS =
  process.env.WITMON_ERC721_ADDRESS ||
  '0xc0FFee029589de1082f8e14d7809F27f452e5191'

export const MONGO_URI: string =
  process.env.MONGO_URI || 'mongodb://localhost:27017/database'

export const CANVAS_MAX_X = process.env.CANVAS_MAX_X
  ? parseInt(process.env.CANVAS_MAX_X)
  : 250

export const CANVAS_MAX_Y = process.env.CANVAS_MAX_Y
  ? parseInt(process.env.CANVAS_MAX_Y)
  : 250

export const CANVAS_SECTOR_SIZE = process.env.CANVAS_SECTOR_SIZE
  ? parseInt(process.env.CANVAS_SECTOR_SIZE)
  : 50

export const OVERWRITE_CANVAS = process.env.OVERWRITE_CANVAS
  ? parseInt(process.env.OVERWRITE_CANVAS)
  : false

export const CANVAS_CACHE_MAX_SIZE = process.env.CANVAS_CACHE_MAX_SIZE
  ? parseInt(process.env.CANVAS_CACHE_MAX_SIZE)
  : 100000

// Pixel locked
export const PIXEL_LOCKED_DURATION_MS = process.env.PIXEL_LOCKED_DURATION_MS
  ? parseInt(process.env.PIXEL_LOCKED_DURATION_MS)
  : 10 * 1000

export const ERC721_TOKEN_ADDRESS = process.env.ERC721_TOKEN_ADDRESS
  ? process.env.ERC721_TOKEN_ADDRESS
  : '0xc0FFee029589de1082f8e14d7809F27f452e5191'

export const ERC721_TOKEN_ID = process.env.ERC721_TOKEN_ID
  ? parseInt(process.env.ERC721_TOKEN_ID)
  : 2
export const DEFAULT_RGB: [number, number, number] = [255, 255, 255]

// Default bonus time: 15 minutes
export const BONUS_TIME: number = parseInt(
  process.env.BONUS_TIME || process.env.POAP_BONUS_TIME || '900000'
)

// Multiplier that will be applied to how many pixels you get out of being scanned during the bonus period
export const BONUS_MULTIPLIER = parseInt(process.env.BONUS_MULTIPLIER || '2')

// How many bonus codes to pre-compute
export const BONUS_COUNT = parseInt(process.env.BONUS_COUNT || '500')

export default {
  PLAYER_KEY_LENGTH_BYTES,
  ERC20_TOKEN_START_TS,
  PLAYERS_COUNT,
  INTERACTION_COOLDOWN_MILLIS,
  INTERACTION_DURATION_MILLIS,
  SELF_INTERACTION_COLOR_QUANTITY,
  INTERACTION_COLOR_QUANTITY,
  INTERACTION_COLOR_QUANTITY_MIN,
  INTERACTION_COLOR_QUANTITY_DIVISOR,
  WITMON_ERC721_ADDRESS,
  CANVAS_MAX_X,
  CANVAS_MAX_Y,
  CANVAS_CACHE_MAX_SIZE,
  DEFAULT_RGB,
  BONUS_COUNT,
  BONUS_MULTIPLIER,
  BONUS_TIME,
}
