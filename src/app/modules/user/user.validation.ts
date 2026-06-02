import z from 'zod'
import { IsActive, UserRole } from './user.interface'

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),

  email: z.string().email('Invalid email format'),

  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d).{8,}$/,
      'Password must be at least 8 characters and include one uppercase letter and one number'
    )
    .optional(),

  phone: z.string().optional(),

  address: z.string().optional(),
  role: z.union([z.literal(UserRole.DRIVER), z.literal(UserRole.RIDER)])
})

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),

  email: z.string().email('Invalid email format').optional(),

  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d).{8,}$/,
      'Password must be at least 8 characters and include one uppercase letter and one number'
    )
    .optional(),

  phone: z.string().optional(),

  address: z.string().optional(),
  role: z
    .union([z.literal(UserRole.DRIVER), z.literal(UserRole.RIDER)])
    .optional(),
  status: z
    .union([
      z.literal(IsActive.ACTIVE),
      z.literal(IsActive.INACTIVE),
      z.literal(IsActive.BLOCK)
    ])
    .optional()
})

export const UserValidation = {
  createUserSchema,
  updateUserSchema
}
