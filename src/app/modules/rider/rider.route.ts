import { Router } from 'express'
import checkAuth from '../../middleware/checkAuth'
import validateRequest from '../../middleware/validateRequest'
import { UserRole } from '../user/user.interface'
import { RiderController } from './rider.controller'
import { RiderValidation } from './rider.validation'

const router = Router()

router.post(
  '/request',
  checkAuth(UserRole.RIDER),
  validateRequest(RiderValidation.requestRideSchema),
  RiderController.requestRide
)

router.patch(
  '/cancel/:rideId',
  checkAuth(UserRole.RIDER),
  RiderController.cancelRide
)

router.get(
  '/history',
  checkAuth(UserRole.RIDER),
  RiderController.getRideHistory
)

export const RiderRoute = router
