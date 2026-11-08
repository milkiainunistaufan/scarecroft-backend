import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// 1. UBAH NAMA FUNGSI INI DARI 'middleware' MENJADI 'proxy'
export async function proxy(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Inisialisasi Supabase Client untuk Proxy
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value, options))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Ambil data user aktif
  const { data: { user } } = await supabase.auth.getUser()

  // Logika Proteksi Route
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isApiAuthPage = request.nextUrl.pathname.startsWith('/api/auth')

  if (!user && !isLoginPage && !isApiAuthPage) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (user && isLoginPage) {
    const dashboardUrl = new URL('/', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return response
}

// Aturan matcher tetap sama
export const config = {
  matcher: [
    '/((?!api/portfolios|api/messages|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}