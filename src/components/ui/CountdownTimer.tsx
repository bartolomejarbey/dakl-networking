'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  /** Event start (ISO 8601) — triggers state A → B */
  targetDate: string
  /** End of "live" window (ISO 8601) — triggers state B → C. If omitted, defaults to targetDate. */
  liveUntilDate?: string
  venueName?: string
  venueDate?: string
}

type Phase = 'before' | 'live' | 'ended'

interface TickState {
  phase: Phase
  days: number
  hours: number
  minutes: number
  seconds: number
}

function computeState(targetMs: number, liveUntilMs: number): TickState {
  const now = Date.now()

  if (now < targetMs) {
    const diff = targetMs - now
    return {
      phase: 'before',
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    }
  }

  if (now < liveUntilMs) {
    return { phase: 'live', days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return { phase: 'ended', days: 0, hours: 0, minutes: 0, seconds: 0 }
}

const pad = (n: number) => String(n).padStart(2, '0')

export function CountdownTimer({
  targetDate,
  liveUntilDate,
  venueName,
  venueDate,
}: CountdownTimerProps) {
  const targetMs = new Date(targetDate).getTime()
  const liveUntilMs = liveUntilDate
    ? new Date(liveUntilDate).getTime()
    : targetMs

  const [state, setState] = useState<TickState>(() =>
    computeState(targetMs, liveUntilMs)
  )

  useEffect(() => {
    const tick = () => setState(computeState(targetMs, liveUntilMs))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetMs, liveUntilMs])

  if (state.phase === 'live') {
    return (
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.04, 1],
            textShadow: [
              '0 0 0px rgba(233,121,64,0)',
              '0 0 24px rgba(233,121,64,0.55)',
              '0 0 0px rgba(233,121,64,0)',
            ],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="font-mono font-medium text-orange text-[clamp(26px,3.6vw,44px)] tracking-[0.04em]"
        >
          AKCE BĚŽÍ
        </motion.div>
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-cream/50 mt-3">
          Právě teď · živě
        </div>
        {venueName && (
          <div className="font-mono text-xs text-cream/55 mt-2">
            {venueName}
            {venueDate ? ` · ${venueDate}` : ''}
          </div>
        )}
      </div>
    )
  }

  if (state.phase === 'ended') {
    return (
      <div className="text-center max-w-[260px]">
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-orange/80 mb-3">
          Akce skončila
        </div>
        <div className="font-serif italic text-cream text-[20px] leading-[1.3]">
          Čekejte na vyhlášení další.
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-cream/60 mb-3">
        — Další akce za
      </div>
      <div className="font-mono text-[clamp(28px,4vw,48px)] font-medium text-cream tracking-wider">
        {pad(state.days)} : {pad(state.hours)} : {pad(state.minutes)} :{' '}
        {pad(state.seconds)}
      </div>
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-cream/40 mt-2">
        dní · hod · min · sek
      </div>
      {venueName && (
        <div className="font-mono text-xs text-cream/50 mt-3">
          {venueName}
          {venueDate ? ` · ${venueDate}` : ''}
        </div>
      )}
    </div>
  )
}
