/**
 * RoleBasedRoute.jsx - Role-Based Protected Route Component
 * 
 * This component:
 * 1. Checks if user is authenticated
 * 2. Checks if user has required role
 * 3. Redirects to login if not authenticated
 * 4. Redirects to dashboard if wrong role
 * 5. Renders the component if authenticated and has correct role
 * 
 * Usage: Wrap role-specific routes
 * Example: <RoleBasedRoute allowedRoles={['Citizen']}><CreateComplaint /></RoleBasedRoute>
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth()

  // Show loading while checking auth
  if (loading) {
    return <div className="loading">Loading...</div>
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // User doesn't have required role, redirect to dashboard
    return <Navigate to="/" replace />
  }

  // Render component if authenticated and has correct role
  return children
}

export default RoleBasedRoute
