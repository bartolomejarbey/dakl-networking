'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { loginAdmin, type LoginActionState } from './actions'
import { Wordmark } from '@/components/ui/Wordmark'

const initialState: LoginActionState = {}

interface LoginFormProps {
  nextPath?: string
  initialError?: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex items-center justify-between gap-4 w-full bg-orange hover:bg-orange-dark disabled:opacity-50 text-cream font-mono text-[11px] tracking-[0.22em] uppercase font-semibold px-6 py-3.5 rounded-[1px] border-2 border-orange transition-colors duration-300 disabled:cursor-not-allowed"
    >
      <span>{pending ? 'Ověřuji…' : 'Přihlásit se'}</span>
      {!pending && (
        <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden>
          &rarr;
        </span>
      )}
    </button>
  )
}

export function LoginForm({ nextPath, initialError }: LoginFormProps) {
  const [state, formAction] = useFormState<LoginActionState, FormData>(loginAdmin, initialState)
  const errorMessage = state.error || initialError

  return (
    <div className="min-h-screen bg-cream text-ink flex items-center justify-center px-6 py-16 grain grain-light">
      <div className="w-full max-w-[440px]">
        {/* Folio + brand */}
        <div className="text-center mb-12">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-6">
            §&nbsp;Privátní vstup — Redakce
          </p>
          <div className="inline-block">
            <Wordmark size="lg" subtitle="Admin" edition="MMXXVI" accent />
          </div>
        </div>

        {/* Subscription-card style insert */}
        <div className="relative">
          <div aria-hidden className="perforation-top h-1 w-full" />
          <div className="bg-cream border-x border-b border-ink/15 shadow-print">
            <div className="px-7 lg:px-10 pt-8 pb-5 border-b border-ink/15 flex items-baseline justify-between">
              <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-ink-soft/65">
                Přihlášení
              </span>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/45">
                Forma — IDX
              </span>
            </div>

            <form action={formAction} className="px-7 lg:px-10 py-8 lg:py-10 space-y-6">
              {nextPath && <input type="hidden" name="next" value={nextPath} />}

              <label className="block">
                <span className="block font-mono text-[10px] tracking-[0.24em] uppercase text-ink-soft/65 mb-2">
                  E-mail
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  autoFocus
                  className="w-full bg-transparent border-b border-ink/30 font-mono text-[14px] text-ink placeholder:text-ink-soft/35 outline-none py-2.5 focus:border-orange transition-colors"
                  placeholder="david@daklnetworking.cz"
                />
                {state.fieldErrors?.email && (
                  <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-orange-dark">
                    {state.fieldErrors.email[0]}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="block font-mono text-[10px] tracking-[0.24em] uppercase text-ink-soft/65 mb-2">
                  Heslo
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  minLength={8}
                  className="w-full bg-transparent border-b border-ink/30 font-mono text-[14px] text-ink placeholder:text-ink-soft/35 outline-none py-2.5 focus:border-orange transition-colors"
                  placeholder="••••••••"
                />
                {state.fieldErrors?.password && (
                  <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-orange-dark">
                    {state.fieldErrors.password[0]}
                  </p>
                )}
              </label>

              {errorMessage && (
                <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-orange-dark py-2 border-y border-orange-dark/30">
                  {errorMessage}
                </p>
              )}

              <SubmitButton />
            </form>
          </div>
          <div aria-hidden className="perforation-bottom h-1 w-full" />
        </div>

        <p className="mt-8 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 text-center">
          DaKl Networking · Privátní redakce · MMXXVI
        </p>
      </div>
    </div>
  )
}
