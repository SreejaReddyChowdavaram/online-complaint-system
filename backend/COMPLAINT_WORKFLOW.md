# JAN SUVIDHA - Complaint Workflow Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Complaint Lifecycle](#complaint-lifecycle)
3. [Workflow Steps](#workflow-steps)
4. [API Endpoints](#api-endpoints)
5. [Sample Requests & Responses](#sample-requests--responses)
6. [Auto-Routing Logic](#auto-routing-logic)
7. [Notification System](#notification-system)

---

## 🎯 Overview

The complaint workflow system handles the complete lifecycle of a complaint from submission to resolution. It includes automatic routing to departments, officer assignment, status tracking, and notifications.

**Key Features:**
- ✅ Citizen submits complaint with category, description, image URL, and geo-location
- ✅ Backend generates unique complaint ID automatically
- ✅ Auto-routing to appropriate department based on category
- ✅ Officer assignment (automatic or manual)
- ✅ Status updates with history tracking
- ✅ Notifications triggered on status changes
- ✅ Complete audit trail with status history

---

## 🔄 Complaint Lifecycle

### Lifecycle Stages

```
┌─────────────┐
│   PENDING   │  ← Complaint submitted, waiting for assignment
└──────┬──────┘
       │
       │ Officer assigned
       │ Status changed
       ▼
┌─────────────────┐
│  IN PROGRESS    │  ← Officer working on complaint
└──────┬──────────┘
       │
       │ Problem fixed
       │ Status changed
       ▼
┌─────────────┐
│  RESOLVED   │  ← Complaint closed, issue fixed
└─────────────┘

       OR

┌─────────────┐
│   PENDING   │
└──────┬──────┘
       │
       │ Invalid/duplicate
       │ Status changed
       ▼
┌─────────────┐
│  REJECTED   │  ← Complaint rejected, won't be fixed
└─────────────┘
```

### Status Transitions

| From Status | To Status | Who Can Change | Notes |
|-------------|-----------|---------------|-------|
| Pending | In Progress | Officer, Admin | When work starts |
| Pending | Rejected | Officer, Admin | If invalid/duplicate |
| In Progress | Resolved | Officer, Admin | When problem fixed |
| In Progress | Rejected | Officer, Admin | If cannot be fixed |
| Resolved | - | - | Final state |
| Rejected | - | - | Final state |

---

## 📝 Workflow Steps

### Step 1: Citizen Submits Complaint

**Who:** Citizen  
**Action:** Submits complaint with details

**Required Data:**
- Title
- Description
- Category (Road, Water, Electricity, Sanitation, Other)
- Location (address + GPS coordinates)
- Image URL (optional)

**What Happens:**
1. Citizen fills form and submits
2. Validation checks all required fields
3. Complaint created in database
4. **Complaint ID auto-generated** (format: COMP-YYYYMMDD-XXXXX)
5. **Department auto-assigned** based on category
6. **Officer auto-assigned** (if available)
7. Status set to "Pending"
8. Initial status added to history
9. **Notifications sent:**
   - To citizen: "Complaint submitted successfully"
   - To assigned officer: "New complaint assigned"

---

### Step 2: Backend Processing

**What Happens Automatically:**

1. **Complaint ID Generation**
   - Format: `COMP-YYYYMMDD-XXXXX`
   - Example: `COMP-20240115-12345`
   - Unique identifier for tracking

2. **Department Auto-Routing**
   - Category → Department mapping:
     - Road → Public Works
     - Water → Water Supply
     - Electricity → Electricity Board
     - Sanitation → Sanitation Department
     - Other → General

3. **Officer Assignment**
   - System finds available officer
   - Assigns to complaint
   - If no officer available, complaint remains unassigned

4. **Status History**
   - Initial entry: "Pending - Complaint submitted"
   - Tracks all status changes

---

### Step 3: Officer Updates Status

**Who:** Assigned Officer or Admin  
**Action:** Updates complaint status

**Status Options:**
- **In Progress** - Work has started
- **Resolved** - Problem fixed
- **Rejected** - Invalid/duplicate complaint

**What Happens:**
1. Officer updates status
2. Status history updated
3. If "Resolved":
   - `resolvedAt` timestamp set
   - Resolution notes can be added
4. **Notifications triggered:**
   - To citizen: "Status updated to [new status]"
   - Special notification if resolved: "Complaint resolved!"

---

### Step 4: Status Triggers Notification

**Notification Types:**

1. **complaint_submitted**
   - Sent to: Citizen
   - When: Complaint created
   - Message: "Your complaint has been submitted. ID: COMP-..."

2. **complaint_assigned**
   - Sent to: Officer
   - When: Complaint assigned to officer
   - Message: "You have been assigned a new complaint"

3. **status_update**
   - Sent to: Citizen, Officer
   - When: Status changes
   - Message: "Complaint status updated to [status]"

4. **complaint_resolved**
   - Sent to: Citizen
   - When: Status = Resolved
   - Message: "Your complaint has been resolved!"

5. **officer_assigned**
   - Sent to: Citizen
   - When: Officer manually assigned
   - Message: "An officer has been assigned to your complaint"

---

## 🛣️ API Endpoints

### 1. Create Complaint
```
POST /api/complaints
Authorization: Bearer <token>
Content-Type: application/json
```

**Access:** Citizen only

---

### 2. Get All Complaints
```
GET /api/complaints
GET /api/complaints?status=Pending
GET /api/complaints?category=Road
GET /api/complaints?department=Public Works
```

**Access:** Public (filtered by role)

---

### 3. Get Complaint by ID
```
GET /api/complaints/:id
```

**Access:** Public

---

### 4. Get Complaint by Complaint ID
```
GET /api/complaints/complaint-id/:complaintId
```

**Access:** Public (for tracking)

---

### 5. Update Complaint
```
PUT /api/complaints/:id
Authorization: Bearer <token>
```

**Access:** Owner, Assigned Officer, Admin

---

### 6. Update Status
```
PUT /api/complaints/:id/status
Authorization: Bearer <token>
Content-Type: application/json
```

**Access:** Assigned Officer, Admin

---

### 7. Assign Officer
```
PUT /api/complaints/:id/assign
Authorization: Bearer <token>
Content-Type: application/json
```

**Access:** Admin only

---

### 8. Add Comment
```
POST /api/complaints/:id/comments
Authorization: Bearer <token>
Content-Type: application/json
```

**Access:** Any authenticated user

---

### 9. Delete Complaint
```
DELETE /api/complaints/:id
Authorization: Bearer <token>
```

**Access:** Admin only

---

## 📨 Sample Requests & Responses

### 1. Create Complaint (Citizen)

**Request:**
```http
POST /api/complaints
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues. Located near the intersection of Main Street and Oak Avenue. Needs immediate attention.",
  "category": "Road",
  "location": {
    "address": "123 Main Street, City, State 12345",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "imageUrl": "https://example.com/images/pothole.jpg",
  "priority": "High"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65b1234567890123",
    "complaintId": "COMP-20240115-12345",
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic issues...",
    "category": "Road",
    "department": "Public Works",
    "status": "Pending",
    "priority": "High",
    "location": {
      "address": "123 Main Street, City, State 12345",
      "coordinates": {
        "latitude": 40.7128,
        "longitude": -74.0060
      }
    },
    "imageUrl": "https://example.com/images/pothole.jpg",
    "submittedBy": {
      "_id": "65b1111111111111",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedTo": {
      "_id": "65b2222222222222",
      "name": "Officer Smith",
      "email": "officer@example.com"
    },
    "statusHistory": [
      {
        "status": "Pending",
        "changedBy": "65b1111111111111",
        "changedAt": "2024-01-15T10:30:00Z",
        "notes": "Complaint submitted"
      }
    ],
    "comments": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. Update Status (Officer)

**Request:**
```http
PUT /api/complaints/65b1234567890123/status
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "In Progress",
  "notes": "Work crew dispatched. Expected completion in 2 days."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Complaint status updated to In Progress",
  "data": {
    "_id": "65b1234567890123",
    "complaintId": "COMP-20240115-12345",
    "status": "In Progress",
    "statusHistory": [
      {
        "status": "Pending",
        "changedBy": {
          "_id": "65b1111111111111",
          "name": "John Doe"
        },
        "changedAt": "2024-01-15T10:30:00Z",
        "notes": "Complaint submitted"
      },
      {
        "status": "In Progress",
        "changedBy": {
          "_id": "65b2222222222222",
          "name": "Officer Smith"
        },
        "changedAt": "2024-01-15T11:00:00Z",
        "notes": "Status changed from Pending to In Progress"
      }
    ],
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

---

### 3. Resolve Complaint (Officer)

**Request:**
```http
PUT /api/complaints/65b1234567890123/status
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "Resolved",
  "notes": "Pothole filled and road resurfaced. Issue resolved completely."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Complaint status updated to Resolved",
  "data": {
    "_id": "65b1234567890123",
    "complaintId": "COMP-20240115-12345",
    "status": "Resolved",
    "resolvedAt": "2024-01-17T14:30:00Z",
    "resolutionNotes": "Pothole filled and road resurfaced. Issue resolved completely.",
    "statusHistory": [
      {
        "status": "Pending",
        "changedBy": {
          "_id": "65b1111111111111",
          "name": "John Doe"
        },
        "changedAt": "2024-01-15T10:30:00Z",
        "notes": "Complaint submitted"
      },
      {
        "status": "In Progress",
        "changedBy": {
          "_id": "65b2222222222222",
          "name": "Officer Smith"
        },
        "changedAt": "2024-01-15T11:00:00Z",
        "notes": "Status changed from Pending to In Progress"
      },
      {
        "status": "Resolved",
        "changedBy": {
          "_id": "65b2222222222222",
          "name": "Officer Smith"
        },
        "changedAt": "2024-01-17T14:30:00Z",
        "notes": "Pothole filled and road resurfaced. Issue resolved completely."
      }
    ],
    "updatedAt": "2024-01-17T14:30:00Z"
  }
}
```

---

### 4. Assign Officer (Admin)

**Request:**
```http
PUT /api/complaints/65b1234567890123/assign
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "officerId": "65b2222222222222"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Officer assigned successfully",
  "data": {
    "_id": "65b1234567890123",
    "complaintId": "COMP-20240115-12345",
    "assignedTo": {
      "_id": "65b2222222222222",
      "name": "Officer Smith",
      "email": "officer@example.com"
    },
    "statusHistory": [
      {
        "status": "Pending",
        "changedBy": {
          "_id": "65b1111111111111",
          "name": "John Doe"
        },
        "changedAt": "2024-01-15T10:30:00Z",
        "notes": "Complaint submitted"
      },
      {
        "status": "Pending",
        "changedBy": {
          "_id": "65b2222222222222",
          "name": "Officer Smith"
        },
        "changedAt": "2024-01-15T10:35:00Z",
        "notes": "Complaint assigned to officer: Officer Smith"
      }
    ],
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

---

### 5. Get Complaint by Complaint ID (Public Tracking)

**Request:**
```http
GET /api/complaints/complaint-id/COMP-20240115-12345
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65b1234567890123",
    "complaintId": "COMP-20240115-12345",
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic issues...",
    "category": "Road",
    "department": "Public Works",
    "status": "In Progress",
    "priority": "High",
    "location": {
      "address": "123 Main Street, City, State 12345",
      "coordinates": {
        "latitude": 40.7128,
        "longitude": -74.0060
      }
    },
    "imageUrl": "https://example.com/images/pothole.jpg",
    "submittedBy": {
      "_id": "65b1111111111111",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedTo": {
      "_id": "65b2222222222222",
      "name": "Officer Smith",
      "email": "officer@example.com"
    },
    "statusHistory": [
      {
        "status": "Pending",
        "changedBy": {
          "_id": "65b1111111111111",
          "name": "John Doe"
        },
        "changedAt": "2024-01-15T10:30:00Z",
        "notes": "Complaint submitted"
      },
      {
        "status": "In Progress",
        "changedBy": {
          "_id": "65b2222222222222",
          "name": "Officer Smith"
        },
        "changedAt": "2024-01-15T11:00:00Z",
        "notes": "Status changed from Pending to In Progress"
      }
    ],
    "comments": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

---

### 6. Add Comment

**Request:**
```http
POST /api/complaints/65b1234567890123/comments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "text": "Work crew has arrived at the location. Starting repairs now."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65b1234567890123",
    "complaintId": "COMP-20240115-12345",
    "comments": [
      {
        "_id": "65b3333333333333",
        "user": {
          "_id": "65b2222222222222",
          "name": "Officer Smith",
          "email": "officer@example.com"
        },
        "text": "Work crew has arrived at the location. Starting repairs now.",
        "createdAt": "2024-01-15T12:00:00Z"
      }
    ]
  }
}
```

---

## 🔀 Auto-Routing Logic

### Category to Department Mapping

| Category | Department |
|----------|------------|
| Road | Public Works |
| Water | Water Supply |
| Electricity | Electricity Board |
| Sanitation | Sanitation Department |
| Other | General |

### Officer Assignment Logic

1. **Automatic Assignment (on creation):**
   - System finds available officer (role = 'Officer', isActive = true)
   - Assigns to complaint
   - If no officer available, complaint remains unassigned

2. **Manual Assignment (by Admin):**
   - Admin can assign specific officer
   - Useful for specialized cases or workload balancing

**Future Enhancement:**
- Assign based on officer specialization/department
- Load balancing (assign to officer with least complaints)
- Geographic proximity matching

---

## 🔔 Notification System

### Notification Model

**Fields:**
- `user` - User who receives notification
- `type` - Notification type
- `title` - Notification title
- `message` - Notification message
- `complaintId` - Related complaint (optional)
- `read` - Read status
- `readAt` - When notification was read
- `createdAt` - When notification was created

### Notification Types

1. **complaint_submitted** - Citizen submitted complaint
2. **complaint_assigned** - Officer assigned to complaint
3. **status_update** - Status changed
4. **complaint_resolved** - Complaint resolved
5. **officer_assigned** - Officer manually assigned
6. **comment_added** - Comment added to complaint
7. **general** - General notification

### Notification Triggers

| Event | Recipient | Type | Message |
|-------|-----------|------|---------|
| Complaint created | Citizen | complaint_submitted | "Complaint submitted. ID: COMP-..." |
| Complaint created | Officer | complaint_assigned | "New complaint assigned" |
| Status changed | Citizen | status_update | "Status updated to [status]" |
| Status = Resolved | Citizen | complaint_resolved | "Complaint resolved!" |
| Officer assigned | Citizen | officer_assigned | "Officer assigned" |
| Officer assigned | Officer | complaint_assigned | "Complaint assigned to you" |

---

## 📊 Complaint Model Fields

### Required Fields
- `title` - Complaint title
- `description` - Detailed description
- `category` - Category (Road, Water, etc.)
- `location.address` - Address
- `location.coordinates.latitude` - Latitude
- `location.coordinates.longitude` - Longitude
- `submittedBy` - User who submitted

### Auto-Generated Fields
- `complaintId` - Unique complaint ID (COMP-YYYYMMDD-XXXXX)
- `department` - Auto-assigned based on category
- `status` - Default: "Pending"
- `priority` - Default: "Medium"
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Optional Fields
- `imageUrl` - Image URL
- `assignedTo` - Assigned officer
- `attachments` - File attachments
- `comments` - Comments array
- `statusHistory` - Status change history
- `resolvedAt` - Resolution timestamp
- `resolutionNotes` - Resolution notes

---

## 🔄 Complete Workflow Example

### Scenario: Citizen Reports Pothole

1. **Citizen Submits Complaint**
   ```
   POST /api/complaints
   {
     "title": "Pothole on Main Street",
     "category": "Road",
     "description": "...",
     "location": { "address": "...", "coordinates": {...} },
     "imageUrl": "https://..."
   }
   ```

2. **Backend Processing**
   - Complaint ID generated: `COMP-20240115-12345`
   - Department assigned: `Public Works`
   - Officer auto-assigned (if available)
   - Status: `Pending`
   - Notifications sent

3. **Officer Updates Status**
   ```
   PUT /api/complaints/:id/status
   {
     "status": "In Progress",
     "notes": "Work started"
   }
   ```
   - Status changed to `In Progress`
   - Citizen notified

4. **Officer Resolves Complaint**
   ```
   PUT /api/complaints/:id/status
   {
     "status": "Resolved",
     "notes": "Pothole fixed"
   }
   ```
   - Status changed to `Resolved`
   - `resolvedAt` timestamp set
   - Citizen notified with special message

---

## ✅ Summary

**Complete Workflow Features:**
- ✅ Citizen submits complaint with all required data
- ✅ Backend generates unique complaint ID
- ✅ Auto-routing to department based on category
- ✅ Automatic officer assignment
- ✅ Status updates with history tracking
- ✅ Notifications on all key events
- ✅ Complete audit trail
- ✅ Public tracking by complaint ID

**All requirements implemented!** 🎉
