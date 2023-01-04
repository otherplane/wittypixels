import { FastifyPluginAsync } from 'fastify'
//import Web3 from 'web3'

//import { WEB3_PROVIDER, WITMON_ERC721_ADDRESS } from '../constants'
//import { MetadataRepository } from '../repositories/metadata'
import { EggMetadata, GetByNumericKeyParams } from '../types'

//const WITMON_ERCC721 = require('../assets/WitmonERC721.json')

const metadata: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  //const metadataRepository = new MetadataRepository(fastify.mongo.db)

  fastify.get<{ Params: GetByNumericKeyParams; Reply: EggMetadata | Error }>(
    '/metadata/:key',
    {
      schema: {
        params: GetByNumericKeyParams,
        response: {
          200: EggMetadata,
        },
      },
      handler: async () =>
        // _request: FastifyRequest<{ Params: { key: number } }>,
        // _reply
        {
          /*
        const { key } = request.params
        // Check if metadata already exists in DB
        const eggMetadataFromDb = await metadataRepository.get(key)
        if (eggMetadataFromDb) {
          return reply.status(200).send(eggMetadataFromDb)
        }
        // Fetch metadata from contract using Web3
        const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER))
        const { abi } = WITMON_ERCC721
        const contract = new web3.eth.Contract(abi, WITMON_ERC721_ADDRESS)
        let callResult
        try {
          callResult = await contract.methods.metadata(key).call()
        } catch (err) {
          console.error('[Server] Metadata error:', err)
          return reply
            .status(404)
            .send(
              new Error(`Metadata for token id ${key} could not be fetched`)
            )
        }
        // Parse contract call result
        const metadataFromContract: EggMetadata = {
          ...JSON.parse(callResult),
          token_id: key,
        }
        // Save metadata into DB
        await metadataRepository.create(metadataFromContract)
        return reply.status(200).send(metadataFromContract)
        */
        },
    }
  )
}

export default metadata
