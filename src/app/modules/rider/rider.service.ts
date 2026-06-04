import AppError from '../../utils/AppError'
import { Ride } from '../ride/ride.model'
import httpStatusCode from 'http-status-codes'

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
  return ride
}

export const RiderService = {
  requestRide
}
