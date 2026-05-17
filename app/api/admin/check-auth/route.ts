import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('admin_session')?.value

  if (!sessionId) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Session exists
  return new Response(JSON.stringify({ authenticated: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
