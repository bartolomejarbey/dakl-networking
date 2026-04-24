# CONVENTUS — Claude Code instructions

## Projekt

Premium networking event platform for Czech business community. Run by David Kladišovský.
Stack: Next.js 14 App Router + TypeScript + Tailwind CSS + Supabase + Framer Motion.

## Design tokens

Colors: teal #1E8B85, teal-dark #16665F, orange #E97940, orange-dark #C65A22, cream #F5EFE2, ink #12201F, ink-soft #2A3838, charcoal #0A1514.
Fonts: Instrument Serif (headings), Inter Tight (body), JetBrains Mono (labels/mono).
Container: 1440px max, 48px gutter (32px tablet, 22px mobile).

## Pravidla

- Jazyk webu: čeština. URLs v češtině (/akce, /prihlaska, /potvrzeni).
- Žádný AI slop: no "dive into", "unleash", "game-changer", "seamless", "elevate".
- Žádné emoji v kódu ani v UI textech pokud není explicitně řečeno.
- Mobile-first: většina traffic z Instagram stories.
- Ceny v CZK jako integer (ne float, ne haléře).
- No user accounts — email je identifikátor.
- Design source of truth: design-assets/Homepage.html

## Konvence

- Komponenty: PascalCase, .tsx
- Hooks: camelCase, use prefix
- Utils: camelCase
- CSS: Tailwind classes, no inline styles
- Animations: Framer Motion (ne vanilla IntersectionObserver)
- Forms: react-hook-form + zod
- Package manager: npm (not pnpm)
