import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import {
  ERC20_TOKEN_START_TS,
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
  GetPixelInfo,
  PixelInfo,
} from '../types'
import { isTimeToMint } from '../utils'
import { msToSeconds } from '../utils/msToSeconds'

const canvas: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { canvasModel, drawModel, playerModel, canvasCache, canvas } = fastify

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
      return reply.status(200).send(canvasCache.getCanvas())
    },
  })

  fastify.get<{
    Querystring: GetPixelInfo
    Reply: PixelInfo | Error
  }>('/canvas/pixel', {
    schema: {
      querystring: GetPixelInfo,
      response: {
        200: PixelInfo,
      },
    },
    handler: async (
      request: FastifyRequest<{ Querystring: GetPixelInfo }>,
      reply
    ) => {
      // Check token is valid
      try {
        fastify.jwt.verify(request.headers.authorization as string)
      } catch (err) {
        return reply.status(403).send(new Error(`Forbidden: invalid token`))
      }
      const { x, y } = request.query

      return reply.status(200).send(canvas.getPixel(x, y))
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
      if (ERC20_TOKEN_START_TS && isTimeToMint())
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
              `Players can only draw once every ${msToSeconds(INTERACTION_DURATION_MILLIS)}s`
            )
          )
      }

      const { color, shade, x, y } = request.body

      const lastPixelDraw = await drawModel.getLastByCoord({ x, y })

      if (
        lastPixelDraw &&
        lastPixelDraw.timestamp + PIXEL_LOCKED_DURATION_MS > currentTimestamp
      ) {
        return reply
          .status(409)
          .send(
            new Error(
              `A pixel can only be drawn once every ${msToSeconds(PIXEL_LOCKED_DURATION_MS)}s`
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

      const pixel = canvas.getPixel(x, y)
      const draw: Draw = fastify.canvas.draw({
        // ends: currentTimestamp + INTERACTION_DURATION_MILLIS,
        owner: player.username,
        // timestamp: currentTimestamp,
        x,
        y,
        shade,
        color,
        stolenTo: pixel.owner,
      })
      // Create and return `draw` object
      await drawModel.create(draw.toDbVTO())

      const dbSectorInfo = draw.toDbSectorInfo()
      const newPixel = {
        x,
        y,
        c: color,
        o: player.username,
        t: Date.now(),
        s: shade,
      }
      canvasModel.draw(dbSectorInfo, newPixel)

      await playerModel.reduceColor(player.username, request.body.color)
      await playerModel.increaseScore(player.username)

      if (lastPixelDraw) {
        await playerModel.decreaseScore(lastPixelDraw.owner)
      }

      fastify.canvasCache.add(fastify.canvas.toBase64())

      return reply.status(200).send(fastify.canvasCache.getCanvas())
    },
  })
}

export default canvas
