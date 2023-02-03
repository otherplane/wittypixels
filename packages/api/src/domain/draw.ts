import { CANVAS_SECTOR_SIZE } from '../constants'
import { DbDrawVTO, PixelLocation } from '../types'

export class Draw {
  ends: number
  owner: string
  timestamp: number
  x: number
  y: number
  color: number

  constructor(vto: DbDrawVTO) {
    this.ends = vto.ends
    this.owner = vto.owner
    this.timestamp = vto.timestamp
    this.x = vto.x
    this.y = vto.y
    this.color = vto.color
  }

  toDbVTO(): DbDrawVTO {
    return {
      ends: this.ends,
      owner: this.owner,
      timestamp: this.timestamp,
      x: this.x,
      y: this.y,
      color: this.color,
    }
  }

  // This method returns DbDrawVTO with the same keys used in the canvas
  toVTO() {
    return {
      o: this.owner,
      t: this.timestamp,
      x: this.x,
      y: this.y,
      c: this.color,
    }
  }

  toDbSectorInfo(): PixelLocation {
    const x = this.x % CANVAS_SECTOR_SIZE
    const y = this.y % CANVAS_SECTOR_SIZE

    const sectorX = Math.floor(this.x / CANVAS_SECTOR_SIZE)
    const sectorY = Math.floor(this.y / CANVAS_SECTOR_SIZE)

    const name = `${sectorX}-${sectorY}`

    return {
      x,
      y,
      sector: name,
    }
  }
}
