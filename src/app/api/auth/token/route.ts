import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const COOKIE_NAME = "auth_token"
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
}

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value || null
  return NextResponse.json({ data: token })
}

export async function POST(request: Request) {
  const body = await request.json()
  const token = body?.token as string | undefined
  if (!token) {
    return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 })
  }
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS)
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  return NextResponse.json({ success: true })
}
