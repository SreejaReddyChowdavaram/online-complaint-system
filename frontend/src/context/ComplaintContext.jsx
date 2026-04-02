/**
 * ComplaintContext.jsx - Complaint State Management
 *
 * This Context provides:
 * 1. List of complaints (role-based)
 * 2. Current complaint (detail view)
 * 3. Functions to fetch, create, update, assign complaints
 */

import { createContext, useState, useContext } from 'react'
import {
  getComplaints as getComplaintsApi,
  getComplaint as getComplaintApi,
  createComplaint as createComplaintApi,
  updateComplaint as updateComplaintApi,
  deleteComplaint as deleteComplaintApi,
  addComment as addCommentApi,
  updateStatus as updateStatusApi,
  assignComplaint
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

  // Fetch complaints (Citizen → own | Officer → assigned)
  const fetchComplaints = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getComplaintsApi()
      setComplaints(response.data.data)
      return { success: true, data: response.data.data }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to fetch complaints'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Fetch single complaint
  const fetchComplaint = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getComplaintApi(id)
      setCurrentComplaint(response.data)
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to fetch complaint'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Create complaint (Citizen)
  const createComplaint = async (complaintData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await createComplaintApi(complaintData)
      // The backend now returns { success, message, data }
      const newComplaint = response.data || response; 
      setComplaints(prev => [newComplaint, ...prev])
      return { success: true, data: newComplaint, message: response.message }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to create complaint'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Update complaint
  const updateComplaint = async (id, updateData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await updateComplaintApi(id, updateData)
      setComplaints(prev =>
        prev.map(c => (c._id === id ? response.data : c))
      )
      if (currentComplaint?._id === id) {
        setCurrentComplaint(response.data)
      }
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to update complaint'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Delete complaint
  const deleteComplaint = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await deleteComplaintApi(id)
      setComplaints(prev => prev.filter(c => c._id !== id))
      if (currentComplaint?._id === id) {
        setCurrentComplaint(null)
      }
      return { success: true }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to delete complaint'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Add comment
  const addComment = async (id, text) => {
    setLoading(true)
    setError(null)
    try {
      const response = await addCommentApi(id, text)
      if (currentComplaint?._id === id) {
        setCurrentComplaint(response.data)
      }
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to add comment'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Update status (Officer)
  const updateStatus = async (id, status) => {
    setLoading(true)
    setError(null)
    try {
      const response = await updateStatusApi(id, status)
      setComplaints(prev =>
        prev.map(c => (c._id === id ? response.data : c))
      )
      if (currentComplaint?._id === id) {
        setCurrentComplaint(response.data)
      }
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to update status'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // STEP 6: Assign complaint to officer
  const assignToOfficer = async (complaintId, officerId) => {
    setLoading(true)
    setError(null)
    try {
      await assignComplaint(complaintId, officerId)
      await fetchComplaints()
      return { success: true }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to assign complaint'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ComplaintContext.Provider
      value={{
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
        assignToOfficer,
        setCurrentComplaint
      }}
    >
      {children}
    </ComplaintContext.Provider>
  )
}
