import {
  authenticatePlayer,
  initialPlayers,
  mongoClean,
  MONGO_INITDB_DATABASE,
  MONGO_URI,
} from '../../setup'
import Fastify from 'fastify'
import { MongoClient } from 'mongodb'
import { app } from '../../../src/app'

describe('authentication.ts', () => {
  it('should authenticate PLAYER #0', async () => {
    const client = await MongoClient.connect(MONGO_URI)
    await mongoClean(client.db(MONGO_INITDB_DATABASE))
    const server = Fastify().register(app)

    const token = await authenticatePlayer(server, initialPlayers[0].key)

    expect(token).toBeTruthy()
    await server.close()
  })

  it('should authenticate PLAYER #1', async () => {
    const client = await MongoClient.connect(MONGO_URI)
    await mongoClean(client.db(MONGO_INITDB_DATABASE))
    const server = Fastify().register(app)

    const token = await authenticatePlayer(server, initialPlayers[1].key)

    expect(token).toBeTruthy()

    await server.close()
  })
})
