/**
 * ComplaintTracking.jsx - Public Complaint Tracking Page
 * 
 * This page:
 * 1. Allows tracking complaint by Complaint ID (public, no auth required)
 * 2. Displays complaint status and history
 * 3. Shows basic complaint information
 * 
 * Route: /tracking/:complaintId
 * Used for: Public tracking without login
 */

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getComplaintByComplaintId } from '../../services/complaintService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import './ComplaintTracking.css'

const ComplaintTracking = () => {
  const { complaintId } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (complaintId) {
      fetchComplaint()
    }
  }, [complaintId])

  const fetchComplaint = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getComplaintByComplaintId(complaintId)
      setComplaint(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Complaint not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading message="Loading complaint details..." />
  }

  if (error || !complaint) {
    return (
      <div className="container">
        <div className="tracking-page">
          <ErrorMessage message={error || 'Complaint not found'} />
          <div className="text-center mt-3">
            <p>Please check your Complaint ID and try again.</p>
            <p className="mt-1">
              Complaint ID format: <strong>COMP-YYYYMMDD-XXXXX</strong>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="tracking-page">
        <h1>Track Your Complaint</h1>
        <p className="tracking-subtitle">Complaint ID: <strong>{complaint.complaintId}</strong></p>

        <div className="card">
          <div className="tracking-header">
            <h2>{complaint.title}</h2>
            <span className={`badge badge-${complaint.status.toLowerCase().replace(' ', '-')}`}>
              {complaint.status}
            </span>
          </div>

          <div className="tracking-info">
            <div className="info-row">
              <strong>Category:</strong> {complaint.category}
            </div>
            <div className="info-row">
              <strong>Priority:</strong>{' '}
              <span className={`badge badge-${complaint.priority.toLowerCase()}`}>
                {complaint.priority}
              </span>
            </div>
            <div className="info-row">
              <strong>Created:</strong> {new Date(complaint.createdAt).toLocaleString()}
            </div>
            {complaint.resolvedAt && (
              <div className="info-row">
                <strong>Resolved:</strong> {new Date(complaint.resolvedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Status History */}
        {complaint.statusHistory && complaint.statusHistory.length > 0 && (
          <div className="card">
            <h3>Status History</h3>
            <div className="status-timeline">
              {complaint.statusHistory.map((history, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong>{history.status}</strong>
                      <span className="timeline-date">
                        {new Date(history.changedAt).toLocaleString()}
                      </span>
                    </div>
                    {history.notes && <p className="timeline-notes">{history.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        {complaint.comments && complaint.comments.length > 0 && (
          <div className="card">
            <h3>Updates</h3>
            <div className="comments-list">
              {complaint.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-header">
                    <strong>{comment.user?.name || 'Officer'}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComplaintTracking
