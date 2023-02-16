import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { GetStatsParams, Stats } from '../types'

const stats: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { interactionModel, playerModel, canvas, stats, drawModel } = fastify

  fastify.get<{
    Params: GetStatsParams
    Reply: Stats | Error
  }>('/stats/:token_id', {
    schema: {
      params: GetStatsParams,
      response: {
        200: Stats,
      },
    },
    handler: async (
      _request: FastifyRequest<{ Params: GetStatsParams }>,
      reply
    ) => {
      const canvasPixels = canvas.countPixelsDrawn()
      const totalPixels = await drawModel.countAll()
      const players = await playerModel.getActivePlayers()
      const totalScans = await interactionModel.countAll()

      const statsParams = {
        players,
        totalPixels,
        totalScans,
        canvasPixels,
      }
      if (stats.hasChanged(statsParams)) {
        stats.update(statsParams)
      }

      const jsonStats = stats.toJson()

      return reply.status(200).send(jsonStats)
    },
  })
}

export default stats
