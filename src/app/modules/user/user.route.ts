import { Router } from 'express'
import validateRequest from '../../middleware/validateRequest'
import { UserValidation } from '../user/user.validation'
import checkAuth from '../../middleware/checkAuth'
import { UserRole } from '../user/user.interface'
import { UserController } from './user.controller'

const router = Router()

router.get(
  '/me',
  checkAuth(...Object.values(UserRole)),
  UserController.getMyProfile
)
router.get(
  '/get-all-users',
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.getAllUsers
)
router.patch(
  '/:id',
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.updateUser
)

export const UserRoute = router
