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

// Secp256k1 private key used for signing in the `mint` endpoint
export const MINT_PRIVATE_KEY = process.env.MINT_PRIVATE_KEY || '0x00'

// Tell how many players to generate
export const PLAYERS_COUNT: number = process.env.PLAYERS_COUNT
  ? parseInt(process.env.PLAYERS_COUNT)
  : 10

// Awards date in millis
// If `PLAYER_MINT_TIMESTAMP=0`, checks are ignored (for testing purposes)
export const PLAYER_MINT_TIMESTAMP = process.env.PLAYER_MINT_TIMESTAMP
  ? parseInt(process.env.PLAYER_MINT_TIMESTAMP)
  : 1645351200 // Sunday, February 20, 2022 18:00:00 PM (UTC)

// Web3 provider URL
export const WEB3_PROVIDER =
  process.env.WEB3_PROVIDER || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID'

// WitmonERC721 contract address
export const WITMON_ERC721_ADDRESS =
  process.env.WITMON_ERC721_ADDRESS ||
  '0x691908f883E006C0fB42da190A9EA07E6996D6c6'

export const MONGO_URI: string =
  process.env.MONGO_URI || 'mongodb://localhost:27017/database'

// Mainnet date in millis
// If `PLAYER_MAINNET_TIMESTAMP=0`, checks are ignored (for testing purposes)
export const PLAYER_MAINNET_TIMESTAMP = process.env.PLAYER_MAINNET_TIMESTAMP
  ? parseInt(process.env.PLAYER_MAINNET_TIMESTAMP)
  : 1645131600 // Thursday, February 17, 2022 09:00:00 PM (UTC)

export const CANVAS_MAX_X = process.env.CANVAS_MAX_X
  ? parseInt(process.env.CANVAS_MAX_X)
  : 1000

export const CANVAS_MAX_Y = process.env.CANVAS_MAX_Y
  ? parseInt(process.env.CANVAS_MAX_Y)
  : 1000

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
  : '0xc0ffee3c6F66dE5a0adcCEc65Dc6bB20C8C6A454'

export const ERC721_TOKEN_ID = process.env.ERC721_TOKEN_ID
  ? parseInt(process.env.ERC721_TOKEN_ID)
  : 1

export default {
  PLAYER_KEY_LENGTH_BYTES,
  PLAYER_MINT_TIMESTAMP,
  PLAYERS_COUNT,
  INTERACTION_COOLDOWN_MILLIS,
  INTERACTION_DURATION_MILLIS,
  SELF_INTERACTION_COLOR_QUANTITY,
  INTERACTION_COLOR_QUANTITY,
  INTERACTION_COLOR_QUANTITY_MIN,
  INTERACTION_COLOR_QUANTITY_DIVISOR,
  WITMON_ERC721_ADDRESS,
  PLAYER_MAINNET_TIMESTAMP,
  CANVAS_MAX_X,
  CANVAS_MAX_Y,
  CANVAS_CACHE_MAX_SIZE,
}
