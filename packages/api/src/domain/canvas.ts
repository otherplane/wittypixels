import {
  CANVAS_MAX_X,
  CANVAS_MAX_Y,
  INTERACTION_DURATION_MILLIS,
} from '../constants'
import {
  // DbPlayerVTO,
  // ExtendedPlayerVTO,
  // PlayerLeaderboardInfo,
  Color,
  // Palette,
  CanvasVTO,
  DbDrawVTO,
} from '../types'
import { Draw } from './draw'

export class Canvas {
  pixels: Array<
    Array<{
      x: number
      y: number
      c: number
      o: string
    }>
  >

  constructor(vto?: CanvasVTO) {
    if (vto) {
      this.pixels = vto.pixels
    } else {
      this.pixels = new Array(CANVAS_MAX_X).fill(null).map((_row, xCoord) => {
        return new Array(CANVAS_MAX_Y).fill(null).map((_col, yCoord) => {
          return {
            x: xCoord,
            y: yCoord,
            c: Color.White,
            // TODO: Allow null
            o: '',
          }
        })
      })
    }
  }

  draw(draw: DbDrawVTO): Draw {
    const now = Date.now()

    const { x, y, player, color } = draw

    this.pixels[x][y] = {
      ...this.pixels[x][y],
      c: color,
      o: player,
    }

    return new Draw({
      color: draw.color,
      ends: now + INTERACTION_DURATION_MILLIS,
      x,
      y,
      player,
      timestamp: now,
    })
  }

  toDbVTO(): CanvasVTO {
    return {
      pixels: this.pixels,
    }
  }
}
