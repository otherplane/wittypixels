import crypto from 'crypto'
import { Collection, Db } from 'mongodb'
import { generateUsernameList, getColorFromIndex } from '../utils'
import {
  PLAYER_KEY_LENGTH_BYTES,
  PLAYER_KEY_SALT,
  INTERACTION_POINTS,
  INTERACTION_POINTS_DIVISOR,
  INTERACTION_POINTS_MIN,
  SELF_INTERACTION_POINTS,
} from '../constants'
import { DbPlayerVTO, DbInteractionVTO } from '../types'
import { Repository } from '../repository'
import { Player } from '../domain/player'

export class PlayerModel {
  private collection: Collection<DbPlayerVTO>
  private repository: Repository<DbPlayerVTO>

  constructor(db: Db) {
    this.collection = db.collection('players')
    this.repository = new Repository(this.collection, 'username')
  }

  public createPlayer(
    index: number,
    getUsername: (_index: number) => string
  ): Player {
    // Generate the player data.
    // First we derive a deterministic 32-bytes sequence of bytes from a fixed salt plus the player nonce.
    const seed = crypto
      .createHash('sha256')
      .update(`${PLAYER_KEY_SALT}|${index}`)
      .digest()
    // We will be using the hexadecimal representation of the first `PLAYER_ID_LENGTH_BYTES` of the seed as the player key.
    const key: string = seed.slice(0, PLAYER_KEY_LENGTH_BYTES).toString('hex')
    // FIXME: avoid repeated usernames
    // The rest of the bytes of the seed will be used for seeding the unique names generator.
    const username: string = getUsername(index)
    const nft: Array<string> = []
    const score = 0
    const color = getColorFromIndex(index)

    return new Player({
      key,
      username,
      nft,
      score,
      creationIndex: index,
      color,
    })
  }

  /**
   * Generate as many players as specified in the `count` argument.
   * @param count How many players to generate
   * @param force If provided and set to `true`, circumvent the double bootstrapping protection.
   */
  public async bootstrap(
    count: number,
    force = false
  ): Promise<Array<Player> | null> {
    // Generate list of unique usernames to avoid name collisions
    const usernamesList = generateUsernameList(count)
    const getUsername = (index: number) => usernamesList[index]
    const vtos = await this.repository.bootstrap(
      (_: null, index: number) =>
        this.createPlayer(index, getUsername).toDbVTO(),
      count,
      force
    )

    return vtos?.map(vto => new Player(vto)) || null
  }

  public async create(player: DbPlayerVTO): Promise<Player> {
    const { username } = player
    const bufficornExists = await this.repository.getOne({ username })

    if (bufficornExists) {
      throw new Error(`Player with name ${username} already exists`)
    }

    return new Player(await this.repository.create(player))
  }

  public async update(player: DbPlayerVTO): Promise<Player> {
    const { username } = player

    return new Player(await this.repository.updateOne({ username }, player))
  }

  public async get(key: string): Promise<Player | null> {
    const vto = await this.repository.getOne({ key })

    return vto ? new Player(vto) : null
  }

  public async addPoints(key: string, points: number): Promise<Player | null> {
    await this.collection.updateOne({ key }, { $inc: { score: points } })

    return await this.get(key)
  }

  public computePoints(
    lastInteraction: DbInteractionVTO | null,
    selfInteraction: boolean
  ) {
    // Compute points
    if (selfInteraction) {
      return SELF_INTERACTION_POINTS
    }

    let points
    if (!lastInteraction) {
      points = INTERACTION_POINTS
    } else {
      points = Math.max(
        Math.ceil(lastInteraction.points / INTERACTION_POINTS_DIVISOR),
        INTERACTION_POINTS_MIN
      )
    }
    return points
  }

  public async getOne(id: string): Promise<Player | null> {
    const vto = await this.repository.getById(id)

    return vto ? new Player(vto) : null
  }

  public async getMany(paginationParams: {
    limit: number
    offset: number
  }): Promise<Array<Player>> {
    // TODO: Remove mongoDB $exists from model
    const vtos = await this.repository.getSortedBy(
      {
        token: { $exists: true, $ne: undefined },
      },
      {
        testnetPoints: -1,
      },
      paginationParams
    )

    return vtos.map(vto => new Player(vto))
  }

  public async countActive() {
    return this.repository.count({ token: { $exists: true, $ne: undefined } })
  }
}
