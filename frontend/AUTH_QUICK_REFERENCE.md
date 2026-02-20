# Frontend Authentication - Quick Reference

## 🚀 Quick Start

### Use Auth in Component
```javascript
import { useAuth } from '../context/AuthContext'

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  // Check if authenticated
  if (!isAuthenticated) {
    return <div>Please login</div>
  }
  
  // Use user data
  return <div>Welcome, {user.name}</div>
}
```

### Protect a Route
```javascript
import PrivateRoute from './components/PrivateRoute'

<Route 
  path="/dashboard" 
  element={<PrivateRoute><Dashboard /></PrivateRoute>} 
/>
```

### Role-Based Route
```javascript
import RoleBasedRoute from './components/RoleBasedRoute'

<Route 
  path="/complaints/create" 
  element={
    <RoleBasedRoute allowedRoles={['Citizen']}>
      <CreateComplaint />
    </RoleBasedRoute>
  } 
/>
```

---

## 🔐 AuthContext API

### State
```javascript
const {
  user,              // User object or null
  loading,           // Loading state
  isAuthenticated,   // Boolean: !!user
  login,             // Function to login
  register,          // Function to register
  logout,           // Function to logout
  checkAuth         // Function to check auth
} = useAuth()
```

### Login
```javascript
const result = await login({ email, password })

if (result.success) {
  // Login successful
  navigate('/')
} else {
  // Login failed
  setError(result.error)
}
```

### Register
```javascript
const result = await register({ 
  name, 
  email, 
  password, 
  phone 
})

if (result.success) {
  // Registration successful
  navigate('/')
}
```

### Logout
```javascript
logout()
navigate('/login')
```

---

## 🛡️ Route Protection

### PrivateRoute
```javascript
// Protects route - requires authentication
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

**Behavior:**
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Renders component if authenticated

### RoleBasedRoute
```javascript
// Protects route - requires specific role
<RoleBasedRoute allowedRoles={['Citizen']}>
  <CreateComplaint />
</RoleBasedRoute>
```

**Behavior:**
- Checks if user is authenticated
- Checks if user has required role
- Redirects to `/login` if not authenticated
- Redirects to `/` if wrong role
- Renders component if authenticated and correct role

---

## 📝 Component Templates

### Login Component
```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await login(formData)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div>{error}</div>}
    </form>
  )
}
```

### Register Component
```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await register(formData)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}
```

---

## 🔄 Token Management

### Token Storage
```javascript
// Stored automatically on login/register
localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(user))

// Retrieved automatically by interceptor
const token = localStorage.getItem('token')

// Removed on logout
localStorage.removeItem('token')
localStorage.removeItem('user')
```

### Token Injection
```javascript
// Automatic via Axios interceptor
// No manual token handling needed

// api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## 🎯 Role-Based UI

### Check Role
```javascript
const { user } = useAuth()

if (user?.role === 'Citizen') {
  // Citizen UI
}

if (user?.role === 'Officer') {
  // Officer UI
}

if (user?.role === 'Admin') {
  // Admin UI
}
```

### Conditional Rendering
```javascript
{user?.role === 'Citizen' && (
  <Link to="/complaints/create">Create Complaint</Link>
)}

{['Officer', 'Admin'].includes(user?.role) && (
  <button onClick={updateStatus}>Update Status</button>
)}
```

---

## 📊 API Service

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

**Note:** Token automatically added by interceptor

---

## 🔐 Protected Route Examples

### Basic Protection
```javascript
<Route 
  path="/dashboard" 
  element={<PrivateRoute><Dashboard /></PrivateRoute>} 
/>
```

### Role-Based Protection
```javascript
// Citizen only
<Route 
  path="/complaints/create" 
  element={
    <RoleBasedRoute allowedRoles={['Citizen']}>
      <CreateComplaint />
    </RoleBasedRoute>
  } 
/>

// Officer or Admin
<Route 
  path="/admin" 
  element={
    <RoleBasedRoute allowedRoles={['Officer', 'Admin']}>
      <AdminPanel />
    </RoleBasedRoute>
  } 
/>
```

---

## 🐛 Common Issues

### Token Not Working
- Check token exists in localStorage
- Check interceptor is working
- Check token format (Bearer <token>)

### 401 Unauthorized
- Token expired or invalid
- User needs to login again
- Check token in localStorage

### Redirect Loop
- Check PrivateRoute logic
- Check isAuthenticated state
- Check loading state

---

## ✅ Checklist

**Login:**
- [ ] Form validates input
- [ ] Calls AuthContext.login()
- [ ] Token stored in localStorage
- [ ] User state updated
- [ ] Redirects to dashboard

**Register:**
- [ ] Form validates input
- [ ] Calls AuthContext.register()
- [ ] Token stored in localStorage
- [ ] User state updated
- [ ] Redirects to dashboard

**Protected Routes:**
- [ ] PrivateRoute checks auth
- [ ] Redirects if not authenticated
- [ ] Renders if authenticated

**Role-Based Routes:**
- [ ] RoleBasedRoute checks auth
- [ ] RoleBasedRoute checks role
- [ ] Redirects if wrong role
- [ ] Renders if correct role

---

## 📚 File Locations

**Auth Context:**
- `src/context/AuthContext.jsx`

**Auth Service:**
- `src/services/authService.js`

**Auth Pages:**
- `src/pages/auth/Login.jsx`
- `src/pages/auth/Register.jsx`

**Route Protection:**
- `src/components/PrivateRoute.jsx`
- `src/components/RoleBasedRoute.jsx`

**API Configuration:**
- `src/services/api.js`

---

## 💡 Pro Tips

1. **Always use useAuth() hook** - Don't access localStorage directly
2. **Use PrivateRoute** - Protect all authenticated routes
3. **Use RoleBasedRoute** - For role-specific routes
4. **Check loading state** - Show loading while checking auth
5. **Handle errors** - Display user-friendly error messages

---

## 🆘 Need Help?

1. Check `FRONTEND_AUTH_FLOW.md` for detailed flow
2. Check `AUTH_VISUAL_GUIDE.md` for visual diagrams
3. Check browser console for errors
4. Check localStorage for token
5. Check network tab for API calls

---

This quick reference covers all frontend authentication operations! 🔐
