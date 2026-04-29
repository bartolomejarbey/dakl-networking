/**
 * Czech IBAN helpers.
 *
 * Czech account format: [prefix-]account_number/bank_code
 * Example: 19-2000145399/0800 → CZ65 0800 0000 1920 0014 5399
 *
 * Algorithm:
 * 1. BBAN = bank_code (4) + prefix (6, zero-padded) + account_number (10, zero-padded)
 * 2. Append CZ + 00 (placeholder check digits) and convert letters: C=12, Z=35
 * 3. Compute mod 97 of resulting numeric string, check digits = 98 - mod
 * 4. IBAN = CZ + check digits + BBAN
 */

function letterToNumber(ch: string): string {
  return String(ch.charCodeAt(0) - 'A'.charCodeAt(0) + 10)
}

function mod97(numeric: string): number {
  let remainder = 0
  for (const c of numeric) {
    remainder = (remainder * 10 + Number(c)) % 97
  }
  return remainder
}

export function buildCzechIban(
  bankCode: string,
  accountNumber: string,
  accountPrefix?: string
): string {
  const code = bankCode.replace(/\D/g, '').padStart(4, '0').slice(0, 4)
  const prefix = (accountPrefix ?? '').replace(/\D/g, '').padStart(6, '0').slice(-6)
  const main = accountNumber.replace(/\D/g, '').padStart(10, '0').slice(-10)
  const bban = `${code}${prefix}${main}`
  // Move country letters and 00 to the end, convert letters
  const rearranged = bban + letterToNumber('C') + letterToNumber('Z') + '00'
  const checkDigits = String(98 - mod97(rearranged)).padStart(2, '0')
  return `CZ${checkDigits}${bban}`
}

export function formatIbanForDisplay(iban: string): string {
  return iban.replace(/(.{4})/g, '$1 ').trim()
}
