/**
 * Dashboard.jsx - Main Dashboard Page
 * 
 * This page:
 * 1. Shows overview statistics (total complaints, by status)
 * 2. Displays recent complaints
 * 3. Quick actions (create complaint, view all)
 * 
 * Used as: Home page after login
 * Data source: ComplaintContext
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useComplaint } from '../context/ComplaintContext'
import Loading from '../components/Loading'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const { complaints, loading, fetchComplaints } = useComplaint()

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints()
  }, [])

  // Determine user role and adjust UI accordingly
  const isCitizen = user?.role === 'Citizen'
  const isOfficer = user?.role === 'Officer'
  const isAdmin = user?.role === 'Admin'

  // Calculate statistics based on role
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    rejected: complaints.filter(c => c.status === 'Rejected').length
  }

  // Get recent complaints (last 5)
  const recentComplaints = complaints.slice(0, 5)

  if (loading) {
    return <Loading />
  }

  return (
    <div className="container">
      <div className="dashboard">
        <h1>Welcome, {user?.name}!</h1>
        <p className="dashboard-subtitle">
          {isCitizen 
            ? "Here's an overview of your complaints"
            : isOfficer
            ? "Here's an overview of assigned complaints"
            : "Here's an overview of all complaints"}
        </p>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.total}</h3>
            <p>Total Complaints</p>
          </div>
          <div className="stat-card stat-pending">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card stat-progress">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card stat-resolved">
            <h3>{stats.resolved}</h3>
            <p>Resolved</p>
          </div>
          {/* Show rejected count for Officers/Admins */}
          {(isOfficer || isAdmin) && (
            <div className="stat-card stat-rejected">
              <h3>{stats.rejected}</h3>
              <p>Rejected</p>
            </div>
          )}
        </div>

        {/* Quick Actions - Role-based */}
        <div className="quick-actions">
          {isCitizen && (
            <Link to="/complaints/create" className="btn btn-primary">
              Create New Complaint
            </Link>
          )}
          <Link to="/complaints" className="btn btn-outline">
            View All Complaints
          </Link>
        </div>

        {/* Recent Complaints */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Complaints</h2>
            <Link to="/complaints">View All</Link>
          </div>

          {recentComplaints.length === 0 ? (
            <p className="text-center">
              {isCitizen 
                ? "No complaints yet. Create your first complaint!"
                : "No complaints found."}
            </p>
          ) : (
            <div className="complaints-list">
              {recentComplaints.map(complaint => (
                <Link
                  key={complaint._id}
                  to={`/complaints/${complaint._id}`}
                  className="complaint-item"
                >
                  <div className="complaint-item-header">
                    <h4>{complaint.title}</h4>
                    <span className={`badge badge-${complaint.status.toLowerCase().replace(' ', '-')}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="complaint-item-desc">{complaint.description.substring(0, 100)}...</p>
                  <div className="complaint-item-footer">
                    <span className="complaint-category">{complaint.category}</span>
                    {/* Show submitted by for Officers/Admins */}
                    {!isCitizen && complaint.submittedBy && (
                      <span className="complaint-submitter">
                        By: {complaint.submittedBy.name}
                      </span>
                    )}
                    <span className="complaint-date">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
