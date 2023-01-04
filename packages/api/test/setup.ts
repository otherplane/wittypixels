import { CollectionInfo, Db, MongoClient } from 'mongodb'
import Fastify, { InjectOptions } from 'fastify'
import { app } from '../src/app'
import { FastifyInstance } from 'fastify'

let server: FastifyInstance

let client = new MongoClient(
  process.env.MONGO_URI ||
    'mongodb://your_username:your_password@localhost:27017/database'
)
let db: Db

beforeAll(async () => {
  client = await client.connect()
  db = await client.db(process.env.MONGO_INITDB_DATABASE || 'database')
})

beforeEach(async () => {
  // Drop mongodb collections
  try {
    const collections = await db.listCollections()
    let info: CollectionInfo | null

    while (await collections.hasNext()) {
      info = await collections.next()
      if (info) {
        await db.dropCollection(info.name)
      }
    }
  } catch (err) {
    console.error('Error dropping mongo', err)
  }

  server = Fastify().register(app)
})

afterAll(async () => {
  await client.close()
})

afterEach(async () => {
  await server.close()
})

async function authenticatePlayer(key: string): Promise<string> {
  return await new Promise(resolve => {
    server.inject(
      {
        method: 'POST',
        url: '/auth',
        payload: { key },
      },
      (err, response) => {
        if (response.json().error) {
          throw new Error(JSON.stringify(response.json()))
        }

        resolve(response.json().token)
      }
    )
  })
}

async function serverInject(
  opts: InjectOptions,
  cb: (_error, _result) => Promise<void> | void
): Promise<null> {
  return new Promise(resolve => {
    server.inject(opts, async (error, result) => {
      await cb(error, result)

      return resolve(null)
    })
  })
}

async function sleep(ms: number) {
  return new Promise(resolve => {
    return setTimeout(() => {
      return resolve(true)
    }, ms)
  })
}

const initialPlayers = [
  {
    key: 'ef12efbd765f9ad3',
    username: 'planned-platypus',
  },
  {
    key: 'bf70268a8f1e2d67',
    username: 'realistic-jay',
  },
  {
    key: '895aa6083cc2dfaf',
    username: 'mental-giraffe',
  },
  { key: '104d81cea432f871', username: 'acute-guan' },
  { key: 'e9d8e88334820666', username: 'continental-rodent' },
  {
    key: 'b5425e1b1ed66dcb',
    username: 'deliberate-kite',
  },
]

export { server, authenticatePlayer, serverInject, sleep, initialPlayers }
