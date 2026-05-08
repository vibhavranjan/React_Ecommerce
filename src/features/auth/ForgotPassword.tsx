
// Link for client-side navigation, useState for form state management
import {Link} from 'react-router-dom'
import { useState } from "react"

// Medusa backend URL and publishable key — same as Login and Register
const MEDUSA_API = import.meta.env.VITE_MEDUSA_STORE_URL || 'http://localhost:9000'
const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_47084fe1e0298b3cb824c4e92b6b4d0bd4b4f2fac0cdb274a1cfdc4000edb987'

export default function ForgotPassword(){
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false) // shows success message after submit
    async function handleSubmit( e: React.FormEvent){
        e.preventDefault()
        setError('')
        setLoading(true)
        try{
             // POST to Medusa's reset-password endpoint
            // We send { identifier: email } — Medusa uses "identifier" not "email" here
            // Medusa will email the user a reset link containing a token
            const res = await fetch(`${MEDUSA_API}/auth/customer/emailpass/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
                },
                body: JSON.stringify({ identifier: email }),
            })
            if (!res.ok) throw new Error('Failed to send reset Email')
            // If successful, show the success message instead of the form
            setSubmitted(true)
        }
        catch (err: unknown){
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            // Always re-enable the button whether it succeeded or failed
            setLoading(false)
        }
    }

    // If the form was submitted successfully, replace the whole page with a success message
    // This is called an "early return" — we return JSX before reaching the main return below
    if (submitted) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-500 text-sm">
                We sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/login" className="text-purple-600 text-sm font-medium hover:underline mt-6 block">
                Back to Sign in
            </Link>
            </div>
        </div>
        )
    }
   // Main return — the form shown before submission
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Forgot password?</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Only shows if error state is not empty */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        {/* Link back to login */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-purple-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}