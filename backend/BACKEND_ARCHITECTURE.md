# JAN SUVIDHA - Backend Architecture Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [MVC Architecture Explained](#mvc-architecture-explained)
4. [Mongoose Models](#mongoose-models)
5. [Authentication & Authorization](#authentication--authorization)
6. [API Routes](#api-routes)
7. [Request Flow](#request-flow)
8. [Component Explanations](#component-explanations)

---

## 🎯 Overview

The backend is built using **Node.js** (JavaScript runtime), **Express** (web framework), and **MongoDB** (database). It follows the **MVC (Model-View-Controller)** pattern to organize code in a clean and maintainable way.

**In Simple Words:**
- **Node.js**: The engine that runs our JavaScript code on the server
- **Express**: A toolkit that makes it easy to create web APIs (like building roads for data to travel)
- **MongoDB**: A database that stores our data in a flexible, JSON-like format
- **MVC**: A way to organize code into three parts: Models (data), Views (responses), and Controllers (logic)

---

## 📁 Folder Structure

```
backend/
├── config/              # Configuration files
│   └── database.js      # MongoDB connection setup
│
├── controllers/         # Request handlers (Controller layer)
│   ├── authController.js      # Handles login, register, password
│   ├── complaintController.js # Handles complaint operations
│   └── userController.js      # Handles user operations
│
├── middleware/          # Functions that run between request and response
│   ├── auth.js          # JWT authentication & role checking
│   ├── errorHandler.js  # Catches and handles errors
│   └── notFound.js      # Handles 404 errors
│
├── models/              # Database schemas (Model layer)
│   ├── User.js          # User data structure
│   └── Complaint.js     # Complaint data structure
│
├── routes/              # API endpoint definitions
│   ├── authRoutes.js    # Authentication routes
│   ├── complaintRoutes.js # Complaint routes
│   └── userRoutes.js    # User routes
│
├── services/            # Business logic (separated from controllers)
│   ├── authService.js   # Authentication logic
│   ├── complaintService.js # Complaint business logic
│   └── userService.js   # User business logic
│
├── validators/          # Input validation rules
│   ├── authValidator.js # Validates login/register data
│   └── complaintValidator.js # Validates complaint data
│
├── utils/               # Helper functions
│   └── helpers.js       # Reusable utility functions
│
├── app.js               # Express app configuration
├── server.js            # Server entry point
├── package.json         # Dependencies and scripts
└── .env                 # Environment variables (not in git)
```

**In Simple Words:**
- **config/**: Settings for connecting to the database
- **controllers/**: Functions that handle what happens when someone makes a request
- **middleware/**: Security guards that check permissions before allowing access
- **models/**: Blueprints that define what data looks like in the database
- **routes/**: Maps URLs to controller functions (like a phone book)
- **services/**: Complex business logic separated from controllers
- **validators/**: Rules that check if incoming data is correct
- **utils/**: Helper tools used throughout the app

---

## 🏗️ MVC Architecture Explained

### What is MVC?

**MVC** stands for **Model-View-Controller**. It's a way to organize code so that:
- **Models** handle data
- **Views** handle presentation (in our case, JSON responses)
- **Controllers** handle user requests and coordinate between Models and Views

### How MVC Works in Our Backend:

```
┌─────────────────────────────────────────────────────────┐
│                    REQUEST FLOW                          │
└─────────────────────────────────────────────────────────┘

1. Client Request
   ↓
2. Route (routes/complaintRoutes.js)
   → "When someone visits /api/complaints, use this controller"
   ↓
3. Middleware (middleware/auth.js)
   → "Check if user is logged in and has permission"
   ↓
4. Controller (controllers/complaintController.js)
   → "Handle the request, get data, prepare response"
   ↓
5. Service (services/complaintService.js) [Optional]
   → "Complex business logic"
   ↓
6. Model (models/Complaint.js)
   → "Talk to database, get/save data"
   ↓
7. Response
   → "Send JSON data back to client"
```

**In Simple Words:**
1. **Route**: "Someone wants to see complaints? Send them to the complaint controller"
2. **Middleware**: "Wait! Are they logged in? Check their ID card (JWT token)"
3. **Controller**: "Okay, they're allowed. Let me get the complaints from the database"
4. **Model**: "Here's the data from MongoDB"
5. **Controller**: "Great! Let me format it nicely and send it back"

---

## 📊 Mongoose Models

### 1. User Model (`models/User.js`)

**What it does:** Defines what a user looks like in the database.

**Fields:**
- `name`: User's full name
- `email`: Email address (unique, used for login)
- `phone`: Phone number
- `password`: Encrypted password (never shown in responses)
- `role`: User type - `Citizen`, `Officer`, or `Admin`
- `address`: User's address (street, city, state, zipCode)
- `isActive`: Whether account is active or disabled
- `lastLogin`: When user last logged in
- `createdAt`, `updatedAt`: Automatic timestamps

**Special Features:**
- **Password Hashing**: Before saving, passwords are encrypted using bcrypt
- **Password Comparison**: Method to check if login password matches stored password

**In Simple Words:**
The User model is like a form that every user must fill out. It stores all user information and automatically encrypts passwords for security.

---

### 2. Complaint Model (`models/Complaint.js`)

**What it does:** Defines what a complaint looks like in the database.

**Fields:**
- `title`: Short description of the complaint
- `description`: Detailed explanation
- `category`: Type of complaint - `Road`, `Water`, `Electricity`, `Sanitation`, `Other`
- `location`: Where the issue is
  - `address`: Text address
  - `coordinates`: GPS coordinates (latitude, longitude)
- `status`: Current state - `Pending`, `In Progress`, `Resolved`, `Rejected`
- `priority`: Importance level - `Low`, `Medium`, `High`, `Urgent`
- `submittedBy`: Reference to User who created it
- `assignedTo`: Reference to Officer handling it (optional)
- `attachments`: Array of photos/files
- `comments`: Array of messages between citizen and officer
- `resolvedAt`: When complaint was resolved
- `resolutionNotes`: Final notes from officer
- `createdAt`, `updatedAt`: Automatic timestamps

**Special Features:**
- **Indexes**: Database indexes for faster searches on status, category, and dates
- **References**: Links to User model for submittedBy and assignedTo

**In Simple Words:**
The Complaint model is like a complaint form with all the details: what the problem is, where it is, who reported it, who's fixing it, and what the current status is.

---

## 🔐 Authentication & Authorization

### JWT Authentication

**What is JWT?**
JWT (JSON Web Token) is like a temporary ID card. When a user logs in, they get a token. They must show this token with every request to prove they're logged in.

**How it works:**
1. User logs in with email and password
2. Server verifies credentials
3. Server creates a JWT token (contains user ID and role)
4. Server sends token to client
5. Client stores token and sends it with every request
6. Server checks token before allowing access

**In Simple Words:**
Like a concert wristband - once you get it at the entrance, you show it to security guards (middleware) to access different areas.

---

### Auth Middleware (`middleware/auth.js`)

#### 1. `protect` Middleware

**What it does:** Checks if user is logged in (has a valid JWT token).

**How it works:**
1. Looks for token in request headers
2. Verifies token is valid and not expired
3. Finds user in database using token
4. Attaches user info to request object
5. Allows request to continue OR blocks it

**In Simple Words:**
A security guard that checks your ID card (JWT token) before letting you into a building.

**Usage:**
```javascript
router.get('/profile', protect, getProfile);
// Only logged-in users can access this route
```

---

#### 2. `authorize` Middleware

**What it does:** Checks if user has the right role (Citizen, Officer, or Admin).

**How it works:**
1. Receives allowed roles (e.g., ['Admin', 'Officer'])
2. Checks if current user's role is in the list
3. Allows access OR blocks with 403 error

**In Simple Words:**
A VIP bouncer that only lets certain types of people (roles) into exclusive areas.

**Usage:**
```javascript
router.delete('/users/:id', protect, authorize('Admin'), deleteUser);
// Only Admins can delete users
```

---

### Role-Based Access Control

**Three Roles:**

1. **Citizen** (Default)
   - Can create complaints
   - Can view own complaints
   - Can add comments to own complaints
   - Cannot access admin features

2. **Officer**
   - Can view all complaints
   - Can update complaint status
   - Can be assigned to complaints
   - Can add comments to any complaint
   - Cannot delete users or complaints

3. **Admin**
   - Full access to everything
   - Can manage users (view, update, delete)
   - Can delete complaints
   - Can assign officers to complaints
   - Can view all statistics

**In Simple Words:**
- **Citizen**: Regular user, can report problems
- **Officer**: Worker, can fix problems
- **Admin**: Boss, can do everything

---

## 🛣️ API Routes

### Base URL: `/api`

---

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/api/auth/register` | Register new user | ❌ No | Any |
| POST | `/api/auth/login` | Login user | ❌ No | Any |
| GET | `/api/auth/me` | Get current user info | ✅ Yes | Any |
| PUT | `/api/auth/updatepassword` | Update password | ✅ Yes | Any |

**In Simple Words:**
- **Register**: Create a new account
- **Login**: Sign in and get a token
- **Get Me**: "Who am I?" - Get your own profile
- **Update Password**: Change your password

---

### Complaint Routes (`/api/complaints`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/complaints` | Get all complaints | ❌ No* | Any |
| GET | `/api/complaints/:id` | Get single complaint | ❌ No | Any |
| POST | `/api/complaints` | Create new complaint | ✅ Yes | Citizen |
| PUT | `/api/complaints/:id` | Update complaint | ✅ Yes | Owner/Officer/Admin |
| DELETE | `/api/complaints/:id` | Delete complaint | ✅ Yes | Admin |
| POST | `/api/complaints/:id/comments` | Add comment | ✅ Yes | Any |

**In Simple Words:**
- **Get All**: See list of complaints (filtered by role)
- **Get One**: See details of a specific complaint
- **Create**: Submit a new complaint
- **Update**: Change complaint details or status
- **Delete**: Remove a complaint (only admins)
- **Add Comment**: Leave a message on a complaint

**Note:** *GET all complaints may be filtered - Citizens see only their own, Officers/Admins see all*

---

### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/users/me` | Get own profile | ✅ Yes | Any |
| GET | `/api/users` | Get all users | ✅ Yes | Admin |
| GET | `/api/users/:id` | Get user by ID | ✅ Yes | Any |
| PUT | `/api/users/:id` | Update user | ✅ Yes | Owner/Admin |
| DELETE | `/api/users/:id` | Delete user | ✅ Yes | Admin |

**In Simple Words:**
- **Get Me**: See your own profile
- **Get All**: See all users (admins only)
- **Get One**: See a specific user's profile
- **Update**: Change user information
- **Delete**: Remove a user account (admins only)

---

## 🔄 Request Flow Example

### Example: Creating a Complaint

```
1. Client (Flutter App)
   → POST /api/complaints
   → Headers: { Authorization: "Bearer <token>" }
   → Body: { title, description, category, location }

2. Express App (app.js)
   → Receives request
   → Routes to /api/complaints

3. Route (routes/complaintRoutes.js)
   → Matches POST /api/complaints
   → Calls: protect middleware → validateComplaint → createComplaint controller

4. Middleware (middleware/auth.js - protect)
   → Extracts token from headers
   → Verifies token
   → Finds user in database
   → Attaches user to req.user
   → ✅ Passes to next step

5. Validator (validators/complaintValidator.js)
   → Checks if title, description, category are provided
   → Validates data format
   → ✅ Passes to controller

6. Controller (controllers/complaintController.js - createComplaint)
   → Gets data from req.body
   → Gets user from req.user
   → Calls service to create complaint

7. Service (services/complaintService.js) [Optional]
   → Business logic (e.g., auto-assign officer based on category)
   → Calls model to save

8. Model (models/Complaint.js)
   → Creates new complaint document
   → Saves to MongoDB
   → Returns saved complaint

9. Controller
   → Formats response
   → Sends JSON back

10. Client
    → Receives: { success: true, data: { complaint } }
    → Updates UI
```

**In Simple Words:**
Like ordering food:
1. You place an order (send request)
2. Restaurant checks if you're a member (authentication)
3. They verify your order is valid (validation)
4. Kitchen prepares food (controller/service)
5. Food is stored in system (database)
6. You get your order (response)

---

## 📝 Component Explanations

### Controllers (`controllers/`)

**What they do:** Handle HTTP requests and responses. They're like waiters in a restaurant - they take your order (request), talk to the kitchen (database), and bring you food (response).

**Example Flow:**
```javascript
// complaintController.js
exports.createComplaint = async (req, res) => {
  // 1. Get data from request
  const { title, description, category } = req.body;
  const userId = req.user.id; // From auth middleware
  
  // 2. Create complaint using model
  const complaint = await Complaint.create({
    title,
    description,
    category,
    submittedBy: userId
  });
  
  // 3. Send response
  res.status(201).json({
    success: true,
    data: complaint
  });
};
```

**In Simple Words:**
Controllers are the "doers" - they receive requests, do the work (talk to database), and send back results.

---

### Services (`services/`)

**What they do:** Contain complex business logic separated from controllers. This keeps controllers clean and makes logic reusable.

**Example:**
```javascript
// complaintService.js
exports.assignOfficer = async (complaintId, category) => {
  // Complex logic: Find best officer for this category
  const officer = await User.findOne({
    role: 'Officer',
    specialization: category,
    isActive: true
  });
  
  return officer;
};
```

**In Simple Words:**
Services are like specialized workers - they handle complex tasks so controllers don't get messy.

---

### Validators (`validators/`)

**What they do:** Check if incoming data is correct before processing. Like a bouncer checking IDs.

**Example:**
```javascript
// complaintValidator.js
exports.validateComplaint = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').isLength({ min: 10 }).withMessage('Description too short'),
  body('category').isIn(['Road', 'Water', 'Electricity']).withMessage('Invalid category')
];
```

**In Simple Words:**
Validators are quality checkers - they make sure data is good before it enters the system.

---

### Error Handler (`middleware/errorHandler.js`)

**What it does:** Catches all errors and sends a nice error message instead of crashing.

**In Simple Words:**
Like a safety net - if something goes wrong, it catches the error and tells the user what happened instead of breaking the app.

---

### Database Connection (`config/database.js`)

**What it does:** Connects to MongoDB database when server starts.

**In Simple Words:**
Like plugging in a power cord - it connects the app to the database so data can flow.

---

## 🎯 Complaint Lifecycle

### Status Flow:

```
Pending → In Progress → Resolved
   ↓
Rejected
```

**Statuses Explained:**

1. **Pending** (Default)
   - Complaint just created
   - Waiting for officer assignment
   - No action taken yet

2. **In Progress**
   - Officer assigned
   - Work has started
   - Being actively worked on

3. **Resolved**
   - Problem fixed
   - Complaint closed
   - Resolution notes added

4. **Rejected**
   - Complaint invalid or duplicate
   - Not going to be fixed
   - Reason provided

**In Simple Words:**
Like a package delivery:
- **Pending**: Package received, waiting to ship
- **In Progress**: Package is on the way
- **Resolved**: Package delivered successfully
- **Rejected**: Package returned (invalid address)

---

## 🔒 Security Features

1. **Password Hashing**: Passwords are encrypted using bcrypt before storing
2. **JWT Tokens**: Secure, time-limited access tokens
3. **Role-Based Access**: Different permissions for different roles
4. **Input Validation**: All inputs are checked before processing
5. **Helmet**: Security headers to protect against common attacks
6. **CORS**: Controls which websites can access the API

**In Simple Words:**
Multiple layers of security like:
- Locked doors (authentication)
- Security guards (middleware)
- ID checks (validation)
- Different access levels (roles)

---

## 📚 Summary

**Backend Architecture in 3 Sentences:**
1. **Models** define what data looks like (User, Complaint)
2. **Controllers** handle requests and send responses
3. **Routes** connect URLs to controllers, **Middleware** adds security, and **Services** handle complex logic

**Key Concepts:**
- **MVC**: Organizes code into Models (data), Views (responses), Controllers (logic)
- **JWT**: Secure way to verify users are logged in
- **Roles**: Different permission levels (Citizen, Officer, Admin)
- **Lifecycle**: Complaints move through statuses (Pending → In Progress → Resolved)

---

## 🚀 Next Steps

To use this backend:
1. Install dependencies: `npm install`
2. Set up `.env` file with database URL and JWT secret
3. Start server: `npm run dev`
4. Test endpoints using Postman or your Flutter app

For detailed setup instructions, see `SETUP_GUIDE.md`
