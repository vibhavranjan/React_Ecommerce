import { RouterProvider } from 'react-router-dom'
import router from './routes'

// RouterProvider replaces <BrowserRouter> + <Routes>
// It takes our router object from routes.tsx and handles everything

function App() {
  return <RouterProvider router={router} />
}

export default App