// Link is used for client-side navigation (no page reload)
// useState manages form field values and UI state
// useNavigate lets us redirect programmatically after registration
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// These values come from your .env file. If not set, fall back to localhost defaults.
const MEDUSA_API = import.meta.env.VITE_MEDUSA_STORE_URL || 'http://localhost:9000'
const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_47084fe1e0298b3cb824c4e92b6b4d0bd4b4f2fac0cdb274a1cfdc4000edb987'

export default function Register() {
  const navigate = useNavigate()

  // Controlled inputs — each field has its own state variable and setter
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // error holds the message to show if something goes wrong
  // loading disables the button while the API call is in progress
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    // Prevents the browser from refreshing the page on form submit
    e.preventDefault()
    setError('')
    if (password.length < 8) {
        setError('Password must be at least 8 characters')
        return
    }
    setLoading(true)
    
    try {
      // STEP 1 — Create auth identity (email + password)
      // This registers the login credentials in Medusa's auth system
      // On success, Medusa returns a JWT token we need for Step 2
      const authRes = await fetch(`${MEDUSA_API}/auth/customer/emailpass/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY },
        body: JSON.stringify({ email, password }),
      })
      const authData = await authRes.json()
      // If status is not 2xx, throw an error to jump to the catch block
      if (!authRes.ok) throw new Error(authData.message || 'Registration failed')

      // STEP 2 — Create the customer profile (name, email)
      // We use the token from Step 1 in the Authorization header to prove identity
      // This links the profile to the auth identity created above
      const customerRes = await fetch(`${MEDUSA_API}/store/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${authData.token}`, // token from Step 1
        },
        body: JSON.stringify({ email, first_name: firstName, last_name: lastName }),
      })
      const customerData = await customerRes.json()
      if (!customerRes.ok) throw new Error(customerData.message || 'Failed to create profile')

      // Both steps succeeded — send user to login page
      navigate('/login')

    } catch (err: unknown) {
      // Show the error message on the page so the user knows what went wrong
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      // Always re-enable the button whether the request succeeded or failed
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-600 mt-2 text-sm">Sign up to get started</p>
        </div>

        {/* onSubmit calls handleSubmit when the form is submitted */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* First & Last name side by side using flexbox */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-900 mb-1">First name</label>
              <input
                type="text"
                placeholder="John"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-900 mb-1">Last name</label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Only renders if error state is not empty */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* disabled={loading} prevents double-submitting while request is in flight */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            {/* Button text changes to give feedback while loading */}
            {loading ? 'Creating account...' : 'Create account'}
          </button>

        </form>

        {/* Link to login page for users who already have an account */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}
