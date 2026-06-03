import { Ride } from '../ride/ride.model'
import { User } from '../user/user.modal'
import { IDriver, IDriverApprovalStatus } from './driver.interface'
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

const getDriverProfile = async (userId: string): Promise<IDriver | null> => {
  const driver = await Driver.findOne({ user: userId })
  if (!driver) {
    throw new Error('Driver profile not found')
  }
  return driver
}

const updateDriverAvailability = async (
  userId: string,
  availabilityData: { isOnline: boolean }
): Promise<IDriver | null> => {
  const driver = await Driver.findOne({ user: userId })
  if (!driver) {
    throw new Error('Driver profile not found')
  }
  driver.isOnline = availabilityData.isOnline
  await driver.save()
  return driver
}

const updateDriverLocation = async (
  userId: string,
  locationData: { location: { type: 'Point'; coordinates: [number, number] } }
): Promise<IDriver | null> => {
  const driver = await Driver.findOne({ user: userId })
  if (!driver) {
    throw new Error('Driver profile not found')
  }
  driver.location = locationData.location
  await driver.save()
  return driver
}

const getDriverEarnings = async (
  userId: string
): Promise<{
  totalCompletedRides: number
  totalEarnings: number
  rides: any[]
}> => {
  const driver = await Driver.findOne({ user: userId })
  if (!driver) {
    throw new Error('Driver profile not found')
  }
  const rides = await Ride.find({ driver: driver._id, status: 'completed' })
  const totalEarnings = rides.reduce((sum, ride) => sum + ride.fare, 0)
  return {
    totalCompletedRides: rides.length,
    totalEarnings,
    rides: rides.map((ride) => ({
      rideId: ride._id,
      fare: ride.fare,
      status: ride.status
    }))
  }
}

const getAllDrivers = async (): Promise<IDriver[]> => {
  const drivers = await Driver.find().populate('user', 'name email')
  return drivers
}

const approveOrRejectDriver = async (
  driverId: string,
  approvalStatus: IDriverApprovalStatus
) => {
  console.log(approvalStatus)
  const driver = await Driver.findById(driverId)
  if (!driver) {
    throw new Error('Driver not found')
  }
  driver.isApproved = approvalStatus
  await driver.save()
  return driver
}

export const DriverService = {
  createDriverProfile,
  getDriverProfile,
  updateDriverAvailability,
  updateDriverLocation,
  getDriverEarnings,
  getAllDrivers,
  approveOrRejectDriver
}
