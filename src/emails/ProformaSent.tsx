import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export interface ProformaSentProps {
  orderNumber: string
  customerFirstName: string
  eventName: string
  totalCzk: number
  bankAccount: string
  bankCode: string
  iban: string
  variableSymbol: string
  dueDate: string
  qrDataUrl: string
  appUrl: string
}

const colors = {
  cream: '#F5EFE2',
  ink: '#12201F',
  inkSoft: '#2A3838',
  orange: '#E97940',
  hairline: 'rgba(18, 32, 31, 0.15)',
}

function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ').format(value).replace(/ /g, ' ') + ' Kč'
}

export function ProformaSent({
  orderNumber,
  customerFirstName,
  eventName,
  totalCzk,
  bankAccount,
  bankCode,
  iban,
  variableSymbol,
  dueDate,
  qrDataUrl,
  appUrl,
}: ProformaSentProps) {
  return (
    <Html lang="cs">
      <Head />
      <Preview>Proforma {orderNumber} — zaplať a vidíme se na akci</Preview>
      <Body
        style={{
          backgroundColor: colors.cream,
          color: colors.ink,
          fontFamily: "'Inter Tight', 'Helvetica Neue', sans-serif",
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
          <Section style={{ padding: '32px 40px 20px', borderBottom: `1px solid ${colors.hairline}` }}>
            <Text style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: colors.orange, margin: 0 }}>
              § Proforma — Vydání 04
            </Text>
            <Heading
              as="h1"
              style={{
                fontFamily: "'Instrument Serif', 'Georgia', serif",
                fontStyle: 'italic',
                fontSize: 36,
                lineHeight: 1.05,
                color: colors.ink,
                margin: '12px 0 0',
                letterSpacing: '-0.02em',
              }}
            >
              Zaplať převodem.
              <br />
              Místo držíme 7 dní.
            </Heading>
          </Section>

          <Section style={{ padding: '28px 40px' }}>
            <Text style={{ fontSize: 16, lineHeight: 1.55, color: colors.inkSoft, margin: 0 }}>
              Ahoj {customerFirstName || 'tam'},
            </Text>
            <Text style={{ fontSize: 16, lineHeight: 1.55, color: colors.inkSoft, marginTop: 16 }}>
              přikládáme proforma fakturu na objednávku <strong>{orderNumber}</strong> ({eventName}).
              Místo držíme 7 dní od vystavení. Po připsání platby na účet vystavíme ostrou fakturu a
              potvrdíme rezervaci.
            </Text>
          </Section>

          {/* QR + bank details side by side (table layout — email-safe) */}
          <Section style={{ padding: '8px 40px 24px' }}>
            <table width="100%" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td valign="top" style={{ width: 160 }}>
                    <Img
                      src={qrDataUrl}
                      alt="QR platba"
                      width={140}
                      height={140}
                      style={{ display: 'block' }}
                    />
                    <Text style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.inkSoft, marginTop: 6, textAlign: 'center' }}>
                      Naskenuj v bance
                    </Text>
                  </td>
                  <td valign="top" style={{ paddingLeft: 24 }}>
                    {[
                      { label: 'Účet', value: `${bankAccount}/${bankCode}` },
                      { label: 'IBAN', value: iban },
                      { label: 'Variabilní symbol', value: variableSymbol },
                      { label: 'Částka', value: formatCzk(totalCzk) },
                      { label: 'Splatnost', value: dueDate },
                    ].map((row) => (
                      <table key={row.label} width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 8 }}>
                        <tbody>
                          <tr>
                            <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.inkSoft, paddingBottom: 2 }}>
                              {row.label}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: colors.ink }}>
                              {row.value}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={{ borderTop: `1px solid ${colors.hairline}`, margin: 0 }} />

          <Section style={{ padding: '24px 40px 32px' }}>
            <Text style={{ fontSize: 14, lineHeight: 1.55, color: colors.inkSoft, margin: 0 }}>
              Proforma v PDF najdeš v příloze. Otázky:{' '}
              <Link href="mailto:david@daklnetworking.cz" style={{ color: colors.orange }}>
                david@daklnetworking.cz
              </Link>
            </Text>
            <Text style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: colors.inkSoft, opacity: 0.6, marginTop: 32 }}>
              DaKl Networking · MMXXVI · {appUrl.replace(/^https?:\/\//, '')}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ProformaSent
