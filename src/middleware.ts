import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { 
          return req.cookies.get(name)?.value 
        },
        set(name, value, options) { 
          res.cookies.set({ name, value, ...options }) 
        },
        remove(name, options) { 
          res.cookies.set({ name, value: '', ...options }) 
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Rutas públicas (sin auth)
  const isPublic = req.nextUrl.pathname === '/' || 
                   req.nextUrl.pathname === '/register' || 
                   req.nextUrl.pathname === '/forgot' ||
                   req.nextUrl.pathname.startsWith('/auth/callback') ||
                   req.nextUrl.pathname.startsWith('/auth/reset')

  // Rutas protegidas (requieren auth)
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard')

  // Si no hay sesión y trata de acceder a ruta protegida -> login
  if (!session && isProtected) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Si hay sesión y está en página pública (excepto reset/callback) -> dashboard
  if (session && isPublic && !req.nextUrl.pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/register', '/forgot', '/dashboard/:path*', '/auth/:path*']
}
