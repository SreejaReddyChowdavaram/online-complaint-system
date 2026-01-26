/**
 * ComplaintContext.jsx - Complaint State Management
 * 
 * This Context provides:
 * 1. List of complaints (with filters)
 * 2. Current complaint (for detail view)
 * 3. Functions to fetch, create, update complaints
 * 
 * Architecture:
 * - Centralized complaint state
 * - All complaint operations go through this context
 * - Components can access complaints without prop drilling
 * 
 * Usage: Wrap App with ComplaintProvider, use useComplaint() hook
 */

import { createContext, useState, useContext } from 'react'
import {
  getComplaints as getComplaintsApi,
  getComplaint as getComplaintApi,
  createComplaint as createComplaintApi,
  updateComplaint as updateComplaintApi,
  deleteComplaint as deleteComplaintApi,
  addComment as addCommentApi,
  updateStatus as updateStatusApi
} from '../services/complaintService'

const ComplaintContext = createContext()

export const useComplaint = () => {
  const context = useContext(ComplaintContext)
  if (!context) {
    throw new Error('useComplaint must be used within ComplaintProvider')
  }
  return context
}

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([])
  const [currentComplaint, setCurrentComplaint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch all complaints with optional filters
   * @param {Object} filters - { status, category, priority }
   */
  const fetchComplaints = async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getComplaintsApi(filters)
      setComplaints(response.data || [])
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch complaints'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetch single complaint by ID
   * @param {String} id - Complaint ID
   */
  const fetchComplaint = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getComplaintApi(id)
      setCurrentComplaint(response.data)
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch complaint'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Create new complaint
   * @param {Object} complaintData - Complaint data
   */
  const createComplaint = async (complaintData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await createComplaintApi(complaintData)
      // Add new complaint to list
      setComplaints(prev => [response.data, ...prev])
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create complaint'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update complaint
   * @param {String} id - Complaint ID
   * @param {Object} updateData - Data to update
   */
  const updateComplaint = async (id, updateData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await updateComplaintApi(id, updateData)
      // Update in list
      setComplaints(prev =>
        prev.map(comp => comp._id === id ? response.data : comp)
      )
      // Update current complaint if it's the one being updated
      if (currentComplaint?._id === id) {
        setCurrentComplaint(response.data)
      }
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update complaint'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Delete complaint
   * @param {String} id - Complaint ID
   */
  const deleteComplaint = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await deleteComplaintApi(id)
      // Remove from list
      setComplaints(prev => prev.filter(comp => comp._id !== id))
      if (currentComplaint?._id === id) {
        setCurrentComplaint(null)
      }
      return { success: true }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete complaint'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Add comment to complaint
   * @param {String} id - Complaint ID
   * @param {String} text - Comment text
   */
  const addComment = async (id, text) => {
    setLoading(true)
    setError(null)
    try {
      const response = await addCommentApi(id, text)
      // Update current complaint
      if (currentComplaint?._id === id) {
        setCurrentComplaint(response.data)
      }
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add comment'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update complaint status
   * @param {String} id - Complaint ID
   * @param {String} status - New status
   * @param {String} notes - Optional notes
   */
  const updateStatus = async (id, status, notes = '') => {
    setLoading(true)
    setError(null)
    try {
      const response = await updateStatusApi(id, status, notes)
      // Update in list
      setComplaints(prev =>
        prev.map(comp => comp._id === id ? response.data : comp)
      )
      // Update current complaint
      if (currentComplaint?._id === id) {
        setCurrentComplaint(response.data)
      }
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update status'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    complaints,
    currentComplaint,
    loading,
    error,
    fetchComplaints,
    fetchComplaint,
    createComplaint,
    updateComplaint,
    deleteComplaint,
    addComment,
    updateStatus,
    setCurrentComplaint
  }

  return (
    <ComplaintContext.Provider value={value}>
      {children}
    </ComplaintContext.Provider>
  )
}
