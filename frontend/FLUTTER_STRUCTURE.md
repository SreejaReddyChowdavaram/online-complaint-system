# JAN SUVIDHA - Flutter Frontend Structure

## 📋 Table of Contents
1. [Folder Structure](#folder-structure)
2. [Screen Templates](#screen-templates)
3. [Service Classes](#service-classes)
4. [Provider State Management](#provider-state-management)
5. [API Integration Map](#api-integration-map)
6. [Widgets](#widgets)

---

## 📁 Folder Structure

```
frontend/lib/
├── config/                    # App configuration
│   ├── app_config.dart        # API URLs, constants
│   └── app_theme.dart         # Theme configuration
│
├── models/                    # Data models
│   ├── user_model.dart        # User data model
│   ├── complaint_model.dart   # Complaint data model
│   └── notification_model.dart # Notification data model
│
├── providers/                 # State management (Provider)
│   ├── auth_provider.dart     # Authentication state
│   ├── complaint_provider.dart # Complaint state
│   └── notification_provider.dart # Notification state
│
├── routes/                    # Navigation routes
│   └── app_router.dart        # Route definitions
│
├── screens/                   # UI Screens
│   ├── auth/
│   │   ├── login_screen.dart          # Login screen
│   │   └── register_screen.dart       # Registration screen
│   │
│   ├── complaints/
│   │   ├── complaint_list_screen.dart      # Citizen dashboard (complaint list)
│   │   ├── complaint_detail_screen.dart    # Complaint details
│   │   ├── complaint_tracking_screen.dart # Status tracking
│   │   └── create_complaint_screen.dart   # Complaint submission form
│   │
│   ├── home/
│   │   └── home_screen.dart   # Main home screen with bottom nav
│   │
│   ├── profile/
│   │   └── profile_screen.dart # User profile
│   │
│   └── splash_screen.dart     # Splash/loading screen
│
├── services/                  # API service classes
│   ├── api_service.dart       # Base API service (HTTP client)
│   ├── auth_service.dart      # Authentication API calls
│   ├── complaint_service.dart # Complaint API calls
│   └── notification_service.dart # Notification API calls
│
├── utils/                     # Utility functions
│   └── constants.dart         # App constants
│
├── widgets/                   # Reusable widgets
│   ├── complaint_card.dart    # Complaint card widget
│   ├── custom_button.dart     # Custom button widget
│   └── custom_text_field.dart # Custom text field widget
│
└── main.dart                  # App entry point
```

---

## 🖥️ Screen Templates

### 1. Login Screen (`screens/auth/login_screen.dart`)

**Purpose:** User authentication

**Features:**
- Email and password input
- Form validation
- Loading state
- Error handling
- Navigation to register screen

**API Calls:**
- `POST /api/auth/login` - Via `AuthProvider.login()`

---

### 2. Register Screen (`screens/auth/register_screen.dart`)

**Purpose:** New user registration

**Features:**
- Name, email, password, phone input
- Form validation
- Loading state
- Error handling
- Navigation to login screen

**API Calls:**
- `POST /api/auth/register` - Via `AuthProvider.register()`

---

### 3. Citizen Dashboard (`screens/complaints/complaint_list_screen.dart`)

**Purpose:** Display user's complaints

**Features:**
- List of user's complaints
- Filter by status
- Pull to refresh
- Navigation to complaint details
- FAB to create new complaint

**API Calls:**
- `GET /api/complaints?submittedBy={userId}` - Via `ComplaintProvider.loadComplaints()`

---

### 4. Complaint Submission Form (`screens/complaints/create_complaint_screen.dart`)

**Purpose:** Submit new complaint

**Features:**
- Title, description, category, location inputs
- Priority selection
- Image upload (optional)
- GPS location picker
- Form validation
- Loading state

**API Calls:**
- `POST /api/complaints` - Via `ComplaintProvider.createComplaint()`

---

### 5. Complaint Status Tracking (`screens/complaints/complaint_tracking_screen.dart`)

**Purpose:** Track complaint status and history

**Features:**
- Complaint details display
- Status history timeline
- Comments section
- Pull to refresh
- Status color coding

**API Calls:**
- `GET /api/complaints/:id` - Via `ComplaintProvider.getComplaint()`
- `GET /api/complaints/complaint-id/:complaintId` - Public tracking

---

## 🔧 Service Classes

### 1. ApiService (`services/api_service.dart`)

**Purpose:** Base HTTP client for all API calls

**Methods:**
- `get()` - GET requests
- `post()` - POST requests
- `put()` - PUT requests
- `delete()` - DELETE requests

**Features:**
- Automatic token injection
- Error handling
- Response parsing

---

### 2. AuthService (`services/auth_service.dart`)

**Purpose:** Authentication API calls

**Methods:**
- `register()` - Register new user
- `login()` - Login user
- `getCurrentUser()` - Get current user
- `updatePassword()` - Update password
- `logout()` - Logout user
- `isLoggedIn()` - Check login status

**API Endpoints:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/updatepassword`

---

### 3. ComplaintService (`services/complaint_service.dart`)

**Purpose:** Complaint API calls

**Methods:**
- `getComplaints()` - Get all complaints
- `getComplaint()` - Get single complaint
- `createComplaint()` - Create complaint
- `updateComplaint()` - Update complaint
- `deleteComplaint()` - Delete complaint
- `addComment()` - Add comment

**API Endpoints:**
- `GET /api/complaints`
- `GET /api/complaints/:id`
- `GET /api/complaints/complaint-id/:complaintId`
- `POST /api/complaints`
- `PUT /api/complaints/:id`
- `DELETE /api/complaints/:id`
- `POST /api/complaints/:id/comments`

---

### 4. NotificationService (`services/notification_service.dart`)

**Purpose:** Notification API calls

**Methods:**
- `getNotifications()` - Get notifications
- `getUnreadCount()` - Get unread count
- `markAsRead()` - Mark as read
- `markAllAsRead()` - Mark all as read
- `deleteNotification()` - Delete notification
- `registerDevice()` - Register device for push

**API Endpoints:**
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/read-all`
- `DELETE /api/notifications/:id`
- `POST /api/notifications/register-device`

---

## 📊 Provider State Management

### 1. AuthProvider (`providers/auth_provider.dart`)

**State:**
- `user` - Current user
- `isLoading` - Loading state
- `error` - Error message
- `isAuthenticated` - Auth status

**Methods:**
- `initialize()` - Check if logged in
- `register()` - Register user
- `login()` - Login user
- `logout()` - Logout user
- `updatePassword()` - Update password

---

### 2. ComplaintProvider (`providers/complaint_provider.dart`)

**State:**
- `complaints` - List of complaints
- `isLoading` - Loading state
- `error` - Error message

**Methods:**
- `loadComplaints()` - Load complaints
- `getComplaint()` - Get single complaint
- `createComplaint()` - Create complaint
- `updateComplaint()` - Update complaint
- `deleteComplaint()` - Delete complaint
- `addComment()` - Add comment

---

### 3. NotificationProvider (`providers/notification_provider.dart`)

**State:**
- `notifications` - List of notifications
- `unreadCount` - Unread count
- `isLoading` - Loading state
- `error` - Error message

**Methods:**
- `loadNotifications()` - Load notifications
- `loadUnreadCount()` - Load unread count
- `markAsRead()` - Mark as read
- `markAllAsRead()` - Mark all as read
- `deleteNotification()` - Delete notification

---

## 🔗 API Integration Map

### Screen → API Mapping

#### 1. Login Screen
**Screen:** `screens/auth/login_screen.dart`

**User Action:** Enter email/password and tap "Login"

**Flow:**
```
LoginScreen
  ↓
AuthProvider.login()
  ↓
AuthService.login()
  ↓
ApiService.post('/api/auth/login')
  ↓
Backend: POST /api/auth/login
```

**API Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "data": { "user": {...} }
}
```

---

#### 2. Register Screen
**Screen:** `screens/auth/register_screen.dart`

**User Action:** Fill form and tap "Register"

**Flow:**
```
RegisterScreen
  ↓
AuthProvider.register()
  ↓
AuthService.register()
  ↓
ApiService.post('/api/auth/register')
  ↓
Backend: POST /api/auth/register
```

**API Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

---

#### 3. Citizen Dashboard (Complaint List)
**Screen:** `screens/complaints/complaint_list_screen.dart`

**User Action:** Screen loads or pull to refresh

**Flow:**
```
ComplaintListScreen (initState)
  ↓
ComplaintProvider.loadComplaints()
  ↓
ComplaintService.getComplaints(submittedBy: userId)
  ↓
ApiService.get('/api/complaints?submittedBy={userId}')
  ↓
Backend: GET /api/complaints?submittedBy={userId}
```

**API Endpoint:** `GET /api/complaints?submittedBy={userId}`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [ {...complaints...} ]
}
```

---

#### 4. Complaint Submission Form
**Screen:** `screens/complaints/create_complaint_screen.dart`

**User Action:** Fill form and tap "Submit Complaint"

**Flow:**
```
CreateComplaintScreen
  ↓
ComplaintProvider.createComplaint()
  ↓
ComplaintService.createComplaint()
  ↓
ApiService.post('/api/complaints')
  ↓
Backend: POST /api/complaints
```

**API Endpoint:** `POST /api/complaints`

**Request:**
```json
{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "Road",
  "location": {
    "address": "123 Main Street",
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
    ...
  }
}
```

---

#### 5. Complaint Status Tracking
**Screen:** `screens/complaints/complaint_tracking_screen.dart`

**User Action:** Screen loads or pull to refresh

**Flow:**
```
ComplaintTrackingScreen (initState)
  ↓
ComplaintProvider.getComplaint(complaintId)
  ↓
ComplaintService.getComplaint(complaintId)
  ↓
ApiService.get('/api/complaints/:id')
  ↓
Backend: GET /api/complaints/:id
```

**API Endpoint:** `GET /api/complaints/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "complaintId": "COMP-20240115-12345",
    "status": "In Progress",
    "statusHistory": [...],
    "comments": [...],
    ...
  }
}
```

**Alternative (Public Tracking):**
```
ApiService.get('/api/complaints/complaint-id/:complaintId')
  ↓
Backend: GET /api/complaints/complaint-id/:complaintId
```

---

## 📱 Complete API Call Flow

### Example: Creating a Complaint

```
1. User fills form in CreateComplaintScreen
   ↓
2. User taps "Submit Complaint"
   ↓
3. CreateComplaintScreen._submitComplaint()
   ↓
4. ComplaintProvider.createComplaint()
   - Sets isLoading = true
   - Notifies listeners
   ↓
5. ComplaintService.createComplaint()
   - Prepares request data
   ↓
6. ApiService.post('/api/complaints', data)
   - Adds Authorization header (Bearer token)
   - Sends POST request
   ↓
7. Backend receives request
   - Validates data
   - Creates complaint
   - Generates complaint ID
   - Auto-assigns department
   - Sends notifications
   ↓
8. Backend sends response
   {
     "success": true,
     "data": { complaint }
   }
   ↓
9. ApiService handles response
   - Parses JSON
   - Returns data
   ↓
10. ComplaintService returns Complaint object
    ↓
11. ComplaintProvider updates state
    - Sets complaints list
    - Sets isLoading = false
    - Notifies listeners
    ↓
12. UI updates
    - Shows success message
    - Navigates back
    - Refreshes complaint list
```

---

## 🎨 Widgets

### 1. CustomTextField (`widgets/custom_text_field.dart`)

**Purpose:** Reusable text input field

**Features:**
- Label and hint text
- Prefix/suffix icons
- Validation
- Error display

---

### 2. CustomButton (`widgets/custom_button.dart`)

**Purpose:** Reusable button widget

**Features:**
- Loading state
- Disabled state
- Custom styling

---

### 3. ComplaintCard (`widgets/complaint_card.dart`)

**Purpose:** Display complaint in list

**Features:**
- Title, description, status
- Category badge
- Priority indicator
- Tap to navigate to details

---

## 🔄 State Management Flow

### Provider Pattern

```
Screen Widget
  ↓
Consumer<Provider> or Provider.of<Provider>()
  ↓
Provider (ChangeNotifier)
  ↓
Service Class
  ↓
ApiService
  ↓
Backend API
```

**Example:**
```dart
// In Screen
Consumer<ComplaintProvider>(
  builder: (context, provider, _) {
    return ListView.builder(
      itemCount: provider.complaints.length,
      itemBuilder: (context, index) {
        return ComplaintCard(
          complaint: provider.complaints[index],
        );
      },
    );
  },
)

// Provider updates state
provider.loadComplaints();
// → Notifies listeners
// → UI rebuilds automatically
```

---

## 📊 Screen → API Summary Table

| Screen | User Action | Provider Method | Service Method | API Endpoint |
|--------|-------------|-----------------|----------------|--------------|
| **Login** | Tap Login | `AuthProvider.login()` | `AuthService.login()` | `POST /api/auth/login` |
| **Register** | Tap Register | `AuthProvider.register()` | `AuthService.register()` | `POST /api/auth/register` |
| **Dashboard** | Screen loads | `ComplaintProvider.loadComplaints()` | `ComplaintService.getComplaints()` | `GET /api/complaints?submittedBy={id}` |
| **Create Complaint** | Tap Submit | `ComplaintProvider.createComplaint()` | `ComplaintService.createComplaint()` | `POST /api/complaints` |
| **Track Complaint** | Screen loads | `ComplaintProvider.getComplaint()` | `ComplaintService.getComplaint()` | `GET /api/complaints/:id` |
| **Profile** | Screen loads | `AuthProvider.initialize()` | `AuthService.getCurrentUser()` | `GET /api/auth/me` |

---

## ✅ Summary

**Flutter Frontend Structure:**
- ✅ Clean folder structure
- ✅ Screen templates for all required screens
- ✅ Service classes for API integration
- ✅ Provider state management
- ✅ Reusable widgets
- ✅ Complete API integration map

**All screens are API-ready and follow Provider pattern!** 🎉

---

**For detailed API documentation, see backend `API_ROUTES.md`**
