import { Router } from 'express'
import { AuthController } from './auth.controller'
import validateRequest from '../../middleware/validateRequest'
import { UserValidation } from '../user/user.validation'
import checkAuth from '../../middleware/checkAuth'
import { UserRole } from '../user/user.interface'

const router = Router()

router.post(
  '/register',
  validateRequest(UserValidation.createUserSchema),
  AuthController.registerUser
)
router.post('/login', AuthController.loginUser)
router.get(
  '/me',
  checkAuth(...Object.values(UserRole)),
  AuthController.getLoggedInUser
)

export const AuthRoute = router
