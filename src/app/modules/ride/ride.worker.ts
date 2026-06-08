import { ConnectionOptions, Worker, Queue } from 'bullmq'
import { Ride } from './ride.model'
import Driver from '../driver/driver.model'
import { IDriverApprovalStatus } from '../driver/driver.interface'
import { redis, redisConnection } from '../../config/redis'
import { rideQueue } from './ride.queue'
import { IRideStatus } from './ride.interface'

const MAX_ATTEMPTS = 4
const ACCEPT_TIMEOUT_MS = 5 * 60 * 1000

async function setDriverAvailability(driverId: any, isAvailable: boolean) {
  await Driver.findByIdAndUpdate(driverId, { isAvailable })
}

const rideAssignmentWorker = new Worker(
  'ride-assignment',
  async (job) => {
    const jobName = (job as any).name || (job as any).type

    if (jobName === 'assign') {
      const { rideId } = job.data

      const isRideExists = await Ride.findById({ _id: rideId })
      if (!isRideExists) {
        throw new Error('Ride not found')
      }

      // if ride already accepted/cancelled/completed, skip
      if (
        [
          IRideStatus.ACCEPTED,
          IRideStatus.COMPLETED,
          IRideStatus.CANCELLED
        ].includes(isRideExists.status)
      ) {
        return
      }

      // get drivers already tried for this ride
      const triedKey = `ride:${rideId}:tried`
      const attemptsKey = `ride:${rideId}:attempts`

      const triedDrivers = await redis.smembers(triedKey)

      // find nearest available driver not in triedDrivers
      const drivers = await Driver.find({
        isAvailable: true,
        isApproved: IDriverApprovalStatus.APPROVED,
        isOnline: true,
        _id: { $nin: triedDrivers },
        location: {
          $near: {
            $geometry: isRideExists.pickupLocation,
            $maxDistance: 5000
          }
        }
      })

      if (!drivers.length) {
        // if no driver found, increment attempts and maybe retry later
        const attempts = parseInt((await redis.get(attemptsKey)) || '0', 10)
        if (attempts + 1 >= MAX_ATTEMPTS) {
          // mark as cancelled or leave as requested per decision; here we mark as cancelled
          isRideExists.status = IRideStatus.CANCELLED
          isRideExists.rideCancelledAt = new Date()
          await isRideExists.save()
          await redis.del(triedKey)
          await redis.del(attemptsKey)
          return
        }

        await redis.set(attemptsKey, String(attempts + 1), 'PX', 30 * 60 * 1000)
        await rideQueue.add('assign', { rideId })
        return
      }

      const closestDriver = drivers[0]

      // set DriverID on ride but keep status as 'requested' until driver accepts
      isRideExists.DriverID = closestDriver._id
      await isRideExists.save()

      // mark driver unavailable so he won't get offered elsewhere
      await setDriverAvailability(closestDriver._id, false)

      // record this driver as tried
      await redis.sadd(triedKey, String(closestDriver._id))
      await redis.pexpire(triedKey, 30 * 60 * 1000)

      // schedule recheck job after ACCEPT_TIMEOUT_MS
      await rideQueue.add(
        'recheck',
        { rideId, driverId: String(closestDriver._id) },
        { delay: ACCEPT_TIMEOUT_MS }
      )
    }

    if (jobName === 'recheck') {
      const { rideId, driverId } = job.data
      const isRideExists = await Ride.findById({ _id: rideId })
      if (!isRideExists) {
        throw new Error('Ride not found')
      }

      // if ride already accepted/cancelled/completed, cleanup and stop
      if (
        [
          IRideStatus.ACCEPTED,
          IRideStatus.COMPLETED,
          IRideStatus.CANCELLED
        ].includes(isRideExists.status)
      ) {
        const triedKey = `ride:${rideId}:tried`
        const attemptsKey = `ride:${rideId}:attempts`
        await redis.del(triedKey)
        await redis.del(attemptsKey)
        return
      }

      // if driver accepted meanwhile, nothing to do
      if (String(isRideExists.DriverID) !== String(driverId)) {
        return
      }

      // driver didn't accept in time: clear driver assignment and mark driver available
      isRideExists.DriverID = null
      await isRideExists.save()

      await setDriverAvailability(driverId, true)

      // increment attempts and decide whether to retry
      const attemptsKey = `ride:${rideId}:attempts`
      const attempts = parseInt((await redis.get(attemptsKey)) || '0', 10)
      if (attempts + 1 >= MAX_ATTEMPTS) {
        isRideExists.status = IRideStatus.CANCELLED
        isRideExists.rideCancelledAt = new Date()
        await isRideExists.save()
        const triedKey = `ride:${rideId}:tried`
        await redis.del(triedKey)
        await redis.del(attemptsKey)
        return
      }

      await redis.set(attemptsKey, String(attempts + 1), 'PX', 30 * 60 * 1000)
      // enqueue another assign job to find next driver
      await rideQueue.add('assign', { rideId })
    }
  },
  { connection: redisConnection as unknown as ConnectionOptions }
)

export default rideAssignmentWorker
