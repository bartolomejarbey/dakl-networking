'use client'

import { useCountdown } from '@/hooks/useCountdown'

interface CountdownTimerProps {
  targetDate: string
  venueName?: string
  venueDate?: string
}

export function CountdownTimer({ targetDate, venueName, venueDate }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate)

  const pad = (n: number) => String(n).padStart(2, '0')

  if (isExpired) {
    return (
      <div className="text-center">
        <div className="label text-orange">Akce probíhá</div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="label text-cream/60 mb-3">— Další akce za</div>
      <div className="font-mono text-[clamp(28px,4vw,48px)] font-medium text-cream tracking-wider">
        {pad(days)} : {pad(hours)} : {pad(minutes)} : {pad(seconds)}
      </div>
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-cream/40 mt-2">
        dní · hod · min · sek
      </div>
      {venueName && venueDate && (
        <div className="font-mono text-xs text-cream/50 mt-3">
          {venueName} · {venueDate}
        </div>
      )}
    </div>
  )
}
