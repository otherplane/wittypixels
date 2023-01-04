import { CollectionInfo, Db } from 'mongodb'
import { FastifyInstance } from 'fastify'

const MONGO_INITDB_DATABASE = process.env.MONGO_INITDB_DATABASE || ''
const MONGO_URI = process.env.MONGO_URI || ''

if (!MONGO_INITDB_DATABASE) {
  new Error('Environment variable not found: MONGO_INITDB_DATABASE')
}

if (!MONGO_URI) {
  new Error('Environment variable not found: MONGO_URI')
}

async function mongoClean(db: Db) {
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

  return
}

async function authenticatePlayer(
  server: FastifyInstance,
  key: string
): Promise<string> {
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

// This functions is not being used to debug easily every test until we fix
// https://github.com/otherplane/wittypixels/blob/main/README.md#e2e-test)
// async function serverInject(
//   opts: InjectOptions,
//   cb: LightMyRequestCallback
// ): Promise<null> {
//   return new Promise(resolve => {
//     server.inject(opts, async (error, result) => {
//       await cb(error, result)

//       return resolve(null)
//     })
//   })
// }

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

export {
  authenticatePlayer,
  initialPlayers,
  MONGO_INITDB_DATABASE,
  MONGO_URI,
  mongoClean,
  sleep,
}
