import { Router } from 'express'
import checkAuth from '../../middleware/checkAuth'
import { UserRole } from '../user/user.interface'
import { DriverController } from './driver.controller'

const router = Router()

router.post(
  '/profile',
  checkAuth(UserRole.DRIVER),
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
  DriverController.updateDriverAvailability
)
router.patch(
  '/location',
  checkAuth(UserRole.DRIVER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DriverController.updateDriverLocation
)

// admin route
router.get(
  '/',
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DriverController.getAllDrivers
)

export const DriverRoute = router
