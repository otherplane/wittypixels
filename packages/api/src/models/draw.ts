import { Collection, Db } from 'mongodb'
import { Draw } from '../domain/draw'

import { Repository } from '../repository'
import { DbDrawVTO } from '../types'

export class DrawModel {
  private collection: Collection<DbDrawVTO>
  private repository: Repository<DbDrawVTO>

  constructor(db: Db) {
    this.collection = db.collection('draw')
    this.repository = new Repository(this.collection, 'timestamp')
  }

  public async create(vto: DbDrawVTO): Promise<Draw> {
    return new Draw(await this.repository.create(vto))
  }

  public async getLast(search: {
    from?: string
    to?: string
  }): Promise<Draw | null> {
    const vto = await this.repository.getLast(search)
    return vto ? new Draw(vto) : null
  }
}
