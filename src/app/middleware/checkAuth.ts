import { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/jwt'
import { envVars } from '../config/config'
import { JwtPayload } from 'jsonwebtoken'
import httpStatusCode from 'http-status-codes'
import { IsActive } from '../modules/user/user.interface'
import AppError from '../utils/AppError'
import { User } from '../modules/user/user.modal'

const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization
      const cookieToken = req.cookies?.accessToken as string | undefined

      const rawToken = authHeader ?? cookieToken
      if (!rawToken) {
        throw new AppError(403, 'No token received')
      }

      const accessToken = rawToken.startsWith('Bearer ')
        ? rawToken.substring(7)
        : rawToken

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_SECRET
      ) as JwtPayload

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, 'You are not allowed to make that request')
      }

      const isUserExist = await User.findOne({
        email: verifiedToken.email
      })
      if (!isUserExist) {
        throw new AppError(httpStatusCode.FORBIDDEN, 'User does not exist')
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpStatusCode.FORBIDDEN, 'User is deleted')
      }

      if (!isUserExist.isVerified) {
        throw new AppError(httpStatusCode.FORBIDDEN, 'User is not verified')
      }
      if (isUserExist.blocked) {
        throw new AppError(httpStatusCode.FORBIDDEN, 'User is blocked')
      }
      if (
        isUserExist.isActive === IsActive.BLOCK ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(httpStatusCode.FORBIDDEN, 'User is not active')
      }
      req.user = verifiedToken
      next()
    } catch (error) {
      next(error)
    }
  }
export default checkAuth
