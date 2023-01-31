import { Collection, Db } from 'mongodb'
import { Interaction } from '../domain/interaction'

import { Repository } from '../repository'
import { DbInteractionVTO } from '../types'

export class InteractionModel {
  private collection: Collection<DbInteractionVTO>
  private repository: Repository<DbInteractionVTO>

  constructor(db: Db) {
    this.collection = db.collection('interactions')
    this.repository = new Repository(this.collection, 'timestamp')
  }

  public async create(vto: DbInteractionVTO): Promise<Interaction> {
    return new Interaction(await this.repository.create(vto))
  }

  public async getLast(search: {
    from?: string
    to?: string
  }): Promise<Interaction | null> {
    const vto = await this.repository.getLast(search)
    return vto ? new Interaction(vto) : null
  }

  public async getManyByUsername(
    username: string,
    paginationParams: { limit: number; offset: number }
  ): Promise<Array<DbInteractionVTO>> {
    return await this.repository.getSortedBy(
      {
        $or: [{ from: username }, { to: username }],
      },
      { timestamp: 'desc' },
      paginationParams
    )
  }

  public async count(username: string): Promise<number> {
    return this.repository.count({
      $or: [{ from: username }, { to: username }],
    })
  }

  public async countAll(): Promise<number> {
    return this.repository.count({})
  }
}
