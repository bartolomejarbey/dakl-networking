'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

/**
 * Sticky right-margin section index.
 *
 * Reads `data-folio` and `data-folio-label` from any element in the DOM and
 * shows the most-visible one as `§ XX / TOTAL — LABEL`. Hidden on viewports
 * smaller than `lg` (1024px) to avoid crowding the mobile gutter.
 */
export function FolioIndex() {
  const pathname = usePathname()
  const [active, setActive] = useState<{ id: string; label: string } | null>(null)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-folio]')
    )
    setTotal(sections.length)
    if (sections.length === 0) {
      setActive(null)
      return
    }
    setActive({
      id: sections[0].dataset.folio ?? '01',
      label: sections[0].dataset.folioLabel ?? '',
    })

    const visibility = new Map<HTMLElement, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target as HTMLElement, entry.intersectionRatio)
        }
        let best: HTMLElement | null = null
        let bestRatio = 0
        for (const [el, ratio] of visibility) {
          if (ratio > bestRatio) {
            best = el
            bestRatio = ratio
          }
        }
        if (best) {
          setActive({
            id: best.dataset.folio ?? '',
            label: best.dataset.folioLabel ?? '',
          })
        }
      },
      {
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      }
    )

    for (const section of sections) observer.observe(section)
    return () => observer.disconnect()
  }, [pathname])

  if (!active || total === 0) return null

  return (
    <aside
      aria-hidden
      className="hidden lg:block fixed top-1/2 right-3 z-[60] -translate-y-1/2 pointer-events-none"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-current opacity-65 [writing-mode:vertical-rl] rotate-180 flex items-center gap-3">
        <span className="tabular-nums">
          §&nbsp;{active.id}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
        </span>
        <span className="h-px w-8 bg-current opacity-40 [writing-mode:horizontal-tb]" />
        <AnimatePresence mode="wait">
          <motion.span
            key={active.label}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 0.85, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {active.label}
          </motion.span>
        </AnimatePresence>
      </div>
    </aside>
  )
}
