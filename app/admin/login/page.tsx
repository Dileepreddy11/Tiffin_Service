'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, AlertCircle, LogIn } from 'lucide-react'
import { verifyAdminCredentialsSimple as verifyAdminCredentials, createSessionTokenSimple as createSessionToken, logLoginAttemptSimple as logLoginAttempt } from '@/lib/auth-simple'

export default function AdminLoginPage() {
  const router = useRouter()
  const [key, setKey] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Verify credentials
      const credentialsValid = verifyAdminCredentials(key, password)
      
      if (!credentialsValid) {
        try {
          await logLoginAttempt(false, key)
        } catch (e) {
          // Silent fail - audit logging optional
        }
        setError('Invalid credentials. Please try again.')
        setLoading(false)
        return
      }

      // Create session
      const sessionId = createSessionToken()
      
      // Log the attempt (optional, doesn't block login)
      try {
        await logLoginAttempt(true, key)
      } catch (logErr) {
        // Silent fail - audit logging is optional
      }

      // Store session in cookies via API
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create session cookie')
      }

      // Redirect to admin dashboard
      setTimeout(() => {
        router.push('/admin')
      }, 500)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('[v0] Login error:', err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-orange-100 p-3 rounded-full">
            <Lock className="w-6 h-6 text-orange-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Login</h1>
        <p className="text-center text-gray-600 mb-8">Tiffin Service Management Portal</p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Key Input */}
          <div>
            <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Key
            </label>
            <input
              id="key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your admin key"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              disabled={loading}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              disabled={loading}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            This is a secure admin portal. Only authorized personnel should access this page.
          </p>
        </div>
      </div>
    </div>
  )
}
