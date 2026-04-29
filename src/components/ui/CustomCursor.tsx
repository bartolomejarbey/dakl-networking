'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]'

/**
 * A small mono caret cursor that appears only on interactive elements.
 * Disables on touch and when prefers-reduced-motion is enabled.
 */
export function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 })

  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduce || coarse) return
    setEnabled(true)

    let raf = 0
    let pendingX = 0
    let pendingY = 0

    const update = () => {
      x.set(pendingX)
      y.set(pendingY)
      raf = 0
    }

    const onMove = (event: MouseEvent) => {
      pendingX = event.clientX
      pendingY = event.clientY
      if (!raf) raf = requestAnimationFrame(update)
    }

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest(INTERACTIVE_SELECTOR)
      setHovering(Boolean(interactive))
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[200] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    >
      <motion.div
        animate={{
          opacity: hovering ? 1 : 0,
          scale: hovering ? 1 : 0.4,
        }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream whitespace-nowrap select-none"
      >
        [ &rarr; ]
      </motion.div>
    </motion.div>
  )
}
