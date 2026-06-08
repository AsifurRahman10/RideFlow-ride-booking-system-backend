import IORedis from 'ioredis'

const redisConnection = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null
})

const redis = new IORedis(redisConnection as any)

export { redis, redisConnection }
