import { model, Schema } from 'mongoose'
import { IRide, IRideStatus } from './ride.interface'

const rideSchema = new Schema<IRide>(
  {
    DriverID: { type: Schema.Types.ObjectId, ref: 'Driver', default: null },
    RiderID: { type: Schema.Types.ObjectId, ref: 'Rider', required: true },
    pickupLocation: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] }
    },
    destinationLocation: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] }
    },
    status: {
      type: String,
      enum: Object.values(IRideStatus),
      default: IRideStatus.REQUESTED
    },
    pickupAddress: {
      type: String
    },

    destinationAddress: {
      type: String
    },
    fare: {
      type: Number,
      default: 0
    },
    rideDistanceKM: {
      type: Number,
      default: 0
    },
    rideRequestedAt: { type: Date, default: Date.now },
    rideAcceptedAt: { type: Date },
    rideCompletedAt: { type: Date },
    rideCancelledAt: {
      type: Date
    }
  },
  { timestamps: true }
)

rideSchema.index({ pickupLocation: '2dsphere' })
rideSchema.index({ destinationLocation: '2dsphere' })

export const Ride = model<IRide>('Ride', rideSchema)
