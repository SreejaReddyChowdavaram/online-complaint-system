# Frontend Authentication Flow - Complete Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Components](#components)
4. [JWT Token Management](#jwt-token-management)
5. [Protected Routes](#protected-routes)
6. [Role-Based Routing](#role-based-routing)
7. [Complete Flow Diagrams](#complete-flow-diagrams)

---

## 🎯 Overview

**Frontend Authentication System:**
- **State Management:** Context API (AuthContext)
- **Token Storage:** localStorage
- **API Calls:** Axios with interceptors
- **Route Protection:** PrivateRoute component
- **Role-Based Access:** RoleBasedRoute component

**Key Features:**
- ✅ Login and Register forms
- ✅ JWT token storage in localStorage
- ✅ Automatic token injection in API requests
- ✅ Protected routes
- ✅ Role-based routing
- ✅ Auto-logout on token expiry

---

## 🔄 Authentication Flow

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              USER VISITS APPLICATION                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              APP.JSX LOADS                                    │
│  • AuthProvider wraps app                                    │
│  • AuthContext initializes                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              AUTHCONTEXT.CHECKAUTH()                         │
│  1. Reads token from localStorage                            │
│  2. If token exists → GET /api/auth/me                      │
│  3. Sets user state                                          │
│  4. Sets loading to false                                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ├──→ Token exists & valid
                        │    ↓
                        │    User authenticated
                        │    ↓
                        │    Access granted
                        │
                        └──→ No token or invalid
                             ↓
                             User not authenticated
                             ↓
                             Redirect to login
```

---

## 📝 Step-by-Step Authentication Flow

### Step 1: Application Initialization

**What happens:**
1. App.jsx loads
2. AuthProvider wraps the application
3. AuthContext initializes
4. `checkAuth()` runs automatically

**Code:**
```javascript
// App.jsx
<AuthProvider>
  <Router>
    {/* Routes */}
  </Router>
</AuthProvider>

// AuthContext.jsx
useEffect(() => {
  checkAuth()  // Runs on mount
}, [])
```

---

### Step 2: Check Authentication

**What happens:**
1. Reads token from localStorage
2. If token exists, fetches user data
3. Sets user state
4. Sets loading to false

**Code:**
```javascript
const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      // Token exists, fetch user data
      const response = await getCurrentUser()
      setUser(response.data)
    }
  } catch (error) {
    // Token invalid or expired
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  } finally {
    setLoading(false)
  }
}
```

---

### Step 3: User Login

**What happens:**
1. User enters email/password
2. Form submits
3. Login component calls `AuthContext.login()`
4. AuthContext calls `authService.login()`
5. API request sent to backend
6. Token received and stored
7. User data stored
8. Redirect to dashboard

**Code Flow:**
```javascript
// Login.jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  const result = await login(formData)  // AuthContext.login()
  if (result.success) {
    navigate('/')  // Redirect to dashboard
  }
}

// AuthContext.jsx
const login = async (credentials) => {
  const response = await loginApi(credentials)  // authService.login()
  
  // Store token and user data
  localStorage.setItem('token', response.token)
  localStorage.setItem('user', JSON.stringify(response.data))
  setUser(response.data)
  
  return { success: true, data: response.data }
}

// authService.js
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data  // { success, token, data: user }
}
```

---

### Step 4: User Registration

**What happens:**
1. User fills registration form
2. Form submits
3. Register component calls `AuthContext.register()`
4. AuthContext calls `authService.register()`
5. API request sent to backend
6. Token received and stored
7. User data stored
8. Redirect to dashboard

**Code Flow:**
```javascript
// Register.jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  const result = await register(formData)  // AuthContext.register()
  if (result.success) {
    navigate('/')  // Redirect to dashboard
  }
}

// AuthContext.jsx
const register = async (userData) => {
  const response = await registerApi(userData)  // authService.register()
  
  // Store token and user data
  localStorage.setItem('token', response.token)
  localStorage.setItem('user', JSON.stringify(response.data))
  setUser(response.data)
  
  return { success: true, data: response.data }
}
```

---

### Step 5: Protected Route Access

**What happens:**
1. User navigates to protected route
2. PrivateRoute component checks authentication
3. If authenticated → Render component
4. If not authenticated → Redirect to login

**Code:**
```javascript
// PrivateRoute.jsx
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
```

---

### Step 6: API Request with Token

**What happens:**
1. Component makes API call
2. Axios interceptor adds token to header
3. Request sent with Authorization header
4. Backend validates token
5. Response returned

**Code:**
```javascript
// api.js - Axios interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)
```

---

### Step 7: Token Expiry Handling

**What happens:**
1. API request made with expired token
2. Backend returns 401 Unauthorized
3. Axios interceptor catches error
4. Token removed from localStorage
5. User redirected to login

**Code:**
```javascript
// api.js - Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

### Step 8: User Logout

**What happens:**
1. User clicks logout
2. AuthContext.logout() called
3. Token removed from localStorage
4. User data cleared
5. User state set to null
6. Redirect to login

**Code:**
```javascript
// AuthContext.jsx
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  setUser(null)
}

// Navbar.jsx
const handleLogout = () => {
  logout()
  navigate('/login')
}
```

---

## 🧩 Components

### 1. AuthContext

**File:** `context/AuthContext.jsx`

**Purpose:** Manages authentication state globally

**State:**
- `user` - Current user object
- `loading` - Loading state during auth check

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

---

### 2. Login Component

**File:** `pages/auth/Login.jsx`

**Purpose:** User login form

**API Call:**
- `POST /api/auth/login` (via AuthContext)

**Flow:**
1. User enters email/password
2. Form submits
3. Calls `AuthContext.login()`
4. Token stored in localStorage
5. Redirects to dashboard

---

### 3. Register Component

**File:** `pages/auth/Register.jsx`

**Purpose:** User registration form

**API Call:**
- `POST /api/auth/register` (via AuthContext)

**Flow:**
1. User fills form (name, email, password, phone)
2. Form submits
3. Calls `AuthContext.register()`
4. Token stored in localStorage
5. Redirects to dashboard

---

### 4. PrivateRoute Component

**File:** `components/PrivateRoute.jsx`

**Purpose:** Protects routes, requires authentication

**Flow:**
1. Checks `isAuthenticated` from AuthContext
2. If not authenticated → Redirect to `/login`
3. If authenticated → Render component

**Usage:**
```javascript
<Route 
  path="/dashboard" 
  element={<PrivateRoute><Dashboard /></PrivateRoute>} 
/>
```

---

### 5. RoleBasedRoute Component

**File:** `components/RoleBasedRoute.jsx`

**Purpose:** Protects routes based on user role

**Flow:**
1. Checks authentication
2. Checks user role
3. If wrong role → Redirect to dashboard
4. If correct role → Render component

**Usage:**
```javascript
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

## 🔐 JWT Token Management

### Token Storage

**Location:** localStorage

**Keys:**
- `token` - JWT token string
- `user` - User object (JSON stringified)

**Code:**
```javascript
// Store token
localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(user))

// Retrieve token
const token = localStorage.getItem('token')

// Remove token
localStorage.removeItem('token')
localStorage.removeItem('user')
```

---

### Token Injection

**Automatic via Axios Interceptor:**

```javascript
// api.js
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)
```

**What happens:**
- Every API request automatically includes token
- No need to manually add token to each request
- Token sent in Authorization header: `Bearer <token>`

---

### Token Validation

**On App Load:**
```javascript
// AuthContext.jsx
useEffect(() => {
  checkAuth()  // Validates token on app load
}, [])

const checkAuth = async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      // Validate token by fetching user
      const response = await getCurrentUser()
      setUser(response.data)  // Token valid
    } catch (error) {
      // Token invalid, clear it
      localStorage.removeItem('token')
      setUser(null)
    }
  }
}
```

**On API Response:**
```javascript
// api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired/invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
  }
)
```

---

## 🛡️ Protected Routes

### Basic Protection

**PrivateRoute Component:**
```javascript
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" />
  
  return children
}
```

**Usage:**
```javascript
<Route 
  path="/dashboard" 
  element={<PrivateRoute><Dashboard /></PrivateRoute>} 
/>
```

---

### Role-Based Protection

**RoleBasedRoute Component:**
```javascript
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" />
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />  // Wrong role, redirect
  }
  
  return children
}
```

**Usage:**
```javascript
// Citizen only route
<Route 
  path="/complaints/create" 
  element={
    <RoleBasedRoute allowedRoles={['Citizen']}>
      <CreateComplaint />
    </RoleBasedRoute>
  } 
/>

// Officer or Admin route
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

## 🔄 Complete Flow Diagrams

### Login Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ Enters email/password
     ▼
┌─────────────────────┐
│  Login.jsx          │
│  handleSubmit()     │
└────┬────────────────┘
     │
     │ login(formData)
     ▼
┌─────────────────────┐
│  AuthContext        │
│  login()            │
└────┬────────────────┘
     │
     │ loginApi(credentials)
     ▼
┌─────────────────────┐
│  authService.js     │
│  login()            │
└────┬────────────────┘
     │
     │ api.post('/auth/login')
     ▼
┌─────────────────────┐
│  api.js             │
│  Interceptor adds   │
│  Authorization      │
└────┬────────────────┘
     │
     │ POST /api/auth/login
     │ Authorization: Bearer <token>
     ▼
┌─────────────────────┐
│  Backend API        │
│  Validates &        │
│  Returns token      │
└────┬────────────────┘
     │
     │ { success, token, data }
     ▼
┌─────────────────────┐
│  AuthContext        │
│  Stores token       │
│  Sets user state    │
└────┬────────────────┘
     │
     │ navigate('/')
     ▼
┌──────────┐
│ Dashboard│
└──────────┘
```

---

### Protected Route Flow

```
┌──────────┐
│  User    │
│  Navigates│
└────┬─────┘
     │
     │ Visits /dashboard
     ▼
┌─────────────────────┐
│  App.jsx            │
│  Route definition   │
└────┬────────────────┘
     │
     │ <PrivateRoute><Dashboard /></PrivateRoute>
     ▼
┌─────────────────────┐
│  PrivateRoute.jsx   │
│  Checks auth        │
└────┬────────────────┘
     │
     ├──→ isAuthenticated = true
     │    ↓
     │    Render Dashboard
     │
     └──→ isAuthenticated = false
          ↓
          <Navigate to="/login" />
```

---

### API Request Flow

```
┌──────────┐
│ Component│
└────┬─────┘
     │
     │ getComplaints()
     ▼
┌─────────────────────┐
│  complaintService   │
│  api.get('/complaints')│
└────┬────────────────┘
     │
     │ Request interceptor
     ▼
┌─────────────────────┐
│  api.js             │
│  Gets token from    │
│  localStorage       │
└────┬────────────────┘
     │
     │ Adds Authorization header
     ▼
┌─────────────────────┐
│  HTTP Request       │
│  GET /api/complaints│
│  Authorization:     │
│  Bearer <token>     │
└────┬────────────────┘
     │
     │ Backend validates token
     ▼
┌─────────────────────┐
│  Response           │
│  { data: [...] }    │
└────┬────────────────┘
     │
     │ Response interceptor
     ▼
┌─────────────────────┐
│  api.js             │
│  Checks status      │
│  (401 = logout)     │
└────┬────────────────┘
     │
     │ Returns data
     ▼
┌──────────┐
│ Component│
│ Updates  │
└──────────┘
```

---

## 📊 Component-API Mapping

| Component | API Endpoint | Method | Purpose |
|-----------|--------------|--------|---------|
| **Login** | `/api/auth/login` | POST | User login |
| **Register** | `/api/auth/register` | POST | User registration |
| **AuthContext** | `/api/auth/me` | GET | Check authentication |
| **PrivateRoute** | None | - | Route protection |
| **RoleBasedRoute** | None | - | Role-based protection |

---

## 🔐 Security Features

### 1. Token Storage
- Stored in localStorage
- Automatically added to requests
- Removed on logout or expiry

### 2. Automatic Token Injection
- Axios interceptor adds token
- No manual token handling needed
- Works for all API calls

### 3. Token Validation
- Validated on app load
- Validated on API responses
- Auto-logout on invalid token

### 4. Protected Routes
- PrivateRoute checks authentication
- RoleBasedRoute checks role
- Automatic redirects

### 5. Error Handling
- 401 errors trigger logout
- Clear error messages
- User-friendly feedback

---

## 💻 Code Examples

### Using AuthContext

```javascript
import { useAuth } from '../context/AuthContext'

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>Please login</div>
  }

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Making Authenticated API Call

```javascript
import api from '../services/api'

// Token automatically added by interceptor
const fetchData = async () => {
  const response = await api.get('/complaints')
  return response.data
}
```

### Role-Based UI

```javascript
const { user } = useAuth()

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

## ✅ Summary

**Frontend Authentication Flow:**
1. App loads → AuthContext checks token
2. User logs in → Token stored → User state set
3. Protected route → PrivateRoute checks auth
4. API request → Token automatically added
5. Token expires → Auto-logout → Redirect to login

**Key Components:**
- AuthContext - State management
- Login/Register - Authentication forms
- PrivateRoute - Route protection
- RoleBasedRoute - Role-based protection
- api.js - Token injection

**Security:**
- Token in localStorage
- Automatic token injection
- Token validation
- Auto-logout on expiry
- Protected routes

The frontend authentication flow is complete and secure! 🔐
