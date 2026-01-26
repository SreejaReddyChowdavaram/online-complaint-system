/**
 * api.js - API Service Base Configuration
 * 
 * This file:
 * 1. Creates an Axios instance with base URL
 * 2. Sets up interceptors to add auth token to requests
 * 3. Handles token storage (localStorage)
 * 4. Provides a centralized API client
 * 
 * Usage: All API calls use this configured axios instance
 */

import axios from 'axios'

// Base URL for API - points to backend server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor: Add auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    // If token exists, add it to Authorization header
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
