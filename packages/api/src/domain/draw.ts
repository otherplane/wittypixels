import { CANVAS_SECTOR_SIZE } from '../constants'
import { DbDrawVTO, PixelLocation } from '../types'

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

  toDbSectorInfo(): PixelLocation {
    const x = this.x % 50
    const y = this.y % 50

    const sectorX = Math.floor(x / CANVAS_SECTOR_SIZE)
    const sectorY = Math.floor(y / CANVAS_SECTOR_SIZE)

    const name = `${sectorX}-${sectorY}`

    return {
      x,
      y,
      sector: name,
    }
  }
}
