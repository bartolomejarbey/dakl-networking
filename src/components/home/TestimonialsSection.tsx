import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import type { Testimonial } from '@/types/database'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

const positions = [
  { left: '0', top: '0', width: '58%' },
  { right: '0', top: '340px', width: '55%' },
  { left: '12%', top: '740px', width: '56%' },
]

const placeholderImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=192&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=192&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=192&q=80',
]

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const displayTestimonials = testimonials.slice(0, 3)

  return (
    <section className="relative bg-cream py-32 lg:py-40 overflow-hidden">
      <Container className="relative z-10">
        {/* Header */}
        <div className="mb-20 lg:mb-28">
          <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-orange mb-6">
            — 06 / Co rikaji
          </span>
          <h2
            className="font-serif text-ink leading-[0.98] text-[clamp(44px,5.6vw,80px)]"
          >
            <span className="block">Lidi, co tam byli.</span>
            <span className="block text-ink/55 pl-[0.5em]">
              Lidi, kteri se vrati.
            </span>
          </h2>
        </div>

        {/* Quotes layout */}
        <div className="relative lg:min-h-[1100px]">
          {displayTestimonials.map((testimonial, index) => {
            const pos = positions[index]
            const posStyle: React.CSSProperties = {}
            if (pos.left) posStyle.left = pos.left
            if (pos.right) posStyle.right = pos.right
            posStyle.top = pos.top
            posStyle.width = pos.width

            return (
              <div
                key={testimonial.id}
                className={cn(
                  'relative mb-20 lg:mb-0',
                  'lg:absolute'
                )}
                style={{ ...posStyle, zIndex: index + 1 }}
              >
                {/* Opening mark */}
                <span
                  className="block font-serif text-orange leading-[0.6] mb-4 text-[96px]"
                >
                  &bdquo;
                </span>

                {/* Quote text */}
                <p
                  className="font-serif italic text-ink leading-[1.45] text-[clamp(22px,2vw,30px)]"
                >
                  {testimonial.quote}
                </p>

                {/* Attribution */}
                <span className="block font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft mt-6">
                  {testimonial.author_name}
                  {testimonial.author_role && `, ${testimonial.author_role}`}
                </span>

                {/* Portrait image */}
                <div className="absolute -right-3 top-3 w-20 h-24 overflow-hidden hidden lg:block">
                  <Image
                    src={testimonial.author_photo_url || placeholderImages[index]}
                    alt={testimonial.author_name}
                    width={80}
                    height={96}
                    className="object-cover w-full h-full grayscale"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
