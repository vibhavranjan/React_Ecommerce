const MEDUSA_API = import.meta.env.VITE_MEDUSA_STORE_URL || 'http://localhost:9000'
const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_47084fe1e0298b3cb824c4e92b6b4d0bd4b4f2fac0cdb274a1cfdc4000edb987'

// TypeScript interfaces describe the shape of data coming back from the API
export interface Price {
  amount: number
  currency_code: string
}

export interface Variant {
  id: string
  title: string
  prices: Price[] | undefined  // Medusa may omit prices depending on the region/context
}

export interface Product {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  variants: Variant[]
}

interface ProductsResponse {
  products: Product[]
}

interface SingleProductResponse {
  product: Product
}

const headers = {
  'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
}

// Fetches the first available region so we can pass its ID to product requests.
// Medusa v2 only includes variant prices when a region_id is provided —
// without it every product comes back with prices: [].
export async function getFirstRegionId(): Promise<string | null> {
  const response = await fetch(`${MEDUSA_API}/store/regions`, { headers })
  if (!response.ok) return null
  const data = await response.json()
  return data.regions?.[0]?.id ?? null
}

export async function getStoreProducts(regionId?: string): Promise<ProductsResponse> {
  const url = regionId
    ? `${MEDUSA_API}/store/products?region_id=${regionId}`
    : `${MEDUSA_API}/store/products`
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error(`Medusa API error: ${response.status}`)
  return response.json()
}

export async function getProductById(id: string): Promise<SingleProductResponse> {
  const response = await fetch(`${MEDUSA_API}/store/products/${id}`, { headers })
  if (!response.ok) throw new Error(`Medusa API error: ${response.status}`)
  return response.json()
}