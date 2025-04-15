import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    // Refresh session if it exists
    await supabase.auth.getSession()

    // Refresh access token if it exists
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      await supabase.auth.refreshSession()
    }

    // If there's no session and the request is for the API, return 401
    if (!session && request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      )
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}