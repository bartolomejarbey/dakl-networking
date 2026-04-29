'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealMaskProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  /** Stagger child elements (each direct child gets its own reveal). */
  stagger?: boolean
  staggerStep?: number
}

const containerVariants: Variants = {
  hidden: {},
  visible: (custom: number) => ({
    transition: {
      staggerChildren: custom,
      delayChildren: 0,
    },
  }),
}

const childVariants: Variants = {
  hidden: {
    clipPath: 'inset(0 0 100% 0)',
    y: '0.4em',
  },
  visible: ({ duration, delay }: { duration: number; delay: number }) => ({
    clipPath: 'inset(0 0 0% 0)',
    y: 0,
    transition: {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

/**
 * Reveals text via a vertical mask wipe.
 * Pads top/bottom to keep Czech diacritics from being clipped.
 */
export function RevealMask({
  children,
  delay = 0,
  duration = 0.9,
  className,
  stagger = false,
  staggerStep = 0.08,
}: RevealMaskProps) {
  if (stagger) {
    return (
      <motion.span
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px' }}
        variants={containerVariants}
        custom={staggerStep}
        style={{ display: 'inline-block' }}
      >
        {Array.isArray(children) ? (
          children.map((child, i) => (
            <motion.span
              key={i}
              variants={childVariants}
              custom={{ duration, delay: delay + i * staggerStep }}
              style={{ display: 'inline-block', paddingTop: '0.12em', paddingBottom: '0.12em' }}
            >
              {child}
            </motion.span>
          ))
        ) : (
          <motion.span
            variants={childVariants}
            custom={{ duration, delay }}
            style={{ display: 'inline-block', paddingTop: '0.12em', paddingBottom: '0.12em' }}
          >
            {children}
          </motion.span>
        )}
      </motion.span>
    )
  }

  return (
    <motion.span
      className={className}
      initial={{ clipPath: 'inset(0 0 100% 0)', y: '0.4em' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'inline-block', paddingTop: '0.12em', paddingBottom: '0.12em' }}
    >
      {children}
    </motion.span>
  )
}
