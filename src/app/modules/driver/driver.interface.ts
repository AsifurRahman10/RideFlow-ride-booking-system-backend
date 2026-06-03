import { Types } from 'mongoose'

export enum IDriverApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

export interface IDriver {
  user: Types.ObjectId
  vehicleInfo: string
  isApproved: IDriverApprovalStatus
  isOnline: boolean
  location?: {
    type: 'Point'
    coordinates: [number, number]
  }
}
