# Frontend Authentication - Code Reference

## 📋 Complete Component Code

This document contains the complete code for all authentication components.

---

## 🔐 AuthContext.jsx

**File:** `src/context/AuthContext.jsx`

```javascript
import { createContext, useState, useEffect, useContext } from 'react'
import { login as loginApi, register as registerApi, getCurrentUser } from '../services/authService'

// Create Context
const AuthContext = createContext()

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await getCurrentUser()
        setUser(response.data)
      }
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Register new user
  const register = async (userData) => {
    try {
      const response = await registerApi(userData)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.data))
      setUser(response.data)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  // Login user
  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.data))
      setUser(response.data)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

---

## 🔑 Login.jsx

**File:** `src/pages/auth/Login.jsx`

```javascript
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/ErrorMessage'
import './Auth.css'

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    const result = await login(formData)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Login failed')
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
```

---

## 📝 Register.jsx

**File:** `src/pages/auth/Register.jsx`

```javascript
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/ErrorMessage'
import './Auth.css'

const Register = () => {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const result = await register(formData)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Registration failed')
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Register</h1>
        <p className="auth-subtitle">Create a new account</p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password (min 6 characters)"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
```

---

## 🛡️ PrivateRoute.jsx

**File:** `src/components/PrivateRoute.jsx`

```javascript
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
```

---

## 🔐 RoleBasedRoute.jsx

**File:** `src/components/RoleBasedRoute.jsx`

```javascript
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RoleBasedRoute
```

---

## 🌐 api.js

**File:** `src/services/api.js`

```javascript
import axios from 'axios'

// Base URL for API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor: Add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // If token is invalid/expired, remove it and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## 🔑 authService.js

**File:** `src/services/authService.js`

```javascript
import api from './api'

/**
 * Register a new user
 * @param {Object} userData - { name, email, password, phone }
 * @returns {Promise} Response with token and user data
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  return response.data
}

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise} Response with token and user data
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

/**
 * Get current user profile
 * @returns {Promise} User data
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

/**
 * Update user password
 * @param {Object} passwordData - { currentPassword, newPassword }
 * @returns {Promise} Success message
 */
export const updatePassword = async (passwordData) => {
  const response = await api.put('/auth/updatepassword', passwordData)
  return response.data
}
```

---

## 📱 App.jsx (Updated with RoleBasedRoute)

**File:** `src/App.jsx`

```javascript
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
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/complaints" element={<PrivateRoute><ComplaintList /></PrivateRoute>} />
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
```

---

## 🎯 Usage Examples

### Using AuthContext in Component

```javascript
import { useAuth } from '../context/AuthContext'

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>Please login</div>
  }

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Making Authenticated API Call

```javascript
import api from '../services/api'

// Token automatically added by interceptor
const fetchData = async () => {
  try {
    const response = await api.get('/complaints')
    return response.data
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Role-Based UI

```javascript
const { user } = useAuth()

{user?.role === 'Citizen' && (
  <Link to="/complaints/create">Create Complaint</Link>
)}

{user?.role === 'Officer' && (
  <button onClick={updateStatus}>Update Status</button>
)}

{user?.role === 'Admin' && (
  <button onClick={assignOfficer}>Assign Officer</button>
)}
```

---

## ✅ Summary

**Complete Authentication Implementation:**
- ✅ AuthContext for state management
- ✅ Login and Register forms
- ✅ JWT token storage
- ✅ Protected routes
- ✅ Role-based routes
- ✅ Automatic token injection
- ✅ Error handling

**All components are ready to use!** 🔐
