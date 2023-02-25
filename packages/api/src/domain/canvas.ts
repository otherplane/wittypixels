import { createCanvas } from 'canvas'
import {
  CANVAS_MAX_X,
  CANVAS_MAX_Y,
  CANVAS_SECTOR_SIZE,
  INTERACTION_DURATION_MILLIS,
  DEFAULT_RGB,
} from '../constants'
import {
  CanvasVTO,
  DbDrawVTO,
  DbSectorVTO,
  DbPixelVTO,
  PixelInfo,
  Shade,
  ColorMap,
  ColorShade,
} from '../types'
import { sha256 } from '../utils'
import { Draw } from './draw'

export const RED_SHADES: ColorShade = {
  0: [255, 219, 227],
  1: [254, 147, 172],
  2: [253, 75, 117],
  3: [234, 3, 58],
  4: [180, 2, 45],
  5: [108, 1, 27],
  6: [36, 0, 9],
}
export const ORANGE_SHADES: ColorShade = {
  0: [255, 225, 219],
  1: [255, 166, 146],
  2: [255, 107, 73],
  3: [255, 87, 48],
  4: [182, 34, 0],
  5: [109, 21, 0],
  6: [36, 7, 0],
}
export const YELLOW_SHADES: ColorShade = {
  0: [254, 252, 220],
  1: [251, 246, 150],
  2: [248, 240, 80],
  3: [245, 234, 10],
  4: [175, 167, 7],
  5: [105, 100, 4],
  6: [35, 33, 1],
}
export const GREEN_SHADES: ColorShade = {
  0: [228, 246, 228],
  1: [175, 227, 173],
  2: [121, 209, 119],
  3: [86, 197, 83],
  4: [48, 136, 46],
  5: [29, 82, 28],
  6: [10, 27, 9],
}
export const BLUE_SHADES: ColorShade = {
  0: [219, 232, 255],
  1: [146, 185, 255],
  2: [73, 138, 255],
  3: [92, 150, 255],
  4: [0, 65, 182],
  5: [0, 39, 109],
  6: [0, 13, 36],
}
export const PURPLE_SHADES: ColorShade = {
  0: [231, 219, 255],
  1: [183, 146, 255],
  2: [135, 73, 255],
  3: [141, 82, 255],
  4: [62, 0, 182],
  5: [37, 0, 109],
  6: [12, 0, 36],
}

const colorToRGB: ColorMap = {
  0: RED_SHADES,
  1: ORANGE_SHADES,
  2: YELLOW_SHADES,
  3: GREEN_SHADES,
  4: BLUE_SHADES,
  5: PURPLE_SHADES,
}

type Pixel = {
  // we are using only the first letter to reduce the response size
  // shade
  s: number
  // color
  c: number | null
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
            c: null,
            o: '',
            t: 0,
            s: Shade.Shade3,
          }
        })
      })
    }
  }

  private fromDbSectorVTOs(sectors: Array<DbSectorVTO>): Array<Array<Pixel>> {
    const pixels: Array<Array<Pixel>> = new Array(CANVAS_MAX_X)
      .fill(null)
      .map(x => {
        return new Array(CANVAS_MAX_Y).fill(null).map(y => ({
          o: '',
          c: null,
          x,
          y,
          t: 0,
          s: Shade.Shade3,
        }))
      })

    sectors.forEach((sector: DbSectorVTO) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name, _id, ...rowMap } = sector
      const rows: Array<Omit<DbSectorVTO, 'name'>> = Object.values(rowMap)
      rows.forEach(row => {
        row.forEach((pixel: DbPixelVTO) => {
          const currentPixel = pixels[pixel.x][pixel.y]
          pixels[pixel.x][pixel.y] = {
            ...pixel,
            c: Number.isInteger(pixel.c) ? pixel.c : currentPixel.c,
            o: pixel.o || currentPixel.o,
            t: pixel.t || currentPixel.t,
            s: Number.isInteger(pixel.s) ? pixel.s : currentPixel.s,
          }
        })
      })
    })

    return pixels
  }

  draw(draw: Omit<DbDrawVTO, 'ends' | 'timestamp'>): Draw {
    const now = Date.now()

    const { x, y, owner, color, shade } = draw
    const previousOwner = this.pixels[x][y].o

    this.pixels[x][y] = {
      ...this.pixels[x][y],
      t: now,
      c: color,
      s: shade,
      o: owner,
    }

    return new Draw({
      color: draw.color,
      ends: now + INTERACTION_DURATION_MILLIS,
      x,
      y,
      owner,
      shade,
      timestamp: now,
      stolenTo: previousOwner,
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
        sectors[name][x % CANVAS_SECTOR_SIZE][y % CANVAS_SECTOR_SIZE] = pixel
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
        const color =
          pixel.c !== null ? colorToRGB[pixel.c][pixel.s] : DEFAULT_RGB
        buffer[pos] = color[0] // some R value [0, 255]
        buffer[pos + 1] = color[1] // some G value
        buffer[pos + 2] = color[2] // some B value
        buffer[pos + 3] = 255 // set alpha channel
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

  toPng() {
    const b64 = this.toBase64()
    const data = b64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(data, 'base64')

    return buffer
  }

  // calculate SHA-256 of the canvas and returns de value as hex
  toSHA256(): string {
    const imageBytes = this.toPng()

    return sha256(imageBytes)
  }

  getPixel(x: number, y: number): Omit<PixelInfo, 'ownerName'> {
    const pixel = this.pixels[x][y]

    return {
      x,
      y,
      owner: pixel.o,
      color: pixel.c,
      shade: pixel.s,
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

export function convertDataUrlToBlob(dataUrl: string) {
  const arr: Array<string> = dataUrl.split(',')
  // const mime = arr[0]?.match(/:(.*?);/)?.[1]
  const bstr = Buffer.from(arr[1], 'base64').toString('base64')
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  // return new Blob([u8arr], { type: mime })
  return u8arr
}
