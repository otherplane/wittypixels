import { Static, Type, TSchema } from '@sinclair/typebox'
import { CANVAS_SECTOR_SIZE } from './constants'
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
  // metaland
  Red = 0,
  // camp build
  Orange = 1,
  // dao town
  Yellow = 2,
  // devtopia
  Green = 3,
  // regenlandia
  Blue = 4,
  // defi district
  Purple = 5,
}

export enum Shade {
  Shade0 = 0,
  Shade1 = 1,
  Shade2 = 2,
  Shade3 = 3,
  Shade4 = 4,
  Shade5 = 5,
  Shade6 = 6,
}

export const PlayerVTO = Type.Object({
  key: Type.String(),
  token: Type.Optional(Type.String()),
  username: Type.String(),
  name: Type.String(),
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
  name: Type.String(),
  score: Type.Integer(),
  nft: Type.Array(Type.Optional(Type.String())),
  creationIndex: Type.Integer(),
  color: Type.Enum(Color),
  palette: Palette,
})

export type DbPlayerVTO = Static<typeof DbPlayerVTO>

export const DbDrawVTO = Type.Object({
  ends: Type.Integer(),
  owner: Type.String(),
  timestamp: Type.Number(),
  x: Type.Number(),
  y: Type.Number(),
  color: Nullable(Type.Enum(Color)),
  stolenTo: Type.String(),
  shade: Type.Enum(Shade),
})

export type DbDrawVTO = Static<typeof DbDrawVTO>

export const DrawVTO = Type.Object({
  // ends
  // e: Type.Integer(),
  // owner
  o: Type.String(),
  // timestamp
  t: Type.Number(),
  // coord x
  x: Type.Number(),
  // coord y
  y: Type.Number(),
  // color
  c: Nullable(Type.Enum(Color)),
  // stolenTo
  st: Type.String(),
  // shade
  s: Type.Enum(Shade),
})
export type DrawVTO = Static<typeof DrawVTO>

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

export const DbPixelVTO = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  c: Nullable(Type.Enum(Color)),
  s: Type.Enum(Shade),
  o: Type.String(),
  t: Type.Number(),
})
export type DbPixelVTO = Static<typeof DbPixelVTO>

export const PixelLocation = Type.Object({
  sector: Type.String(),
  x: Type.Number(),
  y: Type.Number(),
})
export type PixelLocation = Static<typeof PixelLocation>

export const CanvasVTO = Type.Object({
  pixels: Type.Array(Type.Array(DbPixelVTO)),
})
export type CanvasVTO = Static<typeof CanvasVTO>

export const GetCanvasResponse = Type.Object({
  canvas: Type.String(),
  checkpoint: Type.Number(),
})
export type GetCanvasResponse = Static<typeof GetCanvasResponse>

// If SECTOR_SIZE === 50
// {
//   name: number,
//   0: Array<PixelVTO>
//   1: Array<PixelVTO>
//   2: Array<PixelVTO>
//   3: Array<PixelVTO>
//   ...
//   49: Array<PixelVTO>
// }
export const DbSectorVTO = Type.Object(
  new Array(CANVAS_SECTOR_SIZE).fill(null).reduce(
    (acc, val, index) => ({
      ...acc,
      [index]: Type.Array(DbPixelVTO),
    }),
    { name: Type.Number() }
  )
)
export type DbSectorVTO = Static<typeof DbSectorVTO>

// export const DbCanvasVTO = Type.Array( DbSectorVTO)
// export type DbCanvasVTO = Static<typeof DbCanvasVTO>

export const SignRedemptionParams = Type.Object({
  address: Type.String(),
})
export type SignRedemptionParams = Static<typeof SignRedemptionParams>

export const SignRedemptionOutput = Type.Object({
  deeds: Type.String(),
})
export type SignRedemptionOutput = Static<typeof SignRedemptionOutput>

export const CanvasMetadata = Type.String()
export type CanvasMetadata = Static<typeof CanvasMetadata>

export const MetadataParams = Type.Object({
  token: Type.Integer(),
})
export type MetadataParams = Static<typeof MetadataParams>

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
  color: Type.Integer(),
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

export type ColorShade = Record<number, [number, number, number]>
export type ColorMap = Record<number, ColorShade>

export type InteractionHistoryParams = Static<typeof InteractionHistoryParams>

export const DrawParams = Type.Object({
  x: Type.Integer(),
  y: Type.Integer(),
  color: Type.Enum(Color),
  shade: Type.Enum(Shade),
})

export type DrawParams = Static<typeof DrawParams>

export const DrawResult = Type.Object({
  canvas: Type.String(),
  checkpoint: Type.Number(),
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

export const GetCanvasParams = Type.Object({
  checkpoint: Type.Number(),
})
export type GetCanvasParams = Static<typeof GetCanvasParams>

export const Stats = Type.Object({
  totalPixels: Type.Number(),
  totalPlayers: Type.Number(),
  totalScans: Type.Number(),
  authorshipsRoot: Type.String(),
  canvasDigest: Type.String(),
  canvasHeight: Type.Number(),
  canvasWidth: Type.Number(),
})
export type Stats = Static<typeof Stats>

export const GetStatsParams = Type.Object({
  token_id: Type.String(),
})
export type GetStatsParams = Static<typeof GetStatsParams>

export const StatsVTO = Type.Object({
  authorshipsRoot: Type.String(),
  totalPixels: Type.Number(),
  totalPlayers: Type.Number(),
  totalScans: Type.Number(),
  canvasDigest: Type.String(),
  canvasHeight: Type.Number(),
  canvasWidth: Type.Number(),
})
export type StatsVTO = Static<typeof StatsVTO>
export const GetPixelInfo = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
})
export type GetPixelInfo = Static<typeof GetPixelInfo>

export const PixelInfo = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  color: Nullable(Type.Enum(Color)),
  shade: Type.Enum(Shade),
  timestamp: Type.Number(),
  owner: Type.String(),
})
export type PixelInfo = Static<typeof PixelInfo>

export const GetImageParams = Type.Object({
  token_id: Type.String(),
})
export type GetImageParams = Static<typeof GetImageParams>

export const GetImageResponse = Type.Any()
export type GetImageResponse = Static<typeof GetImageResponse>

export const GetImageQueryParams = Type.Object({
  digest: Type.Optional(Type.String()),
})
export type GetImageQueryParams = Static<typeof GetImageQueryParams>
// Interactions history
export const DrawHistoryQueryParams = Type.Object({
  limit: Type.Optional(Type.Integer()),
  offset: Type.Optional(Type.Integer()),
})
export type DrawHistoryQueryParams = Static<typeof DrawHistoryQueryParams>

export const DrawHistoryResponse = Type.Object({
  draws: Type.Object({
    draws: Type.Array(DbDrawVTO),
    total: Type.Integer(),
  }),
})
export type DrawHistoryResponse = Static<typeof DrawHistoryResponse>

export const UpdateNameParams = Type.Object({
  key: Type.String(),
})
export type UpdateNameParams = Static<typeof UpdateNameParams>

export const UpdateNameBody = Type.Object({
  name: Type.String(),
})
export type UpdateNameBody = Static<typeof UpdateNameBody>
