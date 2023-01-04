import Ajv from 'ajv'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import fastifyJwt from '@fastify/jwt'
import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify'
import fastifyMongodb from '@fastify/mongodb'
import fp from 'fastify-plugin'
import { join } from 'path'

import { PLAYERS_COUNT, JWT_SECRET, MONGO_URI } from './constants'
import { PlayerModel } from './models/player'
import { InteractionModel } from './models/interaction'

declare module 'fastify' {
  interface FastifyInstance {
    playerModel: PlayerModel
    interactionModel: InteractionModel
  }
}

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // TODO: Add HTTPS support
  // {
  //   https: {
  //     key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  //     cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
  //   }
  // }

  // Json Validator
  const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: 'array',
    allErrors: true,
  })
  // Support ajv@7
  ajv.addKeyword('kind')
  ajv.addKeyword('modifier')
  fastify.setValidatorCompiler(({ schema }) => {
    return ajv.compile(schema)
  })

  // MongoDB
  fastify.register(fastifyMongodb, {
    // force to close the mongodb connection when app stopped
    forceClose: true,
    url: MONGO_URI,
  })
  // InitializeModels and callback
  const initializeModels: FastifyPluginCallback = async (
    fastify,
    options,
    next
  ) => {
    if (!fastify.mongo.db) throw Error('mongo db not found')
    const playerModel = new PlayerModel(fastify.mongo.db)
    const interactionModel = new InteractionModel(fastify.mongo.db)

    fastify.decorate('playerModel', playerModel)
    fastify.decorate('interactionModel', interactionModel)

    next()
  }

  fastify.register(fp(initializeModels))

  // Initialize game repositories
  fastify.register(async (fastify, options, next) => {
    if (!fastify.mongo.db) throw Error('mongo db not found')
    // Initialize game repositories and bootstrap
    await fastify.playerModel.bootstrap(PLAYERS_COUNT, false)
    next()
  })

  // CORS
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  fastify.register(require('@fastify/cors'), {
    origin: '*',
    methods: ['GET', 'POST'],
  })

  // JWT
  fastify.register(fastifyJwt, {
    secret: JWT_SECRET as string,
  })

  // Plugins defined in routes
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
  })

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  fastify.register(require('@fastify/static'), {
    root: join(__dirname, '../public'),
    // prefix: '/public/', // optional: default '/'
  })
}

export default app
export { app }
