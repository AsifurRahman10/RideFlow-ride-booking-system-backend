import { Router } from 'express'
import validateRequest from '../../middleware/validateRequest'
import { UserValidation } from '../user/user.validation'
import checkAuth from '../../middleware/checkAuth'
import { UserRole } from '../user/user.interface'
import { DriverController } from './driver.controller'

const router = Router()

router.post(
  '/profile',
  checkAuth(UserRole.DRIVER),
  DriverController.createDriverProfile
)

export const DriverRoute = router
