import crypto from 'crypto'
import { Collection, Db } from 'mongodb'
import { generateUsernameList, getColorFromIndex } from '../utils'
import {
  PLAYER_KEY_LENGTH_BYTES,
  PLAYER_KEY_SALT,
  SELF_INTERACTION_COLOR_QUANTITY,
  INTERACTION_COLOR_QUANTITY,
  INTERACTION_COLOR_QUANTITY_MIN,
  INTERACTION_COLOR_QUANTITY_DIVISOR,
} from '../constants'
import { DbPlayerVTO, DbInteractionVTO, Color } from '../types'
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
      name: username,
      nft,
      score,
      creationIndex: index,
      color,
      palette: Player.getEmptyPalette(),
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
    const playerExists = await this.repository.getOne({ username })

    if (playerExists) {
      throw new Error(`Player with name ${username} already exists`)
    }

    return new Player(await this.repository.create(player))
  }

  public async update(player: DbPlayerVTO): Promise<Player> {
    const { username } = player

    return new Player(await this.repository.updateOne({ username }, player))
  }

  public async updateName(key: string, name: string): Promise<Player> {
    return new Player(await this.repository.updateOne({ key }, { name }))
  }

  public async get(key: string): Promise<Player | null> {
    const vto = await this.repository.getOne({ key })

    return vto ? new Player(vto) : null
  }

  public async addColor(
    key: string,
    color: Color,
    amount: number
  ): Promise<Player | null> {
    await this.collection.updateOne(
      { key },
      { $inc: { [`palette.${color}`]: amount } }
    )

    return await this.get(key)
  }

  public async reduceColor(
    username: string,
    color: Color
  ): Promise<Player | null> {
    await this.collection.updateOne(
      { username },
      { $inc: { [`palette.${color}`]: -1 } }
    )

    return await this.get(username)
  }

  public computeColors(
    lastInteraction: DbInteractionVTO | null,
    selfInteraction: boolean
  ) {
    // Compute points
    if (selfInteraction) {
      return SELF_INTERACTION_COLOR_QUANTITY
    }

    let quantity
    if (!lastInteraction) {
      quantity = INTERACTION_COLOR_QUANTITY
    } else {
      quantity = Math.max(
        Math.ceil(
          lastInteraction.quantity / INTERACTION_COLOR_QUANTITY_DIVISOR
        ),
        INTERACTION_COLOR_QUANTITY_MIN
      )
    }
    return quantity
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

  public async increaseScore(username: string): Promise<Player | null> {
    await this.collection.updateOne({ username }, { $inc: { score: 1 } })

    return await this.get(username)
  }

  public async decreaseScore(username: string): Promise<Player | null> {
    await this.collection.updateOne({ username }, { $inc: { score: -1 } })

    return await this.get(username)
  }

  public async getAll(): Promise<Array<Player>> {
    const players = await this.repository.get({})

    return players.map(p => new Player(p))
  }

  public async getActivePlayers(): Promise<Array<Player>> {
    const players = await this.repository.get({
      token: { $exists: true, $ne: undefined },
    })

    return players.map(p => new Player(p))
  }
}
