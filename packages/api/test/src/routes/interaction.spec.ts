import { MongoClient } from 'mongodb'
import Fastify from 'fastify'
import {
  INTERACTION_DURATION_MILLIS,
  SELF_INTERACTION_COLOR_QUANTITY,
} from '../../../src/constants'
import {
  authenticatePlayer,
  initialPlayers,
  mongoClean,
  MONGO_INITDB_DATABASE,
  MONGO_URI,
} from '../../setup'
import { app } from '../../../src/app'

describe.only('Route /interactions', () => {
  it.only('should return the interaction object after interact with itself', async () => {
    const client = await MongoClient.connect(MONGO_URI)
    await mongoClean(client.db(MONGO_INITDB_DATABASE))
    const server = Fastify().register(app)

    const token = await authenticatePlayer(server, initialPlayers[0].key)

    await new Promise(resolve => {
      server.inject(
        {
          method: 'POST',
          url: '/interactions',
          payload: {
            to: initialPlayers[0].key,
          },
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          console.log('response', response.json())
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(response.headers['content-type']).toBe(
            'application/json; charset=utf-8'
          )
          expect(response.json().to).toBe(initialPlayers[0].username)
          expect(response.json().from).toBe(initialPlayers[0].username)
          expect(response.json().timestamp).toBeTruthy()
          expect(response.json().ends).toBe(
            response.json().timestamp + INTERACTION_DURATION_MILLIS
          )
          expect(response.json().quantity).toBe(SELF_INTERACTION_COLOR_QUANTITY)
          // TODO should be this color?
          expect(response.json().color).toBe(0)
          resolve(true)
        }
      )
    })

    await new Promise(resolve => {
      server.inject(
        {
          method: 'GET',
          url: `/players/${initialPlayers[0].key}`,
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(response.headers['content-type']).toBe(
            'application/json; charset=utf-8'
          )
          // TODO: should be this color?
          expect(response.json().player.palette).toStrictEqual({
            0: 1,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
          })
          resolve(true)
        }
      )
    })
    await server.close()
  }, 10000)
})
