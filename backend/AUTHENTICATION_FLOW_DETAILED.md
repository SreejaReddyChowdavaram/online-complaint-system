# Authentication Flow - Step-by-Step Guide

## 🔐 Complete Authentication Implementation

This document explains the authentication system for Jan Suvidha in simple, step-by-step terms.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Components](#components)
3. [Registration Flow](#registration-flow)
4. [Login Flow](#login-flow)
5. [Protected Route Flow](#protected-route-flow)
6. [Password Update Flow](#password-update-flow)
7. [Code Walkthrough](#code-walkthrough)

---

## 🎯 Overview

**What is Authentication?**
- Authentication = Proving who you are (login/register)
- Authorization = What you're allowed to do (role-based access)

**How it works:**
1. User registers/logs in → Gets a JWT token
2. Token is like an ID card that proves identity
3. Token is sent with every protected request
4. Server verifies token before allowing access

---

## 🧩 Components

### 1. **User Model** (`models/User.js`)
- Stores user data (name, email, password, role)
- Automatically hashes passwords before saving
- Has method to compare passwords

### 2. **Auth Controller** (`controllers/authController.js`)
- Handles HTTP requests/responses
- Calls service layer for business logic

### 3. **Auth Service** (`services/authService.js`)
- Creates JWT tokens
- Handles registration logic
- Handles login logic
- Password management

### 4. **Auth Routes** (`routes/authRoutes.js`)
- Defines API endpoints
- Connects URLs to controllers

### 5. **Auth Middleware** (`middleware/auth.js`)
- `protect` - Verifies JWT token
- `authorize` - Checks user role

### 6. **Validators** (`validators/authValidator.js`)
- Validates input data

---

## 📝 Registration Flow

### Step-by-Step Process

**1. User sends registration request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

**2. Route receives request:**
```
routes/authRoutes.js
→ validateRegister middleware runs
  ✓ Checks: name is 2-50 characters
  ✓ Checks: email is valid format
  ✓ Checks: password is at least 6 characters
  ✓ Checks: phone is 10 digits
→ If validation fails → Return 400 error
→ If validation passes → Continue to controller
```

**3. Controller handles request:**
```
controllers/authController.js → register()
→ Extracts: name, email, password, phone from req.body
→ Calls: authService.register()
```

**4. Service processes registration:**
```
services/authService.js → register()
→ Step 1: Check if user already exists
  - Calls: userService.getUserByEmail(email)
  - If exists → Throw error "User already exists"
  
→ Step 2: Create new user
  - Calls: userService.createUser(userData)
  - This calls: User.create(data)
  
→ Step 3: Password gets hashed automatically
  - User model's pre-save hook runs
  - bcrypt.genSalt(10) creates salt
  - bcrypt.hash(password, salt) hashes password
  - Hashed password saved to database
  
→ Step 4: Generate JWT token
  - Calls: generateToken(user._id)
  - jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
  - Returns token string
  
→ Step 5: Return user and token
  - User object (without password)
  - JWT token
```

**5. Response sent to user:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "Citizen",
    "createdAt": "2026-01-25T10:00:00.000Z"
  }
}
```

**6. Frontend stores token:**
- Usually stored in localStorage or sessionStorage
- Token will be sent with future requests

---

## 🔑 Login Flow

### Step-by-Step Process

**1. User sends login request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**2. Route receives request:**
```
routes/authRoutes.js
→ validateLogin middleware runs
  ✓ Checks: email is valid format
  ✓ Checks: password is provided
→ If validation fails → Return 400 error
→ If validation passes → Continue to controller
```

**3. Controller handles request:**
```
controllers/authController.js → login()
→ Extracts: email, password from req.body
→ Calls: authService.login(email, password)
```

**4. Service processes login:**
```
services/authService.js → login()
→ Step 1: Validate input
  - If email or password missing → Throw error
  
→ Step 2: Find user by email
  - Calls: userService.getUserByEmail(email)
  - This includes password field (select('+password'))
  - If user not found → Throw error "Invalid credentials"
  
→ Step 3: Compare password
  - Calls: user.comparePassword(password)
  - This uses: bcrypt.compare(candidatePassword, hashedPassword)
  - If passwords don't match → Throw error "Invalid credentials"
  
→ Step 4: Update last login
  - user.lastLogin = new Date()
  - user.save()
  
→ Step 5: Generate JWT token
  - Calls: generateToken(user._id)
  - jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
  
→ Step 6: Get user without password
  - Calls: userService.getUserById(user._id)
  - This excludes password field
  
→ Step 7: Return user and token
```

**5. Response sent to user:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Citizen",
    "lastLogin": "2026-01-25T10:00:00.000Z"
  }
}
```

---

## 🛡️ Protected Route Flow

### Step-by-Step Process

**1. User sends protected request:**
```http
GET /api/complaints
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**2. Route has protect middleware:**
```javascript
router.get('/complaints', protect, getAllComplaints);
```

**3. Protect middleware runs:**
```
middleware/auth.js → protect()
→ Step 1: Extract token from header
  - Checks: req.headers.authorization
  - Looks for: "Bearer <token>"
  - Splits: authorization.split(' ')[1]
  - If no token → Return 401 "Not authorized"
  
→ Step 2: Verify token
  - Calls: jwt.verify(token, JWT_SECRET)
  - Decodes token to get: { id: "507f1f77bcf86cd799439011" }
  - If token invalid/expired → Return 401 "Not authorized"
  
→ Step 3: Find user from token
  - Calls: User.findById(decoded.id)
  - Excludes password field: .select('-password')
  - If user not found → Return 401 "User not found"
  
→ Step 4: Attach user to request
  - req.user = user object
  - Now controller can access: req.user.id, req.user.role, etc.
  
→ Step 5: Continue to next middleware/controller
  - next()
```

**4. Controller receives request:**
```
controllers/complaintController.js → getAllComplaints()
→ Can access: req.user.id, req.user.role
→ Processes request with user context
→ Returns response
```

---

## 🔒 Role-Based Authorization Flow

### Step-by-Step Process

**1. Route has authorize middleware:**
```javascript
router.post('/complaints', protect, authorize('Citizen'), createComplaint);
```

**2. Protect middleware runs first:**
- Verifies token
- Attaches user to req.user

**3. Authorize middleware runs:**
```
middleware/auth.js → authorize('Citizen')
→ Step 1: Check user role
  - Gets: req.user.role
  - Checks: Is role in allowed roles? ['Citizen']
  
→ Step 2: If role matches
  - Continue to next middleware/controller
  - next()
  
→ Step 3: If role doesn't match
  - Return 403 "User role 'Officer' is not authorized"
```

**Example:**
- User with role "Citizen" → ✅ Allowed
- User with role "Officer" → ❌ 403 Forbidden
- User with role "Admin" → ❌ 403 Forbidden

---

## 🔄 Password Update Flow

### Step-by-Step Process

**1. User sends password update request:**
```http
PUT /api/auth/updatepassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**2. Route receives request:**
```
routes/authRoutes.js
→ protect middleware runs (user must be logged in)
→ validateUpdatePassword middleware runs
  ✓ Checks: currentPassword is provided
  ✓ Checks: newPassword is at least 6 characters
→ If validation fails → Return 400 error
→ If validation passes → Continue to controller
```

**3. Controller handles request:**
```
controllers/authController.js → updatePassword()
→ Extracts: currentPassword, newPassword from req.body
→ Gets: userId from req.user.id (from protect middleware)
→ Calls: authService.updatePassword(userId, currentPassword, newPassword)
```

**4. Service processes password update:**
```
services/authService.js → updatePassword()
→ Step 1: Get user
  - Calls: userService.getUserById(userId)
  
→ Step 2: Get user with password field
  - Calls: userService.getUserByEmail(user.email)
  - This includes password: select('+password')
  
→ Step 3: Verify current password
  - Calls: userWithPassword.comparePassword(currentPassword)
  - Uses: bcrypt.compare()
  - If doesn't match → Throw error "Current password is incorrect"
  
→ Step 4: Update password
  - userWithPassword.password = newPassword
  - userWithPassword.save()
  - Pre-save hook automatically hashes new password
  - bcrypt.genSalt(10) → bcrypt.hash(newPassword, salt)
  
→ Step 5: Return success
```

**5. Response sent to user:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## 💻 Code Walkthrough

### 1. User Model - Password Hashing

```javascript
// models/User.js

// Before saving user, hash the password
userSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) {
    return next();
  }
  
  // Generate salt (random string for extra security)
  const salt = await bcrypt.genSalt(10);
  
  // Hash password with salt
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Compare plain password with hashed password
  return await bcrypt.compare(candidatePassword, this.password);
};
```

**What happens:**
- User creates account with password: "mypassword123"
- Before saving, password becomes: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
- Original password is never stored
- During login, bcrypt.compare() checks if passwords match

---

### 2. Auth Service - Token Generation

```javascript
// services/authService.js

generateToken(id) {
  // Create JWT token with user ID
  return jwt.sign(
    { id },                    // Payload (data in token)
    process.env.JWT_SECRET,    // Secret key (from .env)
    { expiresIn: '7d' }        // Token expires in 7 days
  );
}
```

**What's in the token:**
```javascript
// Token contains:
{
  id: "507f1f77bcf86cd799439011",  // User ID
  iat: 1706179200,                  // Issued at (timestamp)
  exp: 1706784000                   // Expires at (timestamp)
}
```

**Token structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  ← Header (algorithm)
eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSJ9.  ← Payload (user ID)
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature (verification)
```

---

### 3. Protect Middleware - Token Verification

```javascript
// middleware/auth.js

exports.protect = async (req, res, next) => {
  let token;
  
  // Step 1: Get token from header
  if (req.headers.authorization && 
      req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // Step 2: Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
  
  try {
    // Step 3: Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: "507f1f77bcf86cd799439011", iat: ..., exp: ... }
    
    // Step 4: Get user from database
    req.user = await User.findById(decoded.id).select('-password');
    
    // Step 5: Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Step 6: Continue to next middleware/controller
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};
```

---

### 4. Authorize Middleware - Role Checking

```javascript
// middleware/auth.js

exports.authorize = (...roles) => {
  // Returns a middleware function
  return (req, res, next) => {
    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    // Role matches, continue
    next();
  };
};
```

**Usage:**
```javascript
// Only Citizens can access
router.post('/complaints', protect, authorize('Citizen'), createComplaint);

// Only Admin can access
router.delete('/complaints/:id', protect, authorize('Admin'), deleteComplaint);

// Admin or Officer can access
router.put('/complaints/:id/status', protect, authorize('Admin', 'Officer'), updateStatus);
```

---

## 🔐 Security Features

### 1. Password Hashing
- **Never store plain passwords**
- Uses bcrypt with salt rounds = 10
- Even if database is compromised, passwords are safe

### 2. JWT Tokens
- **Stateless authentication** (no server-side session storage)
- Token expires after 7 days
- Secret key stored in environment variables

### 3. Token Verification
- Every protected route verifies token
- Invalid/expired tokens are rejected
- User must be active in database

### 4. Role-Based Access
- Different permissions for different roles
- Prevents unauthorized actions

### 5. Input Validation
- All inputs are validated before processing
- Prevents invalid data from entering system

---

## 📊 Complete Flow Diagram

```
┌─────────────┐
│   Client    │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. POST /api/auth/register
       │    { name, email, password, phone }
       ▼
┌─────────────────┐
│  authRoutes.js   │
│  validateRegister│
└──────┬──────────┘
       │
       │ 2. authController.register()
       ▼
┌─────────────────┐
│  authService.js  │
│  register()      │
└──────┬──────────┘
       │
       │ 3. userService.createUser()
       ▼
┌─────────────────┐
│   User Model     │
│  pre-save hook   │
│  bcrypt.hash()   │
└──────┬──────────┘
       │
       │ 4. Save to MongoDB
       │    (password is hashed)
       ▼
┌─────────────────┐
│  authService.js  │
│  generateToken() │
│  jwt.sign()      │
└──────┬──────────┘
       │
       │ 5. Return { user, token }
       ▼
┌─────────────────┐
│  authController │
│  res.json()      │
└──────┬──────────┘
       │
       │ 6. Response with token
       ▼
┌─────────────┐
│   Client    │
│ Stores token│
└─────────────┘
```

---

## 🎯 Key Points to Remember

1. **Password Hashing:**
   - Happens automatically in User model
   - Uses bcrypt with salt
   - Never store plain passwords

2. **JWT Tokens:**
   - Created on login/register
   - Contains user ID
   - Expires after 7 days
   - Must be sent with protected requests

3. **Protect Middleware:**
   - Verifies token on every protected route
   - Attaches user to req.user
   - Must run before authorize middleware

4. **Authorize Middleware:**
   - Checks user role
   - Must run after protect middleware
   - Returns 403 if role doesn't match

5. **Validation:**
   - Always validate input before processing
   - Prevents invalid data
   - Returns clear error messages

---

## 🧪 Testing Authentication

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/complaints \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ✅ Summary

**Authentication Flow:**
1. User registers → Password hashed → Token generated → Token returned
2. User logs in → Password verified → Token generated → Token returned
3. User makes request → Token verified → User attached → Request processed
4. Role checked → If authorized → Request continues → If not → 403 error

**Security:**
- Passwords are hashed with bcrypt
- JWT tokens for stateless authentication
- Token verification on every protected route
- Role-based authorization
- Input validation

**Components:**
- User Model: Password hashing
- Auth Service: Token generation, login/register logic
- Auth Controller: Request handling
- Auth Middleware: Token verification, role checking
- Validators: Input validation

This authentication system is secure, scalable, and follows best practices! 🔐
