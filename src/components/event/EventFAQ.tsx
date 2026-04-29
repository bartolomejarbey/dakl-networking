'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

interface EventFAQProps {
  faqs: FAQItem[]
}

export function EventFAQ({ faqs }: EventFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-cream text-ink py-24 lg:py-32">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-14 lg:mb-16">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
            §&nbsp;Otázky a odpovědi
          </p>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/60 tabular-nums">
            {String(faqs.length).padStart(2, '0')}&nbsp;položek
          </p>
        </div>

        <h2
          className="font-serif text-ink leading-[1] tracking-[-0.02em] text-[clamp(36px,5vw,72px)] mb-14"
          style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
        >
          Časté otázky.
          <span className="block italic text-ink-soft pl-[0.4em]">
            Krátké odpovědi.
          </span>
        </h2>

        <ul className="border-t border-ink/15">
          {faqs.map((faq, i) => (
            <li key={i} className="border-b border-ink/15">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-baseline justify-between text-left py-7 lg:py-8 gap-8 group"
                aria-expanded={openIndex === i}
              >
                <div className="flex items-baseline gap-4 lg:gap-6 flex-1">
                  <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-orange shrink-0 tabular-nums">
                    Q{String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-serif italic text-ink text-[20px] lg:text-[26px] leading-[1.25]">
                    {faq.question}
                  </span>
                </div>
                <span
                  aria-hidden
                  className={cn(
                    'shrink-0 font-mono text-[18px] text-ink/65 transition-transform duration-400 ease-editorial',
                    openIndex === i && 'rotate-90 text-orange'
                  )}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-[64px_1fr] lg:grid-cols-[88px_1fr] gap-4 lg:gap-6 pb-7 lg:pb-8">
                      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/60 tabular-nums">
                        A
                      </span>
                      <p className="text-ink-soft text-[16px] lg:text-[18px] leading-[1.6] max-w-[680px]">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
