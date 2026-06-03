import { model, Schema } from 'mongoose'
import { IRide } from './ride.interface'

const riderSchema = new Schema<IRide>(
  {
    DriverID: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    RiderID: { type: Schema.Types.ObjectId, ref: 'Rider', required: true },
    pickupLocation: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }
    },
    destination: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'completed', 'cancelled'],
      default: 'requested'
    },
    fare: { type: Number, required: true },
    rideRequestedAt: { type: Date, default: Date.now },
    rideAcceptedAt: { type: Date },
    rideCompletedAt: { type: Date }
  },
  { timestamps: true }
)

export const Ride = model<IRide>('Ride', riderSchema)
