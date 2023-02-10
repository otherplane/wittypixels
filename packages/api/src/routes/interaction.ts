import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { ERC20_TOKEN_START_TS, INTERACTION_DURATION_MILLIS } from '../constants'

import {
  AuthorizationHeader,
  JwtVerifyPayload,
  InteractionResult,
  InteractionParams,
  InteractionHistoryParams,
  InteractionHistoryResponse,
} from '../types'
import {
  calculateRemainingCooldown,
  isTimeToMint,
  printRemainingMillis,
} from '../utils'

const interactions: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { playerModel, interactionModel } = fastify

  fastify.post<{ Body: InteractionParams; Reply: InteractionResult | Error }>(
    '/interactions',
    {
      schema: {
        body: InteractionParams,
        headers: AuthorizationHeader,
        response: {
          200: InteractionResult,
        },
      },
      handler: async (
        request: FastifyRequest<{ Body: InteractionParams }>,
        reply
      ) => {
        // Check 0: interaction period
        if (ERC20_TOKEN_START_TS && isTimeToMint())
          return reply
            .status(403)
            .send(new Error(`Interaction period is over.`))

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
        const fromPlayer = await playerModel.get(fromKey)
        if (!fromPlayer) {
          return reply
            .status(404)
            .send(new Error(`Player does not exist (key: ${fromKey})`))
        }

        // Check 3 (unreachable): trading player has been claimed
        if (!fromPlayer.token) {
          return reply
            .status(409)
            .send(
              new Error(`Player should be claimed before interact with others`)
            )
        }

        // Check 4: target player exist
        const toPlayer = await playerModel.get(request.body.to)
        if (!toPlayer) {
          return reply
            .status(404)
            .send(new Error(`Wrong target player with key ${request.body.to}`))
        }

        // Check 5: target Player is claimed
        if (!toPlayer.token) {
          return reply
            .status(409)
            .send(new Error(`Target player has not been claimed yet`))
        }

        const currentTimestamp = Date.now()

        // Check 6: from can interaction (is free)
        const lastInteractionFrom = await interactionModel.getLast({
          from: fromPlayer.username,
        })
        if (
          lastInteractionFrom &&
          lastInteractionFrom.ends > currentTimestamp
        ) {
          return reply
            .status(409)
            .send(new Error(`Players can only interact 1 player at a time`))
        }

        // Check 7: target player can interact (is free)
        const lastInteractionTo = await interactionModel.getLast({
          to: toPlayer.username,
        })
        if (lastInteractionTo && lastInteractionTo.ends > currentTimestamp) {
          return reply
            .status(409)
            .send(new Error(`Target Player is already trading`))
        }

        // Check 8: cooldown period from Player to target Player has elapsed
        const lastInteraction = await interactionModel.getLast({
          from: fromPlayer.username,
          to: toPlayer.username,
        })
        const remainingCooldown: number = lastInteraction
          ? calculateRemainingCooldown(lastInteraction.ends)
          : 0
        if (remainingCooldown) {
          return reply
            .status(409)
            .send(
              new Error(
                `Target Player needs ${printRemainingMillis(
                  remainingCooldown
                )} to cooldown before interact again`
              )
            )
        }
        const selfInteraction = toPlayer.username === fromPlayer.username
        const colorQuantity = playerModel.computeColors(
          lastInteraction,
          selfInteraction
        )
        try {
          // Add points to player
          await playerModel.addColor(
            toPlayer.toDbVTO().key,
            fromPlayer.color,
            colorQuantity
          )
        } catch (error) {
          return reply.status(403).send(error as Error)
        }

        // Create and return `interact` object
        const interaction = await interactionModel.create({
          ends: currentTimestamp + INTERACTION_DURATION_MILLIS,
          from: fromPlayer.username,
          to: toPlayer.username,
          quantity: colorQuantity,
          color: fromPlayer.color,
          timestamp: currentTimestamp,
        })

        return reply.status(200).send(interaction)
      },
    }
  )

  // GET /history?limit=LIMIT&offset=OFFSET
  fastify.get<{
    Querystring: InteractionHistoryParams
    Reply: InteractionHistoryResponse | Error
  }>('/history', {
    schema: {
      querystring: InteractionHistoryParams,
      headers: AuthorizationHeader,
      response: {
        200: InteractionHistoryResponse,
      },
    },
    handler: async (
      request: FastifyRequest<{ Querystring: InteractionHistoryParams }>,
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
        interactions: {
          interactions: await interactionModel.getManyByUsername(
            player.username,
            {
              limit: request.query.limit || 10,
              offset: request.query.offset || 0,
            }
          ),
          total: await interactionModel.count(player.username),
        },
      })
    },
  })
}

export default interactions
