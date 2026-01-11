import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED = ['en', 'kn', 'si', 'ta'] as const
const LANG_COOKIE = 'idam_lang'
const VISITOR_COOKIE = 'idam_vid'

export function middleware(req: NextRequest) {
  const url = new URL(req.url)

  // Language
  const qp = url.searchParams.get('lang')
  const existing = req.cookies.get(LANG_COOKIE)?.value
  let lang = existing || 'en'
  if (qp && (SUPPORTED as readonly string[]).includes(qp)) lang = qp

  const res = NextResponse.next()
  res.cookies.set(LANG_COOKIE, lang, { path: '/', sameSite: 'lax' })

  // Visitor token for analytics dedupe
  const vid = req.cookies.get(VISITOR_COOKIE)?.value
  if (!vid) {
    const token = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now())
    res.cookies.set(VISITOR_COOKIE, token, { path: '/', sameSite: 'lax' })
  }

  return res
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)'],
}
