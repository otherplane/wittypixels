import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import {
  PLAYER_MINT_TIMESTAMP,
  INTERACTION_DURATION_MILLIS,
  PIXEL_LOCKED_DURATION_MS,
} from '../constants'
import { Draw } from '../domain/draw'

import {
  AuthorizationHeader,
  JwtVerifyPayload,
  DrawParams,
  DrawResult,
  GetCanvasResponse,
  GetCanvasParams,
} from '../types'
import { isTimeToMint } from '../utils'

const canvas: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { canvasModel, drawModel, playerModel, canvas } = fastify

  fastify.get<{
    Querystring: GetCanvasParams
    Reply: GetCanvasResponse | Error
  }>('/canvas', {
    schema: {
      querystring: GetCanvasParams,
      response: {
        200: GetCanvasResponse,
      },
    },
    handler: async (
      request: FastifyRequest<{ Querystring: GetCanvasParams }>,
      reply
    ) => {
      const MAX_PIXELS_DIFF = 1000
      const canvasCache = fastify.canvasCache

      const checkpoint = request.query.checkpoint

      if (!checkpoint || canvasCache.lastIndex - checkpoint > MAX_PIXELS_DIFF) {
        return reply.status(200).send({
          canvas: canvas.toVTO(),
          checkpoint: canvasCache.lastIndex,
        })
      } else {
        return reply.status(200).send({
          canvas: fastify.canvasCache.getFrom(checkpoint),
          checkpoint: fastify.canvasCache.lastIndex,
        })
      }
    },
  })

  fastify.post<{ Body: DrawParams; Reply: DrawResult | Error }>('/canvas', {
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
      const lastDraw = await drawModel.getLastByPlayer({
        player: player.username,
      })
      if (lastDraw && lastDraw.ends > currentTimestamp) {
        return reply
          .status(409)
          .send(
            new Error(
              `Players can only draw once every ${INTERACTION_DURATION_MILLIS}ms`
            )
          )
      }

      const { color, x, y } = request.body

      const lastPixelDraw = await drawModel.getLastByCoord({ x, y })

      if (
        lastPixelDraw &&
        lastPixelDraw.timestamp + PIXEL_LOCKED_DURATION_MS > currentTimestamp
      ) {
        return reply
          .status(409)
          .send(
            new Error(
              `A pixel can only be drawn once every ${PIXEL_LOCKED_DURATION_MS}ms`
            )
          )
      }

      // Check 6: has the color
      if (!player.hasColor(request.body.color)) {
        return reply
          .status(409)
          .send(
            new Error(`Player doesn't have the color ${request.body.color}`)
          )
      }

      const draw: Draw = fastify.canvas.draw({
        // ends: currentTimestamp + INTERACTION_DURATION_MILLIS,
        owner: player.username,
        // timestamp: currentTimestamp,
        x,
        y,
        color,
      })
      // Create and return `draw` object
      await drawModel.create(draw.toDbVTO())
      canvasModel.draw(draw.toDbSectorInfo(), {
        x,
        y,
        c: color,
        o: player.username,
        t: Date.now(),
      })

      await playerModel.reduceColor(player.username, request.body.color)
      await playerModel.increaseScore(player.username)

      if (lastPixelDraw) {
        await playerModel.decreaseScore(lastPixelDraw.owner)
      }

      fastify.canvasCache.add(draw)

      return reply.status(200).send(draw.toVTO())
    },
  })
}

export default canvas
