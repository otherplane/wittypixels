import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import {
  PLAYER_MINT_TIMESTAMP,
  INTERACTION_DURATION_MILLIS,
} from '../constants'
import { Draw } from '../domain/draw'

import {
  AuthorizationHeader,
  JwtVerifyPayload,
  DrawParams,
  DrawResult,
  CanvasVTO,
} from '../types'
import { isTimeToMint } from '../utils'

const canvas: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { drawModel, playerModel, canvas } = fastify

  // const { canvasModel, drawModel, playerModel, canvas } = fastify

  fastify.get<{
    Params: Record<string, never>
    Reply: CanvasVTO | Error
  }>('/canvas', {
    schema: {
      params: {},
      response: {
        200: CanvasVTO,
      },
    },
    handler: async (
      _request: FastifyRequest<{ Params: Record<string, never> }>,
      reply
    ) => {
      return reply.status(200).send(canvas.toDbVTO())
    },
  })

  fastify.patch<{ Body: DrawParams; Reply: DrawResult | Error }>('/canvas', {
    schema: {
      body: DrawParams,
      headers: AuthorizationHeader,
      response: {
        200: DrawResult,
      },
    },
    handler: async (request: FastifyRequest<{ Body: DrawParams }>, reply) => {
      // Check 0: interaction period
      if (PLAYER_MINT_TIMESTAMP && isTimeToMint())
        return reply.status(403).send(new Error(`Interaction period is over.`))

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

      // Check 3 (unreachable): trading player has been claimed
      if (!player.token) {
        return reply
          .status(409)
          .send(
            new Error(`Player should be claimed before interact with others`)
          )
      }

      const currentTimestamp = Date.now()

      // Check 6: from can interaction (is free)
      const lastDraw = await drawModel.getLast({
        from: player.username,
      })
      if (lastDraw && lastDraw.ends > currentTimestamp) {
        return reply
          .status(409)
          .send(new Error(`Players can only draw once every X seconds`))
      }

      const draw: Draw = fastify.canvas.draw({
        ends: currentTimestamp + INTERACTION_DURATION_MILLIS,
        player: player.username,
        timestamp: currentTimestamp,
        x: request.body.x,
        y: request.body.y,
        color: request.body.color,
      })

      // Create and return `draw` object
      await drawModel.create(draw.toDbVTO())

      // canvasModel.draw(draw)

      return reply.status(200).send(draw)
    },
  })
}

export default canvas