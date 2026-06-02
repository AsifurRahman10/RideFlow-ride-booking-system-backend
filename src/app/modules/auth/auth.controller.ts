import catchAsync from '../../utils/catchAsync'
import { NextFunction, Request, Response } from 'express'
import { AuthService } from './auth.service'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'
import { sendCookie } from '../../utils/sendCookie'

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthService.registerUser(req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: 'User created successfully',
      data: user
    })
  }
)

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthService.loginUser(req.body)

    sendCookie(res, user)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User logged in successfully',
      data: user
    })
  }
)

const getLoggedInUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user)
    const user = await AuthService.getLoggedInUser(req.user)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User retrieved successfully',
      data: user
    })
  }
)

export const AuthController = {
  registerUser,
  loginUser,
  getLoggedInUser
}
