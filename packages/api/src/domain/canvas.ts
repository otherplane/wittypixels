import {
  CANVAS_MAX_X,
  CANVAS_MAX_Y,
  CANVAS_SECTOR_SIZE,
  INTERACTION_DURATION_MILLIS,
} from '../constants'
import { Color, CanvasVTO, DbDrawVTO, DbSectorVTO, DbPixelVTO } from '../types'
import { Draw } from './draw'

type Pixel = {
  // we are using only the first letter to reduce the response size
  // color
  c: number
  // owner
  o: string
  // coord x
  x: number
  // coord y
  y: number
  // timestamp
  t: number
}

export class Canvas {
  pixels: Array<Array<Pixel>>

  constructor(vto?: Array<DbSectorVTO>) {
    if (vto) {
      this.pixels = this.fromDbSectorVTOs(vto)
    } else {
      this.pixels = new Array(CANVAS_MAX_X).fill(null).map((_row, xCoord) => {
        return new Array(CANVAS_MAX_Y).fill(null).map((_col, yCoord) => {
          return {
            x: xCoord,
            y: yCoord,
            c: Color.White,
            o: '',
            t: 0,
          }
        })
      })
    }
  }

  private fromDbSectorVTOs(sectors: Array<DbSectorVTO>): Array<Array<Pixel>> {
    const pixels = new Array(CANVAS_MAX_X).fill(null).map(x => {
      return new Array(CANVAS_MAX_Y).fill(null).map(y => ({
        o: '',
        c: Color.White,
        x,
        y,
        t: 0,
      }))
    })

    sectors.forEach((sector: DbSectorVTO) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name, _id, ...rowMap } = sector
      const rows: Array<Omit<DbSectorVTO, 'name'>> = Object.values(rowMap)
      rows.forEach(row => {
        row.forEach((pixel: DbPixelVTO) => {
          if (!pixels[pixel.x]) {
            pixels
          }
          pixels[pixel.x][pixel.y] = pixel
        })
      })
    })

    return pixels
  }

  draw(draw: Omit<DbDrawVTO, 'ends' | 'timestamp'>): Draw {
    const now = Date.now()

    const { x, y, owner, color } = draw

    this.pixels[x][y] = {
      ...this.pixels[x][y],
      t: now,
      c: color,
      o: owner,
    }

    return new Draw({
      color: draw.color,
      ends: now + INTERACTION_DURATION_MILLIS,
      x,
      y,
      owner,
      timestamp: now,
    })
  }

  toVTO(): CanvasVTO {
    return {
      pixels: this.pixels,
    }
  }

  toDbSectors(): Array<DbSectorVTO> {
    const sectorsPerRow = getSectorsPerRow(CANVAS_MAX_X, CANVAS_SECTOR_SIZE)
    const sectorsPerColumn = getSectorsPerRow(CANVAS_MAX_Y, CANVAS_SECTOR_SIZE)

    const totalSectors = sectorsPerRow * sectorsPerColumn
    const sectors: Record<string, DbSectorVTO> = new Array(totalSectors)
      .fill(null)
      .map((_, sectorIndex) => {
        const x = sectorIndex % sectorsPerRow
        const y = Math.floor(sectorIndex / sectorsPerRow)

        return sectorFactory(`${x}-${y}`)
      })
      // convert array to map by name
      .reduce((sectors, sector) => ({ ...sectors, [sector.name]: sector }), {})

    for (let y = 0; y < this.pixels.length; y++) {
      for (let x = 0; x < this.pixels[0].length; x++) {
        const pixel = this.pixels[y][x]
        const sectorX = Math.floor(x / CANVAS_SECTOR_SIZE)
        const sectorY = Math.floor(y / CANVAS_SECTOR_SIZE)
        const name = `${sectorX}-${sectorY}`
        sectors[name][y % CANVAS_SECTOR_SIZE][x % CANVAS_SECTOR_SIZE] = pixel
      }
    }

    return Object.values(sectors)
  }

  // Count all pixels drawn in the canvas
  countPixelsDrawn(): number {
    return this.pixels.reduce(
      (totalPixelsDrawn, row: Array<Pixel>) =>
        totalPixelsDrawn +
        row.reduce(
          (pixelsDrawnInDraw, pixel: Pixel) =>
            pixel.c ? pixelsDrawnInDraw + 1 : pixelsDrawnInDraw,
          0
        ),
      0
    )
  }

  countPixels(username: string): number {
    return this.pixels.reduce(
      (totalPixelsDrawn, row: Array<Pixel>) =>
        totalPixelsDrawn +
        row.reduce(
          (pixelsDrawnInDraw, pixel: Pixel) =>
            pixel.o === username ? pixelsDrawnInDraw + 1 : pixelsDrawnInDraw,
          0
        ),
      0
    )
  }
}

export function getSectorsPerRow(maxX: number, sectorSize: number) {
  return Math.ceil(maxX / sectorSize)
}

function sectorFactory(name: string): DbSectorVTO {
  const sector: Record<string, unknown> = {}

  for (let i = 0; i < CANVAS_SECTOR_SIZE; i++) {
    sector[i] = []
  }
  sector.name = name

  return sector
}
