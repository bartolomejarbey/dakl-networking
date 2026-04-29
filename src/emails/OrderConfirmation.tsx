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

export interface OrderConfirmationProps {
  orderNumber: string
  customerFirstName: string
  eventName: string
  eventDate: string
  eventVenue: string | null
  totalCzk: number
  paymentMethodLabel: string
  isProforma?: boolean
  appUrl: string
}

const colors = {
  cream: '#F5EFE2',
  ink: '#12201F',
  inkSoft: '#2A3838',
  forest: '#163933',
  forestDeep: '#0F2926',
  orange: '#E97940',
  hairline: 'rgba(18, 32, 31, 0.15)',
}

function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ').format(value).replace(/ /g, ' ') + ' Kč'
}

export function OrderConfirmation({
  orderNumber,
  customerFirstName,
  eventName,
  eventDate,
  eventVenue,
  totalCzk,
  paymentMethodLabel,
  isProforma,
  appUrl,
}: OrderConfirmationProps) {
  const documentLabel = isProforma ? 'Proforma faktura' : 'Faktura'
  const headline = isProforma
    ? 'Proforma odeslána. Zaplať a vidíme se na akci.'
    : 'Hotovo. Vidíme se na akci.'

  return (
    <Html lang="cs">
      <Head />
      <Preview>
        {documentLabel} {orderNumber} — DaKl Networking
      </Preview>
      <Body
        style={{
          backgroundColor: colors.cream,
          color: colors.ink,
          fontFamily:
            "'Inter Tight', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          margin: 0,
          padding: '40px 16px',
        }}
      >
        <Container
          style={{
            maxWidth: 600,
            margin: '0 auto',
            backgroundColor: '#FBF8EF',
            border: `1px solid ${colors.hairline}`,
          }}
        >
          {/* Masthead */}
          <Section
            style={{
              padding: '32px 40px 20px',
              borderBottom: `1px solid ${colors.hairline}`,
            }}
          >
            <Text
              style={{
                fontFamily: "'JetBrains Mono', 'Menlo', monospace",
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: colors.orange,
                margin: 0,
              }}
            >
              § {documentLabel} — Vydání 04
            </Text>
            <Heading
              as="h1"
              style={{
                fontFamily: "'Instrument Serif', 'Georgia', serif",
                fontStyle: 'italic',
                fontSize: 38,
                lineHeight: 1.05,
                color: colors.ink,
                margin: '12px 0 0',
                letterSpacing: '-0.02em',
              }}
            >
              {headline}
            </Heading>
          </Section>

          {/* Greeting + summary */}
          <Section style={{ padding: '28px 40px' }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 1.55,
                color: colors.inkSoft,
                margin: 0,
              }}
            >
              Ahoj {customerFirstName || 'tam'},
            </Text>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 1.55,
                color: colors.inkSoft,
                marginTop: 16,
              }}
            >
              {isProforma
                ? `přikládáme proforma fakturu k objednávce ${orderNumber}. Po připsání platby na účet ti vystavíme ostrou fakturu a místo bude potvrzeno.`
                : `přikládáme fakturu k objednávce ${orderNumber}. Děkujeme — místo na akci je tvoje.`}
            </Text>
          </Section>

          {/* Event card */}
          <Section
            style={{
              padding: '20px 40px',
              borderTop: `1px solid ${colors.hairline}`,
              borderBottom: `1px solid ${colors.hairline}`,
              backgroundColor: 'rgba(18, 32, 31, 0.025)',
            }}
          >
            <Text
              style={{
                fontFamily: "'JetBrains Mono', 'Menlo', monospace",
                fontSize: 9,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: colors.inkSoft,
                margin: 0,
                marginBottom: 8,
              }}
            >
              Akce
            </Text>
            <Text
              style={{
                fontFamily: "'Instrument Serif', 'Georgia', serif",
                fontStyle: 'italic',
                fontSize: 24,
                lineHeight: 1.2,
                color: colors.ink,
                margin: 0,
              }}
            >
              {eventName}
            </Text>
            {eventVenue && (
              <Text
                style={{
                  fontFamily: "'JetBrains Mono', 'Menlo', monospace",
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: colors.inkSoft,
                  margin: '8px 0 0',
                }}
              >
                {eventVenue}
              </Text>
            )}
            <Text
              style={{
                fontFamily: "'JetBrains Mono', 'Menlo', monospace",
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: colors.inkSoft,
                margin: '4px 0 0',
              }}
            >
              {eventDate}
            </Text>
          </Section>

          {/* Order details */}
          <Section style={{ padding: '24px 40px' }}>
            <table width="100%" cellPadding={0} cellSpacing={0} style={{ fontSize: 14 }}>
              <tbody>
                <tr>
                  <td style={{ padding: '6px 0', color: colors.inkSoft }}>Číslo objednávky</td>
                  <td style={{ padding: '6px 0', textAlign: 'right', fontFamily: "'JetBrains Mono', 'Menlo', monospace", color: colors.ink }}>
                    {orderNumber}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: colors.inkSoft }}>Forma platby</td>
                  <td style={{ padding: '6px 0', textAlign: 'right', color: colors.ink }}>
                    {paymentMethodLabel}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: '12px 0 6px',
                      borderTop: `1px solid ${colors.hairline}`,
                      fontFamily: "'JetBrains Mono', 'Menlo', monospace",
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      fontSize: 11,
                      color: colors.ink,
                    }}
                  >
                    Celkem
                  </td>
                  <td
                    style={{
                      padding: '12px 0 6px',
                      textAlign: 'right',
                      borderTop: `1px solid ${colors.hairline}`,
                      fontFamily: "'JetBrains Mono', 'Menlo', monospace",
                      fontSize: 18,
                      color: colors.ink,
                    }}
                  >
                    {formatCzk(totalCzk)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={{ borderTop: `1px solid ${colors.hairline}`, margin: 0 }} />

          {/* Footer */}
          <Section style={{ padding: '24px 40px 32px' }}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: colors.inkSoft,
                margin: 0,
              }}
            >
              {documentLabel} v PDF najdeš v příloze tohoto e-mailu. Pokud máš jakoukoli otázku, napiš
              přímo na{' '}
              <Link href="mailto:david@daklnetworking.cz" style={{ color: colors.orange }}>
                david@daklnetworking.cz
              </Link>
              .
            </Text>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: colors.inkSoft,
                marginTop: 16,
              }}
            >
              Detail tvé objednávky najdeš taky online:
            </Text>
            <Link
              href={`${appUrl}/akce`}
              style={{
                display: 'inline-block',
                marginTop: 14,
                padding: '12px 24px',
                backgroundColor: colors.orange,
                color: colors.cream,
                textDecoration: 'none',
                fontFamily: "'JetBrains Mono', 'Menlo', monospace",
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              Otevřít archiv akcí →
            </Link>
            <Text
              style={{
                fontFamily: "'JetBrains Mono', 'Menlo', monospace",
                fontSize: 9,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: colors.inkSoft,
                opacity: 0.6,
                marginTop: 32,
              }}
            >
              DaKl Networking · Pražský čtvrtletník · MMXXVI
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderConfirmation
