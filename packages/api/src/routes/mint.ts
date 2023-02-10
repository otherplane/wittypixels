import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import keccak from 'keccak'
import secp256k1 from 'secp256k1'
import Web3 from 'web3'
import {
  PLAYER_MINT_TIMESTAMP,
  MINT_PRIVATE_KEY,
  WEB3_PROVIDER,
  PARENT_TOKEN,
  PARENT_TOKEN_ID,
} from '../constants'
import { calculateLeaf } from '../services/playersTree'
import {
  AuthorizationHeader,
  JwtVerifyPayload,
  MintOutput,
  MintParams,
} from '../types'
import { fromHexToUint8Array, isTimeToMint } from '../utils'

const mint: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { mintModel, playerModel, canvas, stats } = fastify

  fastify.post<{ Body: MintParams; Reply: MintOutput | Error }>('/mint', {
    schema: {
      body: MintParams,
      headers: AuthorizationHeader,
      response: {
        200: MintOutput,
      },
    },
    handler: async (request: FastifyRequest<{ Body: MintParams }>, reply) => {
      // Check 0: incubation period
      if (PLAYER_MINT_TIMESTAMP && !isTimeToMint())
        return reply
          .status(403)
          .send(new Error(`Forbidden: mint is not enabled yet`))

      // Check 1: token is valid
      let key: string
      try {
        const decoded: JwtVerifyPayload = fastify.jwt.verify(
          request.headers.authorization as string
        )
        key = decoded.id
      } catch (err) {
        return reply.status(403).send(new Error(`Forbidden: invalid token`))
      }
      // Unreachable: valid server issued token refers to non-existent player
      const player = await playerModel.get(key)
      if (!player) {
        return reply
          .status(404)
          .send(new Error(`Player does not exist (key: ${key})`))
      }
      // Check 3 (unreachable): incubating player egg has been claimed
      if (!player.token) {
        return reply
          .status(405)
          .send(new Error(`Player has not been claimed yet (key: ${key})`))
      }
      // Check 4 (unreachable): player must have database id
      if (!player.key) {
        return reply
          .status(405)
          .send(new Error(`Player has no id (key: ${key})`))
      }

      // If previously minted, reply with same mint output
      const prevMint = await mintModel.get(player.creationIndex)
      if (prevMint) {
        return reply.status(200).send(prevMint)
      }
      const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER))
      // Check address is valid
      if (!web3.utils.isAddress(request.body.address)) {
        return reply
          .status(409)
          .send(new Error(`Mint address should be a valid addresss`))
      }

      const playerPixels = canvas.countPixels(player.username)

      const leaf = calculateLeaf(player)
      if (!stats.merkleTree) {
        throw new Error('No tree exists inside stats in /mint')
      }
      const proof = stats.merkleTree.getProof(leaf) as Array<string>
      if (!proof) {
        throw new Error('Proof is empty in /mint')
      }
      const message = web3.eth.abi.encodeParameters(
        [
          'address',
          'uint256',
          'address',
          'uint256',
          'uint256',
          'bytes32[]',
          'bytes',
        ],
        [
          PARENT_TOKEN,
          PARENT_TOKEN_ID,
          request.body.address,
          player.creationIndex,
          playerPixels,
          proof,
        ]
      )
      if (!message) {
        throw Error('Mint failed because signature message is empty')
      }

      // Compute Keccak256 from data
      const messageBuffer = Buffer.from(message.substring(2), 'hex')
      const messageHash = keccak('keccak256').update(messageBuffer).digest()
      // Sign message
      // Note: web3.eth.accounts.sign is not used because it prefixes the message to sign
      const signatureObj = secp256k1.ecdsaSign(
        messageHash,
        fromHexToUint8Array(MINT_PRIVATE_KEY)
      )
      // `V` signature component (V = 27 + recid)
      const signV = (27 + signatureObj.recid).toString(16)
      // Signature = RS | V
      const signature = Buffer.from(signatureObj.signature)
        .toString('hex')
        .concat(signV)
      const response = {
        envelopedSignature: {
          message: message.substring(2),
          messageHash: messageHash.toString('hex'),
          signature,
        },
        data: {
          parentToken: PARENT_TOKEN,
          parentTokenId: PARENT_TOKEN_ID,
          playerAddress: request.body.address,
          playerIndex: player.creationIndex,
          playerPixels,
          playerPixelsProof: proof,
        },
      }
      await mintModel.create(response)
      return reply.status(200).send(response)
    },
  })
}

export default mint
