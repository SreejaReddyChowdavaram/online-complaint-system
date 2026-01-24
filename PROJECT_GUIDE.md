# JAN SUVIDHA - Complete Project Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Tech Stack Explanation](#tech-stack-explanation)
4. [Project Structure](#project-structure)
5. [Setup Instructions](#setup-instructions)
6. [System Workflow](#system-workflow)
7. [Key Features & Implementation](#key-features--implementation)
8. [API Documentation](#api-documentation)
9. [Database Schema](#database-schema)
10. [Viva Preparation](#viva-preparation)

---

## 🎯 Project Overview

**Jan Suvidha** is a civic complaint registering system that enables citizens to:
- Register complaints about civic issues (roads, water, electricity, sanitation)
- Track complaint status in real-time
- Add location using Google Maps
- Upload photos as evidence
- Receive updates and comments from officers
- View complaint history

**User Roles:**
- **Citizen**: Submit and track complaints
- **Officer**: Manage assigned complaints, update status
- **Admin**: Full system access, user management

---

## 🏗️ System Architecture

### Architecture Pattern: **MVC (Model-View-Controller)**

```
┌─────────────────┐
│   Flutter App   │  (Frontend - View Layer)
│   (Dart)        │
└────────┬────────┘
         │ HTTP/REST API
         │ (JSON)
         ▼
┌─────────────────┐
│  Express Server │  (Backend - Controller Layer)
│   (Node.js)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    MongoDB      │  (Database - Model Layer)
│   (Mongoose)    │
└─────────────────┘
```

### Request Flow:
1. **User Action** → Flutter UI
2. **API Call** → HTTP Service (Dart)
3. **Request** → Express Route
4. **Validation** → Middleware/Validators
5. **Business Logic** → Service Layer
6. **Data Access** → Model (Mongoose)
7. **Response** → JSON → Flutter → UI Update

---

## 💻 Tech Stack Explanation

### **Frontend: Flutter (Dart)**
- **Why Flutter?**
  - Cross-platform (iOS, Android, Web)
  - Single codebase
  - Fast development with hot reload
  - Rich UI components
  - Good performance

### **Backend: Node.js + Express**
- **Why Node.js?**
  - JavaScript ecosystem
  - Fast, non-blocking I/O
  - Large package ecosystem
  - Easy to learn and maintain
  - Good for REST APIs

### **Database: MongoDB (Mongoose)**
- **Why MongoDB?**
  - NoSQL - flexible schema
  - JSON-like documents
  - Easy to scale
  - Good for nested data (complaints with comments)
  - Mongoose provides validation and middleware

### **Authentication: JWT (JSON Web Tokens)**
- **Why JWT?**
  - Stateless authentication
  - No server-side session storage
  - Secure token-based auth
  - Works well with mobile apps
  - Token contains user info

### **Maps: Google Maps API**
- **Why Google Maps?**
  - Accurate location services
  - Geocoding (address ↔ coordinates)
  - Reverse geocoding
  - Well-documented API

---

## 📁 Project Structure

### Backend Structure (MVC Pattern)

```
backend/
├── config/              # Configuration files
│   └── database.js     # MongoDB connection
├── controllers/         # Request handlers (C in MVC)
│   ├── authController.js
│   ├── complaintController.js
│   └── userController.js
├── middleware/         # Custom middleware
│   ├── auth.js         # JWT authentication
│   ├── errorHandler.js # Error handling
│   └── notFound.js     # 404 handler
├── models/             # Database models (M in MVC)
│   ├── Complaint.js
│   └── User.js
├── routes/             # API route definitions
│   ├── authRoutes.js
│   ├── complaintRoutes.js
│   └── userRoutes.js
├── services/           # Business logic layer
│   ├── authService.js
│   ├── complaintService.js
│   └── userService.js
├── utils/              # Helper functions
│   └── helpers.js
├── validators/         # Input validation
│   ├── authValidator.js
│   └── complaintValidator.js
├── app.js              # Express app setup
├── server.js           # Server entry point
└── package.json        # Dependencies
```

**MVC Breakdown:**
- **Model**: `models/` - Data structure and database operations
- **View**: Not applicable (API returns JSON)
- **Controller**: `controllers/` - Handle HTTP requests/responses

### Frontend Structure

```
frontend/
├── lib/
│   ├── config/         # App configuration
│   │   ├── app_config.dart
│   │   └── app_theme.dart
│   ├── models/         # Data models
│   │   ├── complaint_model.dart
│   │   └── user_model.dart
│   ├── providers/      # State management (Provider pattern)
│   │   ├── auth_provider.dart
│   │   └── complaint_provider.dart
│   ├── routes/         # Navigation
│   │   └── app_router.dart
│   ├── screens/        # UI Screens
│   │   ├── auth/
│   │   ├── complaints/
│   │   ├── home/
│   │   └── profile/
│   ├── services/       # API services
│   │   ├── api_service.dart
│   │   ├── auth_service.dart
│   │   └── complaint_service.dart
│   ├── utils/          # Utilities
│   │   └── constants.dart
│   ├── widgets/        # Reusable widgets
│   └── main.dart       # App entry point
└── pubspec.yaml        # Dependencies
```

---

## 🚀 Setup Instructions

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jan-suvidha
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. **Start MongoDB:**
   - Install MongoDB locally, or
   - Use MongoDB Atlas (cloud)

5. **Run the server:**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install Flutter dependencies:**
   ```bash
   flutter pub get
   ```

3. **Update API URL in `lib/config/app_config.dart`:**
   ```dart
   static const String baseUrl = 'http://localhost:5000/api';
   ```

4. **Get Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create project
   - Enable Maps SDK for Android/iOS
   - Create API key
   - Add to `app_config.dart`

5. **Run the app:**
   ```bash
   flutter run
   ```

---

## 🔄 System Workflow

### 1. **User Registration/Login Flow**

```
User opens app
    ↓
Splash Screen (check if logged in)
    ↓
If not logged in → Login/Register Screen
    ↓
User enters credentials
    ↓
POST /api/auth/register or /api/auth/login
    ↓
Backend validates → Creates user / Checks password
    ↓
JWT token generated
    ↓
Token stored in Flutter Secure Storage
    ↓
Navigate to Home Screen
```

### 2. **Create Complaint Flow**

```
User clicks "Create Complaint"
    ↓
Opens Create Complaint Screen
    ↓
User fills form:
  - Title, Description
  - Category (Road/Water/etc.)
  - Location (Google Maps picker)
  - Photos (optional)
    ↓
POST /api/complaints
  Headers: { Authorization: Bearer <token> }
  Body: { title, description, category, location, ... }
    ↓
Backend:
  - Auth middleware verifies token
  - Validates input
  - Creates complaint in DB
  - Sets status = "Pending"
    ↓
Response: Complaint object
    ↓
Flutter updates UI → Shows success message
    ↓
Navigate to Complaint List
```

### 3. **View Complaints Flow**

```
User opens Complaint List
    ↓
GET /api/complaints
  Headers: { Authorization: Bearer <token> }
    ↓
Backend:
  - Auth middleware verifies token
  - Queries MongoDB
  - Filters by user role:
    * Citizen: Only their complaints
    * Officer: Assigned complaints
    * Admin: All complaints
    ↓
Response: Array of complaints
    ↓
Flutter displays list with cards
    ↓
User clicks complaint → Opens Detail Screen
    ↓
GET /api/complaints/:id
    ↓
Shows full details, comments, status
```

### 4. **Update Complaint Status (Officer/Admin)**

```
Officer opens complaint detail
    ↓
Changes status dropdown (Pending → In Progress)
    ↓
PUT /api/complaints/:id
  Body: { status: "In Progress" }
    ↓
Backend:
  - Checks authorization (Officer/Admin)
  - Updates complaint
  - Can add resolution notes
    ↓
Response: Updated complaint
    ↓
UI refreshes with new status
```

---

## 🔑 Key Features & Implementation

### 1. **JWT Authentication**

**Backend (`middleware/auth.js`):**
```javascript
// Extract token from header: "Bearer <token>"
// Verify token using JWT_SECRET
// Attach user to req.user
// Next middleware/controller
```

**Frontend (`services/auth_service.dart`):**
```dart
// Store token in SecureStorage after login
// Add token to headers: "Authorization: Bearer <token>"
// Check token on app start
```

**Why this approach?**
- Stateless: No session storage needed
- Secure: Token signed with secret
- Scalable: Works across multiple servers

### 2. **Role-Based Access Control (RBAC)**

**Roles:**
- `Citizen`: Can create/view own complaints
- `Officer`: Can view/update assigned complaints
- `Admin`: Full access

**Implementation:**
```javascript
// middleware/auth.js
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
  };
};

// Usage in routes:
router.delete('/:id', protect, authorize('Admin'), deleteComplaint);
```

### 3. **Google Maps Integration**

**Frontend:**
1. Add `google_maps_flutter` package
2. Get API key from Google Cloud Console
3. Use `GoogleMap` widget
4. Get location using `geolocator`
5. Reverse geocoding for address

**Backend:**
- Store coordinates: `{ latitude, longitude }`
- Store address string
- Can use Google Geocoding API for validation

### 4. **File Upload (Attachments)**

**Implementation:**
- Use `multer` middleware in Express
- Store files in `uploads/` folder
- Save file path in complaint document
- Frontend uses `image_picker` package

### 5. **State Management (Provider Pattern)**

**Why Provider?**
- Simple and lightweight
- Built-in Flutter package
- Good for small-medium apps
- Easy to understand

**Usage:**
```dart
// Provider holds state
class ComplaintProvider extends ChangeNotifier {
  List<Complaint> _complaints = [];
  
  Future<void> fetchComplaints() async {
    // API call
    _complaints = await complaintService.getComplaints();
    notifyListeners(); // Update UI
  }
}

// Widget listens to changes
Consumer<ComplaintProvider>(
  builder: (context, provider, child) {
    return ListView.builder(
      itemCount: provider.complaints.length,
      // ...
    );
  },
)
```

---

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### Register User
```
POST /auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}
Response: { success: true, token: "...", data: { user } }
```

#### Login
```
POST /auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response: { success: true, token: "...", data: { user } }
```

#### Get Current User
```
GET /auth/me
Headers: { Authorization: Bearer <token> }
Response: { success: true, data: { user } }
```

### Complaint Endpoints

#### Get All Complaints
```
GET /complaints?status=Pending&category=Road
Headers: { Authorization: Bearer <token> }
Response: { success: true, count: 10, data: [complaints] }
```

#### Get Single Complaint
```
GET /complaints/:id
Headers: { Authorization: Bearer <token> }
Response: { success: true, data: { complaint } }
```

#### Create Complaint
```
POST /complaints
Headers: { Authorization: Bearer <token> }
Body: {
  "title": "Pothole on Main Street",
  "description": "Large pothole causing accidents",
  "category": "Road",
  "location": {
    "address": "123 Main St",
    "coordinates": { "latitude": 28.6139, "longitude": 77.2090 }
  },
  "priority": "High"
}
Response: { success: true, data: { complaint } }
```

#### Update Complaint
```
PUT /complaints/:id
Headers: { Authorization: Bearer <token> }
Body: { "status": "In Progress", "resolutionNotes": "..." }
Response: { success: true, data: { complaint } }
```

#### Add Comment
```
POST /complaints/:id/comments
Headers: { Authorization: Bearer <token> }
Body: { "text": "Work started on this issue" }
Response: { success: true, data: { complaint } }
```

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: String (enum: ['Citizen', 'Officer', 'Admin']),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String (enum: ['Road', 'Water', 'Electricity', 'Sanitation', 'Other']),
  location: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  status: String (enum: ['Pending', 'In Progress', 'Resolved', 'Rejected']),
  priority: String (enum: ['Low', 'Medium', 'High', 'Urgent']),
  submittedBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  attachments: [{
    filename: String,
    path: String,
    uploadedAt: Date
  }],
  comments: [{
    user: ObjectId (ref: User),
    text: String,
    createdAt: Date
  }],
  resolvedAt: Date,
  resolutionNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `status`: For filtering by status
- `category`: For filtering by category
- `submittedBy`: For user's complaints
- `createdAt`: For sorting by date

---

## 🎓 Viva Preparation

### Common Questions & Answers

**Q1: Why did you choose this tech stack?**
- **Flutter**: Cross-platform, single codebase, fast development
- **Node.js**: JavaScript ecosystem, fast I/O, good for APIs
- **MongoDB**: Flexible schema, good for nested data (comments)
- **JWT**: Stateless auth, works well with mobile apps

**Q2: Explain the MVC architecture.**
- **Model**: Database schemas and data operations (Mongoose models)
- **View**: Not applicable (API returns JSON), but Flutter UI acts as view
- **Controller**: Request handlers that process HTTP requests

**Q3: How does authentication work?**
- User logs in → Backend validates credentials → Generates JWT token
- Token sent to frontend → Stored securely
- Every API request includes token in header
- Backend middleware verifies token → Extracts user info

**Q4: How do you handle file uploads?**
- Use `multer` middleware in Express
- Files stored in `uploads/` directory
- File paths saved in database
- Frontend uses `image_picker` to select images

**Q5: Explain the complaint workflow.**
1. Citizen creates complaint → Status: "Pending"
2. Officer views assigned complaints
3. Officer updates status → "In Progress"
4. Officer adds comments/updates
5. When resolved → Status: "Resolved" + resolution notes
6. Citizen can view updates in real-time

**Q6: How do you ensure security?**
- Password hashing with bcrypt
- JWT tokens for authentication
- Role-based access control
- Input validation (express-validator)
- Helmet for security headers
- CORS configuration

**Q7: What are the challenges you faced?**
- State management in Flutter → Solved with Provider
- File upload handling → Used multer
- Real-time updates → Polling or WebSockets (future)
- Location accuracy → Google Maps API

**Q8: How would you scale this system?**
- Database: MongoDB sharding
- Backend: Load balancer + multiple Node.js instances
- Caching: Redis for frequently accessed data
- CDN: For static files/images
- Message queue: For async tasks

### Demo Flow for Viva

1. **Show Project Structure** (5 min)
   - Explain MVC architecture
   - Show folder structure
   - Explain separation of concerns

2. **Backend Demo** (10 min)
   - Show API endpoints (Postman/Thunder Client)
   - Demonstrate authentication
   - Show CRUD operations
   - Explain database schema

3. **Frontend Demo** (10 min)
   - Run Flutter app
   - Show registration/login
   - Create a complaint
   - Show complaint list
   - Demonstrate status updates

4. **Code Walkthrough** (10 min)
   - Explain key files
   - Show authentication flow
   - Explain service layer
   - Show state management

5. **Q&A** (5 min)

### Key Points to Emphasize

✅ **Clean Architecture**: MVC pattern, separation of concerns
✅ **Security**: JWT, password hashing, RBAC
✅ **Scalability**: Modular code, service layer
✅ **User Experience**: Real-time updates, location services
✅ **Code Quality**: Validation, error handling, comments

---

## 📝 Additional Notes

### Environment Variables
- Never commit `.env` file
- Use `.env.example` as template
- Different configs for dev/production

### Error Handling
- Centralized error handler middleware
- Consistent error response format
- User-friendly error messages

### Testing (Future Enhancement)
- Unit tests for services
- Integration tests for API
- Widget tests for Flutter

### Deployment
- Backend: Heroku, Railway, or AWS
- Frontend: Build APK/IPA or deploy to stores
- Database: MongoDB Atlas (cloud)

---

## 🎯 Conclusion

This project demonstrates:
- Full-stack development skills
- RESTful API design
- Mobile app development
- Database design
- Authentication & authorization
- Modern development practices

**Good luck with your viva! 🚀**
