import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { GetImageParams, GetImageResponse, GetImageQueryParams } from '../types'
import base58 from 'bs58'
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
        const canvasHash = canvas.toSHA256()
        const canvasB58 = base58.encode(Buffer.from(canvasHash))
        return reply.status(200).send('sha-256:' + canvasB58)
      } else {
        reply.header('Content-disposition', 'attachment; filename=wittypixels')
        return reply.type('image/png').send(canvas.toPng())
      }
    },
  })
}

export default image
