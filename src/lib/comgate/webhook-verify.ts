export function verifyComgateWebhook(formData: FormData): boolean {
  const merchant = formData.get('merchant')
  return merchant === process.env.COMGATE_MERCHANT_ID
}
