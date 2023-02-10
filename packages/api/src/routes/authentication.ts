import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { ERC20_TOKEN_START_TS } from '../constants'
import { ClaimPlayerParams, DbPlayerVTO } from '../types'
import { isTimeToMint } from '../utils'

const authentication: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { playerModel } = fastify

  fastify.post<{ Body: ClaimPlayerParams; Reply: DbPlayerVTO | Error }>(
    '/auth',
    {
      schema: {
        body: ClaimPlayerParams,
        response: {
          200: DbPlayerVTO,
        },
      },
      handler: async (
        request: FastifyRequest<{ Body: ClaimPlayerParams }>,
        reply
      ) => {
        // Check 0: check if game is over
        if (ERC20_TOKEN_START_TS && isTimeToMint())
          return reply
            .status(403)
            .send(
              new Error(`Claiming is not possible because the game is over.`)
            )
        const key = request.body.key
        const player = await playerModel.get(key)

        if (!player) {
          return reply
            .status(404)
            .send(new Error(`Player does not exist (key: ${key})`))
        }

        if (player.token) {
          return reply
            .status(405)
            .send(new Error(`Player has already been claimed (key ${key})`))
        }

        const token = fastify.jwt.sign({ id: key })

        try {
          const playerUpdated = await playerModel.update({
            ...player,
            token,
          })

          return reply.status(200).send(playerUpdated.toDbVTO(true))
        } catch (error) {
          reply.status(409).send(error as Error)
        }
      },
    }
  )
}

export default authentication
