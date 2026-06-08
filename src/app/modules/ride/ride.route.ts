import { Router } from 'express'
import checkAuth from '../../middleware/checkAuth'
import validateRequest from '../../middleware/validateRequest'
import { UserRole } from '../user/user.interface'
import { RideController } from './ride.controller'

const router = Router()

router.get(
  '/',
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  RideController.getAllRides
)
router.get(
  '/:id',
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  RideController.getRideDetails
)

export const RideRoute = router
