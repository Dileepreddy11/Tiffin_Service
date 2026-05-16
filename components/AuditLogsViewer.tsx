'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, RefreshCw, Shield, Clock } from 'lucide-react'

interface LoginAttempt {
  timestamp: number
  success: boolean
  keyUsed?: string
  userAgent?: string
}

export default function AuditLogsViewer() {
  const [logs, setLogs] = useState<LoginAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all')

  const fetchLogs = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/audit-logs')
      if (!response.ok) throw new Error('Failed to fetch audit logs')
      
      const data = await response.json()
      setLogs(data.attempts || [])
    } catch (err) {
      setError('Failed to load audit logs')
      console.error('[v0] Audit logs error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    // Refresh every 5 minutes
    const interval = setInterval(fetchLogs, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredLogs = logs.filter(log => {
    if (filter === 'success') return log.success
    if (filter === 'failed') return !log.success
    return true
  })

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Admin Login Audit Trail</h2>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(['all', 'success', 'failed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-medium text-sm transition border-b-2 ${
              filter === f
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {f === 'all' && `All Attempts (${logs.length})`}
            {f === 'success' && `Successful (${logs.filter(l => l.success).length})`}
            {f === 'failed' && `Failed (${logs.filter(l => !l.success).length})`}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading audit logs...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredLogs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No login attempts found</p>
        </div>
      )}

      {/* Logs Table */}
      {!loading && filteredLogs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Time</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Key Used</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Device</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        log.success
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {log.success ? '✓ Success' : '✗ Failed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                    {log.keyUsed || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs truncate max-w-xs">
                    {log.userAgent
                      ? log.userAgent.substring(0, 50) + '...'
                      : 'Unknown'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
