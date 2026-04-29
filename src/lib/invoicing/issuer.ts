import { createAdminClient } from '@/lib/supabase/admin'
import type { IssuerSettings } from '@/types/database'

export type IssuerKey = 'issuer_payer' | 'issuer_nonpayer'

export interface ResolvedIssuer extends IssuerSettings {
  key: IssuerKey
}

/**
 * Selects the issuer entity for an order based on the customer's VAT-payer
 * status:
 *
 *   - customer is a VAT payer (`true`)  → issue from `issuer_payer` (VAT-registered company, charges 21 % DPH)
 *   - customer is NOT a VAT payer       → issue from `issuer_nonpayer` (non-VAT company, no DPH)
 *
 * This is the standard Czech business pattern. A VAT-payer customer can
 * deduct DPH so selling them from the VAT entity is preferable; a non-VAT
 * customer would otherwise pay 21 % more for nothing.
 */
export async function getIssuerForOrder(customerIsVatPayer: boolean): Promise<ResolvedIssuer> {
  const key: IssuerKey = customerIsVatPayer ? 'issuer_payer' : 'issuer_nonpayer'
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single<{ value: IssuerSettings }>()
  if (error || !data) {
    throw new Error(`Issuer settings missing: ${key}`)
  }
  return { ...data.value, key }
}

export function isPlaceholderIssuer(issuer: IssuerSettings): boolean {
  return issuer.ico === '00000000' || issuer.name.includes('placeholder')
}
