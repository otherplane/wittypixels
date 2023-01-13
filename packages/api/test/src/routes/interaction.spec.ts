import { MongoClient } from 'mongodb'
import Fastify from 'fastify'
import {
  // INTERACTION_COOLDOWN_MILLIS,
  INTERACTION_DURATION_MILLIS,
  // INTERACTION_POINTS,
  // SELF_INTERACTION_POINTS,
  // INTERACTION_POINTS_DIVISOR,
  SELF_INTERACTION_COLOR_QUANTITY,
} from '../../../src/constants'
import {
  authenticatePlayer,
  initialPlayers,
  // sleep,
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

  // it('should sum points to player', async () => {
  //   const client = await MongoClient.connect(MONGO_URI)
  //   await mongoClean(client.db(MONGO_INITDB_DATABASE))
  //   const server = Fastify().register(app)

  //   const [token, token2] = await Promise.all([
  //     authenticatePlayer(server, initialPlayers[0].key),
  //     authenticatePlayer(server, initialPlayers[1].key),
  //     authenticatePlayer(server, initialPlayers[1].key),
  //   ])

  //   await new Promise(resolve => {
  //     server.inject(
  //       {
  //         method: 'POST',
  //         url: '/interactions',
  //         payload: {
  //           to: initialPlayers[1].key,
  //         },
  //         headers: {
  //           Authorization: token,
  //         },
  //       },
  //       (err, response) => {
  //         expect(err).toBeFalsy()
  //         expect(response.statusCode).toBe(200)
  //         expect(response.headers['content-type']).toBe(
  //           'application/json; charset=utf-8'
  //         )
  //         expect(response.json().points).toBe(INTERACTION_POINTS)
  //         resolve(true)
  //       }
  //     )
  //   })

  //   await new Promise(resolve =>
  //     server.inject(
  //       {
  //         method: 'GET',
  //         url: `/players/${initialPlayers[1].key}`,
  //         headers: {
  //           Authorization: token2,
  //         },
  //       },
  //       (err, response) => {
  //         expect(err).toBeFalsy()
  //         expect(response.statusCode).toBe(200)
  //         expect(response.headers['content-type']).toBe(
  //           'application/json; charset=utf-8'
  //         )
  //         const player = response.json().player.score
  //         expect(player).toBe(INTERACTION_POINTS)
  //         resolve(true)
  //       }
  //     )
  //   )

  //   await server.close()
  // }, 10000)

  // it(
  //   'should sum less points if interaction with the same player occurs several times',
  //   async () => {
  //     const client = await MongoClient.connect(MONGO_URI)
  //     await mongoClean(client.db(MONGO_INITDB_DATABASE))
  //     const server = Fastify().register(app)

  //     const [token, token1] = await Promise.all([
  //       authenticatePlayer(server, initialPlayers[0].key),
  //       authenticatePlayer(server, initialPlayers[1].key),
  //     ])

  //     await new Promise(resolve =>
  //       server.inject(
  //         {
  //           method: 'POST',
  //           url: '/interactions',
  //           payload: {
  //             to: initialPlayers[1].key,
  //           },
  //           headers: {
  //             Authorization: token,
  //           },
  //         },
  //         (err, response) => {
  //           expect(err).toBeFalsy()
  //           expect(response.statusCode).toBe(200)
  //           expect(response.headers['content-type']).toBe(
  //             'application/json; charset=utf-8'
  //           )
  //           expect(response.json().to).toBe(initialPlayers[1].username)
  //           expect(response.json().from).toBe(initialPlayers[0].username)
  //           expect(response.json().timestamp).toBeTruthy()
  //           expect(response.json().ends).toBe(
  //             response.json().timestamp + INTERACTION_DURATION_MILLIS
  //           )
  //           expect(response.json().points).toBe(INTERACTION_POINTS)
  //           resolve(true)
  //         }
  //       )
  //     )

  //     await sleep(INTERACTION_COOLDOWN_MILLIS)

  //     const secondInteractionPoints = Math.ceil(
  //       INTERACTION_POINTS / INTERACTION_POINTS_DIVISOR
  //     )

  //     await new Promise(resolve =>
  //       server.inject(
  //         {
  //           method: 'POST',
  //           url: '/interactions',
  //           payload: {
  //             to: initialPlayers[1].key,
  //           },
  //           headers: {
  //             Authorization: token,
  //           },
  //         },
  //         (err, response) => {
  //           expect(err).toBeFalsy()
  //           expect(response.statusCode).toBe(200)
  //           expect(response.headers['content-type']).toBe(
  //             'application/json; charset=utf-8'
  //           )
  //           expect(response.json().to).toBe(initialPlayers[1].username)
  //           expect(response.json().from).toBe(initialPlayers[0].username)
  //           expect(response.json().timestamp).toBeTruthy()
  //           expect(response.json().ends).toBe(
  //             response.json().timestamp + INTERACTION_DURATION_MILLIS
  //           )
  //           expect(response.json().points).toBe(secondInteractionPoints)
  //           resolve(true)
  //         }
  //       )
  //     )

  //     await new Promise(resolve =>
  //       server.inject(
  //         {
  //           method: 'GET',
  //           url: `/players/${initialPlayers[1].key}`,
  //           headers: {
  //             Authorization: token1,
  //           },
  //         },
  //         (err, response) => {
  //           expect(err).toBeFalsy()
  //           expect(response.statusCode).toBe(200)
  //           expect(response.headers['content-type']).toBe(
  //             'application/json; charset=utf-8'
  //           )

  //           expect(response.json().player.score).toBe(
  //             INTERACTION_POINTS + secondInteractionPoints
  //           )
  //           resolve(true)
  //         }
  //       )
  //     )

  //     await server.close()
  //   },
  //   INTERACTION_COOLDOWN_MILLIS * 4.0
  // )

  // it('should NOT INTERACT if invalid token (check 1)', async () => {
  //   const client = await MongoClient.connect(MONGO_URI)
  //   await mongoClean(client.db(MONGO_INITDB_DATABASE))
  //   const server = Fastify().register(app)

  //   await new Promise(resolve =>
  //     server.inject(
  //       {
  //         method: 'POST',
  //         url: '/interactions',
  //         payload: {
  //           to: initialPlayers[0].key,
  //         },
  //         headers: {
  //           Authorization: 'invalid',
  //         },
  //       },
  //       (err, response) => {
  //         expect(err).toBeFalsy()
  //         expect(response.statusCode).toBe(403)
  //         expect(response.headers['content-type']).toBe(
  //           'application/json; charset=utf-8'
  //         )
  //         resolve(true)
  //       }
  //     )
  //   )
  //   await server.close()
  // })

  // // TODO: get valid token
  // it('should NOT interact if valid token but for non existent player (check 2)', async () => {
  //   const client = await MongoClient.connect(MONGO_URI)
  //   await mongoClean(client.db(MONGO_INITDB_DATABASE))
  //   const server = Fastify().register(app)

  //   await new Promise(resolve =>
  //     server.inject(
  //       {
  //         method: 'POST',
  //         url: '/interactions',
  //         payload: {
  //           to: 'inexistent',
  //         },
  //         headers: {
  //           Authorization: '',
  //         },
  //       },
  //       (err, response) => {
  //         expect(err)
  //         expect(response.statusCode).toBe(403)
  //         expect(response.headers['content-type']).toBe(
  //           'application/json; charset=utf-8'
  //         )
  //         resolve(true)
  //       }
  //     )
  //   )
  //   await server.close()
  // })

  // it('should NOT INTERACT if player has not claimed its own player (check 3)', async () => {
  //   const client = await MongoClient.connect(MONGO_URI)
  //   await mongoClean(client.db(MONGO_INITDB_DATABASE))
  //   const server = Fastify().register(app)

  //   await new Promise(r =>
  //     server.inject(
  //       {
  //         method: 'POST',
  //         url: '/interactions',
  //         payload: {
  //           to: initialPlayers[1].key,
  //         },
  //         headers: {
  //           Authorization:
  //             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVmMTJlZmJkNzY1ZjlhZDMiLCJpYXQiOjE2MzI5MzI0NjN9.Koji-yz6dQyYpsGgRKiN_PEM-nvTQqXtP8Mx8icIHYQ',
  //         },
  //       },
  //       (err, response) => {
  //         expect(err).toBeFalsy()
  //         expect(response.statusCode).toBe(409)
  //         expect(response.headers['content-type']).toBe(
  //           'application/json; charset=utf-8'
  //         )
  //         r(true)
  //       }
  //     )
  //   )
  //   await server.close()
  // })

  // it('should NOT interact if target player does not exist (check 4)', async () => {
  //   const client = await MongoClient.connect(MONGO_URI)
  //   await mongoClean(client.db(MONGO_INITDB_DATABASE))
  //   const server = Fastify().register(app)
  //   const token = await authenticatePlayer(server, initialPlayers[0].key)

  //   await new Promise(r =>
  //     server.inject(
  //       {
  //         method: 'POST',
  //         url: '/interactions',
  //         payload: {
  //           to: 'foo-bar',
  //         },
  //         headers: {
  //           Authorization: token,
  //         },
  //       },
  //       (err, response) => {
  //         expect(err).toBeFalsy()
  //         expect(response.statusCode).toBe(404)
  //         expect(response.headers['content-type']).toBe(
  //           'application/json; charset=utf-8'
  //         )
  //         r(true)
  //       }
  //     )
  //   )

  //   await server.close()
  // })

  // it('should NOT interact if target player does not exist (check 5)', async () => {
  //   const client = await MongoClient.connect(MONGO_URI)
  //   await mongoClean(client.db(MONGO_INITDB_DATABASE))
  //   const server = Fastify().register(app)
  //   const token = await authenticatePlayer(server, initialPlayers[0].key)

  //   await new Promise(p =>
  //     server.inject(
  //       {
  //         method: 'POST',
  //         url: '/interactions',
  //         payload: {
  //           to: initialPlayers[1].key,
  //         },
  //         headers: {
  //           Authorization: token,
  //         },
  //       },
  //       (err, response) => {
  //         expect(err).toBeFalsy()
  //         expect(response.statusCode).toBe(409)
  //         expect(response.headers['content-type']).toBe(
  //           'application/json; charset=utf-8'
  //         )
  //         p(true)
  //       }
  //     )
  //   )

  //   await server.close()
  // })

  // it('should NOT interact if FROM player is already interacting with other player(check 6)', async () => {
  //   const client = await MongoClient.connect(MONGO_URI)
  //   await mongoClean(client.db(MONGO_INITDB_DATABASE))
  //   const server = Fastify().register(app)

  //   const [token] = await Promise.all([
  //     authenticatePlayer(server, initialPlayers[0].key),
  //     authenticatePlayer(server, initialPlayers[1].key),
  //   ])

  //   await new Promise(r =>
  //     server.inject(
  //       {
  //         method: 'POST',
  //         url: '/interactions',
  //         payload: {
  //           to: initialPlayers[1].key,
  //         },
  //         headers: {
  //           Authorization: token,
  //         },
  //       },
  //       (err, response) => {
  //         expect(err).toBeFalsy()
  //         expect(response.statusCode).toBe(200)
  //         expect(response.headers['content-type']).toBe(
  //           'application/json; charset=utf-8'
  //         )
  //         r(true)
  //       }
  //     )
  //   )

  //   await new Promise(r =>
  //     server.inject(
  //       {
  //         method: 'POST',
  //         url: '/interactions',
  //         payload: {
  //           to: initialPlayers[1].key,
  //         },
  //         headers: {
  //           Authorization: token,
  //         },
  //       },
  //       (err, response) => {
  //         expect(err).toBeFalsy()
  //         expect(response.statusCode).toBe(409)
  //         expect(response.headers['content-type']).toBe(
  //           'application/json; charset=utf-8'
  //         )
  //         r(true)
  //       }
  //     )
  //   )

  //   await server.close()
  // })

  // it('should NOT interact if target player is already interacting (check 7)', async () => {
  //   const client = await MongoClient.connect(MONGO_URI)
  //   await mongoClean(client.db(MONGO_INITDB_DATABASE))
  //   const server = Fastify().register(app)

  //   const [token1, token2] = await Promise.all([
  //     await authenticatePlayer(server, initialPlayers[0].key),
  //     await authenticatePlayer(server, initialPlayers[1].key),
  //   ])
  //   await new Promise(r =>
  //     server.inject(
  //       {
  //         method: 'POST',
  //         url: '/interactions',
  //         payload: {
  //           to: initialPlayers[0].key,
  //         },
  //         headers: {
  //           Authorization: token1,
  //         },
  //       },
  //       (err, response) => {
  //         expect(err).toBeFalsy()
  //         expect(response.statusCode).toBe(200)
  //         expect(response.headers['content-type']).toBe(
  //           'application/json; charset=utf-8'
  //         )
  //         r(true)
  //       }
  //     )
  //   )

  //   await new Promise(r =>
  //     server.inject(
  //       {
  //         method: 'POST',
  //         url: '/interactions',
  //         payload: {
  //           to: initialPlayers[0].key,
  //         },
  //         headers: {
  //           Authorization: token2,
  //         },
  //       },
  //       (err, response) => {
  //         expect(err).toBeFalsy()
  //         expect(response.statusCode).toBe(409)
  //         expect(response.headers['content-type']).toBe(
  //           'application/json; charset=utf-8'
  //         )
  //         r(true)
  //       }
  //     )
  //   )

  //   await server.close()
  // }, 10000)

  // it(
  //   'should NOT interact if cooldown has not elapsed (check 8)',
  //   async () => {
  //     const client = await MongoClient.connect(MONGO_URI)
  //     await mongoClean(client.db(MONGO_INITDB_DATABASE))
  //     const server = Fastify().register(app)

  //     const [token] = await Promise.all([
  //       authenticatePlayer(server, initialPlayers[0].key),
  //       authenticatePlayer(server, initialPlayers[1].key),
  //     ])

  //     await new Promise(r =>
  //       server.inject(
  //         {
  //           method: 'POST',
  //           url: '/interactions',
  //           payload: {
  //             to: initialPlayers[1].key,
  //           },
  //           headers: {
  //             Authorization: token,
  //           },
  //         },
  //         (err, response) => {
  //           expect(err).toBeFalsy()
  //           expect(response.statusCode).toBe(200)
  //           expect(response.headers['content-type']).toBe(
  //             'application/json; charset=utf-8'
  //           )
  //           r(true)
  //         }
  //       )
  //     )

  //     await sleep(INTERACTION_DURATION_MILLIS)

  //     await new Promise(r =>
  //       server.inject(
  //         {
  //           method: 'POST',
  //           url: '/interactions',
  //           payload: {
  //             to: initialPlayers[1].key,
  //           },
  //           headers: {
  //             Authorization: token,
  //           },
  //         },
  //         (err, response) => {
  //           expect(err).toBeFalsy()
  //           expect(response.statusCode).toBe(409)
  //           expect(response.headers['content-type']).toBe(
  //             'application/json; charset=utf-8'
  //           )
  //           r(true)
  //         }
  //       )
  //     )

  //     await sleep(INTERACTION_COOLDOWN_MILLIS)

  //     await new Promise(r =>
  //       server.inject(
  //         {
  //           method: 'POST',
  //           url: '/interactions',
  //           payload: {
  //             to: initialPlayers[1].key,
  //           },
  //           headers: {
  //             Authorization: token,
  //           },
  //         },
  //         (err, response) => {
  //           expect(err).toBeFalsy()
  //           expect(response.statusCode).toBe(200)
  //           r(true)
  //         }
  //       )
  //     )

  //     await server.close()
  //   },
  //   (INTERACTION_COOLDOWN_MILLIS + INTERACTION_DURATION_MILLIS) * 2.0
  // )
})
