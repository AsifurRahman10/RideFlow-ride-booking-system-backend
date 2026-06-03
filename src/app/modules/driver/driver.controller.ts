import catchAsync from '../../utils/catchAsync'
import { NextFunction, Request, Response } from 'express'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'
import { DriverService } from './driver.service'

const createDriverProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await DriverService.createDriverProfile(
      req.user.userId as string,
      req.body
    )
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Driver profile created successfully',
      data: user
    })
  }
)
const getDriverProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await DriverService.getDriverProfile(req.user.userId as string)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Driver profile retrieved successfully',
      data: user
    })
  }
)
const updateDriverAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await DriverService.updateDriverAvailability(
      req.user.userId as string,
      req.body
    )
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Driver availability updated successfully',
      data: user
    })
  }
)

const updateDriverLocation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await DriverService.updateDriverLocation(
      req.user.userId as string,
      req.body
    )
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Driver location updated successfully',
      data: user
    })
  }
)

const getDriverEarnings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await DriverService.getDriverEarnings(
      req.user.userId as string
    )
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Driver earnings retrieved successfully',
      data: user
    })
  }
)
const getAllDrivers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await DriverService.getAllDrivers()
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'All drivers retrieved successfully',
      data: users
    })
  }
)

export const DriverController = {
  createDriverProfile,
  getDriverProfile,
  updateDriverAvailability,
  updateDriverLocation,
  getDriverEarnings,
  getAllDrivers
}
