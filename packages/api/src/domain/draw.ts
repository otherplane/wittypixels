import { DbDrawVTO } from '../types'

export class Draw {
  ends: number
  player: string
  timestamp: number
  x: number
  y: number
  color: number

  constructor(vto: DbDrawVTO) {
    this.ends = vto.ends
    this.player = vto.player
    this.timestamp = vto.timestamp
    this.x = vto.x
    this.y = vto.y
    this.color = vto.color
  }

  toDbVTO(): DbDrawVTO {
    return {
      ends: this.ends,
      player: this.player,
      timestamp: this.timestamp,
      x: this.x,
      y: this.y,
      color: this.color,
    }
  }
}
