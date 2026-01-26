# Authentication Visual Guide

## 🔐 Quick Visual Reference

---

## 📊 Registration Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ POST /api/auth/register
     │ { name, email, password, phone }
     ▼
┌─────────────────────┐
│  validateRegister    │ ← Validates input
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  authController     │ ← Handles request
│  .register()        │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  authService        │ ← Business logic
│  .register()        │
│  1. Check if exists │
│  2. Create user     │
│  3. Generate token  │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  User Model         │
│  pre-save hook      │ ← Auto-hashes password
│  bcrypt.hash()      │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  MongoDB            │ ← Save user
│  (password hashed)   │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Response           │
│  { token, user }    │
└────┬────────────────┘
     │
     ▼
┌──────────┐
│  Client  │ ← Store token
└──────────┘
```

---

## 🔑 Login Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ POST /api/auth/login
     │ { email, password }
     ▼
┌─────────────────────┐
│  validateLogin      │ ← Validates input
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  authController     │
│  .login()           │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  authService        │
│  .login()           │
│  1. Find user       │
│  2. Compare password│ ← bcrypt.compare()
│  3. Update lastLogin│
│  4. Generate token  │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Response           │
│  { token, user }      │
└────┬────────────────┘
     │
     ▼
┌──────────┐
│  Client  │ ← Store token
└──────────┘
```

---

## 🛡️ Protected Route Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ GET /api/complaints
     │ Authorization: Bearer <token>
     ▼
┌─────────────────────┐
│  protect middleware │
│  1. Extract token   │
│  2. Verify token    │ ← jwt.verify()
│  3. Find user       │
│  4. Attach to req   │ ← req.user = user
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  authorize('Citizen')│ ← Check role
│  (if needed)        │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Controller         │
│  Can use req.user   │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Response           │
└────┬────────────────┘
     │
     ▼
┌──────────┐
│  Client  │
└──────────┘
```

---

## 🔄 Password Update Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ PUT /api/auth/updatepassword
     │ Authorization: Bearer <token>
     │ { currentPassword, newPassword }
     ▼
┌─────────────────────┐
│  protect middleware │ ← Verify token
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  validateUpdatePass │ ← Validate input
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  authController     │
│  .updatePassword()  │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  authService        │
│  .updatePassword()  │
│  1. Get user        │
│  2. Verify current  │ ← bcrypt.compare()
│  3. Update password │
│  4. Auto-hash       │ ← pre-save hook
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Response           │
│  { success: true }  │
└────┬────────────────┘
     │
     ▼
┌──────────┐
│  Client  │
└──────────┘
```

---

## 🎯 Component Interaction

```
┌──────────────┐
│   Routes     │ ← Define endpoints
└──────┬───────┘
       │
       ├──→ Validators ← Check input
       │
       ├──→ Controllers ← Handle requests
       │       │
       │       └──→ Services ← Business logic
       │               │
       │               └──→ Models ← Database
       │
       └──→ Middleware ← Security
               │
               ├──→ protect ← Verify token
               │
               └──→ authorize ← Check role
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────┐
│  Layer 1: Input Validation      │
│  - Email format                 │
│  - Password strength            │
│  - Required fields              │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Layer 2: Password Hashing      │
│  - bcrypt with salt             │
│  - Never store plain text       │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Layer 3: JWT Token              │
│  - Signed with secret            │
│  - Expires after 7 days          │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Layer 4: Token Verification     │
│  - Verify on every request       │
│  - Check user exists             │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Layer 5: Role Authorization     │
│  - Check user role              │
│  - Restrict access              │
└─────────────────────────────────┘
```

---

## 📝 Request/Response Examples

### Registration Request
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

### Registration Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Citizen",
    "createdAt": "2026-01-25T10:00:00.000Z"
  }
}
```

### Login Request
```http
POST /api/auth/login
Content-Type: application/json

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
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Citizen",
    "lastLogin": "2026-01-25T10:00:00.000Z"
  }
}
```

### Protected Request
```http
GET /api/complaints
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎨 Token Structure

```
JWT Token = Header.Payload.Signature

┌─────────────────────────────────────┐
│  Header                              │
│  {                                   │
│    "alg": "HS256",                   │
│    "typ": "JWT"                      │
│  }                                   │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Payload                             │
│  {                                   │
│    "id": "507f1f77bcf86cd799439011", │
│    "iat": 1706179200,                │
│    "exp": 1706784000                 │
│  }                                   │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Signature                           │
│  HMACSHA256(                         │
│    base64UrlEncode(header) + "." +   │
│    base64UrlEncode(payload),         │
│    JWT_SECRET                        │
│  )                                   │
└─────────────────────────────────────┘
```

---

## 🔑 Key Concepts

### Password Hashing
```
Plain Password: "mypassword123"
         │
         ▼
   bcrypt.genSalt(10)
         │
         ▼
   bcrypt.hash(password, salt)
         │
         ▼
Hashed Password: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
```

### Token Verification
```
Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
         │
         ▼
   jwt.verify(token, JWT_SECRET)
         │
         ▼
   { id: "507f1f77bcf86cd799439011" }
         │
         ▼
   User.findById(id)
         │
         ▼
   req.user = user object
```

### Role Authorization
```
User Role: "Citizen"
         │
         ▼
   authorize('Citizen', 'Admin')
         │
         ▼
   Check: Is "Citizen" in ['Citizen', 'Admin']?
         │
         ├─→ Yes → Allow access
         │
         └─→ No → Return 403 Forbidden
```

---

## ✅ Quick Checklist

**Registration:**
- [ ] Input validated
- [ ] Email checked for duplicates
- [ ] Password hashed
- [ ] User saved to database
- [ ] Token generated
- [ ] Token returned to client

**Login:**
- [ ] Input validated
- [ ] User found by email
- [ ] Password compared (bcrypt)
- [ ] Last login updated
- [ ] Token generated
- [ ] Token returned to client

**Protected Route:**
- [ ] Token extracted from header
- [ ] Token verified (JWT)
- [ ] User found from token
- [ ] User attached to request
- [ ] Role checked (if needed)
- [ ] Request processed

---

## 🚀 Ready to Use!

All authentication components are implemented and working. Use the visual guides above to understand the flow, and refer to the detailed documentation for implementation details.

**Main Files:**
- `AUTHENTICATION_FLOW_DETAILED.md` - Complete step-by-step explanation
- `AUTH_IMPLEMENTATION_CHECKLIST.md` - Implementation status
- `AUTH_VISUAL_GUIDE.md` - This file (visual reference)
