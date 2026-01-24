# JAN SUVIDHA - Flutter API Integration Map

## 📋 Quick Reference: Screen → API Mapping

This document explains which screen calls which API endpoint.

---

## 🔐 Authentication Screens

### 1. Login Screen
**File:** `screens/auth/login_screen.dart`

**User Action:** Enter email/password → Tap "Login"

**Flow:**
```
LoginScreen
  → AuthProvider.login()
  → AuthService.login()
  → ApiService.post('/api/auth/login')
  → Backend: POST /api/auth/login
```

**API:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**On Success:** Navigates to Home Screen

---

### 2. Register Screen
**File:** `screens/auth/register_screen.dart`

**User Action:** Fill form → Tap "Register"

**Flow:**
```
RegisterScreen
  → AuthProvider.register()
  → AuthService.register()
  → ApiService.post('/api/auth/register')
  → Backend: POST /api/auth/register
```

**API:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

**On Success:** Navigates to Home Screen

---

## 📝 Complaint Screens

### 3. Citizen Dashboard (Complaint List)
**File:** `screens/complaints/complaint_list_screen.dart`

**User Action:** Screen loads or pull to refresh

**Flow:**
```
ComplaintListScreen (initState)
  → ComplaintProvider.loadComplaints()
  → ComplaintService.getComplaints(submittedBy: userId)
  → ApiService.get('/api/complaints?submittedBy={userId}')
  → Backend: GET /api/complaints?submittedBy={userId}
```

**API:** `GET /api/complaints?submittedBy={userId}`

**Query Parameters:**
- `submittedBy` - Current user ID
- `status` - Optional filter (Pending, In Progress, Resolved, Rejected)
- `category` - Optional filter (Road, Water, Electricity, etc.)
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [ {...complaints...} ]
}
```

**Displays:** List of user's complaints with status, category, priority

---

### 4. Complaint Submission Form
**File:** `screens/complaints/create_complaint_screen.dart`

**User Action:** Fill form → Tap "Submit Complaint"

**Flow:**
```
CreateComplaintScreen
  → ComplaintProvider.createComplaint()
  → ComplaintService.createComplaint()
  → ApiService.post('/api/complaints')
  → Backend: POST /api/complaints
```

**API:** `POST /api/complaints`

**Request Body:**
```json
{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "Road",
  "location": {
    "address": "123 Main Street, City, State",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "imageUrl": "https://example.com/image.jpg",
  "priority": "High"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "complaintId": "COMP-20240115-12345",
    "status": "Pending",
    "department": "Public Works",
    "assignedTo": {...},
    ...
  }
}
```

**On Success:** 
- Shows success message
- Navigates back to complaint list
- Refreshes complaint list

---

### 5. Complaint Status Tracking
**File:** `screens/complaints/complaint_tracking_screen.dart`

**User Action:** Screen loads or pull to refresh

**Flow:**
```
ComplaintTrackingScreen (initState)
  → ComplaintProvider.getComplaint(complaintId)
  → ComplaintService.getComplaint(complaintId)
  → ApiService.get('/api/complaints/:id')
  → Backend: GET /api/complaints/:id
```

**API:** `GET /api/complaints/:id`

**Alternative (Public Tracking by Complaint ID):**
```
ApiService.get('/api/complaints/complaint-id/:complaintId')
  → Backend: GET /api/complaints/complaint-id/:complaintId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "complaintId": "COMP-20240115-12345",
    "title": "Pothole on Main Street",
    "status": "In Progress",
    "statusHistory": [
      {
        "status": "Pending",
        "changedBy": {...},
        "changedAt": "2024-01-15T10:30:00Z",
        "notes": "Complaint submitted"
      },
      {
        "status": "In Progress",
        "changedBy": {...},
        "changedAt": "2024-01-15T11:00:00Z",
        "notes": "Work started"
      }
    ],
    "comments": [...],
    ...
  }
}
```

**Displays:**
- Complaint ID
- Current status with color coding
- Status history timeline
- Comments section
- Location details

---

## 👤 Profile Screen

### 6. Profile Screen
**File:** `screens/profile/profile_screen.dart`

**User Action:** Screen loads

**Flow:**
```
ProfileScreen (initState)
  → AuthProvider.initialize()
  → AuthService.getCurrentUser()
  → ApiService.get('/api/auth/me')
  → Backend: GET /api/auth/me
```

**API:** `GET /api/auth/me`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Citizen",
    ...
  }
}
```

**Displays:** User profile information

---

## 📊 Complete API Call Summary

| Screen | Provider Method | Service Method | API Endpoint | Method |
|--------|----------------|----------------|--------------|--------|
| **Login** | `AuthProvider.login()` | `AuthService.login()` | `/api/auth/login` | POST |
| **Register** | `AuthProvider.register()` | `AuthService.register()` | `/api/auth/register` | POST |
| **Dashboard** | `ComplaintProvider.loadComplaints()` | `ComplaintService.getComplaints()` | `/api/complaints?submittedBy={id}` | GET |
| **Create Complaint** | `ComplaintProvider.createComplaint()` | `ComplaintService.createComplaint()` | `/api/complaints` | POST |
| **Track Complaint** | `ComplaintProvider.getComplaint()` | `ComplaintService.getComplaint()` | `/api/complaints/:id` | GET |
| **Profile** | `AuthProvider.initialize()` | `AuthService.getCurrentUser()` | `/api/auth/me` | GET |

---

## 🔄 Data Flow Example

### Creating a Complaint

```
1. User opens CreateComplaintScreen
   ↓
2. User fills form:
   - Title: "Pothole on Main Street"
   - Description: "Large pothole..."
   - Category: "Road"
   - Location: Address + GPS coordinates
   - Priority: "High"
   ↓
3. User taps "Submit Complaint"
   ↓
4. CreateComplaintScreen._submitComplaint()
   - Validates form
   ↓
5. ComplaintProvider.createComplaint()
   - Sets isLoading = true
   - Notifies listeners (UI shows loading)
   ↓
6. ComplaintService.createComplaint()
   - Prepares request data:
     {
       "title": "...",
       "description": "...",
       "category": "Road",
       "location": {
         "address": "...",
         "coordinates": { lat, lng }
       },
       "priority": "High"
     }
   ↓
7. ApiService.post('/api/complaints', data)
   - Gets token from SharedPreferences
   - Adds Authorization header: "Bearer {token}"
   - Sends POST request
   ↓
8. Backend processes:
   - Validates data
   - Creates complaint
   - Generates complaint ID: COMP-20240115-12345
   - Auto-assigns department: Public Works
   - Auto-assigns officer (if available)
   - Sends notifications
   ↓
9. Backend responds:
   {
     "success": true,
     "data": {
       "complaintId": "COMP-20240115-12345",
       "status": "Pending",
       ...
     }
   }
   ↓
10. ApiService handles response
    - Parses JSON
    - Returns data
    ↓
11. ComplaintService.createComplaint()
    - Converts JSON to Complaint model
    - Returns Complaint object
    ↓
12. ComplaintProvider.createComplaint()
    - Adds complaint to list
    - Sets isLoading = false
    - Notifies listeners
    ↓
13. UI updates:
    - Loading indicator disappears
    - Success message shown
    - Navigates back
    - Complaint list refreshes
```

---

## 🎯 Key Points

1. **All API calls go through Service classes**
   - Services handle API-specific logic
   - Providers handle state management
   - Screens handle UI

2. **Authentication token is automatically added**
   - ApiService gets token from SharedPreferences
   - Adds to Authorization header
   - No need to manually add in each call

3. **Error handling is consistent**
   - Services throw exceptions
   - Providers catch and set error state
   - Screens display error messages

4. **State management with Provider**
   - Providers notify listeners on state change
   - UI automatically rebuilds
   - No manual setState needed

---

## 📱 Screen Navigation Flow

```
Splash Screen
  ↓ (check auth)
Login Screen ← → Register Screen
  ↓ (on success)
Home Screen (Bottom Nav)
  ├─ Complaint List (Dashboard)
  │   ├─ Complaint Detail
  │   └─ Complaint Tracking
  ├─ Create Complaint
  └─ Profile
```

---

**All screens are API-integrated and ready to use!** 🎉
