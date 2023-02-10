import { createCanvas } from 'canvas'
import {
  CANVAS_MAX_X,
  CANVAS_MAX_Y,
  CANVAS_SECTOR_SIZE,
  INTERACTION_DURATION_MILLIS,
} from '../constants'
import {
  Color,
  CanvasVTO,
  DbDrawVTO,
  DbSectorVTO,
  DbPixelVTO,
  PixelInfo,
} from '../types'
import { Draw } from './draw'

const colorToRGB: Record<number, [number, number, number, 255]> = {
  // white,
  0: [255, 255, 255, 255],
  // black,
  1: [0, 0, 0, 255],
  // orange,
  2: [255, 87, 48, 255],
  // yellow
  3: [245, 234, 10, 255],
  // green,
  4: [86, 197, 83, 255],
  // blue,
  5: [92, 150, 255, 255],
  // red,
  6: [234, 3, 58, 255],
  // purple,
  7: [141, 82, 255, 255],
  // light grey
  // 8: [138, 138, 138, 255]
}

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

  toBase64(): string {
    const width = this.pixels.length
    const height = this.pixels[0].length

    const buffer = new Uint8ClampedArray(
      this.pixels.length * this.pixels[0].length * 4
    )

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pos = (y * width + x) * 4 // position in buffer based on x and y
        const pixel = this.pixels[x][y]
        const color = colorToRGB[pixel.c]
        buffer[pos] = color[0] // some R value [0, 255]
        buffer[pos + 1] = color[1] // some G value
        buffer[pos + 2] = color[2] // some B value
        buffer[pos + 3] = color[3] // set alpha channel
      }
    }

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    // create imageData object
    const idata = ctx.createImageData(width, height)
    // set our buffer as source
    idata.data.set(buffer)
    // update canvas with new data
    ctx.putImageData(idata, 0, 0)
    const dataUri = canvas.toDataURL()

    return dataUri
  }

  getPixel(x: number, y: number): PixelInfo {
    const pixel = this.pixels[x][y]

    return {
      x,
      y,
      owner: pixel.o,
      color: pixel.c,
      timestamp: pixel.t,
    }
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
