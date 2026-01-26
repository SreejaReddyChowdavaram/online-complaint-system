/**
 * App.jsx - Main Application Component
 * 
 * This component:
 * 1. Sets up React Router for navigation
 * 2. Provides AuthContext to all child components
 * 3. Defines all routes (pages) in the application
 * 4. Handles protected routes (requires authentication)
 * 
 * Architecture: App → Router → Pages → Components
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ComplaintProvider } from './context/ComplaintContext'

// Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import ComplaintList from './pages/complaints/ComplaintList'
import ComplaintDetail from './pages/complaints/ComplaintDetail'
import CreateComplaint from './pages/complaints/CreateComplaint'
import ComplaintTracking from './pages/complaints/ComplaintTracking'
import Profile from './pages/Profile'
import ComplaintForm from './pages/ComplaintForm'

// Components
import PrivateRoute from './components/PrivateRoute'
import RoleBasedRoute from './components/RoleBasedRoute'
import Navbar from './components/Navbar'

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <Router>
          <div className="app">
            <Navbar />
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
          </div>
        </Router>
      </ComplaintProvider>
    </AuthProvider>
  )
}

export default App
