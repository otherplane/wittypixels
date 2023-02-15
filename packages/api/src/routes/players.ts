import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { Player } from '../domain/player'

import {
  AuthorizationHeader,
  GetByStringKeyParams,
  JwtVerifyPayload,
  ExtendedPlayerVTO,
  UpdateNameBody,
  UpdateNameParams,
  BonusParams,
  BonusReply,
} from '../types'

const players: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { playerModel, playerCache } = fastify

  fastify.get<{
    Params: GetByStringKeyParams
    Reply: ExtendedPlayerVTO | Error
  }>('/players/:key', {
    schema: {
      params: GetByStringKeyParams,
      headers: AuthorizationHeader,
      response: {
        200: ExtendedPlayerVTO,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: GetByStringKeyParams }>,
      reply
    ) => {
      const { key } = request.params
      let playerKey: string
      try {
        const decoded: JwtVerifyPayload = fastify.jwt.verify(
          request.headers.authorization as string
        )
        playerKey = decoded.id
      } catch (err) {
        return reply.status(403).send(new Error(`Forbidden: invalid token`))
      }
      if (playerKey !== key)
        return reply.status(403).send(new Error(`Forbidden: invalid token`))

      // Unreachable: valid server issued token refers to non-existent player
      const player = await playerModel.get(key)
      if (!player) {
        return reply
          .status(404)
          .send(new Error(`Player does not exist (key: ${key})`))
      }

      // Unreachable: valid server issued token refers to an unclaimed player
      if (!player.token) {
        return reply
          .status(405)
          .send(new Error(`Player has not been claimed yet (key: ${key})`))
      }

      const extendedPlayer: ExtendedPlayerVTO =
        await player.toExtendedPlayerVTO({
          // get last incoming interaction
          lastInteractionIn: await fastify.interactionModel.getLast({
            to: player.username,
          }),
          // get last outgoing interaction
          lastInteractionOut: await fastify.interactionModel.getLast({
            from: player.username,
          }),
        })

      return reply.status(200).send(extendedPlayer)
    },
  })

  fastify.post<{
    Body: BonusParams
    Reply: BonusReply | Error
  }>('/players/bonus', {
    schema: {
      body: BonusParams,
      headers: AuthorizationHeader,
      response: {
        200: BonusReply,
      },
    },
    handler: async (request: FastifyRequest<{ Body: BonusParams }>, reply) => {
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

      const bonusCode = request.body.url.split('/').pop() || ''

      if (!fastify.bonusValidator.isValid(bonusCode)) {
        return reply.status(403).send(new Error(`The bonus code is invalid`))
      }
      if (player.scannedBonuses.includes(bonusCode)) {
        return reply
          .status(403)
          .send(new Error(`This bonus code was already claimed`))
      }

      // Valid bonus code: add to scannedBonuses, increment bonusEndsAt, and store to database
      player.scannedBonuses.push(bonusCode)
      const currentTimestamp = Date.now()
      player.addBonusTime(currentTimestamp)
      // Save to DB
      playerModel.updateBonuses(
        player.username,
        player.scannedBonuses,
        player.bonusEndsAt
      )

      return reply.status(200).send({ bonusEndsAt: player.bonusEndsAt })
    },
  })

  fastify.put<{
    Params: UpdateNameParams
    Body: UpdateNameBody
    Reply: ExtendedPlayerVTO | Error
  }>('/players/:key', {
    schema: {
      body: UpdateNameBody,
      params: GetByStringKeyParams,
      headers: AuthorizationHeader,
      response: {
        200: ExtendedPlayerVTO,
      },
    },
    handler: async (
      request: FastifyRequest<{
        Params: UpdateNameParams
        Body: UpdateNameBody
      }>,
      reply
    ) => {
      const { key } = request.params
      let playerKey: string
      try {
        const decoded: JwtVerifyPayload = fastify.jwt.verify(
          request.headers.authorization as string
        )
        playerKey = decoded.id
      } catch (err) {
        return reply.status(403).send(new Error(`Forbidden: invalid token`))
      }
      if (playerKey !== key)
        return reply.status(403).send(new Error(`Forbidden: invalid token`))

      // Unreachable: valid server issued token refers to non-existent player
      const player = await playerModel.get(key)
      if (!player) {
        return reply
          .status(404)
          .send(new Error(`Player does not exist (key: ${key})`))
      }

      // Unreachable: valid server issued token refers to an unclaimed player
      if (!player.token) {
        return reply
          .status(405)
          .send(new Error(`Player has not been claimed yet (key: ${key})`))
      }
      const isValidName = Player.isValidName(request.body.name)
      if (!isValidName) {
        return reply
          .status(405)
          .send(new Error(`Name should have between 2 and 34 characters`))
      }

      playerModel.updateName(request.params.key, request.body.name)
      playerCache.add({ name: request.body.name, username: player.username })

      const extendedPlayer: ExtendedPlayerVTO =
        await player.toExtendedPlayerVTO({
          // get last incoming interaction
          lastInteractionIn: await fastify.interactionModel.getLast({
            to: player.username,
          }),
          // get last outgoing interaction
          lastInteractionOut: await fastify.interactionModel.getLast({
            from: player.username,
          }),
        })

      return reply.status(200).send(extendedPlayer)
    },
  })
}

export default players
