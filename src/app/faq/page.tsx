'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  title: string
  items: FAQItem[]
}

const faqData: FAQCategory[] = [
  {
    title: 'O akcích',
    items: [
      {
        question: 'Kdo může přijít na akci?',
        answer:
          'Akce jsou pro aktivní podnikatele, freelancery a profesionály. Pokud podnikáš nebo o podnikání uvažuješ, jsi vítán. Filtruje se to osobně — nejde o exkluzivitu, jde o kvalitu večera.',
      },
      {
        question: 'Co je zahrnuto v ceně?',
        answer:
          'Všechno. Vstup, jídlo, pití (alkoholické i nealko), aktivity, doprovodný program. Žádné domlouvání u baru, žádné zvlášť faktury.',
      },
      {
        question: 'Jaký je dress code?',
        answer:
          'Záleží na formátu. Loď a beach bar — smart casual. Business dinner — formálnější. Vždy upřesníme v pozvánce.',
      },
      {
        question: 'Můžu přijít sám/sama?',
        answer:
          'Většina lidí chodí sama. Program je navržený tak, aby ses rychle rozhýbal/a. O nikoho se starat nemusíš — postaráme se my.',
      },
    ],
  },
  {
    title: 'Platba a faktury',
    items: [
      {
        question: 'Jak probíhá platba?',
        answer:
          'Po přihlášce ti pošleme QR kód nebo bankovní údaje. Platba do 48 h, jinak místo uvolníme. Faktura se posílá automaticky po přijetí platby.',
      },
      {
        question: 'Dostanu fakturu?',
        answer:
          'Ano, fakturu posíláme automaticky e-mailem. Daňový doklad — jde uplatnit jako náklad na vzdělávání nebo reprezentaci.',
      },
    ],
  },
  {
    title: 'Storno',
    items: [
      {
        question: 'Můžu akci stornovat?',
        answer:
          'Do 48 h před akcí — vrátíme 100 % částky. Po této hranici už místo nedrží smysl, ale klidně za sebe pošli náhradníka.',
      },
    ],
  },
  {
    title: 'Technické',
    items: [
      {
        question: 'Nedostal/a jsem potvrzovací e-mail',
        answer:
          'Zkontroluj spam. Když ani tam není, napiš na david@daklnetworking.cz a pošleme znovu. Ujisti se, že byla správná e-mailová adresa.',
      },
    ],
  },
]

function FAQAccordionItem({ item, index }: { item: FAQItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <li className="border-b border-ink/15">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-baseline justify-between text-left py-7 lg:py-8 gap-8 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-baseline gap-4 lg:gap-6 flex-1">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-orange shrink-0 tabular-nums">
            Q{String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-serif italic text-ink text-[20px] lg:text-[26px] leading-[1.25]">
            {item.question}
          </span>
        </div>
        <span
          aria-hidden
          className={cn(
            'shrink-0 font-mono text-[18px] text-ink/65 transition-transform duration-400 ease-editorial',
            isOpen && 'rotate-90 text-orange'
          )}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
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
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export default function FAQPage() {
  let qIndex = 0
  return (
    <>
      <Navbar solid />
      <main>
        <section className="bg-cream text-ink pt-32 lg:pt-40 pb-24 lg:pb-32">
          <Container>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-14">
              <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
                §&nbsp;Otázky a odpovědi
              </p>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/60 tabular-nums">
                {String(faqData.reduce((acc, c) => acc + c.items.length, 0)).padStart(2, '0')}&nbsp;položek · {String(faqData.length).padStart(2, '0')}&nbsp;rubrik
              </p>
            </div>

            <h1
              className="font-serif text-ink leading-[1] tracking-[-0.022em] text-[clamp(48px,8vw,128px)] mb-20 lg:mb-28 max-w-[1100px]"
              style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
            >
              Časté otázky.
              <span className="block italic text-ink-soft pl-[0.4em]">
                Krátké odpovědi.
              </span>
            </h1>

            <div className="max-w-[920px]">
              {faqData.map((category, ci) => (
                <div key={category.title} className="mb-20 last:mb-0">
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ink-soft/55 mb-7 tabular-nums">
                    §&nbsp;{String(ci + 1).padStart(2, '0')} — {category.title}
                  </p>
                  <ul className="border-t border-ink/15">
                    {category.items.map((item) => {
                      const i = qIndex++
                      return <FAQAccordionItem key={item.question} item={item} index={i} />
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
