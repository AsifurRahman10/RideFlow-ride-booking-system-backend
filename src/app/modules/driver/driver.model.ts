import { model, Schema } from 'mongoose'
import { IDriverApprovalStatus, IDriver } from './driver.interface'

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
      type: String,
      enum: Object.values(IDriverApprovalStatus),
      default: IDriverApprovalStatus.PENDING
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  },
  { timestamps: true }
)
driverSchema.index({ location: '2dsphere' })
const Driver = model('Driver', driverSchema)

export default Driver
