# JAN SUVIDHA - Backend Architecture Diagram

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Flutter App)                      │
│                  Makes HTTP Requests                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP Request
                        │ (JSON Data)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                              │
│                  (Node.js Backend)                            │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  app.js - Main Application Setup                     │    │
│  │  - CORS, Security, Body Parsing                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                      │
│                        ▼                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ROUTES (routes/)                                     │    │
│  │  - authRoutes.js      → /api/auth/*                  │    │
│  │  - complaintRoutes.js → /api/complaints/*            │    │
│  │  - userRoutes.js      → /api/users/*                │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                      │
│                        ▼                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  MIDDLEWARE (middleware/)                            │    │
│  │  - auth.js          → Check JWT token               │    │
│  │  - errorHandler.js  → Handle errors                 │    │
│  │  - notFound.js      → Handle 404                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                      │
│                        ▼                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  CONTROLLERS (controllers/)                           │    │
│  │  - authController.js      → Handle auth requests     │    │
│  │  - complaintController.js → Handle complaint ops     │    │
│  │  - userController.js      → Handle user ops         │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                      │
│                        ▼                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  SERVICES (services/) [Optional]                     │    │
│  │  - authService.js      → Business logic             │    │
│  │  - complaintService.js → Business logic              │    │
│  │  - userService.js      → Business logic              │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                      │
│                        ▼                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  MODELS (models/)                                     │    │
│  │  - User.js      → User data structure                 │    │
│  │  - Complaint.js → Complaint data structure            │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                      │
└────────────────────────┼──────────────────────────────────────┘
                         │
                         │ Database Queries
                         │ (Mongoose)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                           │
│                  Stores All Data                              │
│  - Users Collection                                           │
│  - Complaints Collection                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example: Creating a Complaint

```
1. USER ACTION
   └─> Flutter App: User fills form and clicks "Submit"
       │
       ▼
2. HTTP REQUEST
   └─> POST /api/complaints
       Headers: { Authorization: "Bearer <token>" }
       Body: { title, description, category, location }
       │
       ▼
3. EXPRESS APP (app.js)
   └─> Receives request
       Applies middleware (CORS, body parsing)
       Routes to /api/complaints
       │
       ▼
4. ROUTE (routes/complaintRoutes.js)
   └─> POST /api/complaints
       Applies: protect → authorize('Citizen') → validateComplaint → createComplaint
       │
       ▼
5. MIDDLEWARE: protect (middleware/auth.js)
   └─> Extracts JWT token from headers
       Verifies token is valid
       Finds user in database
       Attaches user to req.user
       ✅ Passes to next
       │
       ▼
6. MIDDLEWARE: authorize('Citizen') (middleware/auth.js)
   └─> Checks if req.user.role === 'Citizen'
       ✅ User is Citizen, passes to next
       │
       ▼
7. MIDDLEWARE: validateComplaint (validators/complaintValidator.js)
   └─> Checks if title, description, category are provided
       Validates data format
       ✅ Data is valid, passes to controller
       │
       ▼
8. CONTROLLER (controllers/complaintController.js)
   └─> createComplaint function
       Gets data from req.body
       Gets user ID from req.user.id
       Calls service to create complaint
       │
       ▼
9. SERVICE (services/complaintService.js) [Optional]
   └─> createComplaint function
       Adds business logic (e.g., set default priority)
       Calls model to save
       │
       ▼
10. MODEL (models/Complaint.js)
    └─> Complaint.create({ ... })
        Validates data against schema
        Saves to MongoDB
        Returns saved complaint
        │
        ▼
11. RESPONSE
    └─> Controller formats response
        Sends: { success: true, data: complaint }
        │
        ▼
12. CLIENT RECEIVES
    └─> Flutter App gets response
        Updates UI
        Shows success message
```

---

## 🔐 Authentication Flow

```
┌──────────────┐
│   USER       │
│  (Citizen)   │
└──────┬───────┘
       │
       │ 1. POST /api/auth/login
       │    { email, password }
       ▼
┌─────────────────────┐
│  authController     │
│  (login function)   │
└──────┬──────────────┘
       │
       │ 2. Check email & password
       ▼
┌─────────────────────┐
│  User Model         │
│  (findOne, compare) │
└──────┬──────────────┘
       │
       │ 3. If valid, create JWT token
       ▼
┌─────────────────────┐
│  JWT Token Created  │
│  Contains:          │
│  - User ID          │
│  - Role             │
│  - Expiration       │
└──────┬──────────────┘
       │
       │ 4. Send token to client
       ▼
┌─────────────────────┐
│  CLIENT             │
│  Stores token       │
│  (localStorage)     │
└─────────────────────┘

       │
       │ 5. Future requests include token
       │    Authorization: Bearer <token>
       ▼
┌─────────────────────┐
│  protect Middleware  │
│  - Extracts token   │
│  - Verifies token   │
│  - Finds user       │
│  - Attaches to req  │
└─────────────────────┘
```

---

## 👥 Role-Based Access Control

```
┌─────────────────────────────────────────────────────────┐
│                    USER ROLES                            │
└─────────────────────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │ Citizen │    │ Officer │    │  Admin  │
    └────┬────┘    └────┬────┘    └────┬────┘
         │              │              │
         │              │              │
    ┌────┴──────────────┴──────────────┴────┐
    │         PERMISSIONS MATRIX            │
    └────────────────────────────────────────┘
    
    ┌─────────────────────────────────────────┐
    │ Action              │ C │ O │ A │
    ├─────────────────────────────────────────┤
    │ Create Complaint    │ ✅ │ ❌ │ ✅ │
    │ View Own Complaints │ ✅ │ ❌ │ ✅ │
    │ View All Complaints │ ❌ │ ✅ │ ✅ │
    │ Update Own          │ ✅ │ ❌ │ ✅ │
    │ Update Assigned     │ ❌ │ ✅ │ ✅ │
    │ Update Any          │ ❌ │ ❌ │ ✅ │
    │ Delete Complaint    │ ❌ │ ❌ │ ✅ │
    │ Add Comment         │ ✅ │ ✅ │ ✅ │
    │ View All Users      │ ❌ │ ❌ │ ✅ │
    │ Delete User         │ ❌ │ ❌ │ ✅ │
    └─────────────────────────────────────────┘
    
    C = Citizen
    O = Officer
    A = Admin
```

---

## 📊 Complaint Lifecycle

```
┌─────────────┐
│   PENDING   │  ← Default status when created
└──────┬──────┘
       │
       │ Officer assigned
       │ Status changed
       ▼
┌─────────────────┐
│  IN PROGRESS    │  ← Work has started
└──────┬──────────┘
       │
       │ Problem fixed
       │ Status changed
       ▼
┌─────────────┐
│  RESOLVED   │  ← Complaint closed
└─────────────┘

       OR

┌─────────────┐
│   PENDING   │
└──────┬──────┘
       │
       │ Invalid/duplicate
       │ Status changed
       ▼
┌─────────────┐
│  REJECTED   │  ← Not going to be fixed
└─────────────┘
```

---

## 📁 Folder Structure Tree

```
backend/
│
├── config/
│   └── database.js          → MongoDB connection
│
├── controllers/              → Request handlers
│   ├── authController.js
│   ├── complaintController.js
│   └── userController.js
│
├── middleware/               → Security & error handling
│   ├── auth.js              → JWT authentication
│   ├── errorHandler.js      → Error catcher
│   └── notFound.js          → 404 handler
│
├── models/                   → Database schemas
│   ├── User.js              → User blueprint
│   └── Complaint.js         → Complaint blueprint
│
├── routes/                   → URL mappings
│   ├── authRoutes.js
│   ├── complaintRoutes.js
│   └── userRoutes.js
│
├── services/                 → Business logic
│   ├── authService.js
│   ├── complaintService.js
│   └── userService.js
│
├── validators/               → Input validation
│   ├── authValidator.js
│   └── complaintValidator.js
│
├── utils/                    → Helper functions
│   └── helpers.js
│
├── app.js                    → Express app setup
├── server.js                 → Server entry point
└── package.json              → Dependencies
```

---

## 🔗 Data Relationships

```
┌─────────────┐
│    USER     │
│             │
│ - id        │◄─────┐
│ - name      │      │
│ - email     │      │
│ - role      │      │
│ - password  │      │
└─────────────┘      │
                     │
                     │ submittedBy
                     │ (who created)
                     │
                     │
┌─────────────┐      │      ┌─────────────┐
│  COMPLAINT  │      │      │    USER     │
│             │      │      │  (Officer)  │
│ - id        │      │      │             │
│ - title     │      │      │ - id        │
│ - status    │      │      │ - name      │
│ - category  │      │      │ - role      │
│             │      │      └─────────────┘
│ submittedBy ├──────┘
│ assignedTo  ├─────────────┐
│             │             │
│ comments[]  │             │ assignedTo
│   └─ user   │             │ (who handles)
│   └─ text   │             │
└─────────────┘             │
                            │
                            │
                            ▼
                    ┌─────────────┐
                    │    USER     │
                    │  (Officer)  │
                    └─────────────┘
```

---

## 🎯 Key Concepts in Simple Terms

### MVC Pattern
- **Model**: The blueprint (like a form template)
- **View**: The output (JSON response in our case)
- **Controller**: The worker (handles requests and coordinates)

### Middleware
- Functions that run between request and response
- Like security guards checking permissions
- Examples: authentication, validation, error handling

### JWT Token
- Like a temporary ID card
- Contains user information
- Must be shown with every request
- Expires after a set time

### Role-Based Access
- Different users have different permissions
- Like a building with different access levels:
  - Citizen: Can enter lobby
  - Officer: Can enter office
  - Admin: Can enter everywhere

### Complaint Lifecycle
- Like a package delivery:
  - Pending: Received, waiting
  - In Progress: On the way
  - Resolved: Delivered
  - Rejected: Returned
