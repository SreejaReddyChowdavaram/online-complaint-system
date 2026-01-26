# React Frontend - Quick Reference

## 🚀 Quick Start

### Start Development Server
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Folder Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── context/            # Context API providers
├── services/           # API service layer
└── styles/             # Global styles
```

---

## 🔗 Routes

### Public Routes
```
/login                  → Login page
/register               → Register page
/tracking/:complaintId  → Public tracking
```

### Protected Routes
```
/                       → Dashboard
/complaints             → Complaint list
/complaints/create      → Create complaint (Citizen)
/complaints/:id         → Complaint detail
/profile                → User profile
```

---

## 🧩 Components

### Pages
- **Login** - User login
- **Register** - User registration
- **Dashboard** - Role-based dashboard
- **ComplaintList** - List complaints
- **ComplaintDetail** - View complaint
- **CreateComplaint** - Create complaint
- **ComplaintTracking** - Public tracking
- **Profile** - User profile

### Reusable Components
- **Navbar** - Navigation bar
- **PrivateRoute** - Protected route wrapper
- **Loading** - Loading spinner
- **ErrorMessage** - Error display

---

## 🔐 Context API

### AuthContext
```javascript
const { user, isAuthenticated, login, logout } = useAuth()
```

**State:**
- `user` - Current user
- `isAuthenticated` - Auth status
- `loading` - Loading state

**Functions:**
- `login(credentials)` - Login
- `register(userData)` - Register
- `logout()` - Logout

### ComplaintContext
```javascript
const { complaints, fetchComplaints, createComplaint } = useComplaint()
```

**State:**
- `complaints` - List of complaints
- `loading` - Loading state
- `error` - Error state

**Functions:**
- `fetchComplaints(filters)` - Get complaints
- `createComplaint(data)` - Create complaint
- `updateComplaint(id, data)` - Update complaint

---

## 🌐 API Services

### Auth Service
```javascript
import { login, register, getCurrentUser } from '../services/authService'

// Login
await login({ email, password })

// Register
await register({ name, email, password, phone })

// Get current user
await getCurrentUser()
```

### Complaint Service
```javascript
import { 
  getComplaints, 
  getComplaint, 
  createComplaint,
  addComment,
  updateStatus
} from '../services/complaintService'

// Get complaints
await getComplaints({ status: 'Pending' })

// Get single complaint
await getComplaint(id)

// Create complaint
await createComplaint(data)

// Add comment
await addComment(id, text)

// Update status
await updateStatus(id, status, notes)
```

---

## 🔄 Common Patterns

### Using Context
```javascript
import { useAuth } from '../context/AuthContext'

const MyComponent = () => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please login</div>
  }
  
  return <div>Welcome, {user.name}</div>
}
```

### Making API Call
```javascript
import { useState } from 'react'
import { getComplaints } from '../services/complaintService'

const MyComponent = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(false)

  const loadComplaints = async () => {
    setLoading(true)
    try {
      const response = await getComplaints()
      setComplaints(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])
}
```

### Form Handling
```javascript
const [formData, setFormData] = useState({
  title: '',
  description: ''
})

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}

const handleSubmit = async (e) => {
  e.preventDefault()
  await createComplaint(formData)
}
```

---

## 🎯 Role-Based UI

### Check User Role
```javascript
const { user } = useAuth()

if (user?.role === 'Citizen') {
  // Citizen UI
} else if (user?.role === 'Officer') {
  // Officer UI
} else if (user?.role === 'Admin') {
  // Admin UI
}
```

### Conditional Rendering
```javascript
{user?.role === 'Citizen' && (
  <Link to="/complaints/create">Create Complaint</Link>
)}

{user?.role === 'Officer' && (
  <button onClick={updateStatus}>Update Status</button>
)}

{user?.role === 'Admin' && (
  <button onClick={assignOfficer}>Assign Officer</button>
)}
```

---

## 🔐 Authentication

### Login Flow
```javascript
const handleLogin = async (credentials) => {
  const result = await login(credentials)
  if (result.success) {
    navigate('/')
  }
}
```

### Protected Route
```javascript
<Route 
  path="/dashboard" 
  element={<PrivateRoute><Dashboard /></PrivateRoute>} 
/>
```

### Check Auth
```javascript
const { isAuthenticated } = useAuth()

if (!isAuthenticated) {
  return <Navigate to="/login" />
}
```

---

## 📝 Form Validation

### Basic Validation
```javascript
const [errors, setErrors] = useState({})

const validate = () => {
  const newErrors = {}
  
  if (!formData.title) {
    newErrors.title = 'Title is required'
  }
  
  if (formData.description.length < 10) {
    newErrors.description = 'Description must be at least 10 characters'
  }
  
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

---

## 🎨 Styling

### CSS Modules
```javascript
import './MyComponent.css'

<div className="my-component">
  <h1 className="title">Title</h1>
</div>
```

### Inline Styles
```javascript
<div style={{ color: 'red', fontSize: '16px' }}>
  Content
</div>
```

---

## 🐛 Error Handling

### Try-Catch
```javascript
try {
  const response = await getComplaints()
  setComplaints(response.data)
} catch (error) {
  setError(error.response?.data?.message || 'An error occurred')
}
```

### Error Display
```javascript
{error && <ErrorMessage message={error} />}
```

---

## 🔄 Navigation

### Programmatic Navigation
```javascript
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate('/complaints')
```

### Link Component
```javascript
import { Link } from 'react-router-dom'

<Link to="/complaints">View Complaints</Link>
```

---

## 📊 State Management

### Local State
```javascript
const [count, setCount] = useState(0)
```

### Context State
```javascript
const { complaints } = useComplaint()
```

### Effect Hook
```javascript
useEffect(() => {
  loadData()
}, [dependency])
```

---

## ✅ Best Practices

1. **Use Context for Global State**
   - Auth state → AuthContext
   - Complaint state → ComplaintContext

2. **Service Layer for API Calls**
   - Don't call APIs directly in components
   - Use service functions

3. **Error Handling**
   - Always use try-catch
   - Display user-friendly errors

4. **Loading States**
   - Show loading spinner during API calls
   - Disable buttons while loading

5. **Form Validation**
   - Validate before submit
   - Show clear error messages

6. **Role-Based Access**
   - Check role before showing UI
   - Backend also enforces permissions

---

## 🆘 Common Issues

### Token Not Sent
- Check localStorage has token
- Check axios interceptor is working

### 401 Unauthorized
- Token expired or invalid
- User needs to login again

### CORS Error
- Check backend CORS settings
- Check API URL in .env

### Component Not Updating
- Check state is being updated
- Check dependencies in useEffect

---

## 📚 File Locations

**Components:**
- `src/components/`

**Pages:**
- `src/pages/`

**Context:**
- `src/context/`

**Services:**
- `src/services/`

**Styles:**
- `src/styles/`

---

This quick reference covers the essential React frontend patterns! 🚀
