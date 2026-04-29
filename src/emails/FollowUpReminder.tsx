import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export interface FollowUpReminderProps {
  recipientName: string
  subject: string
  body: string | null
  customerEmail: string
  customerName: string | null
  dueAtFormatted: string
  appUrl: string
}

const colors = {
  cream: '#F5EFE2',
  ink: '#12201F',
  inkSoft: '#2A3838',
  orange: '#E97940',
  hairline: 'rgba(18, 32, 31, 0.15)',
}

export function FollowUpReminder({
  recipientName,
  subject,
  body,
  customerEmail,
  customerName,
  dueAtFormatted,
  appUrl,
}: FollowUpReminderProps) {
  return (
    <Html lang="cs">
      <Head />
      <Preview>Follow-up: {subject}</Preview>
      <Body
        style={{
          backgroundColor: colors.cream,
          fontFamily: "'Inter Tight', sans-serif",
          margin: 0,
          padding: '40px 16px',
        }}
      >
        <Container style={{ maxWidth: 560, margin: '0 auto', backgroundColor: '#FBF8EF', border: `1px solid ${colors.hairline}` }}>
          <Section style={{ padding: '28px 36px', borderBottom: `1px solid ${colors.hairline}` }}>
            <Text style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: colors.orange, margin: 0 }}>
              § Follow-up — DaKl Networking
            </Text>
            <Heading
              as="h1"
              style={{
                fontFamily: "'Instrument Serif', 'Georgia', serif",
                fontStyle: 'italic',
                fontSize: 30,
                lineHeight: 1.1,
                color: colors.ink,
                margin: '10px 0 0',
                letterSpacing: '-0.018em',
              }}
            >
              {subject}
            </Heading>
          </Section>

          <Section style={{ padding: '24px 36px' }}>
            <Text style={{ fontSize: 15, color: colors.inkSoft, margin: 0 }}>
              Ahoj {recipientName || 'Davide'},
            </Text>
            <Text style={{ fontSize: 15, color: colors.inkSoft, lineHeight: 1.55, marginTop: 14 }}>
              Připomínka: <strong>{subject}</strong> — splatnost {dueAtFormatted}.
            </Text>
            {body && (
              <Text style={{ fontSize: 15, color: colors.inkSoft, lineHeight: 1.55, marginTop: 14 }}>
                {body}
              </Text>
            )}
          </Section>

          {customerEmail && (
            <Section
              style={{
                padding: '16px 36px',
                margin: '0 36px 16px',
                border: `1px solid ${colors.hairline}`,
                backgroundColor: 'rgba(18, 32, 31, 0.025)',
              }}
            >
              <Text style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.inkSoft, margin: 0 }}>
                Zákazník
              </Text>
              <Text style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 18, color: colors.ink, margin: '4px 0 0' }}>
                {customerName || customerEmail}
              </Text>
              <Text style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: colors.inkSoft, margin: '2px 0 0' }}>
                {customerEmail}
              </Text>
            </Section>
          )}

          <Hr style={{ borderTop: `1px solid ${colors.hairline}`, margin: 0 }} />

          <Section style={{ padding: '20px 36px 30px' }}>
            <Link
              href={`${appUrl}/admin/followups`}
              style={{
                display: 'inline-block',
                padding: '10px 22px',
                backgroundColor: colors.orange,
                color: colors.cream,
                textDecoration: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              Otevřít follow-ups →
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default FollowUpReminder
