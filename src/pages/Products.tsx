import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getStoreProducts, getFirstRegionId, type Product } from '../services/medusa'

// Medusa stores all prices in the smallest currency unit (e.g. cents for USD).
// Dividing by 100 converts 1999 → $19.99. Intl.NumberFormat handles the
// currency symbol and decimal formatting for any currency code.
function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

// A product can have multiple variants (e.g. sizes/colors), each with their own
// price list. We flatten all variant prices into one array and pick the lowest
// so the card always shows "from $X" — the most attractive number to show.
function getLowestPrice(product: Product): string {
  // v.prices can be undefined if Medusa omits it for a variant — fall back to []
  const prices = product.variants.flatMap((v) => v.prices ?? [])
  if (prices.length === 0) return 'Price unavailable'
  const lowest = prices.reduce((min, p) => (p.amount < min.amount ? p : min), prices[0])
  return formatPrice(lowest.amount, lowest.currency_code)
}

export default function Products() {
  // products: the list fetched from Medusa's /store/products endpoint
  // loading: true while the fetch is in-flight — drives the spinner
  // error: holds the error message if the fetch fails — drives the error UI
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Read the JWT token saved during login. !! converts the string/null to boolean.
  const token = localStorage.getItem('medusa_token')
  const isLoggedIn = !!token
  const navigate = useNavigate()

  // customerName is fetched separately so the navbar can greet the logged-in user.
  const [customerName, setCustomerName] = useState('')

  // Fetch region first, then products with that region_id.
  // Medusa v2 only returns variant prices when a region_id is included in the request.
  // finally() always runs (success or failure) so the spinner is always cleared.
  useEffect(() => {
    getFirstRegionId()
      .then((regionId) => getStoreProducts(regionId ?? undefined))
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Fetch the logged-in customer's name for the navbar greeting.
  // Skips the request entirely if no token exists (user is not logged in).
  // The publishable API key is required on every Medusa store-front request.
  useEffect(() => {
    if (!token) return
    const MEDUSA_API = import.meta.env.VITE_MEDUSA_STORE_URL || 'http://localhost:9000'
    const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || ''
    fetch(`${MEDUSA_API}/store/customers/me`, {
      headers: {
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
        // Bearer token identifies who the logged-in customer is
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.customer) setCustomerName(data.customer.first_name)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── shared layout with Home.tsx.
          Active "Products" link is purple to indicate the current page. */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        {/* Brand — clicking takes the user back to the homepage */}
        <Link to="/" className="text-xl font-bold text-purple-600">MyShop</Link>

        <div className="flex items-center gap-4">
          {/* Active link styled in purple so the user knows which page they're on */}
          <Link to="/products" className="text-sm font-medium text-purple-600">Products</Link>

          {/* Show greeting + logout when logged in, otherwise show Sign in */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">Hi, {customerName || 'there'}</span>

              {/* Logout: remove the JWT from localStorage and redirect to /login */}
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

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>

        {/* ── Loading state ──
            Shown while the Medusa API request is in-flight.
            role="status" lets screen readers announce "loading" to assistive tech. */}
        {loading && (
          <div className="flex justify-center items-center py-24" role="status">
            {/* CSS-only spinner: one border side is transparent, rotation creates the spin */}
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ── Error state ──
            Shown when the fetch fails (network down, Medusa server not running, etc.).
            role="alert" causes screen readers to announce the error immediately.
            "Try again" reloads the page to re-trigger the useEffect fetch. */}
        {error && (
          <div className="text-center py-24" role="alert">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-purple-600 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* ── Empty state ──
            Medusa returned successfully but the store has no products yet. */}
        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-500 py-24">No products found.</p>
        )}

        {/* ── Product grid ──
            Responsive columns: 1 on mobile → 2 on sm → 3 on lg → 4 on xl.
            Each card is a <Link> so the entire card is clickable and navigates
            to the product detail page at /products/:id. */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}              // React needs a stable key for list diffing
                to={`/products/${product.id}`} // navigates to the (future) detail page
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* ── Thumbnail ──
                    aspect-square keeps the image area perfectly square regardless of
                    the actual image dimensions. group-hover:scale-105 zooms on card hover
                    (the "group" class on the parent <Link> enables this).
                    loading="lazy" defers off-screen images to speed up initial page load. */}
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      // If the image URL is broken (e.g. placeholder service down),
                      // swap to the emoji fallback rather than showing a broken image icon.
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.removeAttribute('hidden')
                      }}
                    />
                  ) : null}
                  {/* Fallback shown when there's no thumbnail or the image fails to load */}
                  <div
                    hidden={!!product.thumbnail}
                    className="w-full h-full flex items-center justify-center text-gray-300 text-5xl"
                  >
                    🛍️
                  </div>
                </div>

                {/* ── Card body ── */}
                <div className="p-4">
                  {/* line-clamp-2 truncates long titles to 2 lines to keep cards uniform */}
                  <h2 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
                    {product.title}
                  </h2>

                  {/* Description is optional in Medusa — only render if it exists */}
                  {product.description && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                  )}

                  {/* Show the lowest price across all variants (calculated above) */}
                  <p className="text-purple-600 font-bold text-sm">{getLowestPrice(product)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
