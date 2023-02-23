import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { GetImageParams, GetImageResponse, GetImageQueryParams } from '../types'
import { isTimeToMint } from '../utils'

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
      if (!isTimeToMint())
        return reply
          .status(403)
          .send(
            new Error(
              `Getting image is not possible because the game is not over.`
            )
          )

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
