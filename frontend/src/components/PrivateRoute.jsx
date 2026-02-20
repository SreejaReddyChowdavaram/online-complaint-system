/**
 * PrivateRoute.jsx - Protected & Role-Based Route Component
 *
 * This component:
 * 1. Checks if user is authenticated
 * 2. Waits for auth loading to finish
 * 3. Optionally checks user role
 * 4. Redirects to login if not authenticated
 * 5. Redirects to dashboard if role mismatch
 *
 * Usage:
 * <PrivateRoute><Dashboard /></PrivateRoute>
 * <PrivateRoute role="Officer"><OfficerDashboard /></PrivateRoute>
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth()

  // ⏳ Wait until auth check completes
  if (loading) {
    return <div className="loading">Loading...</div>
  }

  // 🔒 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // 🔐 Role-based protection
  if (role && user?.role !== role) {
    // Redirect based on role
    if (user?.role === 'Officer') {
      return <Navigate to="/officer-dashboard" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  // ✅ Allowed
  return children
}

export default PrivateRoute
