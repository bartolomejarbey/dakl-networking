'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { updateIssuer } from './actions'
import type { IssuerSettings } from '@/types/database'
import { cn } from '@/lib/utils'

interface IssuerFormProps {
  issuerKey: 'issuer_payer' | 'issuer_nonpayer'
  initial: IssuerSettings
}

const labelClass = 'block font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 mb-2'
const inputClass =
  'w-full bg-transparent border-b border-cream/25 font-mono text-[13px] text-cream placeholder:text-cream/30 outline-none py-2 focus:border-orange transition-colors'

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-mono text-[10px] tracking-[0.22em] uppercase font-semibold px-5 py-3 border-2 border-orange bg-orange text-cream hover:bg-orange-dark disabled:opacity-50 transition-colors rounded-[1px]"
    >
      {pending ? 'Ukládám…' : 'Uložit'}
    </button>
  )
}

export function IssuerForm({ issuerKey, initial }: IssuerFormProps) {
  const [state, action] = useFormState<{ ok?: boolean; error?: string; message?: string }, FormData>(
    updateIssuer,
    {}
  )

  const title = issuerKey === 'issuer_payer' ? 'Plátce DPH' : 'Neplátce DPH'
  const subtitle = issuerKey === 'issuer_payer'
    ? 'Faktury pro klienty-plátce DPH (s 21 % DPH).'
    : 'Faktury pro klienty-neplátce (bez DPH, s odkazem na § 6).'

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="key" value={issuerKey} />
      <input type="hidden" name="is_vat_payer" value={String(issuerKey === 'issuer_payer')} />
      <input type="hidden" name="vat_rate" value={issuerKey === 'issuer_payer' ? '21' : '0'} />

      <div className="border-b border-cream/15 pb-4">
        <h2 className="font-serif italic text-[28px] text-cream leading-[1.1]">{title}</h2>
        <p className="mt-2 font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <label className="block md:col-span-2">
          <span className={labelClass}>Obchodní název</span>
          <input name="name" defaultValue={initial.name} required className={inputClass} placeholder="DaKl Networking s.r.o." />
        </label>
        <label className="block">
          <span className={labelClass}>IČO</span>
          <input name="ico" defaultValue={initial.ico} required className={inputClass} placeholder="12345678" inputMode="numeric" />
        </label>
        {issuerKey === 'issuer_payer' && (
          <label className="block">
            <span className={labelClass}>DIČ</span>
            <input name="dic" defaultValue={initial.dic ?? ''} required className={inputClass} placeholder="CZ12345678" />
          </label>
        )}
        <label className="block md:col-span-2">
          <span className={labelClass}>Ulice a č. p.</span>
          <input name="address_street" defaultValue={initial.address_street} required className={inputClass} placeholder="Náplavka 1" autoComplete="street-address" />
        </label>
        <label className="block">
          <span className={labelClass}>Město</span>
          <input name="address_city" defaultValue={initial.address_city} required className={inputClass} placeholder="Praha" autoComplete="address-level2" />
        </label>
        <label className="block">
          <span className={labelClass}>PSČ</span>
          <input name="address_zip" defaultValue={initial.address_zip} required className={inputClass} placeholder="110 00" autoComplete="postal-code" />
        </label>
        <label className="block">
          <span className={labelClass}>Země (ISO 2)</span>
          <input name="address_country" defaultValue={initial.address_country} required maxLength={2} className={inputClass} />
        </label>
      </div>

      <div className="border-t border-cream/15 pt-5">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-4">§ Banka</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <label className="block">
            <span className={labelClass}>Číslo účtu</span>
            <input name="bank_account" defaultValue={initial.bank_account} required className={inputClass} placeholder="123456789" />
          </label>
          <label className="block">
            <span className={labelClass}>Kód banky</span>
            <input name="bank_code" defaultValue={initial.bank_code} required pattern="\d{4}" className={inputClass} placeholder="0100" />
          </label>
          <label className="block md:col-span-2">
            <span className={labelClass}>IBAN</span>
            <input name="bank_iban" defaultValue={initial.bank_iban} required className={inputClass} placeholder="CZ65 0800 0000 1920 0014 5399" />
          </label>
        </div>
      </div>

      <div className="border-t border-cream/15 pt-5">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-4">§ Kontakt na faktuře</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <label className="block">
            <span className={labelClass}>E-mail</span>
            <input name="email" type="email" defaultValue={initial.email} className={inputClass} placeholder="fakturace@firma.cz" autoComplete="email" />
          </label>
          <label className="block">
            <span className={labelClass}>Telefon</span>
            <input name="phone" defaultValue={initial.phone} className={inputClass} placeholder="+420 …" autoComplete="tel" />
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <p
          className={cn(
            'font-mono text-[10px] tracking-[0.18em] uppercase transition-opacity',
            state?.error ? 'text-orange-dark' : state?.message ? 'text-orange' : 'opacity-0'
          )}
        >
          {state?.error || state?.message || '·'}
        </p>
        <SaveButton />
      </div>
    </form>
  )
}
