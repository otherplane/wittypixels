import { Collection, Db, WithId } from 'mongodb'

import { SignRedemptionOutput } from '../types'
import { Repository } from '../repository'

export class SignRedemptionModel {
  private collection: Collection<SignRedemptionOutput>
  private repository: Repository<SignRedemptionOutput>

  constructor(db: Db) {
    this.collection = db.collection('signRedemptions')
    // FIXME: allow nested objects: data.index
    this.repository = new Repository(this.collection, 'deeds')
  }

  public async create(
    mintOutput: SignRedemptionOutput
  ): Promise<SignRedemptionOutput> {
    return await this.repository.create(mintOutput)
  }

  public async get(
    index: number
  ): Promise<WithId<SignRedemptionOutput> | null> {
    return await this.repository.getOne({
      'data.index': index,
    })
  }
}
