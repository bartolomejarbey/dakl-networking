'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm, FormProvider, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { checkoutSchema, stepSchemas, type CheckoutFormData } from '@/types/checkout'
import type { Event } from '@/types/database'
import { formatCZK, formatDateDot, cn } from '@/lib/utils'
import { Container } from '@/components/layout/Container'
import { GrainOverlay } from '@/components/ui/GrainOverlay'

const EASE = [0.22, 1, 0.36, 1] as const

interface CheckoutWizardProps {
  event: Event
  soldCount?: number
}

export interface StepProps {
  form: UseFormReturn<CheckoutFormData>
  event: Event
  onNext: () => void
  onBack: () => void
}

const STEP_LABELS = ['Vstupenky', 'Kontakt', 'Fakturace', 'Doplňky', 'Souhrn', 'Platba']

const STORAGE_KEY_PREFIX = 'dakl_checkout_'

const inputClass =
  'w-full bg-transparent border-b border-ink/30 font-mono text-[14px] text-ink placeholder:text-ink-soft/35 outline-none py-2.5 focus:border-orange transition-colors'
const labelClass =
  'block font-mono text-[10px] tracking-[0.24em] uppercase text-ink-soft/65 mb-2'
const errorClass = 'mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-orange-dark'

function StepIndicator({ currentStep }: { currentStep: number }) {
  const total = STEP_LABELS.length
  const progress = (currentStep / total) * 100
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between font-mono text-[10px] tracking-[0.24em] uppercase">
        <span className="text-orange">
          §&nbsp;Krok&nbsp;{String(currentStep).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
        </span>
        <span className="text-ink-soft/65">
          {STEP_LABELS[currentStep - 1]}
        </span>
      </div>
      <div className="relative h-px w-full bg-ink/15 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-orange"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </div>
      <ol className="hidden md:flex items-center justify-between font-mono text-[9px] tracking-[0.22em] uppercase text-ink-soft/45 pt-1">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1
          return (
            <li
              key={label}
              className={cn(
                'transition-colors duration-300',
                step === currentStep && 'text-orange',
                step < currentStep && 'text-ink/65'
              )}
            >
              {label}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function StepShell({
  number,
  total,
  title,
  subtitle,
  children,
}: {
  number: number
  total: number
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-7">
      <div>
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 mb-2 tabular-nums">
          §&nbsp;{String(number).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
        </p>
        <h2
          className="font-serif italic text-ink text-[clamp(28px,3.6vw,44px)] leading-[1.1] tracking-[-0.018em]"
          style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft/65">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}

function StepQuantity({ form, event }: StepProps) {
  const quantity = form.watch('quantity')

  return (
    <StepShell
      number={1}
      total={6}
      title="Kolik vstupenek?"
      subtitle={`Cena za osobu · ${formatCZK(event.price_czk)}`}
    >
      <div className="border-y border-ink/15 py-7">
        <div className="flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => form.setValue('quantity', Math.max(1, quantity - 1))}
            className="w-12 h-12 border border-ink/25 flex items-center justify-center text-ink hover:border-orange hover:text-orange transition-colors font-mono text-[18px]"
            aria-label="Méně"
          >
            −
          </button>
          <div className="flex-1 text-center">
            <span className="font-mono text-[clamp(56px,9vw,96px)] leading-none tabular-nums text-ink">
              {quantity}
            </span>
            <p className="mt-2 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55">
              {quantity === 1 ? 'osoba' : quantity < 5 ? 'osoby' : 'osob'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => form.setValue('quantity', Math.min(5, quantity + 1))}
            className="w-12 h-12 border border-ink/25 flex items-center justify-center text-ink hover:border-orange hover:text-orange transition-colors font-mono text-[18px]"
            aria-label="Více"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-baseline justify-between font-mono text-[12px] tracking-[0.18em] uppercase">
        <span className="text-ink-soft/65">Celkem</span>
        <span className="text-ink tabular-nums text-[20px]">
          {formatCZK(quantity * event.price_czk)}
        </span>
      </div>
    </StepShell>
  )
}

function StepContact({ form }: StepProps) {
  const { register, formState: { errors } } = form

  return (
    <StepShell number={2} total={6} title="Kontaktní údaje" subtitle="Pošleme na e-mail fakturu i potvrzení">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
        <label className="block">
          <span className={labelClass}>Jméno</span>
          <input {...register('firstName')} className={inputClass} placeholder="David" autoComplete="given-name" />
          {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
        </label>
        <label className="block">
          <span className={labelClass}>Příjmení</span>
          <input {...register('lastName')} className={inputClass} placeholder="Novák" autoComplete="family-name" />
          {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
        </label>
      </div>
      <label className="block">
        <span className={labelClass}>E-mail</span>
        <input {...register('email')} type="email" className={inputClass} placeholder="david@firma.cz" autoComplete="email" />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </label>
      <label className="block">
        <span className={labelClass}>Telefon — volitelné</span>
        <input {...register('phone')} type="tel" className={inputClass} placeholder="+420 777 123 456" autoComplete="tel" />
      </label>
    </StepShell>
  )
}

function StepBilling({ form }: StepProps) {
  const { register, watch, formState: { errors } } = form
  const billingType = watch('billingType')

  return (
    <StepShell number={3} total={6} title="Fakturace">
      <div className="grid grid-cols-2 gap-3">
        {(['person', 'company'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => form.setValue('billingType', value)}
            className={cn(
              'py-4 px-4 font-mono text-[11px] tracking-[0.22em] uppercase rounded-[1px] border-2 transition-colors',
              billingType === value
                ? 'border-orange bg-orange text-cream'
                : 'border-ink/25 text-ink-soft hover:border-ink hover:text-ink'
            )}
          >
            [&nbsp;{value === 'person' ? 'Fyzická osoba' : 'Firma'}&nbsp;]
          </button>
        ))}
      </div>

      {billingType === 'company' && (
        <div className="space-y-7 pt-2">
          <label className="block">
            <span className={labelClass}>Název firmy</span>
            <input {...register('companyName')} className={inputClass} placeholder="Bonum Negotium s.r.o." autoComplete="organization" />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
            <label className="block">
              <span className={labelClass}>IČO</span>
              <input {...register('ico')} className={inputClass} placeholder="12345678" inputMode="numeric" />
            </label>
            <label className="block">
              <span className={labelClass}>DIČ — volitelné</span>
              <input {...register('dic')} className={inputClass} placeholder="CZ12345678" />
            </label>
          </div>
          <label className="block">
            <span className={labelClass}>Ulice a č.&nbsp;p.</span>
            <input {...register('billingStreet')} className={inputClass} placeholder="Vodičkova 28" autoComplete="street-address" />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
            <label className="block">
              <span className={labelClass}>Město</span>
              <input {...register('billingCity')} className={inputClass} placeholder="Praha" autoComplete="address-level2" />
            </label>
            <label className="block">
              <span className={labelClass}>PSČ</span>
              <input {...register('billingZip')} className={inputClass} placeholder="110 00" autoComplete="postal-code" />
            </label>
          </div>
        </div>
      )}

      {errors.billingType && <p className={errorClass}>{errors.billingType.message}</p>}
    </StepShell>
  )
}

function StepExtras({ form }: StepProps) {
  const { register } = form

  return (
    <StepShell number={4} total={6} title="Doplňkové informace" subtitle="Nic z toho není povinné">
      <label className="block">
        <span className={labelClass}>Dietní omezení</span>
        <input {...register('dietaryRestrictions')} className={inputClass} placeholder="Vegetarián, bez lepku..." />
      </label>
      <label className="block">
        <span className={labelClass}>Jak ses o nás dozvěděl/a?</span>
        <input {...register('source')} className={inputClass} placeholder="Instagram, doporučení..." />
      </label>
      <label className="block">
        <span className={labelClass}>Poznámka</span>
        <textarea
          {...register('customerNote')}
          rows={3}
          className={cn(inputClass, 'resize-none font-sans text-[16px] py-2')}
          placeholder="Cokoli, co bychom měli vědět..."
        />
      </label>
    </StepShell>
  )
}

function StepReview({ form, event }: StepProps) {
  const { watch, register, formState: { errors } } = form
  const values = watch()

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Akce', value: event.name },
    { label: 'Datum', value: formatDateDot(event.starts_at) },
    { label: 'Místo', value: event.location_name ?? '—' },
    { label: 'Vstupenek', value: `${values.quantity}×` },
    { label: 'Kontakt', value: `${values.firstName} ${values.lastName}` },
    { label: 'E-mail', value: values.email },
  ]

  return (
    <StepShell number={5} total={6} title="Souhrn objednávky">
      <ul className="border-y border-ink/15 divide-y divide-ink/10">
        {rows.map((row) => (
          <li key={row.label} className="flex items-baseline justify-between gap-4 py-3.5">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/65 shrink-0">
              {row.label}
            </span>
            <span className="font-serif italic text-ink text-[16px] text-right">
              {row.value}
            </span>
          </li>
        ))}
        <li className="flex items-baseline justify-between gap-4 py-5 bg-ink/[0.03] -mx-4 px-4">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink">Celkem</span>
          <span className="font-mono text-ink text-[22px] tabular-nums">
            {formatCZK(values.quantity * event.price_czk)}
          </span>
        </li>
      </ul>

      <div className="space-y-4 pt-2">
        {[
          {
            field: 'agreedTerms' as const,
            label: (
              <>
                Souhlasím s{' '}
                <a href="/podminky" target="_blank" className="text-orange underline underline-offset-2">obchodními podmínkami</a>.
              </>
            ),
            error: errors.agreedTerms?.message,
          },
          {
            field: 'agreedGdpr' as const,
            label: (
              <>
                Souhlasím se{' '}
                <a href="/ochrana-osobnich-udaju" target="_blank" className="text-orange underline underline-offset-2">zpracováním osobních údajů</a>.
              </>
            ),
            error: errors.agreedGdpr?.message,
          },
          {
            field: 'agreedNewsletter' as const,
            label: <>Chci odebírat pozvánky na další akce.</>,
            error: undefined,
          },
        ].map((item) => (
          <label key={item.field} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register(item.field)}
              className="mt-1 w-4 h-4 rounded-[1px] border border-ink/30 accent-orange shrink-0"
            />
            <span className="font-mono text-[12px] leading-[1.6] text-ink-soft group-hover:text-ink transition-colors">
              {item.label}
            </span>
            {item.error && <p className={errorClass}>{item.error}</p>}
          </label>
        ))}
      </div>
    </StepShell>
  )
}

function StepPayment({ form }: StepProps) {
  const { watch } = form
  const paymentMethod = watch('paymentMethod')

  const options: {
    value: 'qr_comgate' | 'bank_transfer'
    title: string
    desc: string
  }[] = [
    {
      value: 'qr_comgate',
      title: 'Karta nebo QR — okamžitě',
      desc: 'Comgate · zpracováno během vteřiny.',
    },
    {
      value: 'bank_transfer',
      title: 'Bankovní převod',
      desc: 'Proforma na e-mail · splatnost 3 dny.',
    },
  ]

  return (
    <StepShell number={6} total={6} title="Způsob platby">
      <ul className="space-y-3">
        {options.map((opt) => {
          const active = paymentMethod === opt.value
          return (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => form.setValue('paymentMethod', opt.value)}
                className={cn(
                  'w-full text-left px-5 py-5 rounded-[1px] border-2 transition-colors flex items-baseline justify-between gap-4',
                  active
                    ? 'border-orange bg-orange/5'
                    : 'border-ink/20 hover:border-ink/45'
                )}
              >
                <div>
                  <p className="font-serif italic text-ink text-[20px] lg:text-[22px] leading-[1.2]">
                    {opt.title}
                  </p>
                  <p className="mt-2 font-mono text-[11px] tracking-[0.16em] uppercase text-ink-soft/65">
                    {opt.desc}
                  </p>
                </div>
                <span
                  aria-hidden
                  className={cn(
                    'shrink-0 w-4 h-4 rounded-full border-2 transition-colors',
                    active ? 'border-orange bg-orange' : 'border-ink/35'
                  )}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </StepShell>
  )
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
}

export function CheckoutWizard({ event, soldCount }: CheckoutWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const storageKey = `${STORAGE_KEY_PREFIX}${event.slug}`

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      quantity: 1,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      billingType: 'person',
      companyName: '',
      ico: '',
      dic: '',
      billingStreet: '',
      billingCity: '',
      billingZip: '',
      dietaryRestrictions: '',
      source: '',
      customerNote: '',
      agreedTerms: undefined as unknown as true,
      agreedGdpr: undefined as unknown as true,
      agreedNewsletter: false,
      paymentMethod: 'qr_comgate',
    },
    mode: 'onTouched',
  })

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        Object.entries(parsed).forEach(([key, value]) => {
          form.setValue(key as keyof CheckoutFormData, value as never)
        })
      }
    } catch {
      // Ignore parse errors
    }
  }, [storageKey, form])

  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(values))
      } catch {
        // Ignore storage errors
      }
    })
    return () => subscription.unsubscribe()
  }, [form, storageKey])

  const validateCurrentStep = useCallback(async () => {
    const schema = stepSchemas[currentStep as keyof typeof stepSchemas]
    const values = form.getValues()
    const result = schema.safeParse(values)

    if (!result.success) {
      const fieldNames = Object.keys(schema.shape) as (keyof CheckoutFormData)[]
      for (const field of fieldNames) {
        await form.trigger(field)
      }
      return false
    }
    return true
  }, [currentStep, form])

  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep()
    if (isValid) {
      setDirection(1)
      setCurrentStep((prev) => Math.min(prev + 1, 6))
    }
  }, [validateCurrentStep])

  const handleBack = useCallback(() => {
    setDirection(-1)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }, [])

  const handleSubmit = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const values = form.getValues()
      const response = await fetch('/api/checkout/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          eventId: event.id,
          eventSlug: event.slug,
          unitPriceCzk: event.price_czk,
          totalCzk: values.quantity * event.price_czk,
        }),
      })

      if (!response.ok) {
        throw new Error('Checkout failed')
      }

      const data = await response.json()

      sessionStorage.removeItem(storageKey)

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setSubmitError('Něco se nepovedlo. Zkus to prosím znovu.')
    } finally {
      setIsSubmitting(false)
    }
  }, [form, event, storageKey])

  const quantity = form.watch('quantity')
  const total = quantity * event.price_czk

  const stepProps: StepProps = {
    form,
    event,
    onNext: handleNext,
    onBack: handleBack,
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepQuantity {...stepProps} />
      case 2: return <StepContact {...stepProps} />
      case 3: return <StepBilling {...stepProps} />
      case 4: return <StepExtras {...stepProps} />
      case 5: return <StepReview {...stepProps} />
      case 6: return <StepPayment {...stepProps} />
      default: return null
    }
  }

  return (
    <FormProvider {...form}>
      <section
        data-folio="P1"
        data-folio-label="Přihláška"
        className="relative bg-cream text-ink min-h-screen pt-32 lg:pt-40 pb-32 grain grain-light"
      >
        <Container>
          {/* Folio header */}
          <div className="max-w-[720px] mx-auto mb-10 lg:mb-14">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
                §&nbsp;Přihláška — Vydání 04
              </p>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55">
                {event.name} · {formatDateDot(event.starts_at)}
              </p>
            </div>
            <h1
              className="mt-6 font-serif italic text-ink leading-[0.96] tracking-[-0.022em] text-[clamp(40px,5.5vw,72px)]"
              style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
            >
              Vyplň přihlášku.
            </h1>
          </div>

          {/* Subscription card */}
          <div className="max-w-[720px] mx-auto">
            <div aria-hidden className="perforation-top h-1 w-full" />
            <div className="bg-cream border-x border-b border-ink/15 shadow-print">
              {/* Card header — step indicator */}
              <div className="px-7 lg:px-10 pt-8 pb-6 border-b border-ink/15">
                <StepIndicator currentStep={currentStep} />
              </div>

              {/* Step content */}
              <div className="relative overflow-hidden min-h-[360px] px-7 lg:px-10 py-9">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.32, ease: EASE }}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer navigation */}
              <div className="px-7 lg:px-10 py-6 border-t border-ink/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-ink/[0.02]">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-ink transition-colors"
                  >
                    <span aria-hidden className="transition-transform duration-300 ease-editorial group-hover:-translate-x-1">&larr;</span>
                    Zpět
                  </button>
                ) : (
                  <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft/45">
                    {formatCZK(total)} celkem
                  </span>
                )}

                {submitError && (
                  <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-orange-dark">
                    {submitError}
                  </p>
                )}

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="group inline-flex items-center justify-center gap-3 bg-orange hover:bg-orange-dark text-cream font-mono text-[11px] tracking-[0.22em] uppercase font-semibold px-6 py-3.5 rounded-[1px] border-2 border-orange transition-colors duration-300"
                  >
                    Pokračovat
                    <span aria-hidden className="transition-transform duration-300 ease-editorial group-hover:translate-x-1">&rarr;</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="group inline-flex items-center justify-center gap-3 bg-orange hover:bg-orange-dark disabled:opacity-50 text-cream font-mono text-[11px] tracking-[0.22em] uppercase font-semibold px-6 py-3.5 rounded-[1px] border-2 border-orange transition-colors duration-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Zpracovávám…' : `Zaplatit ${formatCZK(total)}`}
                    {!isSubmitting && (
                      <span aria-hidden className="transition-transform duration-300 ease-editorial group-hover:translate-x-1">&rarr;</span>
                    )}
                  </button>
                )}
              </div>
            </div>
            <div aria-hidden className="perforation-bottom h-1 w-full" />
          </div>

          <p className="max-w-[720px] mx-auto mt-8 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 text-center">
            Faktura na firmu automaticky · Platba okamžitě nebo převodem
          </p>
        </Container>
      </section>
    </FormProvider>
  )
}
