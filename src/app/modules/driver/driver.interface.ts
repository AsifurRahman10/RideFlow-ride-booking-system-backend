import { Types } from 'mongoose'

export interface IDriver {
  user: Types.ObjectId
  vehicleInfo: string
  isApproved: boolean
  isOnline: boolean
  location?: string
}
