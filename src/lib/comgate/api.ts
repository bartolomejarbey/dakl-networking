interface CreatePaymentParams {
  orderId: string
  amount: number // CZK whole number
  email: string
  label: string
  method?: 'ALL' | 'CARD_ALL' | 'BANK_ALL'
}

interface CreatePaymentResult {
  transId: string
  redirectUrl: string
}

export async function createComgatePayment(
  params: CreatePaymentParams
): Promise<CreatePaymentResult> {
  const body = new URLSearchParams({
    merchant: process.env.COMGATE_MERCHANT_ID!,
    secret: process.env.COMGATE_SECRET!,
    price: String(params.amount * 100),
    curr: 'CZK',
    label: params.label,
    refId: params.orderId,
    email: params.email,
    method: params.method || 'ALL',
    prepareOnly: 'true',
    country: 'CZ',
    lang: 'cs',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/comgate-webhook`,
  })

  const response = await fetch('https://payments.comgate.cz/v1.0/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  const responseText = await response.text()
  const result = new URLSearchParams(responseText)

  const code = result.get('code')
  if (code !== '0') {
    const message = result.get('message') || 'Unknown Comgate error'
    throw new Error(`Comgate payment creation failed: ${message} (code: ${code})`)
  }

  const transId = result.get('transId')
  const redirectUrl = result.get('redirect')

  if (!transId || !redirectUrl) {
    throw new Error('Comgate response missing transId or redirect URL')
  }

  return { transId, redirectUrl }
}
