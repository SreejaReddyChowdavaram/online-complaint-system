/**
 * ComplaintList.jsx - Complaints List Page
 * 
 * This page:
 * 1. Displays all complaints in a list
 * 2. Provides filters (status, category, priority)
 * 3. Shows complaint cards with key information
 * 4. Links to complaint detail page
 * 
 * Data source: ComplaintContext.fetchComplaints()
 * User can filter by: status, category, priority
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useComplaint } from '../../context/ComplaintContext'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import './ComplaintList.css'

const ComplaintList = () => {
  const { user } = useAuth()
  const { complaints, loading, error, fetchComplaints } = useComplaint()
  
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: ''
  })

  // Determine page title and whether to show create button based on role
  const isCitizen = user?.role === 'Citizen'
  const pageTitle = isCitizen ? 'My Complaints' : 'All Complaints'
  const showCreateButton = isCitizen

  // Fetch complaints on mount and when filters change
  // Backend automatically filters by user role (Citizens see only their complaints)
  useEffect(() => {
    fetchComplaints(filters)
  }, [filters])

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const clearFilters = () => {
    setFilters({ status: '', category: '', priority: '' })
  }

  return (
    <div className="container">
      <div className="complaint-list-page">
        <div className="page-header">
          <h1>{pageTitle}</h1>
          {showCreateButton && (
            <Link to="/complaints/create" className="btn btn-primary">
              Create New Complaint
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="card filters-card">
          <h3>Filters</h3>
          <div className="filters-grid">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="Road">Road</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                className="form-select"
                value={filters.priority}
                onChange={handleFilterChange}
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <button
                type="button"
                onClick={clearFilters}
                className="btn btn-outline"
                style={{ marginTop: '1.75rem' }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <ErrorMessage message={error} />

        {loading ? (
          <Loading />
        ) : (
          <>
            {complaints.length === 0 ? (
              <div className="card text-center">
                <p>No complaints found.</p>
                {showCreateButton && (
                  <Link to="/complaints/create" className="btn btn-primary mt-2">
                    Create Your First Complaint
                  </Link>
                )}
              </div>
            ) : (
              <div className="complaints-grid">
                {complaints.map((complaint, index) => (
                  <motion.div
                    key={complaint._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to={`/complaints/${complaint._id}`}
                        className="complaint-card"
                      >
                        <div className="complaint-card-header">
                          <h3>{complaint.title}</h3>
                          <motion.span
                            className={`badge badge-${complaint.status.toLowerCase().replace(' ', '-')}`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {complaint.status}
                          </motion.span>
                        </div>
                        
                        <p className="complaint-card-desc">
                          {complaint.description.substring(0, 150)}
                          {complaint.description.length > 150 ? '...' : ''}
                        </p>

                        <div className="complaint-card-meta">
                          <div className="meta-item">
                            <strong>Category:</strong> {complaint.category}
                          </div>
                          <div className="meta-item">
                            <strong>Priority:</strong>{' '}
                            <motion.span
                              className={`badge badge-${complaint.priority.toLowerCase()}`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {complaint.priority}
                            </motion.span>
                          </div>
                          <div className="meta-item">
                            <strong>Complaint ID:</strong> {complaint.complaintId}
                          </div>
                          <div className="meta-item">
                            <strong>Created:</strong>{' '}
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </div>
                          {/* Show submitted by for Officers/Admins */}
                          {!isCitizen && complaint.submittedBy && (
                            <div className="meta-item">
                              <strong>Submitted By:</strong> {complaint.submittedBy.name}
                            </div>
                          )}
                          {/* Show assigned officer if exists */}
                          {complaint.assignedTo && (
                            <div className="meta-item">
                              <strong>Assigned To:</strong> {complaint.assignedTo.name}
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ComplaintList
