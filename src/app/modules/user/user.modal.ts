import { model, Schema } from 'mongoose'
import { IAuthProvider, IsActive, IUser, UserRole } from './user.interface'

const authSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerID: { type: String, required: true }
  },
  {
    versionKey: false,
    _id: false
  }
)

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.RIDER
    },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE
    },
    phoneNumber: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    auths: [authSchema]
  },
  {
    timestamps: true
  }
)

export const User = model<IUser>('User', userSchema)
