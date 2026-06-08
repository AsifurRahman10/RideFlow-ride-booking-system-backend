import { Router } from 'express'
import checkAuth from '../../middleware/checkAuth'
import validateRequest from '../../middleware/validateRequest'
import { UserRole } from '../user/user.interface'
import { DriverController } from './driver.controller'
import { DriverValidation } from './driver.validation'

const router = Router()

router.post(
  '/profile',
  checkAuth(UserRole.DRIVER),
  validateRequest(DriverValidation.createDriverProfileSchema),
  DriverController.createDriverProfile
)

router.get(
  '/profile',
  checkAuth(UserRole.DRIVER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DriverController.getDriverProfile
)
router.get(
  '/earnings',
  checkAuth(UserRole.DRIVER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DriverController.getDriverEarnings
)
router.patch(
  '/availability',
  checkAuth(UserRole.DRIVER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(DriverValidation.updateDriverAvailabilitySchema),
  DriverController.updateDriverAvailability
)
router.patch(
  '/location',
  checkAuth(UserRole.DRIVER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(DriverValidation.updateDriverLocationSchema),
  DriverController.updateDriverLocation
)

router.get(
  '/request',
  checkAuth(UserRole.DRIVER),
  DriverController.getRideRequests
)
router.get(
  '/rides-history',
  checkAuth(UserRole.DRIVER),
  DriverController.getRidesHistory
)

router.patch(
  '/status/:id',
  checkAuth(UserRole.DRIVER),
  validateRequest(DriverValidation.updateRideStatusSchema),
  DriverController.updateRideStatus
)

// admin route
router.get(
  '/',
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DriverController.getAllDrivers
)
router.patch(
  '/status/:id',
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DriverController.approveOrRejectDriver
)

export const DriverRoute = router
