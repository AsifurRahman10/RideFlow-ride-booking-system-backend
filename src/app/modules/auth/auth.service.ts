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

  return user
}

export const AuthService = {
  registerUser
}
