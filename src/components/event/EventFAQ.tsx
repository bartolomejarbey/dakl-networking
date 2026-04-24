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
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container>
        <h2
          className="font-serif text-ink leading-[1.1] mb-12 text-[clamp(32px,4vw,52px)]"
        >
          Casto kladene otazky
        </h2>

        <div>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={cn(
                'border-b border-teal/[0.15]',
                i === 0 && 'border-t border-teal/[0.15]'
              )}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between text-left py-5 group"
              >
                <span className="font-sans text-[18px] font-medium text-ink pr-4">
                  {faq.question}
                </span>
                <span
                  className={cn(
                    'shrink-0 w-6 h-6 flex items-center justify-center font-mono text-[18px] text-ink-soft transition-transform duration-300',
                    openIndex === i && 'rotate-45'
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
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="font-sans text-[16px] text-ink-soft leading-[1.6] pb-5">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
