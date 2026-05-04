{/* for Auth 0 with medusa
// This page is the "middleman" after Auth0 login.
// Auth0 redirects the user here after they log in.
// The user never really sees this page — it runs logic silently and redirects away.

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

export default function AuthCallback() {
  // useAuth0() gives us data about the logged-in user from Auth0
  // user     → their profile (email, name, unique ID)
  // isAuthenticated → true if Auth0 confirmed they are logged in
  // isLoading       → true while Auth0 is still checking (not ready yet)
  const { user, isAuthenticated, isLoading } = useAuth0()

  // useNavigate lets us redirect the user to another page programmatically
  const navigate = useNavigate()

  // useEffect runs code after the component renders
  // The dependency array [isAuthenticated, isLoading, user] means:
  // "re-run this effect whenever any of these values change"
  useEffect(() => {
    // Wait until Auth0 has finished loading AND confirmed the user is logged in
    // If not ready yet, exit early and do nothing
    if (isLoading || !isAuthenticated || !user) return

    async function syncWithMedusa() {
      // Extract the user's email from their Auth0 profile
      const email = user!.email!

      // user.sub is Auth0's unique ID for this user (e.g. "auth0|abc123")
      // We use it as a password for Medusa — Auth0 already verified the user,
      // so we just need a stable, unique value as the Medusa password
      const password = user!.sub!

      // --- STEP 1: Try to log in to Medusa (for returning users) ---
      // POST to Medusa's emailpass auth endpoint with email + password
      const loginRes = await fetch('http://localhost:9000/auth/customer/emailpass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      // If login succeeded, Medusa returns a JWT token
      // Save it to localStorage so future API calls (cart, orders) can use it
      if (loginRes.ok) {
        const { token } = await loginRes.json()
        localStorage.setItem('medusa_token', token)
        navigate('/') // redirect to home page
        return        // stop here — no need to register
      }

      // --- STEP 2: Login failed — this is a new user, register them ---
      // POST to Medusa's register endpoint to create an auth account
      const registerRes = await fetch('http://localhost:9000/auth/customer/emailpass/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      // If registration also failed, something is wrong — stop and do nothing
      if (!registerRes.ok) return

      const { token } = await registerRes.json()

      // --- STEP 3: Create the customer profile in Medusa ---
      // Registering only creates an auth identity (login credentials)
      // We also need to create a customer profile (name, email) separately
      // The Authorization header proves we are the newly registered user
      await fetch('http://localhost:9000/store/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          // Use given_name if available, fall back to nickname, then empty string
          first_name: user!.given_name ?? user!.nickname ?? '',
          last_name: user!.family_name ?? '',
        }),
      })

      // Save the token and redirect to home page
      localStorage.setItem('medusa_token', token)
      navigate('/')
    }

    syncWithMedusa()
  }, [isAuthenticated, isLoading, user])

  // While the logic above runs, show a simple loading message to the user
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 text-lg">Logging you in...</p>
    </div>
  )
}
*/}
// my Auth 0 without medusa

// This is the simpler version — Auth0 is the only source of truth.
// No Medusa API calls at all. Just get the Auth0 token and redirect.
// import { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth0 } from '@auth0/auth0-react'
// export default function AuthCallbackAuth0Only() {

//   // getAccessTokenSilently → fetches the Auth0 JWT token silently (no popup)
//   // isAuthenticated        → true if the user is logged in via Auth0
//   // isLoading              → true while Auth0 is still initializing
//   const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0()

//   // useNavigate lets us redirect the user to another page in code
//   const navigate = useNavigate()

//   useEffect(() => {
//     // Exit early if Auth0 is still loading or user is not logged in yet
//     if (isLoading || !isAuthenticated) return

//     async function handleCallback() {
//       // Ask Auth0 for the access token of the currently logged-in user
//       // This token proves the user's identity — no username/password needed here
//       const token = await getAccessTokenSilently()

//       // Save the token in localStorage so other pages can attach it to API calls
//       // e.g. fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
//       localStorage.setItem('auth0_token', token)

//       // Redirect to the home page — auth is complete
//       navigate('/')
//     }

//     handleCallback()

//   // Re-run this effect whenever isAuthenticated or isLoading changes
//   }, [isAuthenticated, isLoading])

//   // Show a loading message while the token is being fetched
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <p className="text-gray-600 text-lg">Logging you in...</p>
//     </div>
//   )
// }