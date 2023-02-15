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

  public async getLastByPlayer(search: {
    player: string
  }): Promise<Draw | null> {
    const vto = await this.repository.getLast(search)
    return vto ? new Draw(vto) : null
  }

  public async getLastByCoord(search: {
    x: number
    y: number
  }): Promise<Draw | null> {
    const vto = await this.repository.getLast(search)
    return vto ? new Draw(vto) : null
  }

  public async getLastDraws(
    limit: number
  ): Promise<{ draws: Array<Draw>; total: number }> {
    const vtos = await this.repository.getSortedBy(
      {},
      { _id: -1 },
      { limit, offset: 0 }
    )
    const totalDraws = await this.repository.count({})
    return {
      draws: vtos.map(vto => new Draw(vto)),
      total: totalDraws,
    }
  }

  public async countAll(): Promise<number> {
    return await this.repository.countAll()
  }

  public async getManyByUsername(
    username: string,
    paginationParams: { limit: number; offset: number }
  ): Promise<Array<DbDrawVTO>> {
    return await this.repository.getSortedBy(
      {
        $or: [{ owner: username }, { stolenTo: username }],
      },
      { timestamp: 'desc' },
      paginationParams
    )
  }

  public async count(username: string): Promise<number> {
    return this.repository.count({
      $or: [{ owner: username }, { stolenTo: username }],
    })
  }
}
