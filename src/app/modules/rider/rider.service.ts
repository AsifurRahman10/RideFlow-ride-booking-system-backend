import AppError from '../../utils/AppError'
import { Ride } from '../ride/ride.model'
import httpStatusCode from 'http-status-codes'
import { rideQueue } from '../ride/ride.queue'
import {
  calculateDistanceKm,
  calculateFare
} from '../../utils/fareCalculationHelpers'
import { IRideStatus } from '../ride/ride.interface'

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

  const [pickupLng, pickupLat] = payload.pickupLocation.coordinates

  const [destinationLng, destinationLat] =
    payload.destinationLocation.coordinates

  const distanceKm = calculateDistanceKm(
    pickupLat,
    pickupLng,
    destinationLat,
    destinationLng
  )

  const fare = calculateFare(distanceKm)
  const ride = await Ride.create({
    RiderID: userId,
    rideDistanceKM: distanceKm,
    fare: fare,
    ...payload
  })

  // send ride request to queue for driver assignment (assign job)
  await rideQueue.add('assign', { rideId: ride._id })
  return ride
}

const cancelRide = async (userId: string, rideId: string) => {
  const ride = await Ride.findOne({ _id: rideId, RiderID: userId })

  if (!ride) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Ride not found')
  }
  if (
    ride.status === IRideStatus.ACCEPTED ||
    ride.status === IRideStatus.COMPLETED
  ) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'Cannot cancel a accepted or completed ride'
    )
  }

  await ride.updateOne({ status: IRideStatus.CANCELLED })
  return ride
}

export const RiderService = {
  requestRide,
  cancelRide
}
