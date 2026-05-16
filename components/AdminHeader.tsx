'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Lock } from 'lucide-react'
import { useState } from 'react'

export default function AdminHeader() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' })
      if (response.ok) {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('[v0] Logout error:', error)
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Lock className="w-5 h-5" />
        <h1 className="text-lg font-bold">Secure Admin Portal</h1>
      </div>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white px-4 py-2 rounded-lg font-semibold transition"
      >
        <LogOut className="w-4 h-4" />
        {loading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  )
}
