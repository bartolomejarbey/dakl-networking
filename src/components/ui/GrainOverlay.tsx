interface GrainOverlayProps {
  /** Default 0.045. Light: 0.025. Strong: 0.08. */
  opacity?: number
  /** When true, the grain is positioned fixed across the viewport. */
  fixed?: boolean
  className?: string
}

/**
 * Subtle film-grain overlay backed by inline SVG feTurbulence.
 * Fixed-mode covers the whole viewport (mount once at root); non-fixed mode
 * sits absolutely inside its parent.
 */
export function GrainOverlay({ opacity = 0.045, fixed = false, className = '' }: GrainOverlayProps) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none ${fixed ? 'fixed inset-0 z-[150]' : 'absolute inset-0'} ${className}`}
      style={{
        opacity,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        backgroundSize: '220px 220px',
      }}
    />
  )
}
