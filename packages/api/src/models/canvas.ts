import { Collection, Db } from 'mongodb'

import { Repository } from '../repository'
import { DbSectorVTO, DbPixelVTO, PixelLocation } from '../types'

export class CanvasModel {
  private collection: Collection<DbSectorVTO>
  private repository: Repository<DbSectorVTO>

  constructor(db: Db) {
    this.collection = db.collection('canvasSectors')
    this.repository = new Repository(this.collection, 'name')
  }

  public async create(
    sectors: Array<DbSectorVTO>
  ): Promise<Array<DbSectorVTO>> {
    return Promise.all(sectors.map(sector => this.repository.create(sector)))
  }

  public async draw(location: PixelLocation, pixel: DbPixelVTO) {
    return this.repository.updateOne(
      { name: location.sector },
      { [`${location.x}.${location.y}`]: pixel }
    )
  }

  public async get(): Promise<Array<DbSectorVTO>> {
    return this.repository.get({})
  }
}
