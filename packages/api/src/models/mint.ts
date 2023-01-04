import { Collection, Db, WithId } from 'mongodb'

import { MintOutput } from '../types'
import { Repository } from '../repository'

export class MintModel {
  private collection: Collection<MintOutput>
  private repository: Repository<MintOutput>

  constructor(db: Db) {
    this.collection = db.collection('mints')
    // FIXME: allow nested objects: data.index
    this.repository = new Repository(this.collection, 'data')
  }

  public async create(mintOutput: MintOutput): Promise<MintOutput> {
    return await this.repository.create(mintOutput)
  }

  public async get(index: number): Promise<WithId<MintOutput> | null> {
    return await this.repository.getOne({
      'data.index': index,
    })
  }
}
