import catchAsync from '../../utils/catchAsync'
import { NextFunction, Request, Response } from 'express'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'
import { AuthService } from '../auth/auth.service'
import { UserService } from './user.service'

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthService.getLoggedInUser(req.user)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User retrieved successfully',
      data: user
    })
  }
)
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.getAllUsers()
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Users retrieved successfully',
      data: users
    })
  }
)

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const user = await UserService.updateUser(id as string, req.body)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User updated successfully',
      data: user
    })
  }
)
export const UserController = {
  getMyProfile,
  getAllUsers,
  updateUser
}
