/**
 * SPAYD ("Short Payment Descriptor") — Czech standard for QR payments.
 * Spec: https://qr-platba.cz/pro-vyvojare/specifikace-formatu/
 *
 * Example payload:
 * SPD*1.0*ACC:CZ6508000000192000145399*AM:2290.00*CC:CZK*X-VS:20260042*MSG:DAKL 04 NETWORKING
 *
 * Field reference:
 *   ACC      — IBAN (required)
 *   AM       — amount with two decimals
 *   CC       — currency (CZK)
 *   X-VS     — variable symbol (numeric, used as the order reference)
 *   X-KS     — constant symbol (optional)
 *   X-SS     — specific symbol (optional)
 *   MSG      — payment message, ASCII only, max 60 chars
 *   DT       — due date YYYYMMDD (optional)
 */

export interface SpaydInput {
  iban: string
  amountCzk: number
  variableSymbol: string
  message: string
  dueDate?: Date
}

const MSG_MAX_LENGTH = 60

const ASCII_REPLACEMENTS: Array<[RegExp, string]> = [
  [/[áä]/g, 'a'], [/[čć]/g, 'c'], [/[ď]/g, 'd'],
  [/[éě]/g, 'e'], [/[í]/g, 'i'], [/[ĺľ]/g, 'l'],
  [/[ňń]/g, 'n'], [/[óöô]/g, 'o'], [/[ŕř]/g, 'r'],
  [/[šś]/g, 's'], [/[ť]/g, 't'], [/[úůü]/g, 'u'],
  [/[ý]/g, 'y'], [/[žź]/g, 'z'],
  [/[ÁÄ]/g, 'A'], [/[ČĆ]/g, 'C'], [/[Ď]/g, 'D'],
  [/[ÉĚ]/g, 'E'], [/[Í]/g, 'I'], [/[ĹĽ]/g, 'L'],
  [/[ŇŃ]/g, 'N'], [/[ÓÖÔ]/g, 'O'], [/[ŔŘ]/g, 'R'],
  [/[ŠŚ]/g, 'S'], [/[Ť]/g, 'T'], [/[ÚŮÜ]/g, 'U'],
  [/[Ý]/g, 'Y'], [/[ŽŹ]/g, 'Z'],
]

function toAscii(input: string): string {
  let s = input
  for (const [pattern, replacement] of ASCII_REPLACEMENTS) {
    s = s.replace(pattern, replacement)
  }
  return s
}

function sanitizeMessage(input: string): string {
  return toAscii(input)
    .toUpperCase()
    .replace(/[*]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MSG_MAX_LENGTH)
}

function formatYyyymmdd(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

export function buildSpaydString(input: SpaydInput): string {
  if (!input.iban) {
    throw new Error('SPAYD: IBAN is required')
  }
  if (input.amountCzk <= 0) {
    throw new Error('SPAYD: amount must be positive')
  }
  if (!/^\d+$/.test(input.variableSymbol)) {
    throw new Error('SPAYD: variable symbol must be numeric')
  }

  const parts = [
    'SPD*1.0',
    `ACC:${input.iban.replace(/\s+/g, '')}`,
    `AM:${input.amountCzk.toFixed(2)}`,
    'CC:CZK',
    `X-VS:${input.variableSymbol}`,
    `MSG:${sanitizeMessage(input.message)}`,
  ]
  if (input.dueDate) {
    parts.push(`DT:${formatYyyymmdd(input.dueDate)}`)
  }
  return parts.join('*')
}

/**
 * Convert an order number like "CN-2026-0042" into a numeric variable symbol
 * acceptable to Czech banks. Strips the prefix + dashes, leaving only digits.
 */
export function variableSymbolFromOrderNumber(orderNumber: string): string {
  return orderNumber.replace(/\D/g, '')
}
