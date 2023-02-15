import {
  DbPlayerVTO,
  ExtendedPlayerVTO,
  PlayerLeaderboardInfo,
  Color,
  Palette,
} from '../types'
import { Interaction } from './interaction'

export class Player {
  creationIndex: number
  token?: string | undefined
  lastInteractionIn?: number | undefined
  lastInteractionOut?: number | undefined
  key: string
  color: Color
  username: string
  score: number
  nft: Array<string> = []
  palette: Palette

  constructor(vto: DbPlayerVTO) {
    this.key = vto.key
    this.username = vto.username
    this.score = vto.score
    this.nft = vto.nft
    this.token = vto.token
    this.creationIndex = vto.creationIndex
    this.color = vto.color
    this.palette = vto.palette
  }

  toExtendedPlayerVTO({
    lastInteractionOut,
    lastInteractionIn,
  }: {
    lastInteractionIn?: Interaction | null
    lastInteractionOut: Interaction | null
  }): ExtendedPlayerVTO {
    // Get all Player attributes except token
    const { ...protectedplayerVTO } = this.toDbVTO()
    return {
      player: {
        ...protectedplayerVTO,
      },
      lastInteractionIn: lastInteractionIn?.isActive()
        ? lastInteractionIn.toVTO()
        : null,
      lastInteractionOut: lastInteractionOut?.isActive()
        ? lastInteractionOut.toVTO()
        : null,
    }
  }

  toDbVTO(showToken = false): DbPlayerVTO {
    const vto = {
      lastInteractionIn: this.lastInteractionIn,
      lastInteractionOut: this.lastInteractionOut,
      key: this.key,
      username: this.username,
      score: this.score,
      nft: this.nft,
      token: this.token,
      creationIndex: this.creationIndex,
      color: this.color,
      palette: this.palette,
    }

    return showToken ? { ...vto, token: this.token } : vto
  }

  hasColor(color: Color): boolean {
    return this.palette[color] > 0
  }

  static getLeaderboard(
    players: Array<Player>,
    totalPlayers: number,
    paginationOffset = 0
  ): { players: Array<PlayerLeaderboardInfo>; total: number } {
    return {
      players: players
        .sort(
          (a, b) =>
            // sort by creation index if the players are tied
            b.score - a.score || a.username.localeCompare(b.username)
        )
        .map((p, index) => ({
          username: p.username,
          creationIndex: p.creationIndex,
          score: p.score,
          color: p.color,
          position: paginationOffset + index,
        })),
      total: totalPlayers,
    }
  }

  static getEmptyPalette(): Palette {
    return {
      [Color.Blue]: 5,
      [Color.Green]: 5,
      [Color.Orange]: 5,
      [Color.Purple]: 5,
      [Color.Red]: 5,
      [Color.Yellow]: 5,
    }
  }
}
