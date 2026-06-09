import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string().min(6, "Confirm your password"),
  role: z.enum(["customer", "vendor", "nutritionist"]).default("customer"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email is required"),
})

export const resetPasswordSchema = z.object({
  email: z.string().email("Valid email is required"),
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string().min(6, "Confirm your password"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
})

export const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Valid phone number is required"),
  address: z.string().min(5, "Full address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(3, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  notes: z.string().optional(),
})

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
})

export const healthProfileSchema = z.object({
  age: z.coerce.number().min(1, "Age is required").max(150).optional(),
  weight: z.coerce.number().min(1).max(500).optional(),
  height: z.coerce.number().min(1).max(300).optional(),
  goals: z.string().optional(),
  dietary_type: z.string().optional(),
  activity_level: z.string().optional(),
  medical_conditions: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type HealthProfileInput = z.infer<typeof healthProfileSchema>
