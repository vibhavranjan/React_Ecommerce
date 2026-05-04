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
  prices: Price[]
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

export async function getStoreProducts(): Promise<ProductsResponse> {
  const response = await fetch(`${MEDUSA_API}/store/products`, { headers })
  if (!response.ok) throw new Error(`Medusa API error: ${response.status}`)
  return response.json()
}

export async function getProductById(id: string): Promise<SingleProductResponse> {
  const response = await fetch(`${MEDUSA_API}/store/products/${id}`, { headers })
  if (!response.ok) throw new Error(`Medusa API error: ${response.status}`)
  return response.json()
}