import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { GetImageParams, GetImageResponse, GetImageQueryParams } from '../types'

const image: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { canvas } = fastify

  fastify.get<{
    Params: GetImageParams
    Reply: GetImageResponse
    Querystring: GetImageQueryParams
  }>('/image/:token_id', {
    schema: {
      params: GetImageParams,
      querystring: GetImageQueryParams,
      response: {
        200: GetImageResponse,
      },
    },
    handler: async (
      request: FastifyRequest<{
        Params: GetImageParams
        Querystring: GetImageQueryParams
      }>,
      reply
    ) => {
      const digest = request.query.digest
      if (digest && digest.toLowerCase() === 'sha-256') {
        return reply.status(200).send(canvas.toSHA256())
      } else {
        reply.header(
          'Content-disposition',
          `attachment; filename=wpx-${request.params.token_id}.png`
        )
        return reply.type('image/png').send(canvas.toPng())
      }
    },
  })
}

export default image
