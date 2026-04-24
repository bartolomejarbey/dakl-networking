'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm, FormProvider, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { checkoutSchema, stepSchemas, type CheckoutFormData } from '@/types/checkout'
import type { Event } from '@/types/database'
import { formatCZK, formatDateDot } from '@/lib/utils'

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

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {STEP_LABELS.map((label, index) => {
        const step = index + 1
        const isActive = step === currentStep
        const isCompleted = step < currentStep

        return (
          <div key={step} className="flex flex-col items-center relative flex-1">
            {/* Connector line */}
            {index > 0 && (
              <div
                className={`absolute top-3 right-1/2 w-full h-[2px] -translate-y-1/2 ${
                  step <= currentStep ? 'bg-forest' : 'bg-ink/10'
                }`}
              />
            )}
            {/* Dot */}
            <div
              className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-medium ${
                isActive
                  ? 'bg-orange text-cream'
                  : isCompleted
                  ? 'bg-forest text-cream'
                  : 'bg-ink/10 text-ink/40'
              }`}
            >
              {isCompleted ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                step
              )}
            </div>
            {/* Label */}
            <span
              className={`mt-1.5 text-[10px] font-mono tracking-wider uppercase ${
                isActive ? 'text-orange' : isCompleted ? 'text-forest' : 'text-ink/30'
              }`}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function StepQuantity({ form, event }: StepProps) {
  const quantity = form.watch('quantity')

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-ink">Kolik vstupenek?</h2>
      <p className="text-sm text-ink-soft">
        Cena za osobu: {formatCZK(event.price_czk)}
      </p>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => form.setValue('quantity', Math.max(1, quantity - 1))}
          className="w-10 h-10 rounded-full border border-ink/20 flex items-center justify-center text-ink hover:border-ink transition-colors"
        >
          -
        </button>
        <span className="font-mono text-2xl text-ink w-8 text-center">{quantity}</span>
        <button
          type="button"
          onClick={() => form.setValue('quantity', Math.min(5, quantity + 1))}
          className="w-10 h-10 rounded-full border border-ink/20 flex items-center justify-center text-ink hover:border-ink transition-colors"
        >
          +
        </button>
      </div>

      <div className="pt-4 border-t border-ink/10">
        <div className="flex justify-between font-mono text-sm">
          <span className="text-ink-soft">Celkem</span>
          <span className="text-ink font-medium">{formatCZK(quantity * event.price_czk)}</span>
        </div>
      </div>
    </div>
  )
}

function StepContact({ form }: StepProps) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-5">
      <h2 className="font-serif text-2xl text-ink">Kontaktní údaje</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft mb-1.5">Jméno</label>
          <input
            {...register('firstName')}
            className="w-full px-3 py-3.5 bg-cream border border-ink/15 rounded-[2px] text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
            placeholder="David"
          />
          {errors.firstName && <p className="text-[11px] text-orange mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft mb-1.5">Příjmení</label>
          <input
            {...register('lastName')}
            className="w-full px-3 py-3.5 bg-cream border border-ink/15 rounded-[2px] text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
            placeholder="Novák"
          />
          {errors.lastName && <p className="text-[11px] text-orange mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft mb-1.5">Email</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-3.5 bg-cream border border-ink/15 rounded-[2px] text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
          placeholder="david@email.cz"
        />
        {errors.email && <p className="text-[11px] text-orange mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft mb-1.5">Telefon (nepovinné)</label>
        <input
          {...register('phone')}
          type="tel"
          className="w-full px-3 py-3.5 bg-cream border border-ink/15 rounded-[2px] text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
          placeholder="+420 777 123 456"
        />
      </div>
    </div>
  )
}

function StepBilling({ form }: StepProps) {
  const { register, watch, formState: { errors } } = form
  const billingType = watch('billingType')

  return (
    <div className="space-y-5">
      <h2 className="font-serif text-2xl text-ink">Fakturační údaje</h2>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => form.setValue('billingType', 'person')}
          className={`flex-1 py-3.5 px-4 text-sm font-mono rounded-[2px] border transition-colors ${
            billingType === 'person'
              ? 'border-forest bg-forest/5 text-forest'
              : 'border-ink/15 text-ink-soft hover:border-ink/30'
          }`}
        >
          Fyzická osoba
        </button>
        <button
          type="button"
          onClick={() => form.setValue('billingType', 'company')}
          className={`flex-1 py-3.5 px-4 text-sm font-mono rounded-[2px] border transition-colors ${
            billingType === 'company'
              ? 'border-forest bg-forest/5 text-forest'
              : 'border-ink/15 text-ink-soft hover:border-ink/30'
          }`}
        >
          Firma
        </button>
      </div>

      {billingType === 'company' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft mb-1.5">Název firmy</label>
            <input
              {...register('companyName')}
              className="w-full px-3 py-3.5 bg-cream border border-ink/15 rounded-[2px] text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft mb-1.5">IČO</label>
              <input
                {...register('ico')}
                className="w-full px-3 py-3.5 bg-cream border border-ink/15 rounded-[2px] text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft mb-1.5">DIČ</label>
              <input
                {...register('dic')}
                className="w-full px-3 py-3.5 bg-cream border border-ink/15 rounded-[2px] text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft mb-1.5">Ulice</label>
            <input
              {...register('billingStreet')}
              className="w-full px-3 py-3.5 bg-cream border border-ink/15 rounded-[2px] text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft mb-1.5">Město</label>
              <input
                {...register('billingCity')}
                className="w-full px-3 py-3.5 bg-cream border border-ink/15 rounded-[2px] text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft mb-1.5">PSČ</label>
              <input
                {...register('billingZip')}
                className="w-full px-3 py-3.5 bg-cream border border-ink/15 rounded-[2px] text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {errors.billingType && <p className="text-[11px] text-orange mt-1">{errors.billingType.message}</p>}
    </div>
  )
}

function StepExtras({ form }: StepProps) {
  const { register } = form

  return (
    <div className="space-y-5">
      <h2 className="font-serif text-2xl text-ink">Doplňkové informace</h2>
      <p className="text-sm text-ink-soft">Nic z toho není povinné.</p>

      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft mb-1.5">Dietní omezení</label>
        <input
          {...register('dietaryRestrictions')}
          className="w-full px-3 py-3.5 bg-cream border border-ink/15 rounded-[2px] text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
          placeholder="Vegetarián, bez lepku..."
        />
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft mb-1.5">Jak ses o nás dozvěděl/a?</label>
        <input
          {...register('source')}
          className="w-full px-3 py-3.5 bg-cream border border-ink/15 rounded-[2px] text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
          placeholder="Instagram, doporučení..."
        />
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft mb-1.5">Poznámka</label>
        <textarea
          {...register('customerNote')}
          rows={3}
          className="w-full px-3 py-3.5 bg-cream border border-ink/15 rounded-[2px] text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors resize-none"
          placeholder="Cokoliv, co bychom měli vědět..."
        />
      </div>
    </div>
  )
}

function StepReview({ form, event }: StepProps) {
  const { watch, register, formState: { errors } } = form
  const values = watch()

  return (
    <div className="space-y-5">
      <h2 className="font-serif text-2xl text-ink">Souhrn objednávky</h2>

      <div className="space-y-3 p-4 bg-ink/[0.02] border border-ink/10 rounded-[2px]">
        <div className="flex justify-between text-sm">
          <span className="text-ink-soft">Akce</span>
          <span className="text-ink font-medium">{event.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-soft">Datum</span>
          <span className="text-ink">{formatDateDot(event.starts_at)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-soft">Počet vstupenek</span>
          <span className="text-ink">{values.quantity}x</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-soft">Kontakt</span>
          <span className="text-ink">{values.firstName} {values.lastName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-soft">Email</span>
          <span className="text-ink">{values.email}</span>
        </div>
        <div className="border-t border-ink/10 pt-3 flex justify-between font-mono text-sm">
          <span className="text-ink-soft">Celkem</span>
          <span className="text-ink font-medium">{formatCZK(values.quantity * event.price_czk)}</span>
        </div>
      </div>

      {/* Consents */}
      <div className="space-y-3 pt-2">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            {...register('agreedTerms')}
            className="mt-0.5 w-4 h-4 rounded-[2px] border border-ink/20 accent-forest"
          />
          <span className="text-sm text-ink-soft">
            Souhlasím s{' '}
            <a href="/podminky" className="text-forest underline">obchodními podmínkami</a>
          </span>
        </label>
        {errors.agreedTerms && <p className="text-[11px] text-orange ml-6">{errors.agreedTerms.message}</p>}

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            {...register('agreedGdpr')}
            className="mt-0.5 w-4 h-4 rounded-[2px] border border-ink/20 accent-forest"
          />
          <span className="text-sm text-ink-soft">
            Souhlasím se{' '}
            <a href="/ochrana-osobnich-udaju" className="text-forest underline">zpracováním osobních údajů</a>
          </span>
        </label>
        {errors.agreedGdpr && <p className="text-[11px] text-orange ml-6">{errors.agreedGdpr.message}</p>}

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            {...register('agreedNewsletter')}
            className="mt-0.5 w-4 h-4 rounded-[2px] border border-ink/20 accent-forest"
          />
          <span className="text-sm text-ink-soft">
            Chci odebírat novinky o dalších akcích
          </span>
        </label>
      </div>
    </div>
  )
}

function StepPayment({ form }: StepProps) {
  const { watch } = form
  const paymentMethod = watch('paymentMethod')

  return (
    <div className="space-y-5">
      <h2 className="font-serif text-2xl text-ink">Způsob platby</h2>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => form.setValue('paymentMethod', 'qr_comgate')}
          className={`w-full p-4 text-left border rounded-[2px] transition-colors ${
            paymentMethod === 'qr_comgate'
              ? 'border-forest bg-forest/5'
              : 'border-ink/15 hover:border-ink/30'
          }`}
        >
          <div className="font-mono text-sm text-ink font-medium">Platba kartou / QR</div>
          <div className="text-[12px] text-ink-soft mt-0.5">Okamžité zpracování přes Comgate</div>
        </button>

        <button
          type="button"
          onClick={() => form.setValue('paymentMethod', 'bank_transfer')}
          className={`w-full p-4 text-left border rounded-[2px] transition-colors ${
            paymentMethod === 'bank_transfer'
              ? 'border-forest bg-forest/5'
              : 'border-ink/15 hover:border-ink/30'
          }`}
        >
          <div className="font-mono text-sm text-ink font-medium">Bankovní převod</div>
          <div className="text-[12px] text-ink-soft mt-0.5">Proforma faktura na email, splatnost 3 dny</div>
        </button>
      </div>
    </div>
  )
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
}

export function CheckoutWizard({ event, soldCount }: CheckoutWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // Restore from sessionStorage on mount
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

  // Persist to sessionStorage on changes
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
      // Trigger validation on the relevant fields
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

      // Clear sessionStorage on success
      sessionStorage.removeItem(storageKey)

      // Redirect to payment or confirmation
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      }
    } catch (error) {
      console.error('Checkout error:', error)
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
      case 1:
        return <StepQuantity {...stepProps} />
      case 2:
        return <StepContact {...stepProps} />
      case 3:
        return <StepBilling {...stepProps} />
      case 4:
        return <StepExtras {...stepProps} />
      case 5:
        return <StepReview {...stepProps} />
      case 6:
        return <StepPayment {...stepProps} />
      default:
        return null
    }
  }

  return (
    <FormProvider {...form}>
      <div className="min-h-screen bg-cream">
        <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
          {/* Header */}
          <div className="mb-6">
            <p className="font-mono text-[11px] tracking-wider uppercase text-ink-soft">
              {event.name} / {formatDateDot(event.starts_at)}
            </p>
          </div>

          {/* Progress */}
          <StepIndicator currentStep={currentStep} />

          {/* Step Content */}
          <div className="relative overflow-hidden min-h-[320px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-ink/10 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="font-mono text-xs tracking-wider uppercase text-ink-soft hover:text-ink transition-colors"
              >
                Zpět
              </button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2.5 bg-orange text-cream font-mono text-xs tracking-[0.08em] uppercase font-medium px-[22px] py-[13px] rounded-[2px] transition-colors hover:bg-orange-dark"
              >
                Pokračovat
                <span className="inline-block">→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-orange text-cream font-mono text-xs tracking-[0.08em] uppercase font-medium px-[22px] py-[13px] rounded-[2px] transition-colors hover:bg-orange-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Zpracovávám...' : `Zaplatit ${formatCZK(total)}`}
                {!isSubmitting && <span className="inline-block">→</span>}
              </button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
