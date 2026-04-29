'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { Wordmark } from '@/components/ui/Wordmark'

const navLinks = [
  { href: '/akce', label: 'Vydání' },
  { href: '/david-kladisovsky', label: 'Pořadatel' },
  { href: '/faq', label: 'Otázky' },
  { href: '/kontakt', label: 'Kontakt' },
]

interface NavbarProps {
  ctaHref?: string
  ctaLabel?: string
  /** Force the solid/scrolled navbar style (use on pages without forest hero) */
  solid?: boolean
}

export function Navbar({
  ctaHref = '/akce',
  ctaLabel = 'Odebírat',
  solid = false,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(solid)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 30, mass: 0.4 })
  const progressWidth = useTransform(progress, (v) => `${v * 100}%`)

  useEffect(() => {
    const onScroll = () => setScrolled(solid || window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [solid])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[80] flex items-center transition-[background-color,color,height,backdrop-filter] duration-[400ms] ease-editorial',
        scrolled
          ? 'bg-cream/85 text-ink h-[68px] backdrop-blur-md'
          : 'text-cream h-[96px]'
      )}
    >
      {/* Hairline at the bottom of the navbar — doubles as scroll progress bar */}
      <div
        className={cn(
          'absolute left-0 right-0 bottom-0 h-px transition-colors duration-[400ms]',
          scrolled ? 'bg-ink/15' : 'bg-cream/15'
        )}
      />
      <motion.div
        aria-hidden
        style={{ width: progressWidth }}
        className={cn(
          'absolute left-0 bottom-0 h-px origin-left transition-colors duration-[400ms]',
          scrolled ? 'bg-orange' : 'bg-orange'
        )}
      />

      <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full max-w-container mx-auto px-[var(--gutter)] gap-8">
        {/* Wordmark */}
        <Link
          href="/"
          aria-label="DaKl Networking — domů"
          className="leading-none transition-opacity duration-300 hover:opacity-90"
        >
          <Wordmark size="md" subtitle="Networking" edition="04" accent />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex gap-7 justify-self-center" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] tracking-[0.18em] uppercase py-1.5 relative after:content-[''] after:absolute after:left-0 after:right-full after:bottom-0 after:h-px after:bg-orange after:transition-[right] after:duration-[400ms] after:ease-editorial hover:after:right-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="justify-self-end flex items-center gap-4">
          <Link
            href={ctaHref}
            className={cn(
              'hidden sm:inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase font-medium px-5 py-2.5 rounded-[1px] transition-colors duration-300 group',
              scrolled
                ? 'bg-ink text-cream hover:bg-orange-dark'
                : 'border border-cream text-cream hover:bg-cream hover:text-forest-deep'
            )}
          >
            {ctaLabel}
            <span className="inline-block transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden>
              &rarr;
            </span>
          </Link>

          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Zavřít menu' : 'Otevřít menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-cream text-ink border-b border-ink/15 py-6 px-[var(--gutter)] max-h-[calc(100vh-68px)] overflow-y-auto shadow-print">
          <nav className="flex flex-col" aria-label="Mobile">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'font-mono text-[12px] tracking-[0.18em] uppercase py-4 flex items-center justify-between border-b border-ink/10',
                  i === 0 && 'border-t border-ink/10'
                )}
                onClick={() => setMobileOpen(false)}
              >
                <span>{link.label}</span>
                <span className="text-orange">&rarr;</span>
              </Link>
            ))}
            <Link
              href={ctaHref}
              className="mt-6 inline-flex items-center justify-between bg-ink text-cream font-mono text-[11px] tracking-[0.16em] uppercase font-medium px-5 py-4 rounded-[1px]"
              onClick={() => setMobileOpen(false)}
            >
              {ctaLabel}
              <span aria-hidden>&rarr;</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
