# JAN SUVIDHA - Authentication Flow Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Authentication Components](#authentication-components)
3. [Registration Flow](#registration-flow)
4. [Login Flow](#login-flow)
5. [Protected Route Flow](#protected-route-flow)
6. [Password Update Flow](#password-update-flow)
7. [JWT Token Structure](#jwt-token-structure)
8. [Security Features](#security-features)

---

## 🎯 Overview

The authentication system uses **JWT (JSON Web Tokens)** for stateless authentication. Users register, login, and receive a token that they must include with every protected request.

**Key Features:**
- ✅ User registration with validation
- ✅ User login with credentials
- ✅ JWT token generation and verification
- ✅ Password hashing with bcrypt
- ✅ Role-based authorization middleware
- ✅ Protected routes

---

## 🔧 Authentication Components

### 1. User Model (`models/User.js`)

**Purpose:** Defines user data structure and password handling.

**Key Features:**
- Password field with `select: false` (hidden by default)
- Pre-save hook that automatically hashes passwords
- `comparePassword()` method to verify passwords
- Role field (Citizen, Officer, Admin)

**Code Structure:**
```javascript
// Password is hashed before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

---

### 2. Auth Controller (`controllers/authController.js`)

**Purpose:** Handles HTTP requests for authentication.

**Endpoints:**
- `register` - Create new user account
- `login` - Authenticate user and return token
- `getMe` - Get current user profile
- `updatePassword` - Change user password

---

### 3. Auth Service (`services/authService.js`)

**Purpose:** Contains authentication business logic.

**Key Methods:**
- `generateToken(id)` - Creates JWT token
- `register(userData)` - Creates user and returns token
- `login(email, password)` - Validates credentials and returns token
- `getCurrentUser(id)` - Gets user by ID
- `updatePassword(userId, currentPassword, newPassword)` - Updates password

---

### 4. Auth Middleware (`middleware/auth.js`)

**Purpose:** Protects routes and checks permissions.

**Functions:**
- `protect` - Verifies JWT token and attaches user to request
- `authorize(...roles)` - Checks if user has required role

---

### 5. Auth Routes (`routes/authRoutes.js`)

**Purpose:** Maps URLs to controller functions.

**Routes:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/updatepassword` - Update password (protected)

---

### 6. Auth Validators (`validators/authValidator.js`)

**Purpose:** Validates input data before processing.

**Validators:**
- `validateRegister` - Validates registration data
- `validateLogin` - Validates login data
- `validateUpdatePassword` - Validates password update data

---

## 📝 Registration Flow - Step by Step

### Step 1: Client Sends Request
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

---

### Step 2: Route Receives Request
**File:** `routes/authRoutes.js`
```javascript
router.post('/register', validateRegister, register);
```
- Route matches `/api/auth/register`
- Applies `validateRegister` middleware first
- Then calls `register` controller

---

### Step 3: Validation Middleware
**File:** `validators/authValidator.js`
```javascript
exports.validateRegister = [
  body('name').notEmpty().isLength({ min: 2, max: 50 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('phone').matches(/^[0-9]{10}$/),
  handleValidationErrors
];
```

**What happens:**
1. Checks if name is provided and 2-50 characters
2. Validates email format
3. Checks password is at least 6 characters
4. Validates phone is 10 digits
5. If validation fails → Returns 400 error with details
6. If validation passes → Continues to controller

---

### Step 4: Controller Processes Request
**File:** `controllers/authController.js`
```javascript
exports.register = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  const { user, token } = await authService.register({
    name, email, password, phone
  });
  res.status(201).json({ success: true, token, data: user });
};
```

**What happens:**
1. Extracts data from request body
2. Calls `authService.register()` with user data
3. Receives user object and JWT token
4. Sends response with token and user data

---

### Step 5: Service Business Logic
**File:** `services/authService.js`
```javascript
async register(userData) {
  // Check if user already exists
  const existingUser = await userService.getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await userService.createUser(userData);

  // Generate token
  const token = this.generateToken(user._id);

  return { user, token };
}
```

**What happens:**
1. Checks if email already exists in database
2. If exists → Throws error (user already registered)
3. If not exists → Creates new user
4. Generates JWT token with user ID
5. Returns user object and token

---

### Step 6: User Creation (User Service)
**File:** `services/userService.js`
```javascript
async createUser(data) {
  const user = await User.create(data);
  return await this.getUserById(user._id);
}
```

**What happens:**
1. Calls `User.create(data)` - Mongoose creates user
2. User model's pre-save hook automatically hashes password
3. User is saved to MongoDB
4. Returns user without password field

---

### Step 7: Password Hashing (User Model)
**File:** `models/User.js`
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

**What happens:**
1. Before saving, checks if password was modified
2. Generates salt (random string) with 10 rounds
3. Hashes password with bcrypt using salt
4. Stores hashed password (original password never stored)
5. Continues with save operation

**Example:**
- Input: `"password123"`
- Output: `"$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"`

---

### Step 8: JWT Token Generation
**File:** `services/authService.js`
```javascript
generateToken(id) {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
}
```

**What happens:**
1. Creates JWT token with user ID as payload
2. Signs token with secret key from environment
3. Sets expiration (default: 7 days)
4. Returns token string

**Token Structure:**
```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjEyMzQ1Njc4OTAxMjMiLCJpYXQiOjE3MDQ1Njg5MDAsImV4cCI6MTcwNzE2MDkwMH0.xyz123...
```

---

### Step 9: Response Sent to Client
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "65b1234567890123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Citizen",
    "phone": "1234567890",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**What client does:**
1. Receives token and user data
2. Stores token securely (localStorage, secure storage, etc.)
3. Uses token for future authenticated requests

---

## 🔐 Login Flow - Step by Step

### Step 1: Client Sends Request
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Step 2: Route Receives Request
**File:** `routes/authRoutes.js`
```javascript
router.post('/login', validateLogin, login);
```
- Route matches `/api/auth/login`
- Applies `validateLogin` middleware
- Then calls `login` controller

---

### Step 3: Validation Middleware
**File:** `validators/authValidator.js`
```javascript
exports.validateLogin = [
  body('email').isEmail(),
  body('password').notEmpty(),
  handleValidationErrors
];
```

**What happens:**
1. Validates email format
2. Checks password is provided
3. If invalid → Returns 400 error
4. If valid → Continues to controller

---

### Step 4: Controller Processes Request
**File:** `controllers/authController.js`
```javascript
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);
  res.status(200).json({ success: true, token, data: user });
};
```

**What happens:**
1. Extracts email and password from request
2. Calls `authService.login()` with credentials
3. Receives user and token
4. Sends response

---

### Step 5: Service Validates Credentials
**File:** `services/authService.js`
```javascript
async login(email, password) {
  // Validate input
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  // Find user by email (with password field)
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = this.generateToken(user._id);

  // Return user without password
  const userWithoutPassword = await userService.getUserById(user._id);
  return { user: userWithoutPassword, token };
}
```

**What happens:**
1. Validates email and password are provided
2. Finds user by email (includes password field)
3. If user not found → Throws "Invalid credentials" error
4. Compares provided password with stored hash
5. If password doesn't match → Throws "Invalid credentials" error
6. If password matches → Updates lastLogin timestamp
7. Generates JWT token
8. Returns user (without password) and token

---

### Step 6: Password Comparison
**File:** `models/User.js`
```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

**What happens:**
1. Takes plain text password from login
2. Takes hashed password from database
3. Uses bcrypt to compare them
4. Returns `true` if match, `false` if not

**How it works:**
- Bcrypt extracts salt from stored hash
- Hashes provided password with same salt
- Compares both hashes
- Secure even if database is compromised

---

### Step 7: Response Sent to Client
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "65b1234567890123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Citizen",
    "lastLogin": "2024-01-15T10:30:00Z"
  }
}
```

---

## 🛡️ Protected Route Flow - Step by Step

### Step 1: Client Sends Request with Token
```
GET /api/complaints
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**What client does:**
1. Retrieves stored token
2. Adds to request headers as `Authorization: Bearer <token>`

---

### Step 2: Route Applies Middleware
**File:** `routes/complaintRoutes.js`
```javascript
router.post('/', protect, createComplaint);
```

**What happens:**
- Route applies `protect` middleware before controller
- If token invalid → Request blocked
- If token valid → Request continues to controller

---

### Step 3: Protect Middleware Verifies Token
**File:** `middleware/auth.js`
```javascript
exports.protect = async (req, res, next) => {
  let token;

  // Extract token from header
  if (req.headers.authorization && 
      req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request and continue
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};
```

**What happens:**
1. **Extract Token:**
   - Checks `Authorization` header
   - Looks for "Bearer " prefix
   - Extracts token string

2. **Check Token Exists:**
   - If no token → Returns 401 Unauthorized

3. **Verify Token:**
   - Uses `jwt.verify()` to check token signature
   - Verifies token hasn't expired
   - Extracts user ID from token payload
   - If invalid/expired → Returns 401 Unauthorized

4. **Get User:**
   - Finds user in database using ID from token
   - Excludes password field
   - If user not found → Returns 401 Unauthorized

5. **Attach User:**
   - Attaches user object to `req.user`
   - Controller can now access `req.user.id`, `req.user.role`, etc.

6. **Continue:**
   - Calls `next()` to continue to controller

---

### Step 4: Controller Uses User Info
**File:** `controllers/complaintController.js`
```javascript
exports.createComplaint = async (req, res, next) => {
  // User is available from protect middleware
  req.body.submittedBy = req.user.id;
  
  const complaint = await complaintService.createComplaint(req.body);
  res.status(201).json({ success: true, data: complaint });
};
```

**What happens:**
1. Controller accesses `req.user` (set by middleware)
2. Uses `req.user.id` to set complaint owner
3. Uses `req.user.role` for authorization checks
4. Processes request normally

---

## 🔑 Role-Based Authorization Flow

### Step 1: Route Applies Authorization
**File:** `routes/complaintRoutes.js`
```javascript
router.post('/', protect, authorize('Citizen'), createComplaint);
```

**What happens:**
- First `protect` verifies user is logged in
- Then `authorize('Citizen')` checks user role
- Only Citizens can create complaints

---

### Step 2: Authorize Middleware Checks Role
**File:** `middleware/auth.js`
```javascript
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
```

**What happens:**
1. Receives allowed roles (e.g., `['Citizen']`)
2. Checks if `req.user.role` is in allowed roles
3. If not allowed → Returns 403 Forbidden
4. If allowed → Continues to controller

**Example:**
- User role: `"Citizen"`
- Allowed roles: `["Citizen"]`
- Result: ✅ Allowed

- User role: `"Officer"`
- Allowed roles: `["Citizen"]`
- Result: ❌ Forbidden (403)

---

## 🔄 Password Update Flow - Step by Step

### Step 1: Client Sends Request
```
PUT /api/auth/updatepassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

### Step 2: Validation
**File:** `validators/authValidator.js`
```javascript
exports.validateUpdatePassword = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  handleValidationErrors
];
```

---

### Step 3: Controller Processes
**File:** `controllers/authController.js`
```javascript
exports.updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  await authService.updatePassword(
    req.user.id, 
    currentPassword, 
    newPassword
  );
  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
};
```

---

### Step 4: Service Updates Password
**File:** `services/authService.js`
```javascript
async updatePassword(userId, currentPassword, newPassword) {
  // Get user with password
  const user = await userService.getUserByEmail(
    (await userService.getUserById(userId)).email
  );
  
  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  // Update password (will be hashed by pre-save hook)
  user.password = newPassword;
  await user.save();

  return true;
}
```

**What happens:**
1. Gets user from database (with password field)
2. Compares current password with stored hash
3. If doesn't match → Throws error
4. If matches → Sets new password
5. Pre-save hook automatically hashes new password
6. Saves to database

---

## 🎫 JWT Token Structure

### Token Parts

A JWT token has three parts separated by dots:

```
Header.Payload.Signature
```

### 1. Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
- Algorithm used (HS256 = HMAC SHA-256)
- Type (always JWT)

### 2. Payload
```json
{
  "id": "65b1234567890123",
  "iat": 1704568900,
  "exp": 1707172900
}
```
- `id`: User ID from database
- `iat`: Issued at (timestamp)
- `exp`: Expiration (timestamp)

### 3. Signature
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWT_SECRET
)
```
- Created using header, payload, and secret key
- Ensures token hasn't been tampered with

### Complete Token Example
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjEyMzQ1Njc4OTAxMjMiLCJpYXQiOjE3MDQ1Njg5MDAsImV4cCI6MTcwNzE2MDkwMH0.xyz123...
```

---

## 🔒 Security Features

### 1. Password Hashing
- **Technology:** bcrypt
- **Salt Rounds:** 10
- **How it works:**
  - Password never stored in plain text
  - Each password has unique salt
  - Even same passwords have different hashes
  - Computationally expensive to crack

### 2. JWT Tokens
- **Stateless:** No server-side sessions
- **Signed:** Cannot be tampered with
- **Expires:** Tokens expire after set time
- **Secure:** Uses secret key for signing

### 3. Token Storage
- **Client-side:** Stored in secure storage
- **Never in URL:** Only in headers
- **HTTPS:** Should use HTTPS in production

### 4. Role-Based Access
- **Middleware:** Checks role before allowing access
- **Flexible:** Can specify multiple roles
- **Secure:** Prevents unauthorized actions

### 5. Input Validation
- **All inputs validated:** Email, password, phone
- **Prevents injection:** Validates format
- **Error messages:** Clear validation errors

---

## 📊 Flow Diagrams

### Registration Flow
```
Client → Route → Validator → Controller → Service → User Model → Database
                                                          ↓
Client ← Response ← Controller ← Service ← User Model ← Database
```

### Login Flow
```
Client → Route → Validator → Controller → Service → User Model (compare password)
                                                          ↓
Client ← Response (with token) ← Controller ← Service ← Token Generated
```

### Protected Route Flow
```
Client (with token) → Route → Protect Middleware → Verify Token → Get User
                                                          ↓
Controller ← User Attached ← Middleware ← Database ← User Found
```

---

## 🎯 Summary

**Authentication Flow in Simple Terms:**

1. **Registration:**
   - User provides details → Validated → Password hashed → User created → Token generated → Token returned

2. **Login:**
   - User provides credentials → Validated → Password compared → Token generated → Token returned

3. **Protected Routes:**
   - Request with token → Token extracted → Token verified → User found → User attached → Request processed

4. **Role Authorization:**
   - User role checked → Compared with allowed roles → Access granted or denied

**Key Security Points:**
- ✅ Passwords never stored in plain text
- ✅ Tokens expire automatically
- ✅ Tokens cannot be tampered with
- ✅ Roles checked on every protected route
- ✅ All inputs validated

---

## 🚀 Testing Authentication

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Access Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Environment Variables Required

```env
JWT_SECRET=your-super-secret-key-here-min-32-characters
JWT_EXPIRE=7d
MONGODB_URI=mongodb://localhost:27017/jan-suvidha
```

---

**Authentication is fully implemented and ready to use!** 🎉
