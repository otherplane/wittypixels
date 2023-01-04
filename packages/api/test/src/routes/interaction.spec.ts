import {
  INTERACTION_COOLDOWN_MILLIS,
  INTERACTION_DURATION_MILLIS,
  INTERACTION_POINTS,
  SELF_INTERACTION_POINTS,
  INTERACTION_POINTS_DIVISOR,
} from '../../../src/constants'
import {
  authenticatePlayer,
  initialPlayers,
  serverInject,
  sleep,
} from '../../setup'

describe('Route /interactions', () => {
  it('should return the interaction object after interact with itself', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
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
        expect(response.json().points).toBe(SELF_INTERACTION_POINTS)
      }
    )

    await serverInject(
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
        expect(response.json().player.score).toBe(SELF_INTERACTION_POINTS)
      }
    )
  })

  it('should sum points to player', async () => {
    const [token, token2] = await Promise.all([
      authenticatePlayer(initialPlayers[0].key),
      authenticatePlayer(initialPlayers[1].key),
      authenticatePlayer(initialPlayers[1].key),
    ])

    await serverInject(
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
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().points).toBe(INTERACTION_POINTS)
      }
    )

    await serverInject(
      {
        method: 'GET',
        url: `/players/${initialPlayers[1].key}`,
        headers: {
          Authorization: token2,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        const player = response.json().player.score
        expect(player).toBe(INTERACTION_POINTS)
      }
    )
  })

  it(
    'should sum less points if interaction with the same player occurs several times',
    async () => {
      // jest.useFakeTimers('legacy')
      const [token, token1] = await Promise.all([
        authenticatePlayer(initialPlayers[0].key),
        authenticatePlayer(initialPlayers[1].key),
      ])

      await serverInject(
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
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(response.headers['content-type']).toBe(
            'application/json; charset=utf-8'
          )
          expect(response.json().to).toBe(initialPlayers[1].username)
          expect(response.json().from).toBe(initialPlayers[0].username)
          expect(response.json().timestamp).toBeTruthy()
          expect(response.json().ends).toBe(
            response.json().timestamp + INTERACTION_DURATION_MILLIS
          )
          expect(response.json().points).toBe(INTERACTION_POINTS)
        }
      )

      await sleep(INTERACTION_COOLDOWN_MILLIS)

      const secondInteractionPoints = Math.ceil(
        INTERACTION_POINTS / INTERACTION_POINTS_DIVISOR
      )

      await serverInject(
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
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(response.headers['content-type']).toBe(
            'application/json; charset=utf-8'
          )
          expect(response.json().to).toBe(initialPlayers[1].username)
          expect(response.json().from).toBe(initialPlayers[0].username)
          expect(response.json().timestamp).toBeTruthy()
          expect(response.json().ends).toBe(
            response.json().timestamp + INTERACTION_DURATION_MILLIS
          )
          expect(response.json().points).toBe(secondInteractionPoints)
        }
      )

      await serverInject(
        {
          method: 'GET',
          url: `/players/${initialPlayers[1].key}`,
          headers: {
            Authorization: token1,
          },
        },
        (err, response) => {
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(response.headers['content-type']).toBe(
            'application/json; charset=utf-8'
          )

          expect(response.json().player.score).toBe(
            INTERACTION_POINTS + secondInteractionPoints
          )
        }
      )
    },
    INTERACTION_COOLDOWN_MILLIS * 1.2
  )

  it('should NOT INTERACT if invalid token (check 1)', async () => {
    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: initialPlayers[0].key,
        },
        headers: {
          Authorization: 'invalid',
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(403)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  // TODO: get valid token
  it('should NOT interact if valid token but for non existent player (check 2)', async () => {
    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: 'inexistent',
        },
        headers: {
          Authorization: '',
        },
      },
      (err, response) => {
        expect(err)
        expect(response.statusCode).toBe(403)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  test('should NOT INTERACT if player has not claimed its own player (check 3)', async () => {
    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: initialPlayers[1].key,
        },
        headers: {
          Authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVmMTJlZmJkNzY1ZjlhZDMiLCJpYXQiOjE2MzI5MzI0NjN9.Koji-yz6dQyYpsGgRKiN_PEM-nvTQqXtP8Mx8icIHYQ',
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  it('should NOT interact if target player does not exist (check 4)', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: 'foo-bar',
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(404)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  it('should NOT interact if target player does not exist (check 5)', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
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
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  it('should NOT interact if FROM player is already interacting with other player(check 6)', async () => {
    const [token] = await Promise.all([
      authenticatePlayer(initialPlayers[0].key),
      authenticatePlayer(initialPlayers[1].key),
    ])

    await serverInject(
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
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )

    await serverInject(
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
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  it('should NOT interact if target player is already interacting (check 7)', async () => {
    const [token1, token2] = await Promise.all([
      await authenticatePlayer(initialPlayers[0].key),
      await authenticatePlayer(initialPlayers[1].key),
    ])
    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: initialPlayers[0].key,
        },
        headers: {
          Authorization: token1,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )

    await serverInject(
      {
        method: 'POST',
        url: '/interactions',
        payload: {
          to: initialPlayers[0].key,
        },
        headers: {
          Authorization: token2,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  it(
    'should NOT interact if cooldown has not elapsed (check 8)',
    async () => {
      const [token] = await Promise.all([
        authenticatePlayer(initialPlayers[0].key),
        authenticatePlayer(initialPlayers[1].key),
      ])

      await serverInject(
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
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(response.headers['content-type']).toBe(
            'application/json; charset=utf-8'
          )
        }
      )

      await sleep(INTERACTION_DURATION_MILLIS)

      await serverInject(
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
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(409)
          expect(response.headers['content-type']).toBe(
            'application/json; charset=utf-8'
          )
        }
      )

      await sleep(INTERACTION_COOLDOWN_MILLIS)

      await serverInject(
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
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
        }
      )
    },
    (INTERACTION_COOLDOWN_MILLIS + INTERACTION_DURATION_MILLIS) * 1.2
  )
})
