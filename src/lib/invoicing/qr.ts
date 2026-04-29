import QRCode from 'qrcode'

const BASE_OPTIONS = {
  errorCorrectionLevel: 'M' as const,
  margin: 1,
  color: { dark: '#0F2926', light: '#F5EFE2' },
}

export async function spaydQrPng(spaydString: string, sizePx = 320): Promise<Buffer> {
  return QRCode.toBuffer(spaydString, { ...BASE_OPTIONS, width: sizePx })
}

export async function spaydQrDataUrl(spaydString: string, sizePx = 320): Promise<string> {
  return QRCode.toDataURL(spaydString, { ...BASE_OPTIONS, width: sizePx })
}

export async function spaydQrSvgString(spaydString: string, sizePx = 320): Promise<string> {
  return QRCode.toString(spaydString, { ...BASE_OPTIONS, width: sizePx, type: 'svg' })
}
