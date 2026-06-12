import { describe, it, expect } from "vitest"
import { loginSchema, registerSchema } from "@/lib/validations"

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "password123" })
    expect(result.success).toBe(true)
  })

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({ email: "notanemail", password: "password123" })
    expect(result.success).toBe(false)
  })

  it("rejects short password", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "12345" })
    expect(result.success).toBe(false)
  })

  it("rejects missing fields", () => {
    const result = loginSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe("registerSchema", () => {
  it("accepts valid registration", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      password_confirmation: "password123",
    })
    expect(result.success).toBe(true)
  })

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      password_confirmation: "different",
    })
    expect(result.success).toBe(false)
  })

  it("rejects short name", () => {
    const result = registerSchema.safeParse({
      name: "J",
      email: "john@example.com",
      password: "password123",
      password_confirmation: "password123",
    })
    expect(result.success).toBe(false)
  })

  it("defaults role to customer", () => {
    const result = registerSchema.parse({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      password_confirmation: "password123",
    })
    expect(result.role).toBe("customer")
  })
})
