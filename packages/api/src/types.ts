import { Static, Type, TSchema } from '@sinclair/typebox'
export { Db, Collection, ObjectId, WithId } from 'mongodb'

const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()])

export const ClaimPlayerParams = Type.Object({
  key: Type.String(),
})
export type ClaimPlayerParams = Static<typeof ClaimPlayerParams>

const Palette = Type.Object({
  0: Type.Integer(),
  1: Type.Integer(),
  2: Type.Integer(),
  3: Type.Integer(),
  4: Type.Integer(),
  5: Type.Integer(),
})

export enum Color {
  // TODO: replace with correct colors
  White = 0,
  Red = 1,
  Blue = 2,
  Green = 3,
  Yellow = 4,
  Orange = 5,
}

export const PlayerVTO = Type.Object({
  key: Type.String(),
  token: Type.Optional(Type.String()),
  username: Type.String(),
  score: Type.Integer(),
  nft: Type.Array(Type.Optional(Type.String())),
  creationIndex: Type.Integer(),
  color: Type.Enum(Color),
  palette: Palette,
})

export type PlayerVTO = Static<typeof PlayerVTO>

export const DbPlayerVTO = Type.Object({
  key: Type.String(),
  token: Type.Optional(Type.String()),
  username: Type.String(),
  score: Type.Integer(),
  nft: Type.Array(Type.Optional(Type.String())),
  creationIndex: Type.Integer(),
  color: Type.Enum(Color),
  palette: Palette,
})

export type DbPlayerVTO = Static<typeof DbPlayerVTO>

export const DbDrawVTO = Type.Object({
  ends: Type.Integer(),
  player: Type.String(),
  timestamp: Type.Number(),
  x: Type.Number(),
  y: Type.Number(),
  color: Type.Enum(Color),
})

export type DbDrawVTO = Static<typeof DbDrawVTO>

export const AuthorizationHeader = Type.Object({
  Authorization: Type.String(),
})
export type AuthorizationHeader = Static<typeof AuthorizationHeader>

export const GetByStringKeyParams = Type.Object({
  key: Type.String(),
})
export type GetByStringKeyParams = Static<typeof GetByStringKeyParams>

export const JwtVerifyPayload = Type.Object({
  id: Type.String(),
  iat: Type.Number(),
})
export type JwtVerifyPayload = Static<typeof JwtVerifyPayload>

export const DbInteractionVTO = Type.Object({
  from: Type.String(),
  to: Type.String(),
  quantity: Type.Number(),
  color: Type.Enum(Color),
  timestamp: Type.Number(),
  ends: Type.Number(),
})
export type DbInteractionVTO = Static<typeof DbInteractionVTO>

export const ProtectedPlayerVTO = Type.Omit(PlayerVTO, ['token'])
export type ProtectedPlayerVTO = Static<typeof ProtectedPlayerVTO>

export const ExtendedPlayerVTO = Type.Object({
  player: ProtectedPlayerVTO,
  lastInteractionIn: Nullable(DbInteractionVTO),
  lastInteractionOut: Nullable(DbInteractionVTO),
})

export type ExtendedPlayerVTO = Static<typeof ExtendedPlayerVTO>

export const PixelVTO = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  c: Type.Enum(Color),
  o: Type.String(),
})

export const CanvasVTO = Type.Object({
  pixels: Type.Array(Type.Array(PixelVTO)),
})
export type CanvasVTO = Static<typeof CanvasVTO>

// export const DbCanvasVTO = Type.Object({
//   pixels: Type.Array(Type.Array(PixelVTO)),
// })
// export type DbCanvasVTO = Static<typeof DbCanvasVTO>

// {
//   name: 0,
//   0: PixelVTO
//   1: PixelVTO
//   2: PixelVTO
//   3: PixelVTO
//   ...
//   49: PixelVTO
// }
export const DbSectorVTO = Type.Object(
  new Array(50).fill(null).reduce(
    (acc, val, index) => ({
      ...acc,
      [index]: Type.Array(PixelVTO),
    }),
    { name: Type.Number() }
  )
)
export type DbSectorVTO = Static<typeof DbSectorVTO>

export const MintParams = Type.Object({
  address: Type.String(),
})
export type MintParams = Static<typeof MintParams>

export const MintOutput = Type.Object({
  envelopedSignature: Type.Object({
    message: Type.String(),
    messageHash: Type.Optional(Type.String()),
    signature: Type.String(),
  }),
  data: Type.Object({
    address: Type.String(),
    index: Type.Number(),
    rank: Type.Number(),
    score: Type.Number(),
    total: Type.Number(),
  }),
})
export type MintOutput = Static<typeof MintOutput>

export const EggMetadata = Type.Object({
  // TODO: verify that it does not break anything with OpenSea
  token_id: Type.Number(),
  name: Type.String(),
  description: Type.String(),
  image_data: Type.String(),
  external_url: Type.String(),
  attributes: Type.Array(
    Type.Object({
      trait_type: Type.String(),
      value: Type.Union([Type.String(), Type.Number()]),
    })
  ),
})

export type EggMetadata = Static<typeof EggMetadata>

export const GetByNumericKeyParams = Type.Object({
  key: Type.Number(),
})
export type GetByNumericKeyParams = Static<typeof GetByNumericKeyParams>

// Interactions

export const InteractionParams = Type.Object({
  to: Type.String(),
})
export type InteractionParams = Static<typeof InteractionParams>

export const InteractionResult = Type.Object({
  quantity: Type.Number(),
  ends: Type.Number(),
  from: Type.String(),
  to: Type.String(),
  timestamp: Type.Number(),
  color: Type.Enum(Color),
})
export type InteractionResult = Static<typeof InteractionParams>

// Leaderboard

export const PlayerLeaderboardInfo = Type.Object({
  username: Type.String(),
  score: Type.Integer(),
  position: Type.Integer(),
  creationIndex: Type.Integer(),
})
export type PlayerLeaderboardInfo = Static<typeof PlayerLeaderboardInfo>

export const LeaderboardParams = Type.Object({
  limit: Type.Optional(Type.Integer()),
  offset: Type.Optional(Type.Integer()),
  filter: Type.Optional(Type.String()),
})
export type LeaderboardParams = Static<typeof LeaderboardParams>

export const LeaderboardResponse = Type.Object({
  players: Type.Object({
    players: Type.Array(PlayerLeaderboardInfo),
    total: Type.Integer(),
  }),
})
export type LeaderboardResponse = Static<typeof LeaderboardResponse>

// Interactions history

export const InteractionHistoryParams = Type.Object({
  limit: Type.Optional(Type.Integer()),
  offset: Type.Optional(Type.Integer()),
})

export type InteractionHistoryParams = Static<typeof InteractionHistoryParams>

export const DrawParams = Type.Object({
  x: Type.Integer(),
  y: Type.Integer(),
  color: Type.Enum(Color),
})

export type DrawParams = Static<typeof DrawParams>

export const DrawResult = Type.Object({
  x: Type.Integer(),
  y: Type.Integer(),
  color: Type.Enum(Color),
  ends: Type.Number(),
  player: Type.String(),
  timestamp: Type.Number(),
})

export type DrawResult = Static<typeof DrawResult>

export const InteractionHistoryResponse = Type.Object({
  interactions: Type.Object({
    interactions: Type.Array(DbInteractionVTO),
    total: Type.Integer(),
  }),
})

export type InteractionHistoryResponse = Static<
  typeof InteractionHistoryResponse
>

export type Palette = { [key in Color]: number }
