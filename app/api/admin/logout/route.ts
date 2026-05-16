import { NextRequest, NextResponse } from 'next/server'
import { endAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get session ID from cookie
    const sessionId = request.cookies.get('admin_session_id')?.value

    if (sessionId) {
      // End session in Firebase
      await endAdminSession(sessionId)
    }

    // Create response and clear cookie
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    )

    response.cookies.set({
      name: 'admin_session_id',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[v0] Logout API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
