import { Types } from 'mongoose'

export enum IRideStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface IRide {
  DriverID: Types.ObjectId | null
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
  status: IRideStatus
  fare: number
  rideRequestedAt: Date
  rideAcceptedAt: Date
  rideCompletedAt: Date
  rideCancelledAt: Date
}
