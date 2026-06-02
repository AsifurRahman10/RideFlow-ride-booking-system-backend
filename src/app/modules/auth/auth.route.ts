import { Router } from 'express'
import { AuthController } from './auth.controller'
import validateRequest from '../../middleware/validateRequest'
import { UserValidation } from '../user/user.validation'

const router = Router()

router.post(
  '/register',
  validateRequest(UserValidation.createUserSchema),
  AuthController.registerUser
)

export const AuthRoute = router
