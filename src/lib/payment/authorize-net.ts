const API_LOGIN_ID = process.env.AUTHORIZE_NET_API_LOGIN_ID || ""
const TRANSACTION_KEY = process.env.AUTHORIZE_NET_TRANSACTION_KEY || ""
const IS_SANDBOX = process.env.AUTHORIZE_NET_SANDBOX !== "false"

const API_URL = IS_SANDBOX
  ? "https://apitest.authorize.net/xml/v1/request.api"
  : "https://api.authorize.net/xml/v1/request.api"

export interface PaymentRequest {
  cardNumber: string
  expirationMonth: string
  expirationYear: string
  cardCode: string
  amount: number
  firstName?: string
  lastName?: string
  address?: string
  city?: string
  state?: string
  zip?: string
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  authCode?: string
  message?: string
  errorCode?: string
  errorMessage?: string
}

function buildTransactionXml(req: PaymentRequest): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<createTransactionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
  <merchantAuthentication>
    <name>${API_LOGIN_ID}</name>
    <transactionKey>${TRANSACTION_KEY}</transactionKey>
  </merchantAuthentication>
  <transactionRequest>
    <transactionType>authCaptureTransaction</transactionType>
    <amount>${req.amount.toFixed(2)}</amount>
    <payment>
      <creditCard>
        <cardNumber>${req.cardNumber}</cardNumber>
        <expirationDate>${req.expirationYear}-${req.expirationMonth}</expirationDate>
        <cardCode>${req.cardCode}</cardCode>
      </creditCard>
    </payment>
    <billTo>
      <firstName>${req.firstName || ""}</firstName>
      <lastName>${req.lastName || ""}</lastName>
      <address>${req.address || ""}</address>
      <city>${req.city || ""}</city>
      <state>${req.state || ""}</state>
      <zip>${req.zip || ""}</zip>
    </billTo>
  </transactionRequest>
</createTransactionRequest>`
}

function parseResponse(xml: string): PaymentResponse {
  try {
    const resultCodeMatch = xml.match(/<resultCode>(\w+)<\/resultCode>/)
    const transIdMatch = xml.match(/<transId>(\w+)<\/transId>/)
    const authCodeMatch = xml.match(/<authCode>(\w+)<\/authCode>/)
    const codeMatch = xml.match(/<errorCode>(\w+)<\/errorCode>/)
    const textMatch = xml.match(/<errorText>(.+?)<\/errorText>/)
    const descMatch = xml.match(/<description>(.+?)<\/description>/)

    const success = resultCodeMatch?.[1] === "Ok"

    return {
      success,
      transactionId: transIdMatch?.[1],
      authCode: authCodeMatch?.[1],
      message: descMatch?.[1],
      errorCode: codeMatch?.[1],
      errorMessage: textMatch?.[1],
    }
  } catch {
    return { success: false, errorMessage: "Failed to parse payment response" }
  }
}

export async function processPayment(req: PaymentRequest): Promise<PaymentResponse> {
  if (!API_LOGIN_ID || !TRANSACTION_KEY) {
    return { success: false, errorMessage: "Payment gateway not configured" }
  }

  const body = buildTransactionXml(req)

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body,
    })

    const xml = await response.text()
    const result = parseResponse(xml)

    if (!result.success) {
      console.error("[Authorize.net] Payment failed:", result.errorMessage || result.message)
    }

    return result
  } catch (err) {
    console.error("[Authorize.net] Request error:", err)
    return { success: false, errorMessage: "Payment gateway request failed" }
  }
}
