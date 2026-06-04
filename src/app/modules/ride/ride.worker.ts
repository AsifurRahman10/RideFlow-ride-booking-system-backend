import { ConnectionOptions, Worker } from 'bullmq'
import { Ride } from './ride.model'
import Driver from '../driver/driver.model'
import { IDriverApprovalStatus } from '../driver/driver.interface'
import redisConnection from '../../config/redis'

const rideAssignmentWorker = new Worker(
  'ride-assignment',
  async (job) => {
    const { rideId } = job.data

    const isRideExists = await Ride.findById({ _id: rideId })
    if (!isRideExists) {
      throw new Error('Ride not found')
    }

    const driver = await Driver.find({
      isAvailable: true,
      isApproved: IDriverApprovalStatus.APPROVED,
      isOnline: true,
      location: {
        $near: {
          $geometry: isRideExists.pickupLocation,
          $maxDistance: 5000
        }
      }
    })

    if (!driver.length) {
      console.log('No driver found')
      return
    }

    const closestDriver = driver[0]

    isRideExists.DriverID = closestDriver._id
    isRideExists.status = 'accepted'

    await isRideExists.save()

    closestDriver.isAvailable = false

    await closestDriver.save()
  },
  { connection: redisConnection as unknown as ConnectionOptions }
)
export default rideAssignmentWorker
