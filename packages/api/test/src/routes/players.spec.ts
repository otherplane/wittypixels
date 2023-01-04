// import { authenticatePlayer, serverInject, initialPlayers } from '../../setup'
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

describe('player.ts', () => {
  it('should NOT get PLAYER #1 - no authorization header', async () => {
    const client = await MongoClient.connect(MONGO_URI)
    await mongoClean(client.db(MONGO_INITDB_DATABASE))
    const server = Fastify().register(app)

    await new Promise(r =>
      server.inject(
        {
          method: 'GET',
          url: `/players/${initialPlayers[0].key}`,
        },
        (err, response) => {
          expect(response?.json().message).toBe(
            `headers must have required property 'authorization'`
          )
          r(true)
        }
      )
    )
  })

  it('should NOT get PLAYER #1 - invalid jwt token', async () => {
    const client = await MongoClient.connect(MONGO_URI)
    await mongoClean(client.db(MONGO_INITDB_DATABASE))
    const server = Fastify().register(app)
    await new Promise(r =>
      server.inject(
        {
          method: 'GET',
          url: `/players/${initialPlayers[0].key}`,
          headers: {
            Authorization: 'foo',
          },
        },
        (err, response) => {
          expect(response?.json().message).toBe('Forbidden: invalid token')
          r(true)
        }
      )
    )
    await server.close()
  })

  it('should NOT get PLAYER#1 - valid token for PLAYER #2', async () => {
    const client = await MongoClient.connect(MONGO_URI)
    await mongoClean(client.db(MONGO_INITDB_DATABASE))
    const server = Fastify().register(app)
    const [, token] = await Promise.all([
      authenticatePlayer(server, initialPlayers[0].key),
      authenticatePlayer(server, initialPlayers[1].key),
    ])

    await new Promise(r =>
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
          expect(response.statusCode).toBe(403)
          expect(response.headers['content-type']).toBe(
            'application/json; charset=utf-8'
          )
          r(true)
        }
      )
    )

    await server.close()
  })

  it('should NOT get PLAYER #12345 - valid token but non-existent player', async () => {
    const client = await MongoClient.connect(MONGO_URI)
    await mongoClean(client.db(MONGO_INITDB_DATABASE))
    const server = Fastify().register(app)

    const token = await authenticatePlayer(server, initialPlayers[0].key)

    await new Promise(r =>
      server.inject(
        {
          method: 'GET',
          url: '/players/12345',
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(403)
          expect(response.headers['content-type']).toBe(
            'application/json; charset=utf-8'
          )
          r(true)
        }
      )
    )

    await server.close()
  })

  it('should get PLAYER #1 - get after claimed', async () => {
    const client = await MongoClient.connect(MONGO_URI)
    await mongoClean(client.db(MONGO_INITDB_DATABASE))
    const server = Fastify().register(app)
    const token = await authenticatePlayer(server, initialPlayers[0].key)

    await new Promise(r =>
      server.inject(
        {
          method: 'GET',
          url: `/players/${initialPlayers[0].key}`,
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          const { key, username, score, nft } = response.json().player

          const { lastInteractionIn, lastInteractionOut } = response.json()

          expect(key).toBeTruthy()
          expect(username).toBeTruthy()
          expect(score).toBe(0)
          expect(lastInteractionIn).toBe(null)
          expect(lastInteractionOut).toBe(null)
          expect(nft).toStrictEqual([])
          r(true)
        }
      )
    )
    await server.close()
  })

  // test('should get EGG #1 - get after incubation', async (t) => {
  //   // Before test: Claim an egg
  //   const token = await claimEgg(t)(0)

  //   await new Promise((resolve) => {
  //     server.inject(
  //       {
  //         method: 'POST',
  //         url: '/eggs/incubate',
  //         payload: {
  //           target: initialEggs[0].key,
  //         },
  //         headers: {
  //           Authorization: `${token}`,
  //         },
  //       },
  //       (err, response) => {
  //         t.error(err)
  //         t.equal(response.statusCode, 200)
  //         resolve(true)
  //       }
  //     )
  //   })

  //   await new Promise((resolve) => {
  //     server.inject(
  //       {
  //         method: 'GET',
  //         url: `/eggs/${initialEggs[0].key}`,
  //         headers: {
  //           Authorization: `${token}`,
  //         },
  //       },
  //       (err, response) => {
  //         t.error(err)
  //         t.equal(response.statusCode, 200)
  //         t.equal(
  //           response.headers['content-type'],
  //           'application/json; charset=utf-8'
  //         )
  //         t.ok(response.json().incubating)
  //         t.ok(response.json().incubatedBy)
  //         t.ok(response.json().egg)
  //         t.same(response.json().egg.rarityIndex, 0)

  //         // Check incubated by (self-incubation)
  //         t.same(response.json().incubatedBy.from, initialEggs[0].username)
  //         t.same(response.json().incubatedBy.to, initialEggs[0].username)
  //         t.ok(response.json().incubatedBy.remainingDuration > 0)
  //         t.ok(
  //           response.json().incubatedBy.remainingDuration <=
  //             INCUBATION_DURATION_MILLIS
  //         )
  //         t.ok(
  //           response.json().incubatedBy.remainingCooldown >
  //             INCUBATION_DURATION_MILLIS
  //         )
  //         t.ok(
  //           response.json().incubatedBy.remainingCooldown <=
  //             INCUBATION_DURATION_MILLIS + INCUBATION_COOLDOWN_MILLIS
  //         )

  //         // Check incubating (self-incubation)
  //         t.same(response.json().incubating.from, initialEggs[0].username)
  //         t.same(response.json().incubating.to, initialEggs[0].username)
  //         t.ok(response.json().incubating.remainingDuration > 0)
  //         t.ok(
  //           response.json().incubating.remainingDuration <=
  //             INCUBATION_DURATION_MILLIS
  //         )
  //         t.ok(
  //           response.json().incubating.remainingCooldown >
  //             INCUBATION_DURATION_MILLIS
  //         )
  //         t.ok(
  //           response.json().incubating.remainingCooldown <=
  //             INCUBATION_DURATION_MILLIS + INCUBATION_COOLDOWN_MILLIS
  //         )

  //         t.end()

  //         resolve(true)
  //       }
  //     )
  //   })
  // })
})
