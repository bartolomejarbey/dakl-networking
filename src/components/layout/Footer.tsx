import Link from 'next/link'
import { Container } from './Container'

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream pt-[88px] pb-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6">
          {/* Brand */}
          <div>
            <div className="font-serif italic text-[28px]">DaKl Networking</div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase mt-2.5">
              Networking pro byznys · Praha
            </div>
            <div className="mt-[18px] text-[13px] leading-relaxed text-cream/[0.55] max-w-[260px]">
              Akce pro podnikatele, co už něco dělají. Loď, jídlo, pití, lidi, co dávají smysl.
            </div>
          </div>

          {/* Akce */}
          <div>
            <h4 className="font-mono text-[11px] tracking-[0.14em] uppercase font-medium mb-5">
              Akce
            </h4>
            <ul className="space-y-2.5 text-[14px] text-cream/[0.65]">
              <li>
                <Link href="/akce/kayak-beach-bar" className="hover:text-cream transition-colors">
                  24.04.26 · Kayak Beach Bar
                </Link>
              </li>
              <li>
                <Link href="/akce" className="hover:text-cream transition-colors">
                  Zobrazit všechny akce
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-mono text-[11px] tracking-[0.14em] uppercase font-medium mb-5">
              Info
            </h4>
            <ul className="space-y-2.5 text-[14px] text-cream/[0.65]">
              <li>
                <Link href="/david-kladisovsky" className="hover:text-cream transition-colors">
                  O pořadateli
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-cream transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cream transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/podminky" className="hover:text-cream transition-colors">
                  Podmínky
                </Link>
              </li>
              <li>
                <Link href="/ochrana-osobnich-udaju" className="hover:text-cream transition-colors">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="font-mono text-[11px] tracking-[0.14em] uppercase font-medium mb-5">
              Kontakt
            </h4>
            <ul className="space-y-2.5 font-mono text-[13px] tracking-[0.04em] text-cream/[0.65]">
              <li>
                <a href="mailto:david@daklnetworking.cz" className="hover:text-cream transition-colors">
                  david@daklnetworking.cz
                </a>
              </li>
              <li>
                <span className="text-cream/40">daklnetworking.cz</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-16 pt-6 border-t border-cream/[0.12] text-[12px] text-cream/[0.35] font-mono tracking-[0.04em] gap-2">
          <span>© 2026 DaKl Networking</span>
          <span>Made in Prague</span>
        </div>
      </Container>
    </footer>
  )
}
