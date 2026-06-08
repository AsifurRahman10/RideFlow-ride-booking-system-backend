import catchAsync from '../../utils/catchAsync'
import { NextFunction, Request, Response } from 'express'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'
import { RideService } from './ride.service'

const getAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await RideService.getAllRides(
      req.query as Record<string, string>
    )
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Ride history retrieved successfully',
      data: users
    })
  }
)
const getRideDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ride = await RideService.getRideDetails(req.params.id as string)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Ride details retrieved successfully',
      data: ride
    })
  }
)

export const RideController = {
  getAllRides,
  getRideDetails
}
