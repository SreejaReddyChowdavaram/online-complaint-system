# Backend Quick Reference Card

## 🚀 Start the Server

```bash
npm install          # Install dependencies
npm run dev         # Start in development mode (with nodemon)
npm start           # Start in production mode
```

**Server runs on:** `http://localhost:5000`

---

## 🔐 Authentication

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

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": { ...user }
}
```

### Use Token in Requests
```http
GET /api/complaints
Authorization: Bearer <your-token-here>
```

---

## 👥 Roles & Permissions

| Role | Can Do |
|------|--------|
| **Citizen** | Create complaints, View own complaints, Add comments |
| **Officer** | View all complaints, Update assigned complaints status, Add comments |
| **Admin** | Everything + Assign officers, Delete complaints, View all data |

---

## 📋 Complaint Status Flow

```
Pending → In Progress → Resolved
   ↓
Rejected (can happen anytime)
```

### Status Meanings:
- **Pending** - Just created, waiting for assignment
- **In Progress** - Officer is working on it
- **Resolved** - Problem fixed
- **Rejected** - Invalid/duplicate complaint

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/register          # Create account
POST   /api/auth/login             # Get token
GET    /api/auth/me                # Get current user (protected)
PUT    /api/auth/updatepassword    # Change password (protected)
```

### Complaints
```
GET    /api/complaints                          # List all (filtered by role)
GET    /api/complaints/:id                      # Get by MongoDB ID
GET    /api/complaints/complaint-id/:complaintId # Get by complaint ID (public)
POST   /api/complaints                          # Create (Citizen only)
PUT    /api/complaints/:id                      # Update (owner/officer/admin)
DELETE /api/complaints/:id                      # Delete (Admin only)
POST   /api/complaints/:id/comments             # Add comment (protected)
PUT    /api/complaints/:id/status               # Update status (Officer/Admin)
PUT    /api/complaints/:id/assign               # Assign officer (Admin only)
```

---

## 📝 Common Code Patterns

### Protect a Route
```javascript
const { protect } = require('../middleware/auth');

router.get('/example', protect, controllerFunction);
```

### Restrict by Role
```javascript
const { protect, authorize } = require('../middleware/auth');

// Only Admin
router.delete('/example', protect, authorize('Admin'), controllerFunction);

// Admin or Officer
router.put('/example', protect, authorize('Admin', 'Officer'), controllerFunction);
```

### Get Current User
```javascript
// In controller (after protect middleware)
const userId = req.user.id;
const userRole = req.user.role;
const userName = req.user.name;
```

### Update Complaint Status
```javascript
// In service
complaint.status = 'In Progress';
complaint.statusHistory.push({
  status: 'In Progress',
  changedBy: userId,
  changedAt: new Date(),
  notes: 'Started investigation'
});
await complaint.save();
```

---

## 🗄️ Database Models

### User Model Fields
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: 'Citizen' | 'Officer' | 'Admin',
  address: { street, city, state, zipCode },
  isActive: Boolean,
  lastLogin: Date
}
```

### Complaint Model Fields
```javascript
{
  complaintId: String (auto-generated: COMP-YYYYMMDD-XXXXX),
  title: String,
  description: String,
  category: 'Road' | 'Water' | 'Electricity' | 'Sanitation' | 'Other',
  department: String (auto-assigned),
  location: { address, coordinates: { latitude, longitude } },
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected',
  priority: 'Low' | 'Medium' | 'High' | 'Urgent',
  submittedBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  attachments: Array,
  comments: Array,
  statusHistory: Array,
  resolvedAt: Date,
  resolutionNotes: String
}
```

---

## 🔧 Environment Variables

Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jan-suvidha
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

---

## 🛠️ Common Tasks

### Add New Route
1. Create controller function in `controllers/`
2. Create route in `routes/`
3. Add middleware if needed (protect, authorize)
4. Add validation in `validators/`

### Add New Model
1. Create schema in `models/`
2. Define fields and validation
3. Add indexes if needed
4. Export model

### Add New Service
1. Create service file in `services/`
2. Add business logic
3. Import and use in controller

---

## 🐛 Error Handling

### Common Errors

**401 Unauthorized**
- Missing or invalid token
- Solution: Login again to get new token

**403 Forbidden**
- User doesn't have required role
- Solution: Check user role

**404 Not Found**
- Resource doesn't exist
- Solution: Check ID/route

**400 Bad Request**
- Invalid input data
- Solution: Check validation rules

**500 Server Error**
- Internal server error
- Solution: Check server logs

---

## 📊 Request/Response Examples

### Create Complaint (Citizen)
```http
POST /api/complaints
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "Road",
  "location": {
    "address": "123 Main St, City",
    "coordinates": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  },
  "priority": "High"
}

Response:
{
  "success": true,
  "data": {
    "complaintId": "COMP-20260125-12345",
    "title": "Pothole on Main Street",
    "status": "Pending",
    ...
  }
}
```

### Update Status (Officer/Admin)
```http
PUT /api/complaints/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "notes": "Started investigation"
}

Response:
{
  "success": true,
  "message": "Complaint status updated to In Progress",
  "data": { ...complaint }
}
```

### Assign Officer (Admin)
```http
PUT /api/complaints/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "officerId": "507f1f77bcf86cd799439011"
}

Response:
{
  "success": true,
  "message": "Officer assigned successfully",
  "data": { ...complaint }
}
```

---

## 🎯 Testing Checklist

- [ ] Server starts without errors
- [ ] Database connects successfully
- [ ] Can register new user
- [ ] Can login and get token
- [ ] Token works for protected routes
- [ ] Role-based access works correctly
- [ ] Can create complaint (Citizen)
- [ ] Can update status (Officer/Admin)
- [ ] Can assign officer (Admin)
- [ ] Status history is tracked
- [ ] Validation works for invalid input
- [ ] Error handling works correctly

---

## 📚 File Locations

**Authentication:**
- Model: `models/User.js`
- Controller: `controllers/authController.js`
- Service: `services/authService.js`
- Routes: `routes/authRoutes.js`
- Middleware: `middleware/auth.js`
- Validator: `validators/authValidator.js`

**Complaints:**
- Model: `models/Complaint.js`
- Controller: `controllers/complaintController.js`
- Service: `services/complaintService.js`
- Routes: `routes/complaintRoutes.js`
- Validator: `validators/complaintValidator.js`

---

## 💡 Pro Tips

1. **Always use middleware in order:**
   ```javascript
   router.post('/', protect, authorize('Citizen'), validateComplaint, createComplaint);
   // Order: protect → authorize → validate → controller
   ```

2. **Check user role in controller:**
   ```javascript
   if (req.user.role === 'Admin') {
     // Admin only code
   }
   ```

3. **Use services for complex logic:**
   - Keep controllers thin
   - Put business logic in services

4. **Validate input:**
   - Always validate user input
   - Use validators before processing

5. **Handle errors:**
   - Use try-catch in controllers
   - Let errorHandler middleware catch errors

---

## 🆘 Need Help?

1. Check `ARCHITECTURE_SIMPLE_GUIDE.md` for detailed explanations
2. Check `FOLDER_STRUCTURE.md` for file organization
3. Check `BACKEND_ARCHITECTURE.md` for technical details
4. Check server logs for error messages
5. Verify environment variables are set correctly
