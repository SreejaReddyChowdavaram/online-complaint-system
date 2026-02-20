# Jan Suvidha Backend Architecture - Simple Guide

## 📁 Folder Structure (MVC Pattern)

Think of MVC like organizing a restaurant:
- **Models** = Ingredients (data structure)
- **Views** = The plate presentation (API responses)
- **Controllers** = The chef (handles requests and decides what to do)

```
backend/
├── config/          → Configuration files (database connection)
├── controllers/     → Request handlers (the "chefs")
├── middleware/      → Security guards (authentication, authorization)
├── models/          → Database schemas (data structure)
├── routes/          → URL paths (which URL does what)
├── services/        → Business logic (complex operations)
├── utils/           → Helper functions (reusable tools)
├── validators/      → Input validation (checking if data is correct)
├── app.js           → Express app setup
└── server.js        → Server startup file
```

---

## 🔐 JWT Authentication - How It Works

### What is JWT?
JWT (JSON Web Token) is like a **temporary ID card** that proves who you are.

### The Flow:

1. **User Registers/Logs In** → Backend creates a JWT token
2. **Token is sent to user** → User stores it (usually in browser/localStorage)
3. **User makes requests** → Sends token with every request
4. **Backend checks token** → Verifies it's valid and knows who the user is

### Files Involved:

**`services/authService.js`** - Creates tokens and handles login/register
```javascript
// When user logs in, we create a token
generateToken(id) {
  return jwt.sign({ id }, SECRET_KEY, { expiresIn: '7d' });
}
```

**`middleware/auth.js`** - Checks if token is valid
```javascript
// This runs before protected routes
// Checks: "Do you have a valid token?"
protect = async (req, res, next) => {
  // 1. Get token from request
  // 2. Verify token is valid
  // 3. Find user from token
  // 4. Attach user to request
}
```

**`routes/authRoutes.js`** - Authentication endpoints
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Get token
- `GET /api/auth/me` - Get current user info

---

## 👥 Role-Based Access Control (RBAC)

### Three Roles:

1. **Citizen** - Can create complaints, view own complaints
2. **Officer** - Can update assigned complaints, change status
3. **Admin** - Can do everything (assign officers, delete complaints)

### How It Works:

**`middleware/auth.js`** - The `authorize()` function
```javascript
// Only allows specific roles
authorize('Admin', 'Officer') // Only Admin or Officer can access
```

**Example in routes:**
```javascript
// Only Citizens can create complaints
router.post('/', protect, authorize('Citizen'), createComplaint);

// Only Admin can assign officers
router.put('/:id/assign', protect, authorize('Admin'), assignOfficer);

// Only Officer or Admin can update status
router.put('/:id/status', protect, authorize('Officer', 'Admin'), updateStatus);
```

### Permission Matrix:

| Action | Citizen | Officer | Admin |
|--------|---------|---------|-------|
| Create Complaint | ✅ | ❌ | ❌ |
| View Own Complaints | ✅ | ✅ | ✅ |
| View All Complaints | ❌ | ✅ | ✅ |
| Update Status | ❌ | ✅ (assigned only) | ✅ |
| Assign Officer | ❌ | ❌ | ✅ |
| Delete Complaint | ❌ | ❌ | ✅ |

---

## 📋 Complaint Lifecycle

### Status Flow:

```
Pending → In Progress → Resolved
   ↓
Rejected (can happen at any time)
```

### Status Meanings:

1. **Pending** - Complaint just created, waiting to be assigned
2. **In Progress** - Officer is working on it
3. **Resolved** - Problem is fixed
4. **Rejected** - Complaint is invalid/duplicate

### How Status Changes:

**`controllers/complaintController.js`** - `updateStatus()` function
```javascript
// Only Officer (assigned) or Admin can change status
PUT /api/complaints/:id/status
Body: { status: "In Progress", notes: "Started working on it" }
```

**`models/Complaint.js`** - Status history tracking
```javascript
statusHistory: [{
  status: "In Progress",
  changedBy: userId,
  changedAt: Date,
  notes: "Started investigation"
}]
```

### Complaint States in Database:

**`models/Complaint.js`** - The schema
```javascript
status: {
  type: String,
  enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
  default: 'Pending'
}
```

---

## 🔄 Request Flow (Step by Step)

### Example: Creating a Complaint

1. **User sends request:**
   ```
   POST /api/complaints
   Headers: { Authorization: "Bearer <token>" }
   Body: { title: "Pothole on Main St", description: "..." }
   ```

2. **Route receives it:**
   ```
   routes/complaintRoutes.js
   → Checks: Is user authenticated? (protect middleware)
   → Checks: Is user a Citizen? (authorize middleware)
   → Validates data (validateComplaint)
   ```

3. **Controller handles it:**
   ```
   controllers/complaintController.js
   → Adds user ID to request body
   → Calls service to create complaint
   ```

4. **Service does the work:**
   ```
   services/complaintService.js
   → Creates complaint in database
   → Generates complaint ID (COMP-20260125-12345)
   → Returns complaint object
   ```

5. **Response sent back:**
   ```json
   {
     "success": true,
     "data": {
       "complaintId": "COMP-20260125-12345",
       "title": "Pothole on Main St",
       "status": "Pending",
       ...
     }
   }
   ```

---

## 📊 Database Models (Mongoose Schemas)

### User Model (`models/User.js`)

**What it stores:**
- Name, Email, Phone, Password
- Role (Citizen/Officer/Admin)
- Address
- Last login time

**Special features:**
- Password is automatically hashed before saving
- Password is hidden from queries (select: false)

### Complaint Model (`models/Complaint.js`)

**What it stores:**
- Complaint ID (auto-generated: COMP-YYYYMMDD-XXXXX)
- Title, Description, Category
- Location (address + GPS coordinates)
- Status, Priority
- Who submitted it (submittedBy)
- Who's working on it (assignedTo)
- Comments, Status history
- Attachments

**Special features:**
- Auto-generates complaint ID
- Auto-assigns department based on category
- Tracks status changes in history

---

## 🛡️ Security Features

### 1. Password Hashing
- Passwords are never stored as plain text
- Uses bcryptjs to hash passwords
- Happens automatically before saving (pre-save hook)

### 2. JWT Tokens
- Tokens expire after 7 days
- Secret key stored in environment variables
- Token must be sent with every protected request

### 3. Input Validation
- `validators/authValidator.js` - Validates login/register data
- `validators/complaintValidator.js` - Validates complaint data
- Prevents bad data from entering database

### 4. Error Handling
- `middleware/errorHandler.js` - Catches all errors
- Returns user-friendly error messages
- Logs errors for debugging

---

## 🚀 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /register` - Create account
- `POST /login` - Get token
- `GET /me` - Get current user (protected)
- `PUT /updatepassword` - Change password (protected)

### Complaints (`/api/complaints`)
- `GET /` - Get all complaints (filtered by role)
- `GET /:id` - Get single complaint
- `GET /complaint-id/:complaintId` - Get by complaint ID (public)
- `POST /` - Create complaint (Citizen only)
- `PUT /:id` - Update complaint (owner/officer/admin)
- `DELETE /:id` - Delete complaint (Admin only)
- `POST /:id/comments` - Add comment (protected)
- `PUT /:id/status` - Update status (Officer/Admin)
- `PUT /:id/assign` - Assign officer (Admin only)

---

## 🔧 Key Files Explained

### `server.js`
- Starts the server
- Connects to MongoDB
- Listens on port 5000

### `app.js`
- Sets up Express app
- Adds middleware (CORS, security, body parser)
- Connects all routes
- Handles errors

### `config/database.js`
- Connects to MongoDB
- Uses connection string from environment variables

### `middleware/auth.js`
- `protect` - Checks if user is logged in
- `authorize` - Checks if user has right role

### `services/`
- Contains business logic
- Separates concerns (controllers just handle requests, services do the work)

---

## 💡 Best Practices Used

1. **Separation of Concerns** - Each file has one job
2. **DRY (Don't Repeat Yourself)** - Reusable middleware and services
3. **Security First** - Passwords hashed, tokens verified
4. **Error Handling** - All errors caught and handled gracefully
5. **Validation** - Input validated before processing
6. **Environment Variables** - Secrets stored in .env file

---

## 🎯 Quick Reference

**To add a new protected route:**
```javascript
router.get('/example', protect, authorize('Admin'), controllerFunction);
```

**To check user role in controller:**
```javascript
if (req.user.role === 'Admin') {
  // Admin only code
}
```

**To get current user:**
```javascript
const userId = req.user.id;  // From protect middleware
const userRole = req.user.role;
```

**To update complaint status:**
```javascript
// In service
complaint.status = 'In Progress';
complaint.statusHistory.push({
  status: 'In Progress',
  changedBy: userId,
  changedAt: new Date(),
  notes: 'Started working'
});
await complaint.save();
```

---

## 📝 Summary

**MVC Structure:**
- Models = Data structure
- Controllers = Request handlers
- Routes = URL paths
- Services = Business logic

**JWT Authentication:**
- Token created on login
- Token sent with every request
- Middleware verifies token

**Role-Based Access:**
- Three roles: Citizen, Officer, Admin
- Middleware checks role before allowing access

**Complaint Lifecycle:**
- Pending → In Progress → Resolved
- Status tracked in history
- Only authorized users can change status

This architecture is clean, secure, and easy to maintain! 🎉
