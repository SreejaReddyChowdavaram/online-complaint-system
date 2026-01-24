# JAN SUVIDHA - API Routes Reference

## 🔗 Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Routes

### Register User
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

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Citizen"
  }
}
```

**Access:** Public (No authentication required)

---

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Citizen"
  }
}
```

**Access:** Public

---

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Citizen",
    "phone": "1234567890"
  }
}
```

**Access:** Private (Requires authentication)

---

### Update Password
```http
PUT /api/auth/updatepassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Access:** Private

---

## 📝 Complaint Routes

### Get All Complaints
```http
GET /api/complaints
GET /api/complaints?status=Pending
GET /api/complaints?category=Road
GET /api/complaints?status=In Progress&category=Water
```

**Query Parameters:**
- `status`: Filter by status (Pending, In Progress, Resolved, Rejected)
- `category`: Filter by category (Road, Water, Electricity, Sanitation, Other)
- `priority`: Filter by priority (Low, Medium, High, Urgent)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "...",
      "title": "Pothole on Main Street",
      "description": "Large pothole causing traffic issues",
      "category": "Road",
      "status": "Pending",
      "priority": "High",
      "location": {
        "address": "123 Main St",
        "coordinates": {
          "latitude": 40.7128,
          "longitude": -74.0060
        }
      },
      "submittedBy": {
        "id": "...",
        "name": "John Doe"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Access:** 
- Public (but filtered - Citizens see only their own)
- Officers/Admins see all

---

### Get Single Complaint
```http
GET /api/complaints/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic issues",
    "category": "Road",
    "status": "Pending",
    "priority": "High",
    "location": {
      "address": "123 Main St",
      "coordinates": {
        "latitude": 40.7128,
        "longitude": -74.0060
      }
    },
    "submittedBy": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedTo": null,
    "attachments": [],
    "comments": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Access:** Public

---

### Create Complaint
```http
POST /api/complaints
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues. Needs immediate attention.",
  "category": "Road",
  "priority": "High",
  "location": {
    "address": "123 Main Street, City, State",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "Pothole on Main Street",
    "status": "Pending",
    "submittedBy": "...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Access:** Private (Citizens only)

---

### Update Complaint
```http
PUT /api/complaints/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "assignedTo": "officer_user_id",
  "priority": "Urgent"
}
```

**Allowed Updates:**
- **Citizens**: Can update their own complaints (title, description, category)
- **Officers**: Can update status, priority, assignedTo, resolutionNotes
- **Admins**: Can update anything

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "status": "In Progress",
    "assignedTo": "...",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Access:** Private
- Owner (Citizen who created it)
- Officer (if assigned)
- Admin

---

### Delete Complaint
```http
DELETE /api/complaints/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Complaint deleted successfully"
}
```

**Access:** Private (Admin only)

---

### Add Comment to Complaint
```http
POST /api/complaints/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Work has started. Expected completion in 2 days."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "comments": [
      {
        "user": {
          "id": "...",
          "name": "Officer Smith"
        },
        "text": "Work has started. Expected completion in 2 days.",
        "createdAt": "2024-01-15T12:00:00Z"
      }
    ]
  }
}
```

**Access:** Private (Any authenticated user)

---

## 👥 User Routes

### Get Own Profile
```http
GET /api/users/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "Citizen",
    "address": {
      "street": "123 Main St",
      "city": "City",
      "state": "State",
      "zipCode": "12345"
    },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Access:** Private (Any authenticated user)

---

### Get All Users
```http
GET /api/users
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Citizen",
      "isActive": true
    }
  ]
}
```

**Access:** Private (Admin only)

---

### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Citizen"
  }
}
```

**Access:** Private (Any authenticated user)

---

### Update User
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9876543210",
  "address": {
    "street": "456 New St",
    "city": "New City",
    "state": "New State",
    "zipCode": "54321"
  }
}
```

**Allowed Updates:**
- **Users**: Can update their own profile (name, phone, address)
- **Admins**: Can update any user (including role, isActive)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Updated",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

**Access:** Private
- Owner (user updating their own profile)
- Admin

---

### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Access:** Private (Admin only)

---

## 🔒 Authentication Header Format

For all protected routes, include the JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token_here>
```

**Example:**
```http
GET /api/complaints
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjEyMzQ1Njc4OTAxMjMiLCJpYXQiOjE3MDQ1Njg5MDAsImV4cCI6MTcwNzE2MDkwMH0.xyz123...
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (no permission) |
| 404 | Not found |
| 500 | Server error |

---

## 🎯 Role-Based Access Summary

### Citizen
- ✅ Create complaints
- ✅ View own complaints
- ✅ Update own complaints
- ✅ Add comments to own complaints
- ✅ View own profile
- ✅ Update own profile

### Officer
- ✅ View all complaints
- ✅ Update complaint status (assigned to them)
- ✅ Add comments to any complaint
- ✅ View own profile
- ✅ Update own profile

### Admin
- ✅ All Citizen permissions
- ✅ All Officer permissions
- ✅ View all users
- ✅ Update any user
- ✅ Delete users
- ✅ Delete complaints
- ✅ Assign officers to complaints
- ✅ Update any complaint

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","phone":"1234567890"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Complaints (with token)
```bash
curl -X GET http://localhost:5000/api/complaints \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Complaint
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Complaint","description":"This is a test","category":"Road","location":{"address":"123 Main St"}}'
```

---

## 📝 Notes

1. **Token Expiration**: JWT tokens expire after 30 days (configurable in `.env`)
2. **Password Requirements**: Minimum 6 characters
3. **Email Validation**: Must be valid email format
4. **Complaint Status**: Automatically set to "Pending" when created
5. **Timestamps**: All models include `createdAt` and `updatedAt` automatically
