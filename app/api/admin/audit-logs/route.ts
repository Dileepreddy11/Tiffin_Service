import { NextRequest, NextResponse } from 'next/server'
import { getRecentLoginAttempts, verifyAdminSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const sessionId = request.cookies.get('admin_session_id')?.value

    if (!sessionId || !(await verifyAdminSession(sessionId))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get audit logs
    const logs = await getRecentLoginAttempts(100)

    return NextResponse.json({
      success: true,
      logs,
      total: logs.length,
    })
  } catch (error) {
    console.error('[v0] Audit logs API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
