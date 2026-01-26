/**
 * AuthContext.jsx - Authentication State Management
 * 
 * This Context provides:
 * 1. User authentication state (logged in/out, user data)
 * 2. Auth functions (login, register, logout)
 * 3. Token management (store/retrieve from localStorage)
 * 
 * Architecture:
 * - Context API for state management (simpler than Redux)
 * - Stores user data and token in localStorage
 * - Provides auth state to all components
 * 
 * Usage: Wrap App with AuthProvider, use useAuth() hook in components
 */

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
  // State: user data and loading status
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On component mount, check if user is already logged in
  useEffect(() => {
    checkAuth()
  }, [])

  /**
   * Check if user is authenticated
   * Reads token from localStorage and fetches user data
   */
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        // Token exists, fetch user data
        const response = await getCurrentUser()
        setUser(response.data)
      }
    } catch (error) {
      // Token invalid or expired, clear it
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Register new user
   * @param {Object} userData - { name, email, password, phone }
   */
  const register = async (userData) => {
    try {
      const response = await registerApi(userData)
      
      // Store token and user data
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

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   */
  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials)
      
      // Store token and user data
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

  /**
   * Logout user
   * Clears token and user data
   */
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  // Value to provide to context consumers
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
