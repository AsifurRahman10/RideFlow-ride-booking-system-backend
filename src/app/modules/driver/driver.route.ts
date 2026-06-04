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

export const DriverRoute = router
