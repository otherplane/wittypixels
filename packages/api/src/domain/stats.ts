import { PlayersTree } from '../services/playersTree'
import { StatsVTO } from '../types'
import { Player } from './player'
import { CANVAS_MAX_X } from '../constants'
import { CANVAS_MAX_Y } from '../constants'

export class Stats {
  merkleTree?: PlayersTree
  initialized?: boolean

  totalPixels?: number
  canvasPixels?: number
  totalPlayers?: number
  totalScans?: number
  players?: Array<Pick<Player, 'creationIndex' | 'score'>>

  update({
    players,
    totalPixels,
    totalScans,
    canvasPixels,
  }: {
    players: Array<Pick<Player, 'creationIndex' | 'score'>>
    totalPixels: number
    totalScans: number
    canvasPixels: number
  }) {
    this.merkleTree = new PlayersTree()
    this.merkleTree.initialize(players)
    this.totalPlayers = players.length
    this.totalScans = totalScans
    this.totalPixels = totalPixels
    this.canvasPixels = canvasPixels
    this.players = players
  }

  hasChanged({
    players,
    totalPixels,
    totalScans,
    canvasPixels,
  }: {
    players: Array<Player>
    totalPixels: number
    totalScans: number
    canvasPixels: number
  }): boolean {
    return (
      this.totalPlayers !== players.length ||
      this.totalPixels !== totalPixels ||
      this.totalScans !== totalScans ||
      this.canvasPixels !== canvasPixels
    )
  }

  toJson(): StatsVTO {
    return {
      canvasRoot: this.merkleTree?.getRoot().slice(2),
      canvasHeight: CANVAS_MAX_Y,
      canvasWidth: CANVAS_MAX_X,
      // amount of drawn pixels in the current canvas
      canvasPixels: this.canvasPixels,
      totalPixels: this.totalPixels,
      totalPlayers: this.totalPlayers,
      totalScans: this.totalScans,
    } as StatsVTO
  }

  isInitialized() {
    return this.initialized
  }
}
