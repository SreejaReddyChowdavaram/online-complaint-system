/**
 * Login.jsx - Login Page
 * 
 * This page:
 * 1. Displays login form (email, password)
 * 2. Handles form submission
 * 3. Calls login API via AuthContext
 * 4. Redirects to dashboard on success
 * 5. Shows error messages on failure
 * 
 * Flow: User enters credentials → Submit → AuthContext.login() → API call → Store token → Redirect
 */

import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/ErrorMessage'
import Logo from '../../components/Logo'
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
    setError('') // Clear error on input change
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    // Call login function from AuthContext
    const result = await login(formData)

    if (result.success) {
      // Success - redirect to dashboard
      navigate('/')
    } else {
      // Show error message
      setError(result.error || 'Login failed')
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="auth-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Logo size="lg" showText={true} className="justify-center mb-4" />
          <h1>Login</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </motion.div>

        <ErrorMessage message={error} />

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="form-label">Email</label>
            <motion.input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              whileFocus={{ scale: 1.02, borderColor: 'var(--primary-color)' }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="form-label">Password</label>
            <motion.input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              whileFocus={{ scale: 1.02, borderColor: 'var(--primary-color)' }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </motion.form>

        <motion.p
          className="auth-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Don't have an account? <Link to="/register">Register here</Link>
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Login
