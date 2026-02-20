# Complaint Workflow - Complete Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Complaint Lifecycle](#complaint-lifecycle)
3. [Workflow Steps](#workflow-steps)
4. [API Endpoints](#api-endpoints)
5. [Sample Requests & Responses](#sample-requests--responses)
6. [Code Walkthrough](#code-walkthrough)

---

## 🎯 Overview

**Complaint Workflow** is the complete process from when a citizen submits a complaint until it's resolved. The system automatically handles:
- Complaint ID generation
- Department routing
- Officer assignment
- Status tracking
- Notifications

---

## 🔄 Complaint Lifecycle

### Status Flow Diagram

```
┌─────────┐
│ Pending │ ← Complaint just created
└────┬────┘
     │
     │ Officer assigned
     ▼
┌──────────────┐
│ In Progress  │ ← Officer is working on it
└────┬─────────┘
     │
     ├──→ ┌──────────┐
     │    │ Resolved │ ← Problem fixed
     │    └──────────┘
     │
     └──→ ┌──────────┐
          │ Rejected │ ← Invalid/duplicate
          └──────────┘
```

### Status Meanings

1. **Pending** (Default)
   - Complaint just submitted
   - Waiting for officer assignment
   - No action taken yet

2. **In Progress**
   - Officer assigned
   - Work has started
   - Investigation/repair ongoing

3. **Resolved**
   - Problem fixed
   - Work completed
   - Citizen notified

4. **Rejected**
   - Invalid complaint
   - Duplicate
   - Out of scope

---

## 📝 Workflow Steps

### Step 1: Citizen Submits Complaint

**What happens:**
1. Citizen fills form with:
   - Title
   - Description
   - Category (Road, Water, Electricity, Sanitation, Other)
   - Location (address + GPS coordinates)
   - Image URL (optional)
   - Priority (optional)

2. Request sent to backend

3. Backend processes:
   - Validates input
   - Generates unique complaint ID (COMP-YYYYMMDD-XXXXX)
   - Auto-assigns department based on category
   - Creates complaint with status "Pending"
   - Auto-routes to available officer
   - Adds initial status to history
   - Sends notifications

**Auto-Routing Logic:**
```
Category → Department Mapping:
- Road → Public Works
- Water → Water Supply
- Electricity → Electricity Board
- Sanitation → Sanitation Department
- Other → General
```

---

### Step 2: Auto-Route to Department

**What happens:**
1. System checks complaint category
2. Maps category to department (pre-save hook)
3. Finds available officer in that department
4. Assigns officer to complaint
5. Updates complaint.assignedTo field
6. Sends notification to officer
7. Sends notification to citizen

**Auto-Routing Code:**
```javascript
// In Complaint model (pre-save hook)
categoryToDepartment = {
  'Road': 'Public Works',
  'Water': 'Water Supply',
  'Electricity': 'Electricity Board',
  'Sanitation': 'Sanitation Department',
  'Other': 'General'
}
```

---

### Step 3: Officer Updates Status

**What happens:**
1. Officer views assigned complaints
2. Updates status to "In Progress" when starting work
3. System:
   - Updates complaint status
   - Adds entry to statusHistory
   - Sends notification to citizen
4. Officer continues working

**Status Update Flow:**
```
Officer → PUT /api/complaints/:id/status
→ Validates status
→ Checks authorization (must be assigned officer or admin)
→ Updates status
→ Adds to statusHistory
→ Triggers notifications
```

---

### Step 4: Status Change Triggers Notification

**What happens:**
1. Status changes (Pending → In Progress → Resolved)
2. System automatically:
   - Adds entry to statusHistory
   - Sends notification to citizen
   - Sends notification to assigned officer (if different)
   - Special notification for "Resolved" status

**Notification Types:**
- `complaint_submitted` - Citizen notified when complaint created
- `complaint_assigned` - Officer notified when assigned
- `status_update` - Both notified when status changes
- `complaint_resolved` - Special notification when resolved
- `comment_added` - Notified when someone comments

---

## 🔗 API Endpoints

### Public Endpoints
```
GET /api/complaints/complaint-id/:complaintId
→ Get complaint by complaint ID (for tracking)
```

### Protected Endpoints

**Citizen Only:**
```
POST /api/complaints
→ Create new complaint
```

**All Authenticated Users:**
```
GET /api/complaints
→ Get all complaints (filtered by role)
GET /api/complaints/:id
→ Get single complaint
POST /api/complaints/:id/comments
→ Add comment to complaint
PUT /api/complaints/:id
→ Update complaint (owner/officer/admin)
```

**Officer/Admin:**
```
PUT /api/complaints/:id/status
→ Update complaint status
```

**Admin Only:**
```
PUT /api/complaints/:id/assign
→ Assign officer to complaint
DELETE /api/complaints/:id
→ Delete complaint
```

---

## 📊 Sample Requests & Responses

### 1. Create Complaint (Citizen)

**Request:**
```http
POST /api/complaints
Authorization: Bearer <citizen-token>
Content-Type: application/json

{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues and vehicle damage. Located near the intersection with Oak Avenue.",
  "category": "Road",
  "location": {
    "address": "123 Main Street, City, State 12345",
    "coordinates": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  },
  "imageUrl": "https://example.com/images/pothole.jpg",
  "priority": "High"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "complaintId": "COMP-20260125-12345",
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic issues and vehicle damage. Located near the intersection with Oak Avenue.",
    "category": "Road",
    "department": "Public Works",
    "location": {
      "address": "123 Main Street, City, State 12345",
      "coordinates": {
        "latitude": 28.6139,
        "longitude": 77.2090
      }
    },
    "imageUrl": "https://example.com/images/pothole.jpg",
    "status": "Pending",
    "priority": "High",
    "submittedBy": {
      "_id": "507f191e810c19729de860ea",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedTo": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Officer Smith",
      "email": "officer@example.com"
    },
    "statusHistory": [
      {
        "status": "Pending",
        "changedBy": "507f191e810c19729de860ea",
        "changedAt": "2026-01-25T10:00:00.000Z",
        "notes": "Complaint submitted"
      }
    ],
    "comments": [],
    "attachments": [],
    "createdAt": "2026-01-25T10:00:00.000Z",
    "updatedAt": "2026-01-25T10:00:00.000Z"
  }
}
```

**What happened:**
- ✅ Complaint ID auto-generated: `COMP-20260125-12345`
- ✅ Department auto-assigned: `Public Works` (based on category "Road")
- ✅ Officer auto-assigned (if available)
- ✅ Status set to "Pending"
- ✅ Initial status added to history
- ✅ Notifications sent to citizen and officer

---

### 2. Get All Complaints

**Request (Citizen - sees own complaints):**
```http
GET /api/complaints?status=Pending
Authorization: Bearer <citizen-token>
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "complaintId": "COMP-20260125-12345",
      "title": "Pothole on Main Street",
      "status": "Pending",
      "category": "Road",
      "createdAt": "2026-01-25T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "complaintId": "COMP-20260124-67890",
      "title": "Water Leak in Park",
      "status": "In Progress",
      "category": "Water",
      "createdAt": "2026-01-24T14:30:00.000Z"
    }
  ]
}
```

**Request (Officer - sees assigned complaints):**
```http
GET /api/complaints?assignedTo=507f1f77bcf86cd799439012&status=In Progress
Authorization: Bearer <officer-token>
```

**Request (Admin - sees all complaints):**
```http
GET /api/complaints?department=Public Works&page=1&limit=10
Authorization: Bearer <admin-token>
```

---

### 3. Get Single Complaint

**Request:**
```http
GET /api/complaints/507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "complaintId": "COMP-20260125-12345",
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic issues...",
    "category": "Road",
    "department": "Public Works",
    "location": {
      "address": "123 Main Street, City, State 12345",
      "coordinates": {
        "latitude": 28.6139,
        "longitude": 77.2090
      }
    },
    "imageUrl": "https://example.com/images/pothole.jpg",
    "status": "In Progress",
    "priority": "High",
    "submittedBy": {
      "_id": "507f191e810c19729de860ea",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    },
    "assignedTo": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Officer Smith",
      "email": "officer@example.com",
      "phone": "9876543210"
    },
    "statusHistory": [
      {
        "status": "Pending",
        "changedBy": {
          "_id": "507f191e810c19729de860ea",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "changedAt": "2026-01-25T10:00:00.000Z",
        "notes": "Complaint submitted"
      },
      {
        "status": "In Progress",
        "changedBy": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Officer Smith",
          "email": "officer@example.com"
        },
        "changedAt": "2026-01-25T11:30:00.000Z",
        "notes": "Started investigation"
      }
    ],
    "comments": [
      {
        "user": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Officer Smith",
          "email": "officer@example.com"
        },
        "text": "Inspected the site. Will begin repairs tomorrow.",
        "createdAt": "2026-01-25T11:35:00.000Z"
      }
    ],
    "attachments": [],
    "createdAt": "2026-01-25T10:00:00.000Z",
    "updatedAt": "2026-01-25T11:30:00.000Z"
  }
}
```

---

### 4. Update Status (Officer/Admin)

**Request:**
```http
PUT /api/complaints/507f1f77bcf86cd799439011/status
Authorization: Bearer <officer-token>
Content-Type: application/json

{
  "status": "In Progress",
  "notes": "Started investigation. Found the issue and will begin repairs tomorrow."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Complaint status updated to In Progress",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "complaintId": "COMP-20260125-12345",
    "status": "In Progress",
    "statusHistory": [
      {
        "status": "Pending",
        "changedBy": "...",
        "changedAt": "2026-01-25T10:00:00.000Z",
        "notes": "Complaint submitted"
      },
      {
        "status": "In Progress",
        "changedBy": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Officer Smith",
          "email": "officer@example.com"
        },
        "changedAt": "2026-01-25T11:30:00.000Z",
        "notes": "Started investigation. Found the issue and will begin repairs tomorrow."
      }
    ],
    ...
  }
}
```

**What happened:**
- ✅ Status updated to "In Progress"
- ✅ Entry added to statusHistory
- ✅ Notification sent to citizen
- ✅ Notification sent to assigned officer (if different)

---

### 5. Resolve Complaint

**Request:**
```http
PUT /api/complaints/507f1f77bcf86cd799439011/status
Authorization: Bearer <officer-token>
Content-Type: application/json

{
  "status": "Resolved",
  "notes": "Pothole has been filled and road surface repaired. Work completed successfully."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Complaint status updated to Resolved",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "complaintId": "COMP-20260125-12345",
    "status": "Resolved",
    "resolvedAt": "2026-01-26T15:00:00.000Z",
    "resolutionNotes": "Pothole has been filled and road surface repaired. Work completed successfully.",
    "statusHistory": [
      {
        "status": "Pending",
        "changedBy": "...",
        "changedAt": "2026-01-25T10:00:00.000Z",
        "notes": "Complaint submitted"
      },
      {
        "status": "In Progress",
        "changedBy": "...",
        "changedAt": "2026-01-25T11:30:00.000Z",
        "notes": "Started investigation"
      },
      {
        "status": "Resolved",
        "changedBy": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Officer Smith",
          "email": "officer@example.com"
        },
        "changedAt": "2026-01-26T15:00:00.000Z",
        "notes": "Pothole has been filled and road surface repaired. Work completed successfully."
      }
    ],
    ...
  }
}
```

**What happened:**
- ✅ Status updated to "Resolved"
- ✅ resolvedAt timestamp set
- ✅ resolutionNotes saved
- ✅ Entry added to statusHistory
- ✅ Special "complaint_resolved" notification sent to citizen

---

### 6. Add Comment

**Request:**
```http
POST /api/complaints/507f1f77bcf86cd799439011/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Thank you for the quick response! The repair looks great."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "comments": [
      {
        "user": {
          "_id": "507f191e810c19729de860ea",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "text": "Thank you for the quick response! The repair looks great.",
        "createdAt": "2026-01-26T16:00:00.000Z"
      }
    ],
    ...
  }
}
```

**What happened:**
- ✅ Comment added to complaint
- ✅ Notification sent to officer (if citizen commented)
- ✅ Notification sent to citizen (if officer commented)

---

### 7. Assign Officer (Admin)

**Request:**
```http
PUT /api/complaints/507f1f77bcf86cd799439011/assign
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "officerId": "507f1f77bcf86cd799439012"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Officer assigned successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "assignedTo": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Officer Smith",
      "email": "officer@example.com"
    },
    "statusHistory": [
      {
        "status": "Pending",
        "changedBy": "...",
        "changedAt": "2026-01-25T10:00:00.000Z",
        "notes": "Complaint submitted"
      },
      {
        "status": "Pending",
        "changedBy": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Officer Smith",
          "email": "officer@example.com"
        },
        "changedAt": "2026-01-25T10:05:00.000Z",
        "notes": "Complaint assigned to officer: Officer Smith"
      }
    ],
    ...
  }
}
```

**What happened:**
- ✅ Officer assigned to complaint
- ✅ Entry added to statusHistory
- ✅ Notification sent to officer
- ✅ Notification sent to citizen

---

### 8. Get Complaint by Complaint ID (Public Tracking)

**Request:**
```http
GET /api/complaints/complaint-id/COMP-20260125-12345
```

**Response:**
```json
{
  "success": true,
  "data": {
    "complaintId": "COMP-20260125-12345",
    "title": "Pothole on Main Street",
    "status": "Resolved",
    "category": "Road",
    "department": "Public Works",
    "createdAt": "2026-01-25T10:00:00.000Z",
    "resolvedAt": "2026-01-26T15:00:00.000Z",
    ...
  }
}
```

**Note:** This endpoint is public (no authentication required) for complaint tracking.

---

## 💻 Code Walkthrough

### 1. Complaint Schema

```javascript
// models/Complaint.js

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
    required: true
  },
  title: String,
  description: String,
  category: {
    type: String,
    enum: ['Road', 'Water', 'Electricity', 'Sanitation', 'Other']
  },
  department: {
    type: String,
    enum: ['Public Works', 'Water Supply', 'Electricity Board', 'Sanitation Department', 'General'],
    default: 'General'
  },
  location: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  imageUrl: String,
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: Date,
    notes: String
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: Date
  }]
});
```

**Key Features:**
- Auto-generates complaint ID
- Auto-assigns department
- Tracks status history
- Stores comments
- Links to users (submittedBy, assignedTo)

---

### 2. Auto-Generate Complaint ID

```javascript
// models/Complaint.js

complaintSchema.pre('save', async function(next) {
  if (!this.complaintId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(10000 + Math.random() * 90000);
    this.complaintId = `COMP-${dateStr}-${random}`;
  }
  next();
});
```

**Example:**
- Date: 2026-01-25
- Random: 12345
- Result: `COMP-20260125-12345`

---

### 3. Auto-Route to Department

```javascript
// models/Complaint.js

complaintSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('category')) {
    const categoryToDepartment = {
      'Road': 'Public Works',
      'Water': 'Water Supply',
      'Electricity': 'Electricity Board',
      'Sanitation': 'Sanitation Department',
      'Other': 'General'
    };
    this.department = categoryToDepartment[this.category] || 'General';
  }
  next();
});
```

**What happens:**
- When category is set/changed
- System automatically assigns department
- No manual intervention needed

---

### 4. Create Complaint Service

```javascript
// services/complaintService.js

async createComplaint(data) {
  // Create complaint (complaintId and department auto-assigned)
  const complaint = await Complaint.create(data);
  
  // Auto-route to department (assign officer)
  const assignedOfficer = await this.autoRouteToDepartment(complaint);
  
  if (assignedOfficer) {
    complaint.assignedTo = assignedOfficer._id;
    await complaint.save();
  }

  // Add initial status to history
  complaint.statusHistory.push({
    status: 'Pending',
    changedBy: complaint.submittedBy,
    notes: 'Complaint submitted'
  });
  await complaint.save();

  // Send notifications
  if (assignedOfficer) {
    await notificationService.sendNotification({
      userId: assignedOfficer._id,
      type: 'complaint_assigned',
      title: 'New Complaint Assigned',
      message: `You have been assigned a new ${complaint.category} complaint: ${complaint.title}`,
      complaintId: complaint._id
    });
  }

  await notificationService.sendNotification({
    userId: complaint.submittedBy,
    type: 'complaint_submitted',
    title: 'Complaint Submitted',
    message: `Your complaint "${complaint.title}" has been submitted successfully. Complaint ID: ${complaint.complaintId}`,
    complaintId: complaint._id
  });

  return await this.getComplaintById(complaint._id);
}
```

**What happens:**
1. Creates complaint (triggers pre-save hooks)
2. Auto-routes to department
3. Assigns officer (if available)
4. Adds status history
5. Sends notifications

---

### 5. Update Status Service

```javascript
// services/complaintService.js

async updateStatus(id, status, changedBy, notes = null) {
  const complaint = await Complaint.findById(id);
  const oldStatus = complaint.status;
  
  complaint.status = status;

  // Add to status history
  complaint.statusHistory.push({
    status: status,
    changedBy: changedBy,
    notes: notes || `Status changed from ${oldStatus} to ${status}`
  });

  // Handle resolved status
  if (status === 'Resolved') {
    complaint.resolvedAt = new Date();
    if (notes) {
      complaint.resolutionNotes = notes;
    }
  }

  await complaint.save();

  // Trigger notifications
  await this.triggerStatusNotifications(complaint, oldStatus, status, changedBy);

  return await this.getComplaintById(complaint._id);
}
```

**What happens:**
1. Updates status
2. Adds to status history
3. Sets resolvedAt if resolved
4. Triggers notifications

---

### 6. Notification Trigger

```javascript
// services/complaintService.js

async triggerStatusNotifications(complaint, oldStatus, newStatus, changedBy) {
  // Notify citizen
  await notificationService.sendNotification({
    userId: complaint.submittedBy,
    type: 'status_update',
    title: 'Complaint Status Updated',
    message: `Your complaint "${complaint.title}" status has been changed from ${oldStatus} to ${newStatus}.`,
    complaintId: complaint._id
  });

  // Notify assigned officer (if different)
  if (complaint.assignedTo && complaint.assignedTo.toString() !== changedBy.toString()) {
    await notificationService.sendNotification({
      userId: complaint.assignedTo,
      type: 'status_update',
      title: 'Complaint Status Updated',
      message: `Complaint "${complaint.title}" status has been changed to ${newStatus}.`,
      complaintId: complaint._id
    });
  }

  // Special notification for resolved
  if (newStatus === 'Resolved') {
    await notificationService.sendNotification({
      userId: complaint.submittedBy,
      type: 'complaint_resolved',
      title: 'Complaint Resolved',
      message: `Great news! Your complaint "${complaint.title}" has been resolved.`,
      complaintId: complaint._id
    });
  }
}
```

**What happens:**
1. Citizen always notified
2. Officer notified (if different from who changed it)
3. Special notification when resolved

---

## 🎯 Complete Workflow Summary

### Citizen Perspective:
1. Submit complaint → Get complaint ID
2. Receive notification: Complaint submitted
3. Receive notification: Officer assigned
4. Receive notification: Status updated
5. Receive notification: Complaint resolved

### Officer Perspective:
1. Receive notification: Complaint assigned
2. View assigned complaints
3. Update status to "In Progress"
4. Add comments/updates
5. Update status to "Resolved"
6. Receive notifications on status changes

### Admin Perspective:
1. View all complaints
2. Assign officers manually
3. Update any complaint status
4. Delete complaints
5. Monitor system

---

## ✅ Key Features

1. **Auto-Generated Complaint ID**
   - Format: COMP-YYYYMMDD-XXXXX
   - Unique identifier for tracking

2. **Auto-Route to Department**
   - Based on category
   - Automatic assignment

3. **Auto-Assign Officer**
   - Finds available officer
   - Assigns automatically

4. **Status Tracking**
   - Complete history
   - Timestamps
   - Notes for each change

5. **Notifications**
   - Automatic on status change
   - Sent to relevant parties
   - Different types for different events

6. **Comments**
   - Two-way communication
   - Notifications on new comments

---

## 🔐 Authorization

**Who can do what:**

| Action | Citizen | Officer | Admin |
|--------|---------|---------|-------|
| Create Complaint | ✅ | ❌ | ❌ |
| View Own Complaints | ✅ | ✅ | ✅ |
| View All Complaints | ❌ | ✅ (assigned) | ✅ |
| Update Status | ❌ | ✅ (assigned) | ✅ |
| Assign Officer | ❌ | ❌ | ✅ |
| Add Comment | ✅ | ✅ | ✅ |
| Delete Complaint | ❌ | ❌ | ✅ |

---

## 📝 Summary

**Complaint Workflow:**
1. Citizen submits → Auto-generate ID → Auto-route department → Auto-assign officer → Notifications
2. Officer updates status → Add to history → Trigger notifications
3. Status changes → Notifications sent → History tracked
4. Resolved → Special notification → Resolution notes saved

**Automation:**
- Complaint ID generation
- Department routing
- Officer assignment
- Status history tracking
- Notification triggering

This workflow is complete, automated, and user-friendly! 🎉
