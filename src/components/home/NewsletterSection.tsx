'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { GrainOverlay } from '@/components/ui/GrainOverlay'

const EASE = [0.22, 1, 0.36, 1] as const

function todayStamp(): string {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yy = String(now.getFullYear()).slice(2)
  return `${dd}.${mm}.${yy}`
}

export function NewsletterSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return
    setPending(true)
    setError(null)
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, first_name: name || null, source: 'homepage' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Něco se nepovedlo')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Něco se nepovedlo')
    } finally {
      setPending(false)
    }
  }

  return (
    <section
      id="odber"
      data-folio="07"
      data-folio-label="Odběr · Subscription card"
      className="relative bg-forest-deep text-cream py-24 lg:py-36 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 22% 30%, rgba(30, 139, 133, 0.16), transparent 60%)',
        }}
      />
      <GrainOverlay opacity={0.05} />

      <Container className="relative z-10">
        {/* Folio + headline */}
        <div className="max-w-[1100px] mb-14 lg:mb-20">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-8">
            §&nbsp;07 — Odběr
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 16, clipPath: 'inset(0 0 100% 0)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-serif leading-[0.98] tracking-[-0.022em] text-[clamp(44px,7vw,108px)]"
            style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
          >
            Dostávej pozvánku
            <span className="block italic text-cream/85 pl-[0.4em]">
              jako první.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mt-7 font-serif italic text-[20px] lg:text-[24px] leading-[1.4] text-cream/75 max-w-[640px]"
          >
            Žádný marketing. Žádné „zadarmo pro tebe". Čtyři až šest e-mailů
            ročně. Před každým vydáním.
          </motion.p>
        </div>

        {/* Subscription card — cream "paper" insert */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="relative mx-auto max-w-[720px]"
        >
          {/* Perforated edges */}
          <div aria-hidden className="perforation-top h-1 w-full" />
          <div className="bg-cream text-ink rounded-[1px] shadow-print relative">
            {/* Card chrome */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 px-7 lg:px-10 pt-8 pb-5 border-b border-ink/15">
              <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-ink-soft/65">
                Přihláška k odběru
              </span>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/45 tabular-nums">
                FORM-Č-{todayStamp()}
              </span>
            </div>

            {submitted ? (
              <div className="px-7 lg:px-10 py-12 text-center">
                <p className="font-serif italic text-[clamp(28px,3vw,42px)] leading-[1.2] text-ink">
                  Zapsáno. Ozveme se před dalším vydáním.
                </p>
                <p className="mt-5 font-mono text-[10px] tracking-[0.26em] uppercase text-orange">
                  Hotovo · {todayStamp()}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-7 lg:px-10 py-8 lg:py-10 space-y-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
                  <label className="block">
                    <span className="block font-mono text-[10px] tracking-[0.24em] uppercase text-ink-soft/65 mb-2">
                      Jméno — volitelné
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jana Nováková"
                      autoComplete="name"
                      className="w-full bg-transparent border-b border-ink/30 font-mono text-[14px] text-ink placeholder:text-ink-soft/35 outline-none py-2 focus:border-orange transition-colors"
                    />
                  </label>
                  <label className="block">
                    <span className="block font-mono text-[10px] tracking-[0.24em] uppercase text-ink-soft/65 mb-2">
                      E-mail — povinné
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jana@firma.cz"
                      required
                      autoComplete="email"
                      className="w-full bg-transparent border-b border-ink/30 font-mono text-[14px] text-ink placeholder:text-ink-soft/35 outline-none py-2 focus:border-orange transition-colors"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="block font-mono text-[10px] tracking-[0.24em] uppercase text-ink-soft/65 mb-2">
                    Poznámka — volitelné
                  </span>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Co děláš, co stojí za řádek"
                    className="w-full bg-transparent border-b border-ink/30 font-mono text-[14px] text-ink placeholder:text-ink-soft/35 outline-none py-2 focus:border-orange transition-colors"
                  />
                </label>

                {error && (
                  <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-orange-dark">
                    {error}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pt-3">
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 max-w-[260px]">
                    Žádný spam. Odhlásíš se kdykoli.
                  </p>
                  <button
                    type="submit"
                    disabled={pending}
                    className="group inline-flex items-center justify-between gap-4 bg-orange hover:bg-orange-dark disabled:opacity-50 text-cream font-mono text-[11px] tracking-[0.22em] uppercase font-semibold px-6 py-3.5 rounded-[1px] border-2 border-orange transition-colors duration-300"
                  >
                    <span>Odebírat — {todayStamp()}</span>
                    <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden>
                      &rarr;
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
          <div aria-hidden className="perforation-bottom h-1 w-full" />
        </motion.div>
      </Container>
    </section>
  )
}
