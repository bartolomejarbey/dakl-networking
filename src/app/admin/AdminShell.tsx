'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAdmin } from './login/actions'
import { cn } from '@/lib/utils'
import { Wordmark } from '@/components/ui/Wordmark'

interface AdminShellProps {
  user: { email: string; name?: string | null }
  issuerPlaceholder: boolean
  children: React.ReactNode
}

const NAV = [
  { href: '/admin', label: 'Přehled', exact: true },
  { href: '/admin/orders', label: 'Objednávky' },
  { href: '/admin/customers', label: 'Zákazníci' },
  { href: '/admin/followups', label: 'Follow-ups' },
  { href: '/admin/events', label: 'Akce' },
  { href: '/admin/settings', label: 'Nastavení' },
]

function todayStamp(): string {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  return `${dd}.${mm}.${now.getFullYear()}`
}

export function AdminShell({ user, issuerPlaceholder, children }: AdminShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-charcoal text-cream flex flex-col">
      {/* Top bar */}
      <header className="border-b border-cream/10 bg-charcoal sticky top-0 z-30">
        <div className="px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
          <Link href="/admin" className="flex items-center gap-3 leading-none" aria-label="Admin home">
            <Wordmark size="sm" subtitle="Admin" edition={null} accent />
          </Link>
          <div className="flex items-center gap-6 text-cream/65">
            <span className="hidden sm:inline font-mono text-[10px] tracking-[0.22em] uppercase tabular-nums">
              {todayStamp()}
            </span>
            <span className="hidden md:inline font-mono text-[10px] tracking-[0.22em] uppercase">
              {user.email}
            </span>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/65 hover:text-orange transition-colors"
              >
                Odhlásit
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-[220px] shrink-0 border-r border-cream/10 py-8 px-6">
          <nav className="flex flex-col gap-0.5" aria-label="Admin">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'font-mono text-[11px] tracking-[0.18em] uppercase py-3 border-b border-cream/5 transition-colors',
                    active
                      ? 'text-orange'
                      : 'text-cream/65 hover:text-cream'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <p className="mt-auto pt-12 font-mono text-[9px] tracking-[0.22em] uppercase text-cream/35 leading-[1.6]">
            DaKl Networking<br />
            Redakce · Praha<br />
            MMXXVI
          </p>
        </aside>

        {/* Body */}
        <main className="flex-1 min-w-0">
          {issuerPlaceholder && (
            <div className="bg-orange/15 border-b border-orange/40 px-6 lg:px-10 py-3 flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-orange">
                §&nbsp;Pozor — issuer data jsou placeholder. Faktury půjdou s textem „FIRMA PLÁTCE — placeholder".
              </p>
              <Link
                href="/admin/settings"
                className="shrink-0 font-mono text-[10px] tracking-[0.22em] uppercase text-orange hover:text-cream transition-colors border-b border-orange hover:border-cream pb-0.5"
              >
                Vyplnit →
              </Link>
            </div>
          )}

          {/* Mobile nav */}
          <nav
            aria-label="Admin (mobile)"
            className="lg:hidden flex overflow-x-auto border-b border-cream/10 px-2"
          >
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'whitespace-nowrap font-mono text-[10px] tracking-[0.18em] uppercase px-4 py-3 border-b-2',
                    active
                      ? 'border-orange text-orange'
                      : 'border-transparent text-cream/55'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="px-6 lg:px-10 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
