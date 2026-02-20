/**
 * complaintService.js - Complaint API Service
 * 
 * This file contains all API calls related to complaints:
 * - Get all complaints (with filters)
 * - Get single complaint
 * - Create complaint
 * - Update complaint
 * - Delete complaint
 * - Add comment
 * - Update status
 * - Track complaint by complaintId
 * 
 * Each function makes HTTP request and returns data
 * Used by: ComplaintContext, Complaint pages
 */

import api from './api'

/**
 * Get all complaints with optional filters
 * @param {Object} filters - { status, category, priority }
 * @returns {Promise} Array of complaints
 */
export const getComplaints = async (filters = {}) => {
  const params = new URLSearchParams()

  // Add filters as query parameters
  if (filters.status) params.append('status', filters.status)
  if (filters.category) params.append('category', filters.category)
  if (filters.priority) params.append('priority', filters.priority)

  const queryString = params.toString()
  const url = queryString ? `/complaints?${queryString}` : '/complaints'

  // Return the full axios response (so callers can access response.data.data)
  const response = await api.get(url)
  return response
}

/**
 * Get single complaint by ID
 * @param {String} id - Complaint ID
 * @returns {Promise} Complaint data
 */
export const getComplaint = async (id) => {
  const response = await api.get(`/complaints/${id}`)
  return response.data
}

/**
 * Get complaint by complaintId (for public tracking)
 * @param {String} complaintId - Complaint ID (e.g., COMP-20240115-12345)
 * @returns {Promise} Complaint data
 */
export const getComplaintByComplaintId = async (complaintId) => {
  const response = await api.get(`/complaints/complaint-id/${complaintId}`)
  return response.data
}

/**
 * Create new complaint
 * @param {Object} complaintData - { title, description, category, location, priority, imageUrl }
 * @returns {Promise} Created complaint data
 */
export const createComplaint = async (complaintData) => {
  const response = await api.post('/complaints', complaintData)
  return response.data
}

/**
 * Update complaint
 * @param {String} id - Complaint ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise} Updated complaint data
 */
export const updateComplaint = async (id, updateData) => {
  const response = await api.put(`/complaints/${id}`, updateData)
  return response.data
}

/**
 * Delete complaint (Admin only)
 * @param {String} id - Complaint ID
 * @returns {Promise} Success message
 */
export const deleteComplaint = async (id) => {
  const response = await api.delete(`/complaints/${id}`)
  return response.data
}

/**
 * Add comment to complaint
 * @param {String} id - Complaint ID
 * @param {String} text - Comment text
 * @returns {Promise} Updated complaint with new comment
 */
export const addComment = async (id, text) => {
  const response = await api.post(`/complaints/${id}/comments`, { text })
  return response.data
}

/**
 * Update complaint status (Officer/Admin only)
 * @param {String} id - Complaint ID
 * @param {String} status - New status
 * @param {String} notes - Optional notes
 * @returns {Promise} Updated complaint data
 */
export const updateStatus = async (id, status, notes = '') => {
  const response = await api.put(`/complaints/${id}/status`, { status, notes })
  return response.data
}


export const assignComplaint = (id, officerId) => {
  return api.put(`/complaints/${id}/assign`, { officerId })
}
