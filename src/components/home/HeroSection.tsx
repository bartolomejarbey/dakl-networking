'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { CountdownTimer } from '@/components/ui/CountdownTimer'

interface HeroSectionProps {
  ctaHref?: string
  ctaLabel?: string
  nextEventDate?: string
  nextEventVenue?: string
  liveUntilDate?: string
}

const headlineLines = ['Zajímaví lidé.', 'Jedna loď.', 'Jeden večer.']

const contactItems = [
  {
    label: 'ZAVOLEJTE',
    value: '+420 601 348 249',
    icon: Phone,
    href: 'tel:+420601348249',
  },
  {
    label: 'NAPIŠTE',
    value: 'david@daklnetworking.cz',
    icon: Mail,
    href: 'mailto:david@daklnetworking.cz',
  },
  {
    label: 'KDE NÁS NAJDETE',
    value: 'Praha, Česko',
    icon: MapPin,
    href: null,
  },
]

const PRAGUE_IMAGE =
  'https://images.unsplash.com/photo-1541849546-216549ae216d?w=2400&q=85'

export function HeroSection({
  ctaHref = '#',
  ctaLabel = 'PŘIHLÁSIT NA 24.4. →',
  nextEventDate,
  nextEventVenue,
  liveUntilDate,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-forest-deep">
      {/* Background — Prague */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={PRAGUE_IMAGE}
          alt="Praha · Vltava"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-forest-deep/[0.80]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(42, 107, 95, 0.22), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 60%, rgba(15, 41, 38, 0.6) 100%)',
          }}
        />
      </motion.div>

      {/* Content */}
      <Container className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center pt-36 pb-24 lg:pt-32 lg:pb-32 max-w-[860px]">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-cream/60 mb-7"
          >
            — DaKl Networking · Praha
          </motion.span>

          <h1 className="font-serif text-cream leading-[1.02] text-[clamp(52px,8vw,112px)] tracking-[-0.02em] mb-8">
            {headlineLines.map((line, lineIndex) => {
              const wordsBefore = headlineLines
                .slice(0, lineIndex)
                .reduce((n, l) => n + l.split(' ').length, 0)
              return (
                <span key={lineIndex} className="block">
                  {line.split(' ').map((word, wordIndex) => {
                    const gi = wordsBefore + wordIndex
                    return (
                      <motion.span
                        key={`${lineIndex}-${wordIndex}`}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.55,
                          delay: 0.6 + gi * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="inline-block mr-[0.24em]"
                      >
                        {word}
                      </motion.span>
                    )
                  })}
                </span>
              )
            })}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-cream/[0.78] text-[20px] lg:text-[22px] leading-[1.5] max-w-[560px] mb-10"
          >
            Nejbližší akce: Kayak Beach Bar, 24. dubna. Loď, jídlo, pití,
            DJs, 150 lidí, co něco dělají.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-orange text-cream font-mono text-[13px] uppercase tracking-[0.08em] font-medium px-8 py-4 rounded-[2px] transition-colors hover:bg-orange-dark"
            >
              {ctaLabel}
            </Link>
            <Link
              href="#principy"
              className="inline-flex items-center border border-cream text-cream font-mono text-[13px] uppercase tracking-[0.08em] font-medium px-8 py-4 rounded-[2px] transition-colors hover:bg-cream hover:text-forest-deep"
            >
              JAK TO FUNGUJE
            </Link>
          </motion.div>
        </div>
      </Container>

      {/* Glass contact panel — top-right, tablet+ */}
      <motion.aside
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.7 }}
        className="hidden md:block absolute top-28 right-8 z-20 bg-forest-lighter/40 backdrop-blur-md border border-forest-glow/40 rounded-[2px] px-6 py-5"
      >
        <ul className="flex flex-col gap-4">
          {contactItems.map(({ label, value, icon: Icon, href }) => (
            <li key={label} className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-orange mt-[3px] shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-cream/60">
                  {label}
                </span>
                {href ? (
                  <a
                    href={href}
                    className="font-mono text-[13px] text-cream hover:text-orange transition-colors"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="font-mono text-[13px] text-cream">
                    {value}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </motion.aside>

      {/* Countdown — bottom-right, desktop only */}
      {nextEventDate && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="hidden lg:block absolute bottom-12 right-8 z-20"
        >
          <CountdownTimer
            targetDate={nextEventDate}
            liveUntilDate={liveUntilDate}
            venueName={nextEventVenue}
          />
        </motion.div>
      )}
    </section>
  )
}
