import { Types } from 'mongoose'

export interface IRide {
  DriverID: Types.ObjectId
  RiderID: Types.ObjectId
  pickupLocation: {
    type: 'Point'
    coordinates: [number, number]
  }
  destination: {
    type: 'Point'
    coordinates: [number, number]
  }
  status: 'requested' | 'accepted' | 'completed' | 'cancelled'
  fare: number
  rideRequestedAt: Date
  rideAcceptedAt: Date
  rideCompletedAt: Date
}
