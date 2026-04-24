'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/akce', label: 'Kalendář akcí' },
  { href: '/david-kladisovsky', label: 'O pořadateli' },
  { href: '/faq', label: 'FAQ' },
  { href: '/kontakt', label: 'Kontakt' },
]

interface NavbarProps {
  ctaHref?: string
  ctaLabel?: string
  /** Force the solid/scrolled navbar style (use on pages without teal hero) */
  solid?: boolean
}

export function Navbar({ ctaHref = '/akce', ctaLabel = 'Kalendář akcí', solid = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(solid)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(solid || window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [solid])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[80] flex items-center transition-all duration-[350ms] ease-out border-b',
        scrolled
          ? 'bg-cream text-ink h-16 border-teal/[0.18]'
          : 'text-cream h-[88px] border-transparent'
      )}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full max-w-container mx-auto px-[var(--gutter)] gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3.5 leading-none group">
          <span className="w-11 h-11 shrink-0 block">
            <Image
              src="/images/logo.png"
              alt=""
              width={44}
              height={44}
              className={cn(
                'w-full h-full object-contain transition-all',
                scrolled ? '' : 'brightness-0 invert'
              )}
            />
          </span>
          <span className="flex flex-col gap-1">
            <span className="relative inline-block font-serif italic text-[30px] tracking-[-0.01em] leading-none px-2.5 py-0.5">
              {/* Orange brush stroke behind text */}
              <span
                className="absolute inset-[-2px_-6px_-4px_-6px] -z-10 bg-no-repeat bg-[length:100%_100%] transition-transform duration-400 ease-[cubic-bezier(.22,1,.36,1)] -rotate-[1.2deg] group-hover:-rotate-[2.4deg] group-hover:scale-[1.04]"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 80' preserveAspectRatio='none'><path fill='%23E97940' d='M8,34 C60,22 120,18 180,24 C240,28 300,30 360,26 C378,24 390,28 392,36 C394,46 380,52 360,54 C300,58 240,56 180,56 C120,56 60,54 12,50 C4,48 0,44 2,40 C4,36 6,34 8,34 Z' opacity='.82'/><path fill='%23E97940' d='M20,40 C80,32 160,28 240,30 C290,32 340,34 378,32' stroke='%23E97940' stroke-width='2' fill='none' opacity='.3'/></svg>")`,
                }}
              />
              Conventus
            </span>
            <span className="font-mono text-[9px] tracking-[0.24em] uppercase opacity-70">
              Conventus.cz · Od 2023
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex gap-7 justify-self-center" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs tracking-[0.12em] uppercase py-1.5 relative after:content-[''] after:absolute after:left-0 after:right-full after:bottom-0.5 after:h-px after:bg-current after:transition-[right] after:duration-[350ms] after:ease-[cubic-bezier(.22,1,.36,1)] hover:after:right-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="justify-self-end flex items-center gap-4">
          <Link
            href={ctaHref}
            className="hidden sm:inline-flex items-center gap-2.5 bg-orange text-cream font-mono text-xs tracking-[0.08em] uppercase font-medium px-[22px] py-[13px] rounded-[2px] transition-colors hover:bg-orange-dark"
          >
            {ctaLabel} <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:translate-x-1">→</span>
          </Link>

          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Zavřít menu' : 'Otevřít menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-cream text-ink border-b border-teal/[0.18] py-6 px-[var(--gutter)] max-h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-sm tracking-[0.1em] uppercase py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2.5 bg-orange text-cream font-mono text-xs tracking-[0.08em] uppercase font-medium px-[22px] py-[13px] rounded-[2px] mt-2 w-fit"
              onClick={() => setMobileOpen(false)}
            >
              {ctaLabel} →
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
