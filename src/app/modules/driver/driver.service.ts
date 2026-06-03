import { User } from '../user/user.modal'
import { IDriver } from './driver.interface'
import Driver from './driver.model'

const createDriverProfile = async (
  userId: string,
  driverData: Partial<IDriver>
): Promise<IDriver> => {
  const isUserExist = await User.findOne({ _id: userId })
  if (!isUserExist) {
    throw new Error('User not found')
  }

  if (isUserExist.role !== 'driver') {
    throw new Error('User is not a driver')
  }
  const userPayload = {
    user: userId,
    ...driverData
  }
  const driver = await Driver.create(userPayload)
  return driver
}

export const DriverService = {
  createDriverProfile
}
