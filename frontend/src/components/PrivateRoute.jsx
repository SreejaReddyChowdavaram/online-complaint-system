/**
 * PrivateRoute.jsx - Protected Route Component
 * 
 * This component:
 * 1. Checks if user is authenticated
 * 2. Redirects to login if not authenticated
 * 3. Renders the protected component if authenticated
 * 
 * Usage: Wrap protected routes with <PrivateRoute>
 * Example: <PrivateRoute><Dashboard /></PrivateRoute>
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // Show loading while checking auth
  if (loading) {
    return <div className="loading">Loading...</div>
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Render protected component
  return children
}

export default PrivateRoute
