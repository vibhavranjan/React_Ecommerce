import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
const MEDUSA_API = import.meta.env.VITE_MEDUSA_STORE_URL || 'http://localhost:9000'
const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_47084fe1e0298b3cb824c4e92b6b4d0bd4b4f2fac0cdb274a1cfdc4000edb987'

export default function Home() {
  const token = localStorage.getItem('medusa_token')
  const isLoggedIn = !!token
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState('')

  useEffect(() => {
    if (!token) return
    fetch(`${MEDUSA_API}/store/customers/me`, {
      headers: {
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.customer) setCustomerName(data.customer.first_name)
      })
  }, [])

  return (
    
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-purple-600">MyShop</span>
        <div className="flex items-center gap-4">
          <Link to="/products" className="text-sm text-gray-600 hover:text-gray-900">Products</Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">Hi, {customerName || 'there'}</span>

              <button
                onClick={() => {
                  localStorage.removeItem('medusa_token')
                  navigate('/login')
                }}
                className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Shop the latest</h1>
        <p className="text-gray-500 text-lg max-w-md mb-8">
          Discover our curated collection of products, delivered fast to your door.
        </p>
        <Link
          to="/products"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm"
        >
          Browse Products
        </Link>
      </section>

      {/* Feature cards */}
      <section className="max-w-4xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: '🚚', title: 'Free Shipping', desc: 'On all orders over $50' },
          { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free returns' },
          { icon: '🔒', title: 'Secure Checkout', desc: 'Your data is always safe' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </section>

    </div>
  )
}
