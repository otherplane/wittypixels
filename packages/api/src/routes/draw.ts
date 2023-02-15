import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import {
  AuthorizationHeader,
  JwtVerifyPayload,
  DrawHistoryQueryParams,
  DrawHistoryResponse,
} from '../types'

const draws: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { playerModel, drawModel } = fastify

  // GET /draws?limit=LIMIT&offset=OFFSET
  fastify.get<{
    Querystring: DrawHistoryQueryParams
    Reply: DrawHistoryResponse | Error
  }>('/draws', {
    schema: {
      querystring: DrawHistoryQueryParams,
      headers: AuthorizationHeader,
      response: {
        200: DrawHistoryResponse,
      },
    },
    handler: async (
      request: FastifyRequest<{ Querystring: DrawHistoryQueryParams }>,
      reply
    ) => {
      // Check 1: token is valid
      let fromKey: string
      try {
        const decoded: JwtVerifyPayload = fastify.jwt.verify(
          request.headers.authorization as string
        )
        fromKey = decoded.id
      } catch (err) {
        return reply.status(403).send(new Error(`Forbidden: invalid token`))
      }

      // Check 2 (unreachable): valid server issued token refers to non-existent player
      const player = await playerModel.get(fromKey)
      if (!player) {
        return reply
          .status(404)
          .send(new Error(`Player does not exist (key: ${fromKey})`))
      }

      // Check 3 (unreachable): interaction player has been claimed
      if (!player.token) {
        return reply
          .status(409)
          .send(
            new Error(`Player should be claimed before interact with others`)
          )
      }

      return reply.status(200).send({
        draws: {
          draws: await drawModel.getManyByUsername(player.username, {
            limit: request.query.limit || 10,
            offset: request.query.offset || 0,
          }),
          total: await drawModel.count(player.username),
        },
      })
    },
  })
}

export default draws
