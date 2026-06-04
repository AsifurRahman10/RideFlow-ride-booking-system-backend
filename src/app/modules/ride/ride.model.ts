import { model, Schema } from 'mongoose'
import { IRide } from './ride.interface'

const riderSchema = new Schema<IRide>(
  {
    DriverID: { type: Schema.Types.ObjectId, ref: 'Driver', default: null },
    RiderID: { type: Schema.Types.ObjectId, ref: 'Rider', required: true },
    pickupLocation: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }
    },
    destinationLocation: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'completed', 'cancelled'],
      default: 'requested'
    },
    pickupAddress: {
      type: String,
      required: true
    },

    destinationAddress: {
      type: String,
      required: true
    },
    fare: {
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

riderSchema.index({ pickupLocation: '2dsphere' })
riderSchema.index({ destinationLocation: '2dsphere' })

export const Ride = model<IRide>('Ride', riderSchema)
