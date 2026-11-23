import IORedis, { RedisOptions } from 'ioredis'
import { envVars } from './config'

const redisOptions: RedisOptions = {
  host: envVars.REDIS_HOST,
  port: Number(envVars.REDIS_PORT),
  username: 'default',
  password: envVars.REDIS_PASSWORD,
  maxRetriesPerRequest: null
}

const redisConnection = new IORedis(redisOptions)
const redis = new IORedis(redisOptions)

export { redis, redisConnection }
