# JAN SUVIDHA - Complaint Workflow Quick Reference

## 🎯 Quick Overview

Complete complaint workflow from submission to resolution with auto-routing, status tracking, and notifications.

---

## 📋 Complaint Lifecycle

```
Pending → In Progress → Resolved
   ↓
Rejected
```

**Statuses:**
- **Pending** - Complaint submitted, waiting
- **In Progress** - Officer working on it
- **Resolved** - Problem fixed
- **Rejected** - Invalid/duplicate

---

## 🛣️ API Endpoints

### Create Complaint
```
POST /api/complaints
Auth: Citizen only
Body: { title, description, category, location, imageUrl, priority }
```

### Get Complaint by ID
```
GET /api/complaints/:id
Auth: Public
```

### Get Complaint by Complaint ID (Tracking)
```
GET /api/complaints/complaint-id/:complaintId
Auth: Public
```

### Update Status
```
PUT /api/complaints/:id/status
Auth: Officer, Admin
Body: { status, notes }
```

### Assign Officer
```
PUT /api/complaints/:id/assign
Auth: Admin only
Body: { officerId }
```

### Add Comment
```
POST /api/complaints/:id/comments
Auth: Any authenticated user
Body: { text }
```

---

## 📝 Sample Request: Create Complaint

```json
POST /api/complaints
{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "Road",
  "location": {
    "address": "123 Main Street, City, State",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "imageUrl": "https://example.com/image.jpg",
  "priority": "High"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "complaintId": "COMP-20240115-12345",
    "title": "Pothole on Main Street",
    "status": "Pending",
    "department": "Public Works",
    "assignedTo": { "name": "Officer Smith" },
    "statusHistory": [...]
  }
}
```

---

## 📝 Sample Request: Update Status

```json
PUT /api/complaints/:id/status
{
  "status": "In Progress",
  "notes": "Work crew dispatched"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Complaint status updated to In Progress",
  "data": {
    "status": "In Progress",
    "statusHistory": [...]
  }
}
```

---

## 🔀 Auto-Routing

**Category → Department:**
- Road → Public Works
- Water → Water Supply
- Electricity → Electricity Board
- Sanitation → Sanitation Department
- Other → General

**Officer Assignment:**
- Automatic on complaint creation
- Finds available officer
- Can be manually assigned by Admin

---

## 🔔 Notifications

**Triggered on:**
- Complaint submitted → Citizen notified
- Complaint assigned → Officer notified
- Status changed → Citizen & Officer notified
- Complaint resolved → Citizen notified (special message)

---

## 📊 Complaint ID Format

**Format:** `COMP-YYYYMMDD-XXXXX`

**Example:** `COMP-20240115-12345`

- Auto-generated
- Unique identifier
- Used for public tracking

---

## ✅ Workflow Checklist

- [ ] Citizen submits complaint
- [ ] Complaint ID generated
- [ ] Department auto-assigned
- [ ] Officer auto-assigned (if available)
- [ ] Status set to "Pending"
- [ ] Notifications sent
- [ ] Officer updates status
- [ ] Status history updated
- [ ] Notifications triggered
- [ ] Complaint resolved

---

## 🎯 Key Features

✅ Auto-generated complaint ID  
✅ Auto-routing to department  
✅ Automatic officer assignment  
✅ Status tracking with history  
✅ Notifications on all events  
✅ Public tracking by complaint ID  
✅ Complete audit trail  

---

**For detailed documentation, see `COMPLAINT_WORKFLOW.md`**
