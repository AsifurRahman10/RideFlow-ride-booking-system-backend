import catchAsync from '../../utils/catchAsync'
import { NextFunction, Request, Response } from 'express'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'
import { RiderService } from './rider.service'

const requestRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await RiderService.requestRide(
      req.user.userId as string,
      req.body
    )
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Ride requested successfully',
      data: users
    })
  }
)
const cancelRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await RiderService.cancelRide(
      req.user.userId as string,
      req.params.rideId as string
    )
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Ride cancelled successfully',
      data: users
    })
  }
)
const getRideHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await RiderService.getRideHistory(req.user.userId as string)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Ride history retrieved successfully',
      data: users
    })
  }
)

export const RiderController = {
  requestRide,
  cancelRide,
  getRideHistory
}
