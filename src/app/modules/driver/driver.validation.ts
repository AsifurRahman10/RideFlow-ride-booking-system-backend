import z from 'zod'

export const locationSchema = z.object({
  type: z.literal('Point').default('Point'),
  coordinates: z.tuple([z.number(), z.number()])
})

export const createDriverProfileSchema = z.object({
  vehicleInfo: z.string().min(1, 'Vehicle information is required'),
  // isApproved: z.boolean().optional().default(false),
  isOnline: z.boolean().optional().default(false),
  location: locationSchema.optional()
})

export const updateDriverAvailabilitySchema = z.object({
  isOnline: z.boolean()
})

export const updateDriverLocationSchema = z.object({
  location: locationSchema
})

export const DriverValidation = {
  createDriverProfileSchema,
  updateDriverAvailabilitySchema,
  updateDriverLocationSchema
}
