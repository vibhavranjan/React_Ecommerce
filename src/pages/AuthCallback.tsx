import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

export default function AuthCallback() {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return

    async function syncWithMedusa() {
      const email = user!.email!
      const password = user!.sub! // Auth0 unique user ID — used as a stable password

      // Try login first (returning user)
      const loginRes = await fetch('http://localhost:9000/auth/customer/emailpass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (loginRes.ok) {
        const { token } = await loginRes.json()
        localStorage.setItem('medusa_token', token)
        navigate('/')
        return
      }

      // Login failed — new user, register them
      const registerRes = await fetch('http://localhost:9000/auth/customer/emailpass/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!registerRes.ok) return

      const { token } = await registerRes.json()

      // Create the Medusa customer profile
      await fetch('http://localhost:9000/store/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          first_name: user!.given_name ?? user!.nickname ?? '',
          last_name: user!.family_name ?? '',
        }),
      })

      localStorage.setItem('medusa_token', token)
      navigate('/')
    }

    syncWithMedusa()
  }, [isAuthenticated, isLoading, user])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 text-lg">Logging you in... dfs</p>
    </div>
  )
}