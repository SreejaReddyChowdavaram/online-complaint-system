# JAN SUVIDHA - React Frontend Architecture

## 📋 Overview

This React.js frontend is built with a clean, modular architecture following best practices for a final-year engineering project.

## 🏗️ Architecture Pattern

### **Component-Based Architecture**
- **Pages**: Full page components (screens)
- **Components**: Reusable UI components
- **Context**: State management (no Redux needed)
- **Services**: API communication layer

```
User Interaction
    ↓
Pages (Screens)
    ↓
Components (UI)
    ↓
Context (State Management)
    ↓
Services (API Calls)
    ↓
Backend API
```

## 📁 Project Structure

```
frontend-react/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── PrivateRoute.jsx # Protected route wrapper
│   │   ├── Loading.jsx      # Loading spinner
│   │   └── ErrorMessage.jsx # Error display
│   │
│   ├── pages/               # Page components (screens)
│   │   ├── auth/
│   │   │   ├── Login.jsx    # Login page
│   │   │   └── Register.jsx # Registration page
│   │   ├── complaints/
│   │   │   ├── ComplaintList.jsx    # List all complaints
│   │   │   ├── ComplaintDetail.jsx  # View single complaint
│   │   │   ├── CreateComplaint.jsx  # Create new complaint
│   │   │   └── ComplaintTracking.jsx # Public tracking
│   │   ├── Dashboard.jsx   # Home page
│   │   └── Profile.jsx      # User profile
│   │
│   ├── context/             # Context API for state
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── ComplaintContext.jsx # Complaint state
│   │
│   ├── services/            # API service layer
│   │   ├── api.js           # Axios configuration
│   │   ├── authService.js   # Auth API calls
│   │   └── complaintService.js # Complaint API calls
│   │
│   ├── styles/              # CSS files
│   │   └── index.css        # Global styles
│   │
│   ├── App.jsx              # Main app with routing
│   └── main.jsx             # Entry point
│
├── package.json
├── vite.config.js
└── index.html
```

## 🔄 Data Flow

### **Authentication Flow**
```
1. User enters credentials (Login.jsx)
2. Calls AuthContext.login()
3. AuthContext calls authService.login()
4. authService makes API call to backend
5. Backend returns token + user data
6. AuthContext stores token in localStorage
7. AuthContext updates user state
8. App redirects to Dashboard
```

### **Complaint Creation Flow**
```
1. User fills form (CreateComplaint.jsx)
2. Submits form
3. Calls ComplaintContext.createComplaint()
4. ComplaintContext calls complaintService.createComplaint()
5. complaintService makes POST /api/complaints
6. Backend creates complaint
7. ComplaintContext updates complaints list
8. Redirect to ComplaintDetail page
```

## 🎯 Key Concepts Explained

### **1. Context API (State Management)**
**Why Context API instead of Redux?**
- Simpler for this project size
- Built into React (no extra library)
- Less boilerplate code
- Perfect for viva explanation

**How it works:**
- `AuthContext`: Manages user authentication state
- `ComplaintContext`: Manages complaint data
- Components use `useAuth()` or `useComplaint()` hooks
- State is shared across all components

### **2. Service Layer**
**Purpose:**
- Separates API calls from components
- Centralized API configuration
- Easy to maintain and test
- Reusable across components

**Structure:**
- `api.js`: Base Axios instance with interceptors
- `authService.js`: All auth-related API calls
- `complaintService.js`: All complaint-related API calls

### **3. Private Routes**
**Purpose:**
- Protects routes that require authentication
- Redirects to login if not authenticated
- Used in App.jsx to wrap protected routes

**Implementation:**
```jsx
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

### **4. Component Hierarchy**
```
App
  ├── Navbar (always visible)
  └── Routes
      ├── Public Routes (Login, Register, Tracking)
      └── Private Routes (Dashboard, Complaints, Profile)
          └── Protected by PrivateRoute
```

## 🔐 Authentication

### **Token Storage**
- Stored in `localStorage`
- Added to every API request via Axios interceptor
- Automatically removed on 401 error

### **Protected Routes**
- Wrapped with `<PrivateRoute>`
- Checks `isAuthenticated` from AuthContext
- Redirects to `/login` if not authenticated

## 📡 API Integration

### **Base Configuration**
- Base URL: `http://localhost:5000/api` (configurable via .env)
- All requests include `Authorization: Bearer <token>` header
- Automatic error handling for 401 (unauthorized)

### **Request Flow**
```
Component → Context → Service → API → Backend
                ↓
         Update State
                ↓
         Re-render UI
```

## 🎨 Styling Approach

### **CSS Variables**
- Centralized theme colors in `:root`
- Easy to customize
- Consistent design

### **Component Styles**
- Each component has its own CSS file
- Global styles in `index.css`
- Responsive design with media queries

## 🚀 Key Features

1. **Clean Code Structure**
   - Separation of concerns
   - Reusable components
   - Easy to understand

2. **State Management**
   - Context API (no Redux complexity)
   - Centralized state
   - Easy to debug

3. **Error Handling**
   - Global error handling
   - User-friendly error messages
   - Automatic token refresh handling

4. **Responsive Design**
   - Mobile-friendly
   - Works on all screen sizes
   - Modern UI

## 📚 For Viva Explanation

### **Why This Architecture?**
1. **Component-Based**: Easy to maintain, reusable code
2. **Context API**: Simple state management without Redux
3. **Service Layer**: Clean separation of API calls
4. **Private Routes**: Secure route protection

### **How Data Flows?**
1. User action → Component
2. Component → Context (state management)
3. Context → Service (API call)
4. Service → Backend API
5. Response → Context (update state)
6. State change → Component re-renders

### **Key Files to Explain:**
- `App.jsx`: Routing and app structure
- `AuthContext.jsx`: Authentication state management
- `ComplaintContext.jsx`: Complaint state management
- `api.js`: API configuration and interceptors
- `PrivateRoute.jsx`: Route protection logic

## 🔧 Customization

### **Adding New Features**
1. Create page in `pages/`
2. Add route in `App.jsx`
3. Add API service in `services/`
4. Update context if needed

### **Styling**
- Modify CSS variables in `index.css`
- Add component-specific styles
- Use existing utility classes

---

**This architecture is:**
- ✅ Clean and modular
- ✅ Easy to understand
- ✅ Viva-ready
- ✅ Scalable
- ✅ Beginner-friendly
