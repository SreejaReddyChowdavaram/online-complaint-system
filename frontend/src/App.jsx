/**
 * App.jsx - Main Application Component
 * 
 * This component:
 * 1. Sets up React Router for navigation
 * 2. Provides AuthContext to all child components
 * 3. Defines all routes (pages) in the application
 * 4. Handles protected routes (requires authentication)
 * 5. Implements lazy loading for performance
 * 6. Wraps routes with page transition animations
 * 
 * Architecture: App → Router → AnimatedRoutes → Pages → Components
 */

import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ComplaintProvider } from './context/ComplaintContext'

// Components
import PrivateRoute from './components/PrivateRoute'
import RoleBasedRoute from './components/RoleBasedRoute'
import Navbar from './components/Navbar'
import AnimatedRoutes from './components/AnimatedRoutes'
import LottieLoader from './components/LottieLoader'

// Lazy load pages for code splitting and performance
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ComplaintList = lazy(() => import('./pages/complaints/ComplaintList'))
const ComplaintDetail = lazy(() => import('./pages/complaints/ComplaintDetail'))
const CreateComplaint = lazy(() => import('./pages/complaints/CreateComplaint'))
const ComplaintTracking = lazy(() => import('./pages/complaints/ComplaintTracking'))
const Profile = lazy(() => import('./pages/Profile'))
const ComplaintForm = lazy(() => import('./pages/ComplaintForm'))

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <Router>
          <div className="app">
            <Navbar />
            <Suspense fallback={<LottieLoader size={120} message="Loading page..." />}>
              <AnimatedRoutes>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/tracking/:complaintId" element={<ComplaintTracking />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/complaints" element={<PrivateRoute><ComplaintList /></PrivateRoute>} />
                  {/* Complaint Form (Citizen-only) */}
                  <Route path="/complaints/new" element={<RoleBasedRoute allowedRoles={['Citizen']}><ComplaintForm /></RoleBasedRoute>} />
                  {/* Backwards-compatible route */}
                  <Route path="/complaints/create" element={<RoleBasedRoute allowedRoles={['Citizen']}><CreateComplaint /></RoleBasedRoute>} />
                  <Route path="/complaints/:id" element={<PrivateRoute><ComplaintDetail /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  
                  {/* Default redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatedRoutes>
            </Suspense>
          </div>
        </Router>
      </ComplaintProvider>
    </AuthProvider>
  )
}

export default App
