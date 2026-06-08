import { Queue, type ConnectionOptions } from 'bullmq'
import { redisConnection } from '../../config/redis'

export const rideQueue = new Queue('ride-assignment', {
  connection: redisConnection as unknown as ConnectionOptions
})
