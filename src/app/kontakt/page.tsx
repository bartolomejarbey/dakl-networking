'use client'

import { useState, type FormEvent } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'

function todayStamp(): string {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yy = String(now.getFullYear()).slice(2)
  return `${dd}.${mm}.${yy}`
}

const cardBlocks = [
  {
    label: 'Korespondence',
    items: [
      { kind: 'mail', value: 'david@daklnetworking.cz', href: 'mailto:david@daklnetworking.cz' },
      { kind: 'tel', value: '+420 601 348 249', href: 'tel:+420601348249' },
      { kind: 'social', value: '@daklnetworking', href: 'https://instagram.com/daklnetworking' },
    ],
  },
  {
    label: 'Adresa',
    items: [
      { kind: 'place', value: 'Praha · Náplavka', href: null },
      { kind: 'place', value: 'Česká republika', href: null },
    ],
  },
  {
    label: 'Spolupráce',
    items: [
      { kind: 'note', value: 'Partnerství, sponzoring, akce na míru.', href: null },
      { kind: 'mail', value: 'partner@daklnetworking.cz', href: 'mailto:partner@daklnetworking.cz' },
    ],
  },
] as const

export default function KontaktPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !message) return
    // Mailto fallback — actual contact API can be wired later
    const subject = encodeURIComponent('Zpráva z webu — DaKl Networking')
    const body = encodeURIComponent(`${message}\n\n— ${name || 'Bez podpisu'} <${email}>`)
    window.location.href = `mailto:david@daklnetworking.cz?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <>
      <Navbar solid />
      <main>
        <section className="bg-cream text-ink pt-32 lg:pt-40 pb-24 lg:pb-32">
          <Container>
            {/* Folio */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-16">
              <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
                §&nbsp;Kontakt — Reception desk
              </p>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/60 tabular-nums">
                {todayStamp()}
              </p>
            </div>

            {/* Editorial card */}
            <div className="max-w-[720px] mx-auto">
              <h1
                className="font-serif italic text-ink leading-[0.96] tracking-[-0.022em] text-[clamp(56px,9vw,140px)] text-center mb-3"
                style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
              >
                Kontakt.
              </h1>
              <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-ink-soft/55 text-center mb-12 lg:mb-16">
                Praha · Česká republika
              </p>

              <div className="border-y border-ink/15 py-12 lg:py-16 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
                {cardBlocks.map((block) => (
                  <div key={block.label}>
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-orange mb-4">
                      §&nbsp;{block.label}
                    </p>
                    <ul className="space-y-2.5">
                      {block.items.map((item, i) => (
                        <li key={i}>
                          {item.href ? (
                            <a
                              href={item.href}
                              target={item.href.startsWith('http') ? '_blank' : undefined}
                              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="font-serif italic text-[18px] lg:text-[20px] leading-[1.35] text-ink hover:text-orange transition-colors"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <span className="font-serif italic text-[18px] lg:text-[20px] leading-[1.35] text-ink-soft">
                              {item.value}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Short message form below */}
            <div className="max-w-[720px] mx-auto mt-24 lg:mt-32">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-orange mb-5 text-center">
                §&nbsp;Krátká zpráva
              </p>
              <p className="font-serif italic text-[clamp(22px,3vw,32px)] leading-[1.35] text-ink-soft text-center mb-12">
                Cokoli, co stojí za řádek. Odepíšu ti během dne nebo dvou.
              </p>

              {submitted ? (
                <p className="text-center font-serif italic text-[24px] text-ink">
                  Zpráva otevřena v poštovní aplikaci. Děkujeme.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-7">
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
                      Zpráva
                    </span>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Napiš, co máš na srdci."
                      required
                      rows={5}
                      className="w-full bg-transparent border-b border-ink/30 font-sans text-[16px] text-ink placeholder:text-ink-soft/35 outline-none py-2 focus:border-orange transition-colors resize-none"
                    />
                  </label>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pt-3">
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55">
                      Odpovídáme do 48 h
                    </p>
                    <button
                      type="submit"
                      className="group inline-flex items-center justify-between gap-4 bg-orange hover:bg-orange-dark text-cream font-mono text-[11px] tracking-[0.22em] uppercase font-semibold px-6 py-3.5 rounded-[1px] border-2 border-orange transition-colors duration-300"
                    >
                      <span>Odeslat — {todayStamp()}</span>
                      <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden>
                        &rarr;
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
