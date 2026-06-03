import z from 'zod'

export const createDriverProfileSchema = z.object({
  vehicleInfo: z.string().min(1, 'Vehicle information is required'),
  isApproved: z.boolean().default(false),
  isOnline: z.boolean().default(false),
  location: z.string().optional()
})
