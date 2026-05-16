import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check if accessing /admin route (but not /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Get session cookie
    const sessionId = request.cookies.get('admin_session_id')?.value

    if (!sessionId) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verify session with a simple check (optional - can be enhanced)
    // For now, just check that the cookie exists
    // In production, you might want to verify it with Firebase
  }

  return NextResponse.next()
}

// Apply middleware to admin routes
export const config = {
  matcher: ['/admin/:path*'],
}
