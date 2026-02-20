# Component to API Mapping Guide

## 📋 Complete Component-API Mapping

This document shows which component uses which API endpoint.

---

## 🔐 Authentication Components

### Login Component
**File:** `pages/auth/Login.jsx`

**API Calls:**
```
POST /api/auth/login
Body: { email, password }
Response: { success, token, data: user }
```

**Flow:**
1. User enters email/password
2. Component calls `AuthContext.login()`
3. AuthContext calls `authService.login()`
4. authService makes `POST /api/auth/login`
5. Token stored in localStorage
6. User data stored in AuthContext
7. Redirect to dashboard

---

### Register Component
**File:** `pages/auth/Register.jsx`

**API Calls:**
```
POST /api/auth/register
Body: { name, email, password, phone }
Response: { success, token, data: user }
```

**Flow:**
1. User fills registration form
2. Component calls `AuthContext.register()`
3. AuthContext calls `authService.register()`
4. authService makes `POST /api/auth/register`
5. Token stored in localStorage
6. User data stored in AuthContext
7. Redirect to dashboard

---

## 📋 Complaint Components

### Dashboard Component
**File:** `pages/Dashboard.jsx`

**API Calls:**
```
GET /api/complaints?submittedBy=userId     (Citizen)
GET /api/complaints?assignedTo=userId      (Officer)
GET /api/complaints                         (Admin - all)
```

**Flow:**
1. Component loads
2. Gets user from AuthContext
3. Determines filters based on role
4. Calls `ComplaintContext.fetchComplaints(filters)`
5. ComplaintContext calls `complaintService.getComplaints()`
6. complaintService makes `GET /api/complaints` with filters
7. Complaints displayed in dashboard

**Role-Based Behavior:**
- **Citizen:** Shows own complaints only
- **Officer:** Shows assigned complaints only
- **Admin:** Shows all complaints

---

### ComplaintList Component
**File:** `pages/complaints/ComplaintList.jsx`

**API Calls:**
```
GET /api/complaints?status=Pending&category=Road&page=1&limit=10
```

**Flow:**
1. Component loads
2. User can apply filters (status, category, priority)
3. Calls `ComplaintContext.fetchComplaints(filters)`
4. ComplaintContext calls `complaintService.getComplaints(filters)`
5. complaintService makes `GET /api/complaints` with query params
6. Complaints displayed in list

**Filters:**
- Status (Pending, In Progress, Resolved, Rejected)
- Category (Road, Water, Electricity, Sanitation, Other)
- Priority (Low, Medium, High, Urgent)
- Pagination (page, limit)

---

### ComplaintDetail Component
**File:** `pages/complaints/ComplaintDetail.jsx`

**API Calls:**
```
GET /api/complaints/:id                    (Load complaint)
POST /api/complaints/:id/comments          (Add comment)
PUT /api/complaints/:id/status             (Update status - Officer/Admin)
```

**Flow - Load Complaint:**
1. Component loads with complaint ID from URL
2. Calls `complaintService.getComplaint(id)`
3. Makes `GET /api/complaints/:id`
4. Complaint data displayed

**Flow - Add Comment:**
1. User enters comment text
2. Calls `complaintService.addComment(id, text)`
3. Makes `POST /api/complaints/:id/comments`
4. Complaint reloaded with new comment

**Flow - Update Status:**
1. Officer/Admin selects new status
2. Calls `complaintService.updateStatus(id, status, notes)`
3. Makes `PUT /api/complaints/:id/status`
4. Complaint reloaded with updated status

**Authorization:**
- **Citizen:** Can view and add comments
- **Officer:** Can view, add comments, update status (if assigned)
- **Admin:** Can view, add comments, update status, assign officer

---

### CreateComplaint Component
**File:** `pages/complaints/CreateComplaint.jsx`

**API Calls:**
```
POST /api/complaints
Body: {
  title,
  description,
  category,
  location: { address, coordinates: { latitude, longitude } },
  priority,
  imageUrl
}
Response: { success, data: complaint }
```

**Flow:**
1. User fills complaint form
2. Gets location coordinates (browser geolocation)
3. Calls `ComplaintContext.createComplaint(data)`
4. ComplaintContext calls `complaintService.createComplaint(data)`
5. complaintService makes `POST /api/complaints`
6. User ID automatically added from auth token
7. Redirects to complaint detail page

**Authorization:**
- **Citizen only** - Route protected by `authorize('Citizen')`

---

### ComplaintTracking Component
**File:** `pages/complaints/ComplaintTracking.jsx`

**API Calls:**
```
GET /api/complaints/complaint-id/:complaintId
```

**Flow:**
1. Public route (no authentication required)
2. User enters complaint ID (e.g., COMP-20260125-12345)
3. Calls `complaintService.getComplaintByComplaintId(complaintId)`
4. Makes `GET /api/complaints/complaint-id/:complaintId`
5. Complaint details displayed

**Note:** This is a public route for tracking complaints without login.

---

## 👤 Profile Component

**File:** `pages/Profile.jsx`

**API Calls:**
```
GET /api/auth/me                           (Get user profile)
PUT /api/auth/updatepassword              (Update password)
```

**Flow - Load Profile:**
1. Component loads
2. Calls `authService.getCurrentUser()`
3. Makes `GET /api/auth/me`
4. User data displayed

**Flow - Update Password:**
1. User enters current and new password
2. Calls `authService.updatePassword({ currentPassword, newPassword })`
3. Makes `PUT /api/auth/updatepassword`
4. Success message displayed

---

## 🔄 Context API Integration

### AuthContext
**File:** `context/AuthContext.jsx`

**API Calls:**
```
POST /api/auth/login                       (via authService.login)
POST /api/auth/register                    (via authService.register)
GET /api/auth/me                           (via authService.getCurrentUser)
```

**State Managed:**
- `user` - Current user object
- `loading` - Loading state
- `isAuthenticated` - Boolean flag

**Functions:**
- `login()` - Calls `POST /api/auth/login`
- `register()` - Calls `POST /api/auth/register`
- `checkAuth()` - Calls `GET /api/auth/me`
- `logout()` - Clears localStorage

---

### ComplaintContext
**File:** `context/ComplaintContext.jsx`

**API Calls:**
```
GET /api/complaints                        (via complaintService.getComplaints)
GET /api/complaints/:id                    (via complaintService.getComplaint)
POST /api/complaints                       (via complaintService.createComplaint)
PUT /api/complaints/:id                    (via complaintService.updateComplaint)
DELETE /api/complaints/:id                 (via complaintService.deleteComplaint)
POST /api/complaints/:id/comments          (via complaintService.addComment)
PUT /api/complaints/:id/status              (via complaintService.updateStatus)
```

**State Managed:**
- `complaints` - List of complaints
- `currentComplaint` - Single complaint
- `loading` - Loading state
- `error` - Error state

**Functions:**
- `fetchComplaints(filters)` - Calls `GET /api/complaints`
- `fetchComplaint(id)` - Calls `GET /api/complaints/:id`
- `createComplaint(data)` - Calls `POST /api/complaints`
- `updateComplaint(id, data)` - Calls `PUT /api/complaints/:id`
- `deleteComplaint(id)` - Calls `DELETE /api/complaints/:id`
- `addComment(id, text)` - Calls `POST /api/complaints/:id/comments`
- `updateStatus(id, status, notes)` - Calls `PUT /api/complaints/:id/status`

---

## 🛡️ Protected Routes

### PrivateRoute Component
**File:** `components/PrivateRoute.jsx`

**API Calls:**
```
None (uses AuthContext to check authentication)
```

**Flow:**
1. Checks `AuthContext.isAuthenticated`
2. If not authenticated, redirects to `/login`
3. If authenticated, renders child component

---

## 📊 Complete API Mapping Table

| Component | API Endpoint | Method | Purpose | Auth Required |
|-----------|--------------|--------|---------|---------------|
| **Login** | `/api/auth/login` | POST | User login | No |
| **Register** | `/api/auth/register` | POST | User registration | No |
| **Dashboard** | `/api/complaints` | GET | Get complaints | Yes |
| **ComplaintList** | `/api/complaints` | GET | List complaints | Yes |
| **ComplaintDetail** | `/api/complaints/:id` | GET | Get complaint | Yes |
| **ComplaintDetail** | `/api/complaints/:id/comments` | POST | Add comment | Yes |
| **ComplaintDetail** | `/api/complaints/:id/status` | PUT | Update status | Yes (Officer/Admin) |
| **CreateComplaint** | `/api/complaints` | POST | Create complaint | Yes (Citizen) |
| **ComplaintTracking** | `/api/complaints/complaint-id/:id` | GET | Track complaint | No |
| **Profile** | `/api/auth/me` | GET | Get profile | Yes |
| **Profile** | `/api/auth/updatepassword` | PUT | Update password | Yes |
| **AuthContext** | `/api/auth/login` | POST | Login | No |
| **AuthContext** | `/api/auth/register` | POST | Register | No |
| **AuthContext** | `/api/auth/me` | GET | Check auth | Yes |

---

## 🔄 Request Flow Example

### User Creates Complaint

```
1. User fills form in CreateComplaint.jsx
   ↓
2. Form submit → ComplaintContext.createComplaint(data)
   ↓
3. ComplaintContext → complaintService.createComplaint(data)
   ↓
4. complaintService → api.post('/complaints', data)
   ↓
5. api.js interceptor adds Authorization header
   ↓
6. POST /api/complaints (with token)
   ↓
7. Backend validates token, creates complaint
   ↓
8. Response: { success: true, data: complaint }
   ↓
9. ComplaintContext updates state
   ↓
10. CreateComplaint redirects to /complaints/:id
```

---

## 🎯 Role-Based API Access

### Citizen
- ✅ `POST /api/complaints` - Create complaint
- ✅ `GET /api/complaints?submittedBy=userId` - View own complaints
- ✅ `GET /api/complaints/:id` - View complaint details
- ✅ `POST /api/complaints/:id/comments` - Add comments
- ❌ `PUT /api/complaints/:id/status` - Cannot update status

### Officer
- ❌ `POST /api/complaints` - Cannot create complaint
- ✅ `GET /api/complaints?assignedTo=userId` - View assigned complaints
- ✅ `GET /api/complaints/:id` - View complaint details
- ✅ `POST /api/complaints/:id/comments` - Add comments
- ✅ `PUT /api/complaints/:id/status` - Update status (assigned only)

### Admin
- ❌ `POST /api/complaints` - Cannot create complaint
- ✅ `GET /api/complaints` - View all complaints
- ✅ `GET /api/complaints/:id` - View complaint details
- ✅ `POST /api/complaints/:id/comments` - Add comments
- ✅ `PUT /api/complaints/:id/status` - Update any status
- ✅ `PUT /api/complaints/:id/assign` - Assign officer
- ✅ `DELETE /api/complaints/:id` - Delete complaint

---

## ✅ Summary

**Component-API Mapping:**
- Each component uses specific API endpoints
- Service layer abstracts API calls
- Context API manages state
- Axios handles HTTP requests
- Token automatically added to requests

**Key Points:**
- Components don't directly call APIs
- Service layer handles all API calls
- Context API manages global state
- Role-based access enforced in backend
- Frontend shows/hides UI based on role

This mapping ensures clear separation of concerns and maintainable code! 🚀
