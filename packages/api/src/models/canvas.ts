// import { Collection, Db } from 'mongodb'
import { Db } from 'mongodb'
// import { CANVAS_MAX_X, CANVAS_SECTOR_SIZE } from '../constants'
// import { Canvas } from '../domain/canvas'

// import { Repository } from '../repository'
// import { Color, DbDrawVTO, DbSectorVTO } from '../types'

export class CanvasModel {
  //   private collection: Collection<DbSectorVTO>
  //   private repository: Repository<DbSectorVTO>
  constructor(_db: Db) {
    // this.collection = db.collection('canvasSectors')
    // this.repository = new Repository(this.collection, 'name')
  }
  //   public async create(): Promise<Array<DbSectorVTO>> {
  //     const sectorSize = 50
  //     const MAX_X = 600
  //     const MAX_Y = 700
  //     const sectorsPerRow = getSectorsPerRow(MAX_X, sectorSize)
  //     const sectorsPerColumn = getSectorsPerRow(MAX_Y, sectorSize)
  //     const totalSectors = sectorsPerRow * sectorsPerColumn
  //     const sectors = new Array(totalSectors).fill(null).map((_, sectorIndex) => {
  //       return new Array(sectorSize).fill(null).reduce(
  //         (acc, item, rowIndex) => {
  //           const x = sectorsPerRow % sectorIndex
  //           return {
  //             ...acc,
  //             [rowIndex]: new Array(sectorSize).fill(null).map((_, colIndex) => {
  //               const y = sectorsPerColumn % colIndex
  //               return {
  //                 color: Color.White,
  //                 owner: '',
  //                 x,
  //                 y,
  //               } as Pixel
  //             }),
  //           }
  //         },
  //         {
  //           name: sectorIndex,
  //         }
  //       )
  //     })
  //     return Promise.all(
  //       sectors.map(async sector => await this.repository.create(sector))
  //     )
  //   }
  //   public async draw(vto: DbDrawVTO): Promise<boolean> {
  //     const { x, y, color, ends, player, timestamp } = vto
  //     const sectorPerRow = Math.ceil(CANVAS_MAX_X / CANVAS_SECTOR_SIZE)
  //     const sector = getSector(x, y, sectorPerRow)
  //     // const sectorPerColumn = Math.ceil(CANVAS_MAX_Y / CANVAS_SECTOR_SIZE)
  //     // const getSectorCoord = (coordinate: number) =>
  //     //   coordinate >= CANVAS_SECTOR_SIZE
  //     //     ? coordinate % CANVAS_SECTOR_SIZE
  //     //     : coordinate
  //     // const sectorX = getSectorCoord(x)
  //     // const sectorY = getSectorCoord(y)
  //     // if (x < CANVAS_SECTOR_SIZE) { }
  //     return true
  //   }
}

// type Pixel = {
//   x: number
//   y: number
//   owner: string
//   color: number
// }

// type Sector = {
//   index: number
//   0: Pixel
//   1: Pixel
//   2: Pixel
//   3: Pixel
// }

// export function getSector(x: number, y: number, sectorPerRow: number): number {
//   return 0
// }

// export function getSectorsPerRow(maxX: number, sectorSize: number) {
//   return Math.ceil(maxX / sectorSize)
// }
