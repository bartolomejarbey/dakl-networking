'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

interface StatScrubProps {
  value: number
  duration?: number
  delay?: number
  className?: string
  /** Format the rendered number. Default: Czech locale with thin space. */
  format?: (n: number) => string
  /** Optional starting "slot reel" value, defaults to 0. */
  from?: number
}

const czechFormat = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

export function StatScrub({
  value,
  duration = 1.4,
  delay = 0,
  className,
  format = czechFormat,
  from = 0,
}: StatScrubProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const motionValue = useMotionValue(from)
  const display = useTransform(motionValue, (latest) => format(latest))
  const [text, setText] = useState(format(from))

  useEffect(() => {
    if (!inView) return
    const controls = animate(motionValue, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
    })
    const unsub = display.on('change', (v) => setText(v))
    return () => {
      controls.stop()
      unsub()
    }
  }, [inView, value, duration, delay, motionValue, display])

  return (
    <motion.span ref={ref} className={className} aria-label={String(value)}>
      {text}
    </motion.span>
  )
}
