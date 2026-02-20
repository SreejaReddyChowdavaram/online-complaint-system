# Backend Folder Structure - Visual Guide

## 📂 Complete Folder Tree

```
backend/
│
├── 📄 server.js                    # Entry point - starts the server
├── 📄 app.js                       # Express app configuration
├── 📄 package.json                 # Dependencies and scripts
├── 📄 .env                         # Environment variables (not in git)
├── 📄 .gitignore                   # Files to ignore in git
│
├── 📁 config/
│   └── database.js                 # MongoDB connection setup
│
├── 📁 models/                      # Database schemas (Mongoose)
│   ├── User.js                     # User model (Citizen/Officer/Admin)
│   ├── Complaint.js                # Complaint model with lifecycle
│   └── Notification.js             # Notification model
│
├── 📁 controllers/                 # Request handlers (MVC - Controller)
│   ├── authController.js           # Login, register, password
│   ├── userController.js           # User profile management
│   ├── complaintController.js     # Complaint CRUD operations
│   └── notificationController.js   # Notification handling
│
├── 📁 routes/                      # API endpoints (URL paths)
│   ├── authRoutes.js               # /api/auth/*
│   ├── userRoutes.js               # /api/users/*
│   ├── complaintRoutes.js          # /api/complaints/*
│   └── notificationRoutes.js       # /api/notifications/*
│
├── 📁 middleware/                  # Security & validation guards
│   ├── auth.js                     # JWT authentication & authorization
│   ├── errorHandler.js             # Global error handler
│   └── notFound.js                 # 404 handler
│
├── 📁 services/                    # Business logic layer
│   ├── authService.js              # Authentication logic
│   ├── userService.js              # User operations
│   ├── complaintService.js         # Complaint operations
│   └── notificationService.js      # Notification operations
│
├── 📁 validators/                  # Input validation
│   ├── authValidator.js            # Auth input validation
│   └── complaintValidator.js       # Complaint input validation
│
├── 📁 utils/                       # Helper functions
│   └── helpers.js                  # Utility functions
│
└── 📁 Documentation/
    ├── ARCHITECTURE_SIMPLE_GUIDE.md
    ├── BACKEND_ARCHITECTURE.md
    └── ... (other docs)
```

---

## 🔍 What Each Folder Does

### 📄 Root Files

**`server.js`**
- Entry point of the application
- Connects to database
- Starts listening on port 5000

**`app.js`**
- Configures Express application
- Sets up middleware (CORS, security, body parser)
- Connects all route files
- Handles errors

---

### 📁 config/
**Purpose:** Configuration files

**`database.js`**
- Connects to MongoDB
- Uses connection string from .env file
- Handles connection errors

---

### 📁 models/
**Purpose:** Define database structure (Mongoose schemas)

**`User.js`**
- User schema with name, email, password, role
- Password hashing (pre-save hook)
- Password comparison method

**`Complaint.js`**
- Complaint schema with all fields
- Auto-generates complaint ID
- Tracks status history
- Indexes for performance

**`Notification.js`**
- Notification schema
- Links to users and complaints

---

### 📁 controllers/
**Purpose:** Handle HTTP requests and responses

**`authController.js`**
- `register()` - Create new user
- `login()` - Authenticate user
- `getMe()` - Get current user
- `updatePassword()` - Change password

**`complaintController.js`**
- `getAllComplaints()` - List complaints
- `getComplaint()` - Get single complaint
- `createComplaint()` - Create new complaint
- `updateComplaint()` - Update complaint
- `deleteComplaint()` - Delete complaint
- `updateStatus()` - Change complaint status
- `assignOfficer()` - Assign officer to complaint
- `addComment()` - Add comment to complaint

**`userController.js`**
- User profile operations

**`notificationController.js`**
- Notification operations

---

### 📁 routes/
**Purpose:** Define API endpoints and connect to controllers

**`authRoutes.js`**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/updatepassword
```

**`complaintRoutes.js`**
```
GET    /api/complaints
GET    /api/complaints/:id
GET    /api/complaints/complaint-id/:complaintId
POST   /api/complaints
PUT    /api/complaints/:id
DELETE /api/complaints/:id
POST   /api/complaints/:id/comments
PUT    /api/complaints/:id/status
PUT    /api/complaints/:id/assign
```

**`userRoutes.js`**
- User profile routes

**`notificationRoutes.js`**
- Notification routes

---

### 📁 middleware/
**Purpose:** Functions that run before controllers

**`auth.js`**
- `protect` - Verifies JWT token
- `authorize(...roles)` - Checks user role

**`errorHandler.js`**
- Catches all errors
- Returns formatted error responses
- Logs errors for debugging

**`notFound.js`**
- Handles 404 errors (route not found)

---

### 📁 services/
**Purpose:** Business logic (separated from controllers)

**`authService.js`**
- Generates JWT tokens
- Handles registration logic
- Handles login logic
- Password management

**`complaintService.js`**
- Complaint creation logic
- Complaint querying logic
- Status update logic
- Officer assignment logic

**`userService.js`**
- User CRUD operations
- User queries

**`notificationService.js`**
- Notification creation
- Notification queries

---

### 📁 validators/
**Purpose:** Validate input data before processing

**`authValidator.js`**
- Validates registration data
- Validates login data
- Validates password update

**`complaintValidator.js`**
- Validates complaint creation
- Validates comment data
- Validates status update

---

### 📁 utils/
**Purpose:** Reusable helper functions

**`helpers.js`**
- Common utility functions
- Date formatting
- String manipulation
- etc.

---

## 🔄 Data Flow

```
Request
  ↓
Routes (routes/)
  ↓
Middleware (middleware/) - Auth check, validation
  ↓
Controllers (controllers/) - Handle request
  ↓
Services (services/) - Business logic
  ↓
Models (models/) - Database operations
  ↓
Response
```

---

## 🎯 MVC Pattern Breakdown

**Model (models/)**
- Defines data structure
- Database schemas
- Data validation rules

**View (Response)**
- JSON responses sent to client
- Formatted in controllers

**Controller (controllers/)**
- Receives requests
- Calls services
- Sends responses

**Routes (routes/)**
- Maps URLs to controllers
- Defines which middleware to use

---

## 📊 File Size & Complexity

**Simple Files:**
- `server.js` - ~15 lines
- `notFound.js` - ~10 lines
- `database.js` - ~20 lines

**Medium Files:**
- `app.js` - ~60 lines
- `auth.js` (middleware) - ~55 lines
- `errorHandler.js` - ~35 lines

**Complex Files:**
- `User.js` (model) - ~65 lines
- `Complaint.js` (model) - ~140 lines
- `authController.js` - ~80 lines
- `complaintController.js` - ~270 lines
- `authService.js` - ~90 lines
- `complaintService.js` - ~200+ lines

---

## 🔐 Security Files

**Authentication:**
- `middleware/auth.js` - JWT verification
- `services/authService.js` - Token generation
- `models/User.js` - Password hashing

**Validation:**
- `validators/authValidator.js` - Input validation
- `validators/complaintValidator.js` - Input validation

**Error Handling:**
- `middleware/errorHandler.js` - Error catching

---

## 📝 Summary

**Organized by Function:**
- Models = Data
- Controllers = Request handling
- Routes = URL mapping
- Services = Business logic
- Middleware = Security & validation
- Validators = Input checking
- Utils = Helpers

**Clean Architecture:**
- Separation of concerns
- Easy to find files
- Easy to maintain
- Easy to test
