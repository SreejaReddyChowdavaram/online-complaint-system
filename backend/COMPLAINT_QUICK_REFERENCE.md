# Complaint Workflow - Quick Reference

## 🚀 Quick Start

### Create Complaint (Citizen)
```http
POST /api/complaints
Authorization: Bearer <citizen-token>
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
  "imageUrl": "https://example.com/image.jpg",
  "priority": "High"
}
```

### Update Status (Officer/Admin)
```http
PUT /api/complaints/:id/status
Authorization: Bearer <officer-token>
Content-Type: application/json

{
  "status": "In Progress",
  "notes": "Started investigation"
}
```

---

## 📋 Complaint Schema

```javascript
{
  complaintId: String,           // Auto-generated: COMP-YYYYMMDD-XXXXX
  title: String,                 // Required, max 200 chars
  description: String,            // Required, min 10 chars
  category: String,              // Required: 'Road', 'Water', 'Electricity', 'Sanitation', 'Other'
  department: String,            // Auto-assigned based on category
  location: {
    address: String,             // Required
    coordinates: {
      latitude: Number,          // Required, -90 to 90
      longitude: Number           // Required, -180 to 180
    }
  },
  imageUrl: String,              // Optional, must be valid URL
  status: String,                 // 'Pending', 'In Progress', 'Resolved', 'Rejected'
  priority: String,               // 'Low', 'Medium', 'High', 'Urgent'
  submittedBy: ObjectId,         // User (Citizen)
  assignedTo: ObjectId,           // User (Officer)
  statusHistory: Array,           // Tracks all status changes
  comments: Array,                // Two-way communication
  resolvedAt: Date,               // Set when resolved
  resolutionNotes: String         // Notes when resolved
}
```

---

## 🔗 API Endpoints

### Public
```
GET /api/complaints/complaint-id/:complaintId
→ Get complaint by complaint ID (no auth required)
```

### Citizen Only
```
POST /api/complaints
→ Create new complaint
```

### All Authenticated
```
GET /api/complaints
→ Get all complaints (filtered by role)
GET /api/complaints/:id
→ Get single complaint
POST /api/complaints/:id/comments
→ Add comment
PUT /api/complaints/:id
→ Update complaint (owner/officer/admin)
```

### Officer/Admin
```
PUT /api/complaints/:id/status
→ Update complaint status
```

### Admin Only
```
PUT /api/complaints/:id/assign
→ Assign officer to complaint
DELETE /api/complaints/:id
→ Delete complaint
```

---

## 📝 Request Examples

### 1. Create Complaint
```http
POST /api/complaints
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Water Leak in Park",
  "description": "Continuous water leak from broken pipe near playground",
  "category": "Water",
  "location": {
    "address": "Central Park, Main Avenue",
    "coordinates": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  },
  "imageUrl": "https://example.com/leak.jpg",
  "priority": "Urgent"
}
```

### 2. Get All Complaints (with filters)
```http
GET /api/complaints?status=Pending&category=Road&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status
- `category` - Filter by category
- `department` - Filter by department
- `submittedBy` - Filter by submitter
- `assignedTo` - Filter by assigned officer
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### 3. Get Single Complaint
```http
GET /api/complaints/507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

### 4. Update Status
```http
PUT /api/complaints/507f1f77bcf86cd799439011/status
Authorization: Bearer <officer-token>
Content-Type: application/json

{
  "status": "Resolved",
  "notes": "Pipe repaired and leak fixed. Water supply restored."
}
```

**Valid Statuses:**
- `Pending`
- `In Progress`
- `Resolved`
- `Rejected`

### 5. Add Comment
```http
POST /api/complaints/507f1f77bcf86cd799439011/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Thank you for the quick response!"
}
```

### 6. Assign Officer (Admin)
```http
PUT /api/complaints/507f1f77bcf86cd799439011/assign
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "officerId": "507f1f77bcf86cd799439012"
}
```

### 7. Update Complaint
```http
PUT /api/complaints/507f1f77bcf86cd799439011
Authorization: Bearer <token>
Content-Type: application/json

{
  "priority": "Urgent",
  "description": "Updated description with more details"
}
```

**Note:** Cannot update `complaintId`, `submittedBy`, or `status` (use status endpoint)

### 8. Get Complaint by Complaint ID (Public)
```http
GET /api/complaints/complaint-id/COMP-20260125-12345
```

**No authentication required** - For public tracking

---

## 📊 Response Examples

### Create Complaint Response
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "complaintId": "COMP-20260125-12345",
    "title": "Pothole on Main Street",
    "status": "Pending",
    "category": "Road",
    "department": "Public Works",
    "assignedTo": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Officer Smith",
      "email": "officer@example.com"
    },
    "createdAt": "2026-01-25T10:00:00.000Z"
  }
}
```

### Status Update Response
```json
{
  "success": true,
  "message": "Complaint status updated to In Progress",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "In Progress",
    "statusHistory": [
      {
        "status": "Pending",
        "changedBy": {...},
        "changedAt": "2026-01-25T10:00:00.000Z",
        "notes": "Complaint submitted"
      },
      {
        "status": "In Progress",
        "changedBy": {...},
        "changedAt": "2026-01-25T11:30:00.000Z",
        "notes": "Started investigation"
      }
    ]
  }
}
```

---

## 🔄 Category to Department Mapping

| Category | Department |
|----------|------------|
| Road | Public Works |
| Water | Water Supply |
| Electricity | Electricity Board |
| Sanitation | Sanitation Department |
| Other | General |

**Auto-assigned** based on category (pre-save hook)

---

## 📋 Status Flow

```
Pending → In Progress → Resolved
   ↓
Rejected (can happen anytime)
```

### Status Meanings
- **Pending** - Just created, waiting for officer
- **In Progress** - Officer working on it
- **Resolved** - Problem fixed
- **Rejected** - Invalid/duplicate

---

## 🔔 Notification Types

| Type | When | Sent To |
|------|------|---------|
| `complaint_submitted` | Complaint created | Citizen |
| `complaint_assigned` | Officer assigned | Officer |
| `status_update` | Status changes | Both |
| `complaint_resolved` | Status = Resolved | Citizen |
| `officer_assigned` | Officer assigned | Citizen |
| `comment_added` | Comment added | Other party |

---

## 👥 Authorization Matrix

| Action | Citizen | Officer | Admin |
|--------|---------|---------|-------|
| Create | ✅ | ❌ | ❌ |
| View Own | ✅ | ✅ | ✅ |
| View All | ❌ | ✅ (assigned) | ✅ |
| Update Status | ❌ | ✅ (assigned) | ✅ |
| Assign Officer | ❌ | ❌ | ✅ |
| Add Comment | ✅ | ✅ | ✅ |
| Delete | ❌ | ❌ | ✅ |

---

## 🎯 Complaint ID Format

```
COMP-YYYYMMDD-XXXXX

Example: COMP-20260125-12345
         │    │       │
         │    │       └── Random (10000-99999)
         │    └────────── Date (YYYYMMDD)
         └─────────────── Prefix
```

**Auto-generated** on complaint creation

---

## 🔧 Common Tasks

### Filter Complaints by Status
```http
GET /api/complaints?status=In Progress
```

### Filter by Category
```http
GET /api/complaints?category=Road
```

### Filter by Department
```http
GET /api/complaints?department=Public Works
```

### Get Citizen's Complaints
```http
GET /api/complaints?submittedBy=507f191e810c19729de860ea
```

### Get Officer's Assigned Complaints
```http
GET /api/complaints?assignedTo=507f1f77bcf86cd799439012
```

### Pagination
```http
GET /api/complaints?page=2&limit=20
```

---

## 🐛 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Title is required",
      "param": "title"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'Citizen' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Complaint not found"
}
```

---

## ✅ Validation Rules

### Title
- Required
- Max 200 characters
- Trimmed

### Description
- Required
- Min 10 characters
- Trimmed

### Category
- Required
- Must be: 'Road', 'Water', 'Electricity', 'Sanitation', 'Other'

### Location
- Address: Required, trimmed
- Latitude: Required, -90 to 90
- Longitude: Required, -180 to 180

### Image URL
- Optional
- Must be valid URL if provided

### Priority
- Optional
- Must be: 'Low', 'Medium', 'High', 'Urgent'

### Status
- Must be: 'Pending', 'In Progress', 'Resolved', 'Rejected'

---

## 📚 File Locations

**Complaint Model:**
- `models/Complaint.js`

**Complaint Controller:**
- `controllers/complaintController.js`

**Complaint Service:**
- `services/complaintService.js`

**Complaint Routes:**
- `routes/complaintRoutes.js`

**Complaint Validator:**
- `validators/complaintValidator.js`

---

## 💡 Pro Tips

1. **Complaint ID is auto-generated** - Don't send it in request
2. **Department is auto-assigned** - Based on category
3. **Status history is automatic** - Every status change is tracked
4. **Notifications are automatic** - Sent on status changes
5. **Use complaint ID for public tracking** - No auth required
6. **Filter by role** - Citizens see own, Officers see assigned, Admins see all

---

## 🆘 Need Help?

1. Check `COMPLAINT_WORKFLOW_GUIDE.md` for detailed workflow
2. Check `COMPLAINT_LIFECYCLE_VISUAL.md` for visual diagrams
3. Check server logs for error messages
4. Verify authentication token is valid
5. Check user role has required permissions

---

## 🎯 Quick Checklist

**Creating Complaint:**
- [ ] Valid authentication token
- [ ] User role is "Citizen"
- [ ] All required fields provided
- [ ] Valid category selected
- [ ] Valid location coordinates
- [ ] Image URL is valid (if provided)

**Updating Status:**
- [ ] Valid authentication token
- [ ] User role is "Officer" or "Admin"
- [ ] Officer is assigned (if Officer role)
- [ ] Valid status provided
- [ ] Notes provided (optional but recommended)

**Adding Comment:**
- [ ] Valid authentication token
- [ ] Comment text provided
- [ ] Comment length valid (1-500 chars)

---

This quick reference covers all complaint workflow operations! 🚀
