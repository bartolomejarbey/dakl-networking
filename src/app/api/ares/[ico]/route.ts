import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { ico: string } }
) {
  const { ico } = params

  // Validate ICO format: must be exactly 8 digits
  if (!/^\d{8}$/.test(ico)) {
    return NextResponse.json(
      { error: 'invalid_ico', message: 'ICO must be exactly 8 digits' },
      { status: 400 }
    )
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 3000)

  try {
    const response = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`,
      { signal: controller.signal }
    )

    clearTimeout(timeout)

    if (!response.ok) {
      return NextResponse.json(
        { error: 'not_found', message: 'Subject not found in ARES' },
        { status: 404 }
      )
    }

    const data = await response.json()

    const sidlo = data.sidlo || {}
    const cisloDomovni = sidlo.cisloDomovni || ''
    const cisloOrientacni = sidlo.cisloOrientacni
      ? `/${sidlo.cisloOrientacni}`
      : ''
    const ulice = sidlo.ulice || sidlo.obec || ''
    const street = ulice
      ? `${ulice} ${cisloDomovni}${cisloOrientacni}`.trim()
      : `${cisloDomovni}${cisloOrientacni}`.trim()

    return NextResponse.json({
      name: data.obchodniJmeno || '',
      dic: data.dic || null,
      street,
      city: sidlo.obec || '',
      zip: sidlo.psc ? String(sidlo.psc) : '',
    })
  } catch (error: unknown) {
    clearTimeout(timeout)

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'timeout', message: 'ARES API request timed out' },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: 'not_found', message: 'Failed to fetch data from ARES' },
      { status: 502 }
    )
  }
}
