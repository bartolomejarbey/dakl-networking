'use client'

import { useState, FormEvent } from 'react'
import { Container } from '@/components/layout/Container'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return
    // Later: POST to /api/newsletter/subscribe
    setSubmitted(true)
  }

  return (
    <section className="relative bg-teal py-32 lg:py-40 overflow-hidden">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #F5EFE2 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6">
          {/* Left — Heading (col 1-6) */}
          <div className="lg:col-span-6">
            <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-orange mb-6">
              — 09 / Nepropasni
            </span>
            <h2
              className="font-serif text-cream leading-[1.02] text-[clamp(44px,5.2vw,68px)]"
            >
              <span className="block">Dej e-mail.</span>
              <span className="block text-cream/60 pl-[0.5em]">
                Pozvu te.
              </span>
            </h2>
          </div>

          {/* Right — Form (col 7-12) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Description */}
            <p className="text-cream/75 text-[18px] leading-[1.55] max-w-[480px] mb-10">
              Jednou za mesic poslu pozvanku na dalsi akci. Zadny newsletter,
              zadne tipy, zadne &bdquo;zadarmo pro tebe&ldquo;. Jen pozvanka.
            </p>

            {/* Form */}
            {submitted ? (
              <div className="font-mono text-[15px] text-cream py-4">
                Hotovo
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-stretch sm:items-center border-b border-cream/30 max-w-[540px]"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tvuj@email.cz"
                  required
                  className="flex-1 bg-transparent font-mono text-[15px] text-cream placeholder:text-cream/45 border-none outline-none py-4 pr-4"
                />
                <button
                  type="submit"
                  className="bg-orange text-cream font-mono text-[12px] uppercase tracking-[0.08em] px-6 py-3 rounded-[2px] hover:bg-orange-dark transition-colors whitespace-nowrap"
                >
                  Prihlasit odber &rarr;
                </button>
              </form>
            )}

            {/* Fine print */}
            <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-cream/50 mt-4">
              Zadny spam. Odhlasit kdykoli.
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
