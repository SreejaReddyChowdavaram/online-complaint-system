# Complaint Submission and Tracking - Component Interaction Guide

## Overview

This document explains how the complaint submission and tracking system works in the React frontend, including component interactions, state management, API integration, and role-based conditional UI.

---

## Architecture Overview

```
App.jsx (Router)
├── AuthProvider (Authentication Context)
├── ComplaintProvider (Complaint State Context)
└── Routes
    ├── Dashboard (Overview)
    ├── ComplaintList (List View)
    ├── CreateComplaint (Form)
    ├── ComplaintDetail (Detail View)
    └── ComplaintTracking (Public Tracking)
```

---

## Component Hierarchy and Data Flow

### 1. **Context Providers (State Management)**

#### **AuthContext** (`src/context/AuthContext.jsx`)
- **Purpose**: Manages user authentication state
- **Provides**:
  - `user`: Current user object (name, email, role)
  - `isAuthenticated`: Boolean authentication status
  - `login()`, `register()`, `logout()`: Auth functions
- **Used by**: All components that need user info or role checks

#### **ComplaintContext** (`src/context/ComplaintContext.jsx`)
- **Purpose**: Centralized complaint state management
- **Provides**:
  - `complaints`: Array of all complaints
  - `currentComplaint`: Single complaint for detail view
  - `loading`, `error`: UI state
  - `fetchComplaints()`, `fetchComplaint()`, `createComplaint()`, etc.
- **Used by**: All complaint-related pages

**Data Flow**:
```
Component → ComplaintContext → complaintService → API → Backend
                ↓
         Updates Context State
                ↓
         Component Re-renders
```

---

## 2. **Service Layer (API Integration)**

### **complaintService.js** (`src/services/complaintService.js`)
- **Purpose**: Handles all HTTP requests to backend
- **Functions**:
  - `getComplaints(filters)`: GET `/api/complaints?status=X&category=Y`
  - `getComplaint(id)`: GET `/api/complaints/:id`
  - `createComplaint(data)`: POST `/api/complaints`
  - `updateStatus(id, status, notes)`: PUT `/api/complaints/:id/status`
  - `addComment(id, text)`: POST `/api/complaints/:id/comments`
  - `deleteComplaint(id)`: DELETE `/api/complaints/:id`

### **api.js** (`src/services/api.js`)
- **Purpose**: Axios instance with interceptors
- **Features**:
  - Automatically adds `Authorization: Bearer <token>` header
  - Handles 401 errors (redirects to login)
  - Base URL configuration

**Request Flow**:
```
Component → complaintService → api (axios) → Backend API
                                    ↓
                            Adds auth token
                                    ↓
                            Returns response
                                    ↓
                            ComplaintContext updates state
```

---

## 3. **Page Components**

### **A. CreateComplaint** (`src/pages/complaints/CreateComplaint.jsx`)

**Purpose**: Form to submit new complaints

**Component Interaction**:
1. User fills form (title, description, category, location, priority)
2. On submit → calls `createComplaint()` from `ComplaintContext`
3. Context calls `createComplaintApi()` from `complaintService`
4. API POST request to `/api/complaints`
5. On success → navigates to complaint detail page
6. New complaint added to context state

**Role Restriction**: 
- Only accessible to `Citizen` role (via `RoleBasedRoute`)

**State Management**:
```javascript
const [formData, setFormData] = useState({...})  // Local form state
const { createComplaint, loading, error } = useComplaint()  // Context state
```

**Key Features**:
- Form validation (required fields)
- Location coordinates (latitude/longitude)
- Image URL support
- Error handling and display

---

### **B. ComplaintList** (`src/pages/complaints/ComplaintList.jsx`)

**Purpose**: Display list of complaints with filtering

**Component Interaction**:
1. On mount → calls `fetchComplaints(filters)` from context
2. Context calls `getComplaintsApi(filters)` from service
3. API GET request to `/api/complaints?status=X&category=Y`
4. Backend filters by role:
   - **Citizens**: See only their own complaints
   - **Officers/Admins**: See all complaints
5. Response updates `complaints` array in context
6. Component renders complaint cards

**Role-Based UI**:
- **Citizens**: 
  - Page title: "My Complaints"
  - Shows "Create New Complaint" button
  - Only shows their own complaints
- **Officers/Admins**:
  - Page title: "All Complaints"
  - No create button
  - Shows all complaints with submitter info

**State Management**:
```javascript
const [filters, setFilters] = useState({ status, category, priority })
const { complaints, loading, error, fetchComplaints } = useComplaint()
```

**Filtering**:
- Filters trigger `useEffect` → calls `fetchComplaints(filters)`
- Backend handles filtering server-side

---

### **C. ComplaintDetail** (`src/pages/complaints/ComplaintDetail.jsx`)

**Purpose**: View full complaint details, status history, comments

**Component Interaction**:
1. Gets complaint ID from URL params (`useParams()`)
2. On mount → calls `fetchComplaint(id)` from context
3. Context calls `getComplaintApi(id)` from service
4. API GET request to `/api/complaints/:id`
5. Response updates `currentComplaint` in context
6. Component displays all complaint information

**Role-Based Actions**:

| Action | Citizen | Officer | Admin |
|--------|---------|---------|-------|
| View Details | ✅ | ✅ | ✅ |
| Add Comment | ✅ | ✅ | ✅ |
| Update Status | ❌ | ✅ | ✅ |
| Delete Complaint | ❌ | ❌ | ✅ |

**Status Update Flow**:
1. Officer/Admin clicks "Update Status"
2. Form appears with status dropdown
3. On submit → calls `updateStatus(id, status, notes)`
4. Context calls `updateStatusApi()` from service
5. API PUT request to `/api/complaints/:id/status`
6. Backend updates status and adds to `statusHistory`
7. Context updates `currentComplaint` with new status

**Comment Flow**:
1. User types comment and submits
2. Calls `addComment(id, text)` from context
3. Context calls `addCommentApi()` from service
4. API POST request to `/api/complaints/:id/comments`
5. Backend adds comment to complaint
6. Context updates `currentComplaint` with new comment

**State Management**:
```javascript
const { currentComplaint, loading, error, fetchComplaint, addComment, updateStatus } = useComplaint()
const [commentText, setCommentText] = useState('')
const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' })
```

---

### **D. ComplaintTracking** (`src/pages/complaints/ComplaintTracking.jsx`)

**Purpose**: Public complaint tracking (no authentication required)

**Component Interaction**:
1. Gets `complaintId` from URL (e.g., `COMP-20240115-12345`)
2. Calls `getComplaintByComplaintId(complaintId)` directly from service
3. API GET request to `/api/complaints/complaint-id/:complaintId`
4. Displays complaint status and history
5. **No context used** - standalone component for public access

**Route**: `/tracking/:complaintId` (public, no auth required)

---

### **E. Dashboard** (`src/pages/Dashboard.jsx`)

**Purpose**: Overview with statistics and recent complaints

**Component Interaction**:
1. On mount → calls `fetchComplaints()` from context
2. Calculates statistics from complaints array
3. Displays stats cards and recent complaints list

**Role-Based Statistics**:
- **Citizens**: Total, Pending, In Progress, Resolved (their complaints)
- **Officers/Admins**: All complaints + Rejected count

**State Management**:
```javascript
const { complaints, loading, fetchComplaints } = useComplaint()
const stats = {
  total: complaints.length,
  pending: complaints.filter(c => c.status === 'Pending').length,
  // ... other stats
}
```

---

## 4. **Supporting Components**

### **Navbar** (`src/components/Navbar.jsx`)
- **Role-Based Links**:
  - "New Complaint" only shown to Citizens
  - All users see: Dashboard, Complaints, Profile

### **RoleBasedRoute** (`src/components/RoleBasedRoute.jsx`)
- **Purpose**: Protects routes based on user role
- **Usage**: `<RoleBasedRoute allowedRoles={['Citizen']}><CreateComplaint /></RoleBasedRoute>`
- **Flow**:
  1. Checks if user is authenticated
  2. Checks if user role is in `allowedRoles`
  3. Redirects if not authorized

### **PrivateRoute** (`src/components/PrivateRoute.jsx`)
- **Purpose**: Protects routes requiring authentication
- **Usage**: `<PrivateRoute><ComplaintList /></PrivateRoute>`

---

## State Flow Diagram

```
┌─────────────────┐
│   User Action   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Component     │ (e.g., CreateComplaint)
│   - Form State  │
│   - Local UI    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ComplaintContext│ (useComplaint hook)
│   - complaints  │
│   - functions   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ complaintService│ (API functions)
│   - HTTP calls  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   api.js        │ (Axios instance)
│   - Add token   │
│   - Interceptors│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │
│  - Validation   │
│  - Database     │
└────────┬────────┘
         │
         │ Response
         ▼
┌─────────────────┐
│ ComplaintContext│ (Updates state)
│   - Set data    │
│   - Set loading │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Component     │ (Re-renders with new data)
│   - Display UI  │
└─────────────────┘
```

---

## Role-Based Conditional UI Summary

### **Citizen Role**
- ✅ Can create complaints
- ✅ Can view own complaints only
- ✅ Can add comments
- ❌ Cannot update status
- ❌ Cannot delete complaints

**UI Elements**:
- "Create New Complaint" button visible
- "My Complaints" page title
- Dashboard shows personal stats

### **Officer Role**
- ❌ Cannot create complaints
- ✅ Can view all complaints
- ✅ Can add comments/updates
- ✅ Can update complaint status
- ❌ Cannot delete complaints

**UI Elements**:
- No "Create New Complaint" button
- "All Complaints" page title
- "Update Status" button on detail page
- Dashboard shows all complaints stats

### **Admin Role**
- ❌ Cannot create complaints
- ✅ Can view all complaints
- ✅ Can add comments/updates
- ✅ Can update complaint status
- ✅ Can delete complaints

**UI Elements**:
- No "Create New Complaint" button
- "All Complaints" page title
- "Update Status" and "Delete Complaint" buttons
- Dashboard shows all complaints stats + rejected count

---

## API Endpoints Used

| Endpoint | Method | Auth Required | Role Required | Purpose |
|----------|--------|---------------|---------------|---------|
| `/api/complaints` | GET | ✅ | - | Get all complaints (filtered by role) |
| `/api/complaints` | POST | ✅ | Citizen | Create new complaint |
| `/api/complaints/:id` | GET | ✅ | - | Get single complaint |
| `/api/complaints/:id` | PUT | ✅ | - | Update complaint |
| `/api/complaints/:id` | DELETE | ✅ | Admin | Delete complaint |
| `/api/complaints/:id/status` | PUT | ✅ | Officer/Admin | Update status |
| `/api/complaints/:id/comments` | POST | ✅ | - | Add comment |
| `/api/complaints/complaint-id/:complaintId` | GET | ❌ | - | Public tracking |

---

## Error Handling

1. **API Errors**: Caught in `complaintService` → returned to context → displayed in component
2. **Validation Errors**: Handled in component (form validation) and backend
3. **401 Unauthorized**: Auto-handled by `api.js` interceptor → redirects to login
4. **Network Errors**: Displayed via `ErrorMessage` component

---

## Loading States

- **Context Loading**: `loading` state in `ComplaintContext`
- **Component Loading**: Uses `<Loading />` component during API calls
- **Button Loading**: Disabled state with "Creating...", "Updating..." text

---

## Best Practices Implemented

1. **Centralized State**: All complaint state in `ComplaintContext` (no prop drilling)
2. **Separation of Concerns**: Service layer handles API, Context handles state, Components handle UI
3. **Role-Based Security**: Both frontend (UI) and backend (API) enforce role restrictions
4. **Error Handling**: Comprehensive error messages and user feedback
5. **Loading States**: Clear loading indicators during async operations
6. **Type Safety**: Consistent data structures across components

---

## Testing the Flow

### **Citizen Flow**:
1. Login as Citizen
2. Navigate to Dashboard → See personal stats
3. Click "Create New Complaint" → Fill form → Submit
4. Redirected to complaint detail → See new complaint
5. Navigate to "My Complaints" → See only own complaints
6. Add comment on complaint detail page

### **Officer Flow**:
1. Login as Officer
2. Navigate to Dashboard → See all complaints stats
3. Navigate to "All Complaints" → See all complaints
4. Click on complaint → View details
5. Click "Update Status" → Change status → Submit
6. See status history updated

### **Admin Flow**:
1. Login as Admin
2. Same as Officer, plus:
3. Can delete complaints (Delete button visible)
4. See rejected complaints count in dashboard

---

## Summary

The complaint system uses:
- **Context API** for state management (no Redux needed)
- **Service layer** for API integration
- **Role-based routing** and UI conditional rendering
- **Centralized error handling** and loading states
- **Clean separation** between UI, state, and API layers

All components interact through the `ComplaintContext`, which provides a single source of truth for complaint data and operations.
