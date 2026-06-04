import z from 'zod'
import { locationSchema } from '../driver/driver.validation'

export const requestRideSchema = z
  .object({
    pickupLocation: locationSchema.optional(),
    pickupAddress: z.string().trim().optional(),

    destinationLocation: locationSchema.optional(),
    destinationAddress: z.string().trim().optional()
  })
  .refine((data) => !!(data.pickupLocation || data.pickupAddress), {
    message: 'Pickup location or pickup address is required',
    path: ['pickupLocation']
  })
  .refine((data) => !!(data.destinationLocation || data.destinationAddress), {
    message: 'Destination location or destination address is required',
    path: ['destinationLocation']
  })

export const RiderValidation = {
  requestRideSchema
}
