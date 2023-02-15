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
import { CanvasModel } from './models/canvas'
import { DrawModel } from './models/draw'
import { Canvas } from './domain/canvas'
import { CanvasCache } from './services/canvasCache'
import { PlayerCache } from './services/playerCache'
import { Stats } from './domain/stats'
import { SignRedemptionModel } from './models/signRedemption'

declare module 'fastify' {
  interface FastifyInstance {
    playerModel: PlayerModel
    interactionModel: InteractionModel
    canvasModel: CanvasModel
    drawModel: DrawModel
    signRedemptionModel: SignRedemptionModel
    canvas: Canvas
    canvasCache: CanvasCache
    playerCache: PlayerCache
    stats: Stats
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
    const canvasModel = new CanvasModel(fastify.mongo.db)
    const drawModel = new DrawModel(fastify.mongo.db)
    const signRedemption = new SignRedemptionModel(fastify.mongo.db)

    fastify.decorate('playerModel', playerModel)
    fastify.decorate('interactionModel', interactionModel)
    fastify.decorate('canvasModel', canvasModel)
    fastify.decorate('drawModel', drawModel)
    fastify.decorate('signRedemptionModel', signRedemption)

    next()
  }

  fastify.register(fp(initializeModels))

  // Initialize Canvas
  const initializeCanvas: FastifyPluginCallback = async (
    fastify,
    options,
    next
  ) => {
    if (!fastify.mongo.db) throw Error('mongo db not found')
    let canvas: Canvas

    const canvasSectors = await fastify.canvasModel.get()
    const needToCreateCanvas =
      process.env.OVERWRITE_CANVAS || !canvasSectors.length

    if (needToCreateCanvas) {
      canvas = new Canvas()
      console.log('Storing Canvas in DB')
      await fastify.canvasModel.create(canvas.toDbSectors())
    } else {
      console.log('Loading Canvas from DB')
      const sectors = await fastify.canvasModel.get()
      canvas = new Canvas(sectors)
    }
    // Initializing canvas cache
    const b64 = canvas.toBase64()
    const canvasCache = new CanvasCache(b64)

    fastify.decorate('canvas', canvas)
    fastify.decorate('canvasCache', canvasCache)

    next()
  }

  fastify.register(fp(initializeCanvas))

  // Initialize Players cache
  const initializePlayerCache: FastifyPluginCallback = async (
    fastify,
    options,
    next
  ) => {
    if (!fastify.mongo.db) throw Error('mongo db not found')
    const players = await fastify.playerModel.getAll()
    // Initializing canvas cache
    const playerCache = new PlayerCache(players)

    fastify.decorate('playerCache', playerCache)
    next()
  }

  fastify.register(fp(initializePlayerCache))

  // Initialize Stats
  const initializeStats: FastifyPluginCallback = async (
    fastify,
    options,
    next
  ) => {
    const stats = new Stats()

    fastify.decorate('stats', stats)

    next()
  }

  fastify.register(fp(initializeStats))

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
    methods: ['GET', 'POST', 'PUT'],
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
