import { processPayment } from "@/lib/payment/authorize-net"
import type { PaymentRequest } from "@/lib/payment/authorize-net"

export async function POST(request: Request) {
  try {
    const body: PaymentRequest = await request.json()

    if (!body.cardNumber || !body.expirationMonth || !body.expirationYear || !body.cardCode || !body.amount) {
      return Response.json(
        { success: false, errorMessage: "Missing required payment fields" },
        { status: 400 },
      )
    }

    const result = await processPayment(body)

    if (!result.success) {
      return Response.json(result, { status: 400 })
    }

    return Response.json(result)
  } catch (err) {
    console.error("[Authorize.net API] Error:", err)
    return Response.json(
      { success: false, errorMessage: "Internal server error" },
      { status: 500 },
    )
  }
}
