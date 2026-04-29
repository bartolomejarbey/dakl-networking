'use client'

import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  /** Maximum offset in pixels at the strongest pull. */
  strength?: number
  /** Activation radius in pixels. Beyond this, button stays at rest. */
  radius?: number
}

/**
 * Wraps a child with a subtle magnetic pull toward the cursor.
 * Disables itself on touch devices and when prefers-reduced-motion is set.
 */
export function MagneticButton({
  children,
  className,
  strength = 8,
  radius = 90,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 22, mass: 0.4 })

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const rect = node.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = event.clientX - cx
    const dy = event.clientY - cy
    const dist = Math.hypot(dx, dy)
    if (dist > radius) {
      x.set(0)
      y.set(0)
      return
    }
    const factor = (1 - dist / radius) * strength
    x.set((dx / dist) * factor)
    y.set((dy / dist) * factor)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
