/**
 * authService.js - Authentication API Service
 * 
 * This file contains all API calls related to authentication:
 * - Register new user
 * - Login user
 * - Get current user profile
 * - Update password
 * 
 * Each function:
 * 1. Makes HTTP request to backend
 * 2. Returns response data
 * 3. Handles errors
 * 
 * Used by: AuthContext, Login/Register pages
 */

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
