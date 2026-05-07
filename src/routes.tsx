import { createBrowserRouter } from 'react-router-dom'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import Home from './pages/Home'
// for Auth 0
// import AuthCallback from './pages/AuthCallback'

// createBrowserRouter takes an array of route objects
// Each object has a path and the component to render (element)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  { path: '/register', 
    element: <Register /> 
  }


  // Add more routes here as you build pages:
  // { path: '/', element: <Home /> },
  // { path: '/products', element: <Products /> },
  // { path: '/products/:id', element: <ProductDetail /> },
  // { path: '/cart', element: <Cart /> },
  // for Auth 0
  // {
  //   path: '/callback',
  //   element: <AuthCallback />,
  // }
])

export default router