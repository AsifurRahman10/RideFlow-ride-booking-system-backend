import AppError from '../../utils/AppError'
import { Ride } from '../ride/ride.model'
import httpStatusCode from 'http-status-codes'
import { rideQueue } from '../ride/ride.queue'

const requestRide = async (userId: string, payload: any) => {
  if (
    !(payload.pickupLocation || payload.pickupAddress) ||
    !(payload.destinationLocation || payload.destinationAddress)
  ) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'Pickup and destination are required'
    )
  }
  const ride = await Ride.create({
    RiderID: userId,
    ...payload
  })

  // send ride request to queue for driver assignment
  await rideQueue.add('ride-assignment', { rideId: ride._id })
  return ride
}

export const RiderService = {
  requestRide
}
