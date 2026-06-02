export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'admin',
  RIDER = 'rider',
  DRIVER = 'driver'
}

export interface IAuthProvider {
  provider: 'google' | 'credential'
  providerID: string
}

export enum IsActive {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCK = 'BLOCK'
}

export interface IUser {
  name: string
  email: string
  password: string
  role: UserRole
  isActive: IsActive
  phoneNumber?: string
  address?: string
  isDeleted?: boolean
  isVerified?: boolean
  auths: IAuthProvider
}
