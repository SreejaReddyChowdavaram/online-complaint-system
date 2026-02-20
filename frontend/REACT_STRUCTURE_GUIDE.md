# React Frontend Structure - Complete Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Component List](#component-list)
4. [API Integration Map](#api-integration-map)
5. [Context API Setup](#context-api-setup)
6. [Role-Based Routing](#role-based-routing)
7. [Sample Components](#sample-components)

---

## 🎯 Overview

**React Frontend Architecture:**
- **Framework:** React 18 with Vite
- **Routing:** React Router DOM v6
- **State Management:** Context API
- **API Calls:** Axios
- **Styling:** CSS Modules (can be extended to styled-components)

**Key Features:**
- ✅ Role-based UI (Citizen, Officer, Admin)
- ✅ Protected routes
- ✅ Context API for state management
- ✅ Axios interceptors for auth
- ✅ Responsive design ready

---

## 📁 Folder Structure

```
frontend-react/
├── public/                          # Static files
│   └── index.html
│
├── src/
│   ├── main.jsx                    # Entry point
│   ├── App.jsx                      # Main app component with routing
│   │
│   ├── components/                  # Reusable components
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── Navbar.css
│   │   ├── PrivateRoute.jsx        # Protected route wrapper
│   │   ├── Loading.jsx             # Loading spinner
│   │   └── ErrorMessage.jsx        # Error display
│   │
│   ├── pages/                       # Page components
│   │   ├── auth/                   # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Auth.css
│   │   │
│   │   ├── complaints/             # Complaint pages
│   │   │   ├── ComplaintList.jsx
│   │   │   ├── ComplaintList.css
│   │   │   ├── ComplaintDetail.jsx
│   │   │   ├── ComplaintDetail.css
│   │   │   ├── CreateComplaint.jsx
│   │   │   ├── CreateComplaint.css
│   │   │   ├── ComplaintTracking.jsx
│   │   │   └── ComplaintTracking.css
│   │   │
│   │   ├── Dashboard.jsx           # Dashboard (role-based)
│   │   ├── Dashboard.css
│   │   ├── Profile.jsx             # User profile
│   │   └── Profile.css
│   │
│   ├── context/                    # Context API providers
│   │   ├── AuthContext.jsx        # Authentication state
│   │   └── ComplaintContext.jsx   # Complaint state
│   │
│   ├── services/                   # API service layer
│   │   ├── api.js                  # Axios instance
│   │   ├── authService.js          # Auth API calls
│   │   └── complaintService.js     # Complaint API calls
│   │
│   └── styles/                     # Global styles
│       └── index.css
│
├── package.json
├── vite.config.js
└── .env                            # Environment variables
```

---

## 🧩 Component List

### Layout Components

| Component | Location | Purpose | API Calls |
|-----------|----------|---------|-----------|
| **Navbar** | `components/Navbar.jsx` | Navigation bar with role-based menu | None (uses AuthContext) |
| **PrivateRoute** | `components/PrivateRoute.jsx` | Protects routes, redirects if not authenticated | None (uses AuthContext) |
| **Loading** | `components/Loading.jsx` | Loading spinner component | None |
| **ErrorMessage** | `components/ErrorMessage.jsx` | Error message display | None |

### Authentication Pages

| Component | Location | Purpose | API Calls |
|-----------|----------|---------|-----------|
| **Login** | `pages/auth/Login.jsx` | User login form | `POST /api/auth/login` |
| **Register** | `pages/auth/Register.jsx` | User registration form | `POST /api/auth/register` |

### Complaint Pages

| Component | Location | Purpose | API Calls |
|-----------|----------|---------|-----------|
| **ComplaintList** | `pages/complaints/ComplaintList.jsx` | List all complaints (filtered by role) | `GET /api/complaints` |
| **ComplaintDetail** | `pages/complaints/ComplaintDetail.jsx` | View single complaint details | `GET /api/complaints/:id`, `POST /api/complaints/:id/comments`, `PUT /api/complaints/:id/status` |
| **CreateComplaint** | `pages/complaints/CreateComplaint.jsx` | Create new complaint form | `POST /api/complaints` |
| **ComplaintTracking** | `pages/complaints/ComplaintTracking.jsx` | Public complaint tracking (no auth) | `GET /api/complaints/complaint-id/:complaintId` |

### Other Pages

| Component | Location | Purpose | API Calls |
|-----------|----------|---------|-----------|
| **Dashboard** | `pages/Dashboard.jsx` | Role-based dashboard | `GET /api/complaints` (filtered) |
| **Profile** | `pages/Profile.jsx` | User profile page | `GET /api/auth/me`, `PUT /api/auth/updatepassword` |

### Context Providers

| Component | Location | Purpose | API Calls |
|-----------|----------|---------|-----------|
| **AuthContext** | `context/AuthContext.jsx` | Authentication state management | `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me` |
| **ComplaintContext** | `context/ComplaintContext.jsx` | Complaint state management | Various complaint APIs |

---

## 🔗 API Integration Map

### Authentication APIs

| Component | API Endpoint | Method | Purpose |
|-----------|--------------|--------|---------|
| **Login.jsx** | `/api/auth/login` | POST | User login |
| **Register.jsx** | `/api/auth/register` | POST | User registration |
| **AuthContext.jsx** | `/api/auth/me` | GET | Get current user |
| **Profile.jsx** | `/api/auth/me` | GET | Get user profile |
| **Profile.jsx** | `/api/auth/updatepassword` | PUT | Update password |

### Complaint APIs

| Component | API Endpoint | Method | Purpose |
|-----------|--------------|--------|---------|
| **Dashboard.jsx** | `/api/complaints` | GET | Get complaints for dashboard |
| **ComplaintList.jsx** | `/api/complaints` | GET | Get all complaints (with filters) |
| **ComplaintDetail.jsx** | `/api/complaints/:id` | GET | Get single complaint |
| **ComplaintDetail.jsx** | `/api/complaints/:id/comments` | POST | Add comment |
| **ComplaintDetail.jsx** | `/api/complaints/:id/status` | PUT | Update status (Officer/Admin) |
| **CreateComplaint.jsx** | `/api/complaints` | POST | Create new complaint |
| **ComplaintTracking.jsx** | `/api/complaints/complaint-id/:complaintId` | GET | Track complaint (public) |

---

## 🎯 Context API Setup

### AuthContext

**Purpose:** Manages authentication state globally

**State:**
- `user` - Current user object
- `loading` - Loading state
- `isAuthenticated` - Boolean flag

**Functions:**
- `login(credentials)` - Login user
- `register(userData)` - Register user
- `logout()` - Logout user
- `checkAuth()` - Check if user is authenticated

**Usage:**
```javascript
import { useAuth } from '../context/AuthContext'

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  // Use auth state and functions
}
```

### ComplaintContext

**Purpose:** Manages complaint state globally

**State:**
- `complaints` - List of complaints
- `loading` - Loading state
- `error` - Error state

**Functions:**
- `fetchComplaints(filters)` - Fetch complaints
- `createComplaint(data)` - Create complaint
- `updateComplaint(id, data)` - Update complaint
- `deleteComplaint(id)` - Delete complaint

**Usage:**
```javascript
import { useComplaint } from '../context/ComplaintContext'

const MyComponent = () => {
  const { complaints, fetchComplaints, createComplaint } = useComplaint()
  
  // Use complaint state and functions
}
```

---

## 🔐 Role-Based Routing

### Route Structure

```javascript
// Public Routes
/login                    → Login page
/register                 → Register page
/tracking/:complaintId    → Public tracking (no auth)

// Protected Routes (All roles)
/                         → Dashboard (role-based content)
/complaints               → Complaint list (filtered by role)
/complaints/:id           → Complaint detail
/profile                  → User profile

// Citizen Only Routes
/complaints/create         → Create complaint (Citizen only)

// Officer/Admin Routes
// (Same routes, different UI based on role)
```

### Role-Based UI Logic

**Dashboard:**
- **Citizen:** Shows own complaints, create complaint button
- **Officer:** Shows assigned complaints, status update options
- **Admin:** Shows all complaints, assign officer options

**ComplaintList:**
- **Citizen:** Shows only own complaints
- **Officer:** Shows assigned complaints
- **Admin:** Shows all complaints

**ComplaintDetail:**
- **Citizen:** View only, can add comments
- **Officer:** Can update status, add comments
- **Admin:** Can update status, assign officer, delete

---

## 💻 Sample Components

### 1. Login Component

**File:** `pages/auth/Login.jsx`

```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/ErrorMessage'
import './Auth.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(formData)
      
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        
        {error && <ErrorMessage message={error} />}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  )
}

export default Login
```

**API Integration:**
- Uses `AuthContext.login()` which calls `POST /api/auth/login`
- Token stored in localStorage automatically
- Redirects to dashboard on success

---

### 2. Create Complaint Component

**File:** `pages/complaints/CreateComplaint.jsx`

```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useComplaint } from '../../context/ComplaintContext'
import ErrorMessage from '../../components/ErrorMessage'
import './CreateComplaint.css'

const CreateComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Road',
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
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { createComplaint } = useComplaint()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: grandchild ? {
            ...formData[parent][child],
            [grandchild]: value
          } : value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            }
          })
        },
        (error) => {
          setError('Unable to get location')
        }
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await createComplaint(formData)
      
      if (result.success) {
        navigate(`/complaints/${result.data._id}`)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to create complaint. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-complaint">
      <h2>Create New Complaint</h2>
      
      {error && <ErrorMessage message={error} />}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={200}
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={10}
            rows={5}
          />
        </div>
        
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Road">Road</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
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
          <label>Address</label>
          <input
            type="text"
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Location Coordinates</label>
          <button type="button" onClick={handleGetLocation}>
            Get Current Location
          </button>
          <input
            type="number"
            name="location.coordinates.latitude"
            value={formData.location.coordinates.latitude}
            onChange={handleChange}
            placeholder="Latitude"
            step="any"
            required
          />
          <input
            type="number"
            name="location.coordinates.longitude"
            value={formData.location.coordinates.longitude}
            onChange={handleChange}
            placeholder="Longitude"
            step="any"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Image URL (Optional)</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Complaint'}
        </button>
      </form>
    </div>
  )
}

export default CreateComplaint
```

**API Integration:**
- Uses `ComplaintContext.createComplaint()` which calls `POST /api/complaints`
- Automatically includes user ID from auth token
- Redirects to complaint detail on success

---

### 3. Dashboard Component (Role-Based)

**File:** `pages/Dashboard.jsx`

```javascript
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useComplaint } from '../context/ComplaintContext'
import Loading from '../components/Loading'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const { complaints, fetchComplaints, loading } = useComplaint()
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  })

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = async () => {
    // Filter based on role
    const filters = {}
    if (user?.role === 'Citizen') {
      filters.submittedBy = user._id
    } else if (user?.role === 'Officer') {
      filters.assignedTo = user._id
    }
    // Admin sees all (no filter)
    
    await fetchComplaints(filters)
  }

  useEffect(() => {
    if (complaints) {
      setStats({
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length
      })
    }
  }, [complaints])

  if (loading) return <Loading />

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}</h1>
      <p className="role-badge">Role: {user?.role}</p>

      {/* Role-based content */}
      {user?.role === 'Citizen' && (
        <div className="dashboard-actions">
          <Link to="/complaints/create" className="btn-primary">
            Create New Complaint
          </Link>
        </div>
      )}

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">{stats.pending}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number">{stats.inProgress}</p>
        </div>
        <div className="stat-card">
          <h3>Resolved</h3>
          <p className="stat-number">{stats.resolved}</p>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="recent-complaints">
        <h2>Recent Complaints</h2>
        {complaints && complaints.length > 0 ? (
          <div className="complaints-list">
            {complaints.slice(0, 5).map(complaint => (
              <Link
                key={complaint._id}
                to={`/complaints/${complaint._id}`}
                className="complaint-item"
              >
                <h4>{complaint.title}</h4>
                <span className={`status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}`}>
                  {complaint.status}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p>No complaints found</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
```

**API Integration:**
- Uses `ComplaintContext.fetchComplaints()` which calls `GET /api/complaints`
- Filters based on user role:
  - Citizen: `?submittedBy=userId`
  - Officer: `?assignedTo=userId`
  - Admin: No filter (all complaints)

---

### 4. ComplaintDetail Component

**File:** `pages/complaints/ComplaintDetail.jsx`

```javascript
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getComplaint, addComment, updateStatus } from '../../services/complaintService'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import './ComplaintDetail.css'

const ComplaintDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentText, setCommentText] = useState('')
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' })

  useEffect(() => {
    loadComplaint()
  }, [id])

  const loadComplaint = async () => {
    try {
      setLoading(true)
      const response = await getComplaint(id)
      setComplaint(response.data)
    } catch (err) {
      setError('Failed to load complaint')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    try {
      const response = await addComment(id, commentText)
      setComplaint(response.data)
      setCommentText('')
    } catch (err) {
      setError('Failed to add comment')
    }
  }

  const handleUpdateStatus = async (e) => {
    e.preventDefault()
    try {
      const response = await updateStatus(
        id,
        statusUpdate.status,
        statusUpdate.notes
      )
      setComplaint(response.data)
      setStatusUpdate({ status: '', notes: '' })
    } catch (err) {
      setError('Failed to update status')
    }
  }

  const canUpdateStatus = () => {
    if (user?.role === 'Admin') return true
    if (user?.role === 'Officer' && complaint?.assignedTo?._id === user._id) {
      return true
    }
    return false
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!complaint) return <div>Complaint not found</div>

  return (
    <div className="complaint-detail">
      <h1>{complaint.title}</h1>
      
      <div className="complaint-info">
        <p><strong>Complaint ID:</strong> {complaint.complaintId}</p>
        <p><strong>Status:</strong> 
          <span className={`status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}`}>
            {complaint.status}
          </span>
        </p>
        <p><strong>Category:</strong> {complaint.category}</p>
        <p><strong>Priority:</strong> {complaint.priority}</p>
        <p><strong>Department:</strong> {complaint.department}</p>
      </div>

      <div className="complaint-description">
        <h3>Description</h3>
        <p>{complaint.description}</p>
      </div>

      <div className="complaint-location">
        <h3>Location</h3>
        <p>{complaint.location.address}</p>
        <p>Coordinates: {complaint.location.coordinates.latitude}, {complaint.location.coordinates.longitude}</p>
      </div>

      {/* Status Update (Officer/Admin only) */}
      {canUpdateStatus() && (
        <div className="status-update-section">
          <h3>Update Status</h3>
          <form onSubmit={handleUpdateStatus}>
            <select
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
            <textarea
              placeholder="Notes (optional)"
              value={statusUpdate.notes}
              onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
              rows={3}
            />
            <button type="submit">Update Status</button>
          </form>
        </div>
      )}

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments</h3>
        
        <form onSubmit={handleAddComment}>
          <textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            rows={3}
          />
          <button type="submit">Add Comment</button>
        </form>

        <div className="comments-list">
          {complaint.comments?.map((comment, index) => (
            <div key={index} className="comment-item">
              <p><strong>{comment.user?.name}</strong></p>
              <p>{comment.text}</p>
              <p className="comment-date">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status History */}
      <div className="status-history">
        <h3>Status History</h3>
        {complaint.statusHistory?.map((history, index) => (
          <div key={index} className="history-item">
            <p><strong>{history.status}</strong></p>
            <p>{history.notes}</p>
            <p className="history-date">
              {new Date(history.changedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComplaintDetail
```

**API Integration:**
- `GET /api/complaints/:id` - Load complaint
- `POST /api/complaints/:id/comments` - Add comment
- `PUT /api/complaints/:id/status` - Update status (Officer/Admin only)

---

## 🔄 Data Flow

```
User Action
    ↓
Component
    ↓
Context/Service
    ↓
API Service (Axios)
    ↓
Backend API
    ↓
Response
    ↓
Update Context State
    ↓
Component Re-renders
```

---

## ✅ Summary

**React Frontend Structure:**
- ✅ Organized folder structure
- ✅ Component-based architecture
- ✅ Context API for state management
- ✅ Axios for API calls
- ✅ Role-based routing
- ✅ Protected routes
- ✅ Reusable components

**Key Components:**
- Authentication pages (Login, Register)
- Complaint pages (List, Detail, Create, Tracking)
- Dashboard (role-based)
- Profile page

**API Integration:**
- All components use service layer
- Service layer uses Axios instance
- Token automatically added to requests
- Error handling in interceptors

This structure is scalable, maintainable, and follows React best practices! 🚀
