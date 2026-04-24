export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatCZK(amount: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' Kč'
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

export function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('cs-CZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateDot(dateStr: string): string {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(2)
  return `${day}.${month}.${year}`
}

export function generateICS(event: {
  name: string
  starts_at: string
  ends_at: string
  location_name?: string | null
  location_address?: string | null
  short_description?: string | null
}): string {
  const formatICSDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  }

  const location = [event.location_name, event.location_address]
    .filter(Boolean)
    .join(', ')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Conventus//Event//CS',
    'BEGIN:VEVENT',
    `DTSTART:${formatICSDate(event.starts_at)}`,
    `DTEND:${formatICSDate(event.ends_at)}`,
    `SUMMARY:Conventus — ${event.name}`,
    location ? `LOCATION:${location}` : '',
    event.short_description ? `DESCRIPTION:${event.short_description.replace(/\n/g, '\\n')}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n')
}

export const EVENT_TYPE_LABELS: Record<string, string> = {
  lod: 'Loď',
  vino: 'Víno',
  more: 'Moře',
  garden: 'Letní',
  jine: 'Jiné',
}
