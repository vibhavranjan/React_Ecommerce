import { createBrowserRouter } from 'react-router-dom'
import Login from './features/auth/Login'
import AuthCallback from './pages/AuthCallback'

// createBrowserRouter takes an array of route objects
// Each object has a path and the component to render (element)

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },

  // Add more routes here as you build pages:
  // { path: '/', element: <Home /> },
  // { path: '/products', element: <Products /> },
  // { path: '/products/:id', element: <ProductDetail /> },
  // { path: '/cart', element: <Cart /> },
  {
    path: '/callback',
    element: <AuthCallback />,
  }
])

export default router