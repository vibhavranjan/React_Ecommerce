// useSearchParams lets us read the ?token=... from the URL
import { Link, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MEDUSA_API = import.meta.env.VITE_MEDUSA_STORE_URL || 'http://localhost:9000'
const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_47084fe1e0298b3cb824c4e92b6b4d0bd4b4f2fac0cdb274a1cfdc4000edb987'

export default function ResetPassword() {
  const navigate = useNavigate()
  // searchParams reads query parameters from the URL (?token=...)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') // extracts the token value from the URL

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
    }

    setLoading(true)
    console.log("Token being sent to Medusa:", token)
    try {
      // POST to Medusa's update endpoint with the token from URL + new password
      const res = await fetch(`${MEDUSA_API}/auth/customer/emailpass/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Reset failed')
    }
      // Show success message
      setDone(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Early return — show success screen after password is reset
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password updated!</h1>
          <p className="text-gray-500 text-sm">You can now sign in with your new password.</p>
          <Link to="/login" className="text-purple-600 text-sm font-medium hover:underline mt-6 block">
            Go to Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Set new password</h1>
          <p className="text-gray-600 mt-2 text-sm">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-1">
                Confirm Password
            </label>
            <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>

      </div>
    </div>
  )
}
