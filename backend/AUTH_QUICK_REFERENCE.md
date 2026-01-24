# JAN SUVIDHA - Authentication Quick Reference

## 🎯 Quick Overview

**Authentication System:** JWT-based stateless authentication with password hashing and role-based authorization.

---

## 📁 Files Involved

| File | Purpose |
|------|---------|
| `models/User.js` | User schema with password hashing |
| `controllers/authController.js` | Handles auth HTTP requests |
| `services/authService.js` | Auth business logic & token generation |
| `middleware/auth.js` | Token verification & role checking |
| `routes/authRoutes.js` | Auth route definitions |
| `validators/authValidator.js` | Input validation rules |

---

## 🔐 Authentication Endpoints

### 1. Register User
```
POST /api/auth/register
Body: { name, email, password, phone }
Response: { success, token, data: user }
```

### 2. Login User
```
POST /api/auth/login
Body: { email, password }
Response: { success, token, data: user }
```

### 3. Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { success, data: user }
```

### 4. Update Password
```
PUT /api/auth/updatepassword
Headers: Authorization: Bearer <token>
Body: { currentPassword, newPassword }
Response: { success, message }
```

---

## 🔄 Authentication Flow Summary

### Registration
1. Client sends registration data
2. Validator checks data format
3. Service checks if email exists
4. User model hashes password automatically
5. User saved to database
6. JWT token generated
7. Token and user returned to client

### Login
1. Client sends email and password
2. Validator checks data format
3. Service finds user by email
4. Password compared with hash
5. If match → Token generated
6. Token and user returned to client

### Protected Route Access
1. Client sends request with token in header
2. `protect` middleware extracts token
3. Token verified (signature & expiration)
4. User found in database
5. User attached to `req.user`
6. Request continues to controller

### Role Authorization
1. `authorize('Role')` middleware checks `req.user.role`
2. If role matches → Access granted
3. If role doesn't match → 403 Forbidden

---

## 🛡️ Security Features

### Password Hashing
- **Library:** bcrypt
- **Rounds:** 10
- **Automatic:** Done in User model pre-save hook
- **Comparison:** `user.comparePassword(plainPassword)`

### JWT Tokens
- **Payload:** User ID
- **Expiration:** Configurable (default: 7 days)
- **Secret:** From `JWT_SECRET` environment variable
- **Verification:** `jwt.verify(token, secret)`

### Role-Based Access
- **Roles:** Citizen, Officer, Admin
- **Middleware:** `authorize('Citizen', 'Officer')`
- **Default Role:** Citizen

---

## 📝 Code Examples

### Using Protect Middleware
```javascript
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
// Only logged-in users can access
```

### Using Role Authorization
```javascript
const { protect, authorize } = require('../middleware/auth');

router.delete('/users/:id', protect, authorize('Admin'), deleteUser);
// Only Admins can delete users
```

### Accessing User in Controller
```javascript
exports.createComplaint = async (req, res) => {
  // User is available from protect middleware
  const userId = req.user.id;
  const userRole = req.user.role;
  
  // Use user info
  req.body.submittedBy = userId;
};
```

### Generating Token
```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRE || '7d' }
);
```

### Verifying Token
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const userId = decoded.id;
```

---

## 🔑 Environment Variables

```env
JWT_SECRET=your-secret-key-minimum-32-characters-long
JWT_EXPIRE=7d
MONGODB_URI=mongodb://localhost:27017/jan-suvidha
```

---

## ✅ Testing Checklist

- [ ] Register new user
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Access protected route without token (should fail)
- [ ] Access protected route with valid token (should work)
- [ ] Access admin route as Citizen (should fail)
- [ ] Update password with correct current password
- [ ] Update password with wrong current password (should fail)

---

## 🚨 Common Issues

### "Not authorized to access this route"
- **Cause:** Missing or invalid token
- **Solution:** Include `Authorization: Bearer <token>` header

### "User role 'Citizen' is not authorized"
- **Cause:** User doesn't have required role
- **Solution:** Check route requires correct role

### "Invalid credentials"
- **Cause:** Wrong email or password
- **Solution:** Verify credentials are correct

### "User already exists with this email"
- **Cause:** Email already registered
- **Solution:** Use different email or login instead

---

## 📊 Request/Response Examples

### Register Request
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

### Register Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "65b1234567890123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Citizen",
    "phone": "1234567890"
  }
}
```

### Login Request
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Login Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "65b1234567890123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Citizen"
  }
}
```

### Protected Route Request
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Protected Route Response
```json
{
  "success": true,
  "data": {
    "id": "65b1234567890123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Citizen"
  }
}
```

---

## 🎯 Key Points

1. **Password Hashing:** Automatic in User model pre-save hook
2. **Token Generation:** Done in authService.generateToken()
3. **Token Verification:** Done in protect middleware
4. **Role Checking:** Done in authorize middleware
5. **User Access:** Available as `req.user` after protect middleware

---

**For detailed flow, see `AUTHENTICATION_FLOW.md`**
