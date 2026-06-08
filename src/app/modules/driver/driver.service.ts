import AppError from '../../utils/AppError'
import httpStatusCode from 'http-status-codes'
import { IRideStatus } from '../ride/ride.interface'
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
  const rides = await Ride.find({
    driver: driver._id,
    status: IRideStatus.COMPLETED
  })
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

const getRideRequests = async (userId: string): Promise<any[]> => {
  const driver = await Driver.findOne({ user: userId })
  if (!driver) {
    throw new Error('Driver profile not found')
  }
  const rides = await Ride.find({
    DriverID: driver._id,
    status: IRideStatus.REQUESTED
  }).populate('RiderID', 'name email')
  return rides
}
const getAllDrivers = async (): Promise<IDriver[]> => {
  const drivers = await Driver.find().populate('user', 'name email')
  return drivers
}

const approveOrRejectDriver = async (
  driverId: string,
  approvalStatus: IDriverApprovalStatus
) => {
  const driver = await Driver.findById(driverId)
  if (!driver) {
    throw new Error('Driver not found')
  }
  driver.isApproved = approvalStatus
  await driver.save()
  return driver
}

const updateRideStatus = async (
  rideId: string,
  driverId: string,
  status: IRideStatus
) => {
  const ride = await Ride.findById(rideId)
  if (!ride) {
    throw new Error('Ride not found')
  }
  const driver = await Driver.findOne({ user: driverId })
  if (!driver) {
    throw new Error('Driver not found')
  }

  if (String(ride.DriverID) !== String(driver._id)) {
    throw new Error('This ride is not assigned to you')
  }

  if (
    ride.status === IRideStatus.COMPLETED ||
    ride.status === IRideStatus.CANCELLED
  ) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'Ride is already finished and cannot be updated'
    )
  }

  const allowedStatuses =
    ride.status === IRideStatus.REQUESTED
      ? [IRideStatus.ACCEPTED, IRideStatus.CANCELLED]
      : [IRideStatus.COMPLETED, IRideStatus.CANCELLED]

  if (!allowedStatuses.includes(status)) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      `Ride status can only be updated to ${allowedStatuses.join(' or ')} from ${ride.status}`
    )
  }

  // Additional driver-level checks for accepting a ride
  if (status === IRideStatus.ACCEPTED) {
    if (driver.isApproved !== IDriverApprovalStatus.APPROVED) {
      throw new AppError(
        httpStatusCode.FORBIDDEN,
        'Driver must be approved by admin to accept rides'
      )
    }

    if (!driver.isOnline) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        'Driver must be online to accept rides'
      )
    }

    if (!driver.isAvailable) {
      throw new AppError(
        httpStatusCode.CONFLICT,
        'Driver is not available to accept another ride'
      )
    }

    // mark driver as unavailable when they accept
    driver.isAvailable = false
    await driver.save()
    ride.rideAcceptedAt = new Date()
  }

  if (status === IRideStatus.COMPLETED) {
    ride.rideCompletedAt = new Date()
    // free up driver
    driver.isAvailable = true
    await driver.save()
  }

  if (status === IRideStatus.CANCELLED) {
    ride.rideCancelledAt = new Date()
    // free up driver
    driver.isAvailable = true
    await driver.save()
  }

  ride.status = status

  await ride.save()

  return ride
}

const getRidesHistory = async (userId: string): Promise<any[]> => {
  const driver = await Driver.findOne({ user: userId })
  if (!driver) {
    throw new Error('Driver profile not found')
  }
  const rides = await Ride.find({
    DriverID: driver._id,
    status: {
      $in: [IRideStatus.ACCEPTED, IRideStatus.COMPLETED, IRideStatus.CANCELLED]
    }
  }).populate('RiderID', 'name email')
  return rides
}

export const DriverService = {
  createDriverProfile,
  getDriverProfile,
  updateDriverAvailability,
  updateDriverLocation,
  getDriverEarnings,
  getRideRequests,
  getAllDrivers,
  approveOrRejectDriver,
  updateRideStatus,
  getRidesHistory
}
