import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import Web3 from 'web3'
import {
  WEB3_PROVIDER,
  ERC721_TOKEN_ADDRESS,
  ERC721_TOKEN_ID,
} from '../constants'

//import { WEB3_PROVIDER, WITMON_ERC721_ADDRESS } from '../constants'
//import { MetadataRepository } from '../repositories/metadata'
import { CanvasMetadata, MetadataParams } from '../types'

// More info aboout why we have to use required instead of import:
// https://github.com/web3/web3.js/issues/3310#issuecomment-701590114
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WITTY_PIXELS_ERC721_ABI = require('../assets/WpxTokenABI.json')

const metadata: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  fastify.get<{ Params: MetadataParams; Reply: CanvasMetadata | Error }>(
    '/metadata/:token',
    {
      schema: {
        params: MetadataParams,
        response: {
          200: CanvasMetadata,
        },
      },
      handler: async (
        request: FastifyRequest<{ Params: MetadataParams }>,
        reply
      ) => {
        const { token } = request.params
        // Check token id is the same as defined
        if (Number(token) !== Number(ERC721_TOKEN_ID)) {
          return reply.status(404).send(new Error(`Token ID not found`))
        }
        let callResult
        const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER))
        const contract = new web3.eth.Contract(
          WITTY_PIXELS_ERC721_ABI,
          ERC721_TOKEN_ADDRESS
        )

        try {
          callResult = await contract.methods.metadata(token).call()
        } catch (err) {
          console.error('[Server] Metadata error:', err)
          return reply.status(502).send(new Error(`Metadata`))
        }
        return reply.status(200).send(callResult)
      },
    }
  )
}

export default metadata
