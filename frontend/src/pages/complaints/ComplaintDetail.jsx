/**
 * ComplaintDetail.jsx - Complaint Detail Page
 * 
 * This page:
 * 1. Displays full complaint details
 * 2. Shows status history timeline
 * 3. Displays comments section
 * 4. Allows adding comments (if authenticated)
 * 5. Allows status update (if Officer/Admin)
 * 
 * Data source: ComplaintContext.fetchComplaint(id)
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useComplaint } from '../../context/ComplaintContext'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import './ComplaintDetail.css'

const ComplaintDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentComplaint, loading, error, fetchComplaint, addComment, updateStatus, deleteComplaint } = useComplaint()

  const [commentText, setCommentText] = useState('')
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' })
  const [showStatusForm, setShowStatusForm] = useState(false)

  useEffect(() => {
    if (id) {
      fetchComplaint(id)
    }
  }, [id])

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const result = await addComment(id, commentText)
    if (result.success) {
      setCommentText('')
    }
  }

  const handleStatusUpdate = async (e) => {
    e.preventDefault()
    if (!statusUpdate.status) return

    const result = await updateStatus(id, statusUpdate.status, statusUpdate.notes)
    if (result.success) {
      setStatusUpdate({ status: '', notes: '' })
      setShowStatusForm(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!currentComplaint) {
    return (
      <div className="container">
        <div className="error">Complaint not found</div>
      </div>
    )
  }

  // Role-based permissions
  const isCitizen = user?.role === 'Citizen'
  const isOfficer = user?.role === 'Officer'
  const isAdmin = user?.role === 'Admin'
  const canUpdateStatus = isOfficer || isAdmin
  const canDeleteComplaint = isAdmin
  const canAddComment = !!user // Any authenticated user can comment

  return (
    <div className="container">
      <div className="complaint-detail-page">
        <button onClick={() => navigate(-1)} className="btn btn-outline mb-2">
          ← Back
        </button>

        <ErrorMessage message={error} />

        {/* Complaint Header */}
        <div className="card">
          <div className="complaint-header">
            <div>
              <h1>{currentComplaint.title}</h1>
              <div className="complaint-meta">
                <span className={`badge badge-${currentComplaint.status.toLowerCase().replace(' ', '-')}`}>
                  {currentComplaint.status}
                </span>
                <span className="complaint-id">ID: {currentComplaint.complaintId}</span>
                <span className="complaint-category">{currentComplaint.category}</span>
                <span className={`badge badge-${currentComplaint.priority.toLowerCase()}`}>
                  {currentComplaint.priority}
                </span>
              </div>
            </div>
            <div className="complaint-actions">
              {canUpdateStatus && (
                <button
                  onClick={() => setShowStatusForm(!showStatusForm)}
                  className="btn btn-primary"
                >
                  {showStatusForm ? 'Cancel Update' : 'Update Status'}
                </button>
              )}
              {canDeleteComplaint && (
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this complaint?')) {
                      const result = await deleteComplaint(id)
                      if (result.success) {
                        navigate('/complaints')
                      }
                    }
                  }}
                  className="btn btn-danger"
                >
                  Delete Complaint
                </button>
              )}
            </div>
          </div>

          {/* Status Update Form */}
          {showStatusForm && canUpdateStatus && (
            <form onSubmit={handleStatusUpdate} className="status-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">New Status</label>
                  <select
                    className="form-select"
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  value={statusUpdate.notes}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                  placeholder="Add notes about status change"
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowStatusForm(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Update Status</button>
              </div>
            </form>
          )}
        </div>

        {/* Complaint Details */}
        <div className="details-grid">
          <div className="card">
            <h3>Description</h3>
            <p>{currentComplaint.description}</p>
          </div>

          <div className="card">
            <h3>Location</h3>
            <p><strong>Address:</strong> {currentComplaint.location?.address}</p>
            <p>
              <strong>Coordinates:</strong>{' '}
              {currentComplaint.location?.coordinates?.latitude}, {currentComplaint.location?.coordinates?.longitude}
            </p>
            {currentComplaint.imageUrl && (
              <div className="complaint-image">
                <img src={currentComplaint.imageUrl} alt="Complaint" />
              </div>
            )}
          </div>

          <div className="card">
            <h3>Information</h3>
            <div className="info-item">
              <strong>Department:</strong> {currentComplaint.department || 'General'}
            </div>
            <div className="info-item">
              <strong>Submitted By:</strong> {currentComplaint.submittedBy?.name || 'Unknown'}
            </div>
            {currentComplaint.assignedTo && (
              <div className="info-item">
                <strong>Assigned To:</strong> {currentComplaint.assignedTo.name}
              </div>
            )}
            <div className="info-item">
              <strong>Created:</strong> {new Date(currentComplaint.createdAt).toLocaleString()}
            </div>
            {currentComplaint.resolvedAt && (
              <div className="info-item">
                <strong>Resolved:</strong> {new Date(currentComplaint.resolvedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Status History */}
        {currentComplaint.statusHistory && currentComplaint.statusHistory.length > 0 && (
          <div className="card">
            <h3>Status History</h3>
            <div className="status-timeline">
              {currentComplaint.statusHistory.map((history, index) => (
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
                    {history.changedBy && (
                      <p className="timeline-user">Changed by: {history.changedBy.name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="card">
          <h3>Comments & Updates</h3>

          {/* Add Comment Form - Available to all authenticated users */}
          {canAddComment && (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                className="form-textarea"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={isCitizen ? "Add a comment or question..." : "Add an update or response..."}
                rows={3}
                required
              />
              <button type="submit" className="btn btn-primary mt-1" disabled={loading}>
                {loading ? 'Adding...' : 'Add Comment'}
              </button>
            </form>
          )}

          {/* Comments List */}
          <div className="comments-list">
            {currentComplaint.comments && currentComplaint.comments.length > 0 ? (
              currentComplaint.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-header">
                    <strong>{comment.user?.name || 'Unknown'}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-center">No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplaintDetail
