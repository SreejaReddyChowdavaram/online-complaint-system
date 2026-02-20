/**
 * Profile.jsx - User Profile Page
 * 
 * This page:
 * 1. Displays user information
 * 2. Allows password update
 * 3. Shows user statistics
 * 
 * Data source: AuthContext (user data)
 */

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useComplaint } from '../context/ComplaintContext'
import { updatePassword } from '../services/authService'
import ErrorMessage from '../components/ErrorMessage'
import './Profile.css'

const Profile = () => {
  const { user } = useAuth()
  const { complaints } = useComplaint()
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // User statistics
  const userStats = {
    total: complaints.filter(c => c.submittedBy?._id === user?.id || c.submittedBy === user?.id).length,
    pending: complaints.filter(c => (c.submittedBy?._id === user?.id || c.submittedBy === user?.id) && c.status === 'Pending').length,
    resolved: complaints.filter(c => (c.submittedBy?._id === user?.id || c.submittedBy === user?.id) && c.status === 'Resolved').length
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess('')
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)

    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setSuccess('Password updated successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="profile-page">
        <h1>My Profile</h1>

        {/* User Information */}
        <div className="card">
          <h2>Account Information</h2>
          <div className="profile-info">
            <div className="info-item">
              <strong>Name:</strong> {user?.name}
            </div>
            <div className="info-item">
              <strong>Email:</strong> {user?.email}
            </div>
            <div className="info-item">
              <strong>Phone:</strong> {user?.phone || 'Not provided'}
            </div>
            <div className="info-item">
              <strong>Role:</strong> <span className="badge">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="card">
          <h2>My Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>{userStats.total}</h3>
              <p>Total Complaints</p>
            </div>
            <div className="stat-item">
              <h3>{userStats.pending}</h3>
              <p>Pending</p>
            </div>
            <div className="stat-item">
              <h3>{userStats.resolved}</h3>
              <p>Resolved</p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
          <h2>Change Password</h2>
          
          <ErrorMessage message={error} />
          {success && <div className="success">{success}</div>}

          <form onSubmit={handlePasswordUpdate}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-input"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
