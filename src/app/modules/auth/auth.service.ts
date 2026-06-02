import bcrypt from 'bcryptjs'
import AppError from '../../utils/AppError'
import { User } from '../user/user.modal'
import httpStatusCode from 'http-status-codes'
import { envVars } from '../../config/config'
import { IAuthProvider } from '../user/user.interface'

const registerUser = async (payload: any) => {
  const { email, password, ...rest } = payload
  const isUserExist = await User.findOne({ email: email })

  if (isUserExist) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'User already exist')
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUNDS)
  )

  const authProvider: IAuthProvider = {
    provider: 'credential',
    providerID: email as string
  }

  const user = await User.create({
    email,
    password: hashPassword,
    ...rest,
    auths: [authProvider]
  })

  const createdUser = user.toObject()

  const {
    password: userPassword,
    isActive,
    isDeleted,
    ...userData
  } = createdUser

  return userData
}

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload

  const isUserExist = await User.findOne({ email: email })

  if (!isUserExist) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }

  const isPasswordMatch = await bcrypt.compare(password, isUserExist.password)

  if (!isPasswordMatch) {
    throw new AppError(httpStatusCode.UNAUTHORIZED, 'Invalid credentials')
  }

  const user = isUserExist.toObject()

  const { password: userPassword, isActive, isDeleted, ...userData } = user

  return userData
}

export const AuthService = {
  registerUser,
  loginUser
}
