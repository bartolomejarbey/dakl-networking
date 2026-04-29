'use client'

import Image, { type ImageProps } from 'next/image'
import { useId } from 'react'

interface DuotoneProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
  variant?: 'forest-cream' | 'forest-orange' | 'mono'
  /** When true, renders without the SVG filter — useful for hover swap. */
  raw?: boolean
}

/**
 * Maps a photo into a two-color duotone via SVG feColorMatrix.
 * Forest-cream is the default editorial treatment; forest-orange is for
 * Aftermath emphasis; mono is the minimum-fidelity fallback.
 */
export function Duotone({ variant = 'forest-cream', raw = false, className, ...rest }: DuotoneProps) {
  const id = useId().replace(/:/g, '')
  const filterId = `duo-${id}`

  const matrices: Record<NonNullable<DuotoneProps['variant']>, string> = {
    // Maps black -> #0F2926, white -> #F5EFE2
    'forest-cream': '0.945 0 0 0 0.059   0.937 0 0 0 0.161   0.886 0 0 0 0.149   0 0 0 1 0',
    // Maps black -> #0F2926, white -> #E97940
    'forest-orange': '0.853 0 0 0 0.059   0.413 0 0 0 0.161   0.149 0 0 0 0.149   0 0 0 1 0',
    // Black-to-cream desaturated
    mono: '0.95 0 0 0 0.043   0.95 0 0 0 0.125   0.85 0 0 0 0.117   0 0 0 1 0',
  }

  return (
    <span className="relative block w-full h-full">
      {!raw && (
        <svg
          aria-hidden
          width="0"
          height="0"
          className="absolute"
          style={{ position: 'absolute', width: 0, height: 0 }}
        >
          <defs>
            <filter id={filterId} colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values={`0.299 0.587 0.114 0 0   0.299 0.587 0.114 0 0   0.299 0.587 0.114 0 0   0 0 0 1 0`} />
              <feColorMatrix type="matrix" values={matrices[variant]} />
            </filter>
          </defs>
        </svg>
      )}
      <Image
        {...rest}
        className={className}
        style={{
          ...(rest.style ?? {}),
          ...(raw ? {} : { filter: `url(#${filterId})` }),
        }}
      />
    </span>
  )
}
