import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const {
      data: { session }
    } = await supabase.auth.getSession()
    
    // If no session, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Check user role in profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // List of allowed roles
    const allowed = ['servicer','agency','agent']
    
    if (!profile || !allowed.includes(profile.role)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    
    return res
  } catch (err) {
    console.error('Middleware error:', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

// Only run middleware on dashboard routes
export const config = { matcher: ['/dashboard/:path*'] }
