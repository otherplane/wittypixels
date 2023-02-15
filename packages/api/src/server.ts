// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

import Fastify from 'fastify'
import Web3 from 'web3'

import app from './app'
import constants, { ERC721_TOKEN_CURATOR_PK } from './constants'

const server = Fastify({
  pluginTimeout: 100000,
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
})

server
  .register(app)
  .then(() => server.ready())
  .then(() => {
    // Public key
    const account = new Web3().eth.accounts.privateKeyToAccount(
      ERC721_TOKEN_CURATOR_PK
    )
    console.log('[Server] ECDSA public Key: ', account.address)
    console.log('[Server] Non-sensitive config:', constants)

    server.listen(4000, '0.0.0.0', function (err) {
      if (err) {
        server.log.error(err)
        process.exit(1)
      }
    })
  })
