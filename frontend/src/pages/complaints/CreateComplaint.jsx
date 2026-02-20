/**
 * CreateComplaint.jsx - Create Complaint Page
 * 
 * This page:
 * 1. Displays form to create new complaint
 * 2. Fields: title, description, category, location, priority, imageUrl
 * 3. Validates form inputs
 * 4. Calls createComplaint API via ComplaintContext
 * 5. Redirects to complaint detail on success
 * 
 * Note: Location coordinates can be entered manually or via Google Maps (future enhancement)
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useComplaint } from '../../context/ComplaintContext'
import ErrorMessage from '../../components/ErrorMessage'
import './CreateComplaint.css'

const CreateComplaint = () => {
  const navigate = useNavigate()
  const { createComplaint, loading, error } = useComplaint()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    location: {
      address: '',
      coordinates: {
        latitude: '',
        longitude: ''
      }
    },
    imageUrl: ''
  })

  const [formError, setFormError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'address') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          address: value
        }
      })
    } else if (name === 'latitude' || name === 'longitude') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          coordinates: {
            ...formData.location.coordinates,
            [name]: value
          }
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    // Validation
    if (!formData.title || !formData.description || !formData.category) {
      setFormError('Please fill in all required fields')
      return
    }

    if (!formData.location.address) {
      setFormError('Please provide an address')
      return
    }

    if (!formData.location.coordinates.latitude || !formData.location.coordinates.longitude) {
      setFormError('Please provide latitude and longitude')
      return
    }

    // Convert coordinates to numbers
    const complaintData = {
      ...formData,
      location: {
        address: formData.location.address,
        coordinates: {
          latitude: parseFloat(formData.location.coordinates.latitude),
          longitude: parseFloat(formData.location.coordinates.longitude)
        }
      }
    }

    // Create complaint
    const result = await createComplaint(complaintData)

    if (result.success) {
      // Redirect to complaint detail
      navigate(`/complaints/${result.data._id}`)
    } else {
      setFormError(result.error || 'Failed to create complaint')
    }
  }

  return (
    <div className="container">
      <div className="create-complaint-page">
        <h1>Create New Complaint</h1>

        <ErrorMessage message={formError || error} />

        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief title of the complaint"
                required
                maxLength={200}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Road">Road</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail"
              required
              rows={5}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Image URL (Optional)</label>
              <input
                type="url"
                name="imageUrl"
                className="form-input"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address *</label>
            <input
              type="text"
              name="address"
              className="form-input"
              value={formData.location.address}
              onChange={handleChange}
              placeholder="Street address, City, State"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Latitude *</label>
              <input
                type="number"
                name="latitude"
                className="form-input"
                value={formData.location.coordinates.latitude}
                onChange={handleChange}
                placeholder="e.g., 28.6139"
                step="any"
                required
              />
              <small className="form-hint">Get coordinates from Google Maps</small>
            </div>

            <div className="form-group">
              <label className="form-label">Longitude *</label>
              <input
                type="number"
                name="longitude"
                className="form-input"
                value={formData.location.coordinates.longitude}
                onChange={handleChange}
                placeholder="e.g., 77.2090"
                step="any"
                required
              />
              <small className="form-hint">Right-click on Google Maps → Coordinates</small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/complaints')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateComplaint
