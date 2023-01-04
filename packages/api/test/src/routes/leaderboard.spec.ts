// import { Player } from '../../../src/domain/player'
// import { authenticatePlayer, initialPlayers, serverInject } from '../../setup'

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
import { Player } from '../../../src/domain/player'

describe('Route /leaderboard', () => {
  describe('should return leaderboard values for each entity', () => {
    it('players', async () => {
      const client = await MongoClient.connect(MONGO_URI)
      await mongoClean(client.db(MONGO_INITDB_DATABASE))
      const server = Fastify().register(app)

      const tokens = await Promise.all([
        authenticatePlayer(server, initialPlayers[0].key),
        authenticatePlayer(server, initialPlayers[1].key),
        authenticatePlayer(server, initialPlayers[2].key),
        authenticatePlayer(server, initialPlayers[3].key),
        authenticatePlayer(server, initialPlayers[4].key),
        authenticatePlayer(server, initialPlayers[5].key),
      ])
      const token = tokens[0]

      await new Promise(r =>
        server.inject(
          {
            method: 'GET',
            url: '/leaderboard',
            headers: {
              Authorization: token,
            },
          },
          (err, response) => {
            const players = response.json().players
            expect(err).toBeFalsy()
            expect(response.statusCode).toBe(200)
            expect(players.players.length).toBe(6)
            expect(players.total).toBe(6)
            players.players.forEach((player: Player) => {
              expect(player.username).toBeTruthy()
              expect(player.score).toBe(0)
              expect(typeof player.creationIndex).toBe('number')
            })

            r(true)
          }
        )
      )

      await server.close()
    })
  })

  describe('should return leaderboard values for each entity AFTER INTERACTION', () => {
    it('players', async () => {
      const client = await MongoClient.connect(MONGO_URI)
      await mongoClean(client.db(MONGO_INITDB_DATABASE))
      const server = Fastify().register(app)
      const tokens = await Promise.all([
        authenticatePlayer(server, initialPlayers[0].key),
        authenticatePlayer(server, initialPlayers[1].key),
        authenticatePlayer(server, initialPlayers[2].key),
        authenticatePlayer(server, initialPlayers[3].key),
        authenticatePlayer(server, initialPlayers[4].key),
      ])

      const token = tokens[0]
      // Trade with player 1
      await new Promise(r =>
        server.inject(
          {
            method: 'POST',
            url: '/interactions',
            payload: {
              to: initialPlayers[1].key,
            },
            headers: {
              Authorization: token,
            },
          },
          (err, response) => {
            expect(response.statusCode).toBe(200)
            r(true)
          }
        )
      )

      await new Promise(r =>
        server.inject(
          {
            method: 'GET',
            url: '/leaderboard',
            headers: {
              Authorization: token,
            },
          },
          (err, response) => {
            const players = response.json().players
            expect(err).toBeFalsy()
            expect(response.statusCode).toBe(200)
            expect(players.players.length).toBe(5)
            expect(players.total).toBe(5)

            players.players.forEach((player: Player) => {
              expect(player.username).toBeTruthy()
              if (player.username === initialPlayers[1].username) {
                expect(player.score).toBe(800)
              } else {
                expect(player.score).toBe(0)
              }
              // expect(typeof player.position).toBe('number')
              // expect(player.position).toBe(index)
            })
            r(true)
          }
        )
      )

      await server.close()
    })
  })

  it('should return correct values when PAGINATION params are given', async () => {
    const client = await MongoClient.connect(MONGO_URI)
    await mongoClean(client.db(MONGO_INITDB_DATABASE))
    const server = Fastify().register(app)

    const tokens = await Promise.all([
      authenticatePlayer(server, initialPlayers[0].key),
      authenticatePlayer(server, initialPlayers[1].key),
      authenticatePlayer(server, initialPlayers[2].key),
      authenticatePlayer(server, initialPlayers[3].key),
      authenticatePlayer(server, initialPlayers[4].key),
    ])
    const token = tokens[0]

    let firstPlayer: Player
    await new Promise(r =>
      server.inject(
        {
          method: 'GET',
          url: '/leaderboard?limit=1&offset=0',
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          expect(response.statusCode).toBe(200)
          expect(response.json().players.players.length).toBe(1)
          expect(response.json().players.total).toBe(5)
          firstPlayer = response.json().players.players[0]

          r(true)
        }
      )
    )

    await authenticatePlayer(server, initialPlayers[5].key)

    await new Promise(r =>
      server.inject(
        {
          method: 'GET',
          url: '/leaderboard?limit=1&offset=1',
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          expect(response.statusCode).toBe(200)
          expect(response.json().players.players.length).toBe(1)
          expect(response.json().players.total).toBe(6)
          expect(response.json().players.players[0].username).not.toBe(
            firstPlayer.username
          )
          r(true)
        }
      )
    )

    await server.close()
  })
})
