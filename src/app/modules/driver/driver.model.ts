import { model, Schema } from 'mongoose'
import { IDriver } from './driver.interface'

const driverSchema = new Schema<IDriver>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    vehicleInfo: {
      type: String,
      required: true
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    location: {
      type: String
    }
  },
  { timestamps: true }
)

const Driver = model('Driver', driverSchema)

export default Driver
