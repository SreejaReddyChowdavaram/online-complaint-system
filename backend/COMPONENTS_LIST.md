# JAN SUVIDHA - Backend Components List

## 📋 Complete Component Overview

This document lists all components of the backend architecture with brief descriptions.

---

## 📁 Folder Structure

### 1. `config/`
**Purpose:** Configuration files

**Files:**
- `database.js` - MongoDB connection setup

**What it does:** Handles database connection when server starts.

---

### 2. `controllers/`
**Purpose:** Request handlers (Controller layer of MVC)

**Files:**
- `authController.js` - Handles authentication requests (register, login, password)
- `complaintController.js` - Handles complaint operations (CRUD, comments)
- `userController.js` - Handles user operations (profile, management)

**What it does:** Functions that process HTTP requests and send responses.

---

### 3. `middleware/`
**Purpose:** Functions that run between request and response

**Files:**
- `auth.js` - JWT authentication and role-based authorization
  - `protect` - Verifies user is logged in
  - `authorize` - Checks user has required role
- `errorHandler.js` - Catches and handles errors gracefully
- `notFound.js` - Handles 404 errors (route not found)

**What it does:** Security guards and error handlers that protect routes and handle errors.

---

### 4. `models/`
**Purpose:** Database schemas (Model layer of MVC)

**Files:**
- `User.js` - User data structure
  - Fields: name, email, phone, password, role, address, isActive
  - Methods: password hashing, password comparison
- `Complaint.js` - Complaint data structure
  - Fields: title, description, category, location, status, priority, submittedBy, assignedTo, attachments, comments
  - Indexes: status, category, submittedBy, createdAt

**What it does:** Defines what data looks like in the database and how it's stored.

---

### 5. `routes/`
**Purpose:** API endpoint definitions

**Files:**
- `authRoutes.js` - Authentication endpoints
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - GET `/api/auth/me`
  - PUT `/api/auth/updatepassword`
- `complaintRoutes.js` - Complaint endpoints
  - GET `/api/complaints`
  - GET `/api/complaints/:id`
  - POST `/api/complaints`
  - PUT `/api/complaints/:id`
  - DELETE `/api/complaints/:id`
  - POST `/api/complaints/:id/comments`
- `userRoutes.js` - User endpoints
  - GET `/api/users/me`
  - GET `/api/users`
  - GET `/api/users/:id`
  - PUT `/api/users/:id`
  - DELETE `/api/users/:id`

**What it does:** Maps URLs to controller functions.

---

### 6. `services/`
**Purpose:** Business logic separated from controllers

**Files:**
- `authService.js` - Authentication business logic
- `complaintService.js` - Complaint processing logic
- `userService.js` - User management logic

**What it does:** Contains complex business logic to keep controllers clean.

---

### 7. `validators/`
**Purpose:** Input validation rules

**Files:**
- `authValidator.js` - Validates login and registration data
- `complaintValidator.js` - Validates complaint data

**What it does:** Checks if incoming data is correct before processing.

---

### 8. `utils/`
**Purpose:** Helper functions

**Files:**
- `helpers.js` - Reusable utility functions

**What it does:** Common functions used throughout the application.

---

### 9. Root Files
**Files:**
- `app.js` - Express application setup and configuration
- `server.js` - Server entry point (starts the server)
- `package.json` - Dependencies and scripts

**What they do:**
- `app.js` - Configures Express app (CORS, security, routes)
- `server.js` - Connects to database and starts server
- `package.json` - Lists all required packages

---

## 🔐 Authentication Components

### JWT Authentication
- **Location:** `middleware/auth.js` (protect function)
- **Purpose:** Verifies user is logged in
- **How it works:** Extracts token from headers, verifies it, finds user in database

### Role-Based Authorization
- **Location:** `middleware/auth.js` (authorize function)
- **Purpose:** Checks if user has required role
- **Roles:** Citizen, Officer, Admin
- **How it works:** Compares user's role with allowed roles

### Password Security
- **Location:** `models/User.js`
- **Purpose:** Encrypts passwords before storing
- **How it works:** Uses bcrypt to hash passwords

---

## 📊 Database Models

### User Model
**Schema Fields:**
- `name` (String, required)
- `email` (String, required, unique)
- `phone` (String, required)
- `password` (String, required, hashed)
- `role` (String, enum: Citizen/Officer/Admin, default: Citizen)
- `address` (Object: street, city, state, zipCode)
- `isActive` (Boolean, default: true)
- `lastLogin` (Date)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

**Methods:**
- `comparePassword()` - Checks if password matches

**Hooks:**
- `pre('save')` - Hashes password before saving

---

### Complaint Model
**Schema Fields:**
- `title` (String, required, max 200 chars)
- `description` (String, required)
- `category` (String, enum: Road/Water/Electricity/Sanitation/Other)
- `location` (Object: address, coordinates)
- `status` (String, enum: Pending/In Progress/Resolved/Rejected, default: Pending)
- `priority` (String, enum: Low/Medium/High/Urgent, default: Medium)
- `submittedBy` (ObjectId, ref: User, required)
- `assignedTo` (ObjectId, ref: User, optional)
- `attachments` (Array: filename, path, uploadedAt)
- `comments` (Array: user, text, createdAt)
- `resolvedAt` (Date)
- `resolutionNotes` (String)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

**Indexes:**
- status
- category
- submittedBy
- createdAt

---

## 🛣️ API Routes Summary

### Authentication Routes (`/api/auth`)
1. `POST /register` - Register new user
2. `POST /login` - Login user
3. `GET /me` - Get current user
4. `PUT /updatepassword` - Update password

### Complaint Routes (`/api/complaints`)
1. `GET /` - Get all complaints
2. `GET /:id` - Get single complaint
3. `POST /` - Create complaint (Citizen only)
4. `PUT /:id` - Update complaint
5. `DELETE /:id` - Delete complaint (Admin only)
6. `POST /:id/comments` - Add comment

### User Routes (`/api/users`)
1. `GET /me` - Get own profile
2. `GET /` - Get all users (Admin only)
3. `GET /:id` - Get user by ID
4. `PUT /:id` - Update user
5. `DELETE /:id` - Delete user (Admin only)

---

## 🔄 Request Flow Components

1. **Route** - Receives request, matches URL
2. **Middleware** - Checks authentication and authorization
3. **Validator** - Validates input data
4. **Controller** - Processes request
5. **Service** - Handles business logic (optional)
6. **Model** - Interacts with database
7. **Response** - Sends JSON response

---

## 🎯 Key Features

### 1. MVC Architecture
- **Model:** `models/` - Data structure
- **View:** JSON responses
- **Controller:** `controllers/` - Request handling

### 2. JWT Authentication
- Token-based authentication
- Stateless (no server-side sessions)
- Secure and scalable

### 3. Role-Based Access Control
- Three roles: Citizen, Officer, Admin
- Different permissions for each role
- Enforced via middleware

### 4. Complaint Lifecycle
- Statuses: Pending → In Progress → Resolved
- Alternative: Pending → Rejected
- Status tracking and updates

### 5. Security Features
- Password hashing (bcrypt)
- JWT token authentication
- Input validation
- Error handling
- CORS configuration
- Helmet security headers

---

## 📝 Documentation Files

1. `BACKEND_ARCHITECTURE.md` - Complete architecture documentation
2. `API_ROUTES.md` - Detailed API routes reference
3. `ARCHITECTURE_DIAGRAM.md` - Visual diagrams and flows
4. `SIMPLE_EXPLANATION.md` - Simple explanations for beginners
5. `COMPONENTS_LIST.md` - This file (component overview)

---

## 🚀 Dependencies

### Core Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `dotenv` - Environment variables
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `morgan` - HTTP request logger
- `express-validator` - Input validation
- `multer` - File upload handling

### Development Dependencies
- `nodemon` - Auto-restart on file changes
- `jest` - Testing framework

---

## ✅ Summary

**Backend Components:**
- ✅ MVC folder structure
- ✅ JWT authentication middleware
- ✅ Role-based access control (Citizen, Officer, Admin)
- ✅ Complaint lifecycle (Pending, In Progress, Resolved)
- ✅ Mongoose models (User, Complaint)
- ✅ API routes (Auth, Complaints, Users)
- ✅ Security features (password hashing, validation, error handling)
- ✅ Complete documentation

**All requirements met!** 🎉
