import { Types } from 'mongoose'

export interface IRide {
  DriverID: Types.ObjectId
  RiderID: Types.ObjectId
  pickupLocation: {
    type: 'Point'
    coordinates: [number, number]
  }
  destinationLocation: {
    type: 'Point'
    coordinates: [number, number]
  }
  pickupAddress: string
  destinationAddress: string
  status: 'requested' | 'accepted' | 'completed' | 'cancelled'
  fare: number
  rideRequestedAt: Date
  rideAcceptedAt: Date
  rideCompletedAt: Date
  rideCancelledAt: Date
}
