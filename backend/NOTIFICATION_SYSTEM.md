# JAN SUVIDHA - Notification System Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Notification Schema](#notification-schema)
3. [Notification Flow](#notification-flow)
4. [API Endpoints](#api-endpoints)
5. [Sample Requests & Responses](#sample-requests--responses)
6. [Push Notification Integration](#push-notification-integration)
7. [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

The notification system provides real-time updates to users about important events in the complaint workflow. Notifications are stored in MongoDB and can be fetched per user. The system is designed to be future-ready for push notifications.

**Key Features:**
- ✅ Notifications stored in MongoDB
- ✅ Notification on status change
- ✅ Fetch notifications per user
- ✅ Mark as read/unread
- ✅ Unread count tracking
- ✅ Future-ready for push notifications
- ✅ Device registration support

---

## 📊 Notification Schema

### Notification Model (`models/Notification.js`)

**Fields:**
- `user` (ObjectId, required) - User who receives the notification
- `type` (String, enum) - Notification type
- `title` (String, required) - Notification title
- `message` (String, required) - Notification message
- `complaintId` (ObjectId, optional) - Related complaint
- `read` (Boolean, default: false) - Read status
- `readAt` (Date, optional) - When notification was read
- `createdAt` (Date, auto) - When notification was created
- `updatedAt` (Date, auto) - Last update timestamp

**Indexes:**
- `{ user: 1, read: 1, createdAt: -1 }` - For efficient querying by user and read status
- `{ user: 1, createdAt: -1 }` - For sorting by date

---

## 🔔 Notification Types

| Type | Description | When Triggered |
|------|-------------|----------------|
| `complaint_submitted` | Complaint submitted | When citizen submits complaint |
| `complaint_assigned` | Complaint assigned | When complaint assigned to officer |
| `status_update` | Status changed | When complaint status changes |
| `complaint_resolved` | Complaint resolved | When status = Resolved |
| `officer_assigned` | Officer assigned | When officer manually assigned |
| `comment_added` | Comment added | When comment added to complaint |
| `general` | General notification | For general notifications |

---

## 🔄 Notification Flow

### Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│              EVENT OCCURS (e.g., Status Change)         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│         NOTIFICATION SERVICE - sendNotification()       │
│  - Creates notification in MongoDB                     │
│  - Stores: user, type, title, message, complaintId     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│         PUSH NOTIFICATION HOOK (Future-ready)          │
│  - sendPushNotification() called                        │
│  - Ready for FCM/APNS integration                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│         NOTIFICATION STORED IN DATABASE                 │
│  - Available for user to fetch                         │
│  - Can be marked as read                               │
└─────────────────────────────────────────────────────────┘
```

### Step-by-Step Flow

#### 1. Event Occurs
**Example:** Complaint status changes from "Pending" to "In Progress"

**Location:** `services/complaintService.js`
```javascript
await complaintService.updateStatus(id, status, changedBy, notes);
```

---

#### 2. Notification Triggered
**Location:** `services/complaintService.js` → `triggerStatusNotifications()`

**What Happens:**
```javascript
await notificationService.sendNotification({
  userId: complaint.submittedBy,
  type: 'status_update',
  title: 'Complaint Status Updated',
  message: `Your complaint "${complaint.title}" status has been changed from ${oldStatus} to ${newStatus}.`,
  complaintId: complaint._id
});
```

---

#### 3. Notification Created
**Location:** `services/notificationService.js` → `sendNotification()`

**What Happens:**
1. Creates notification document in MongoDB
2. Sets `read: false`
3. Stores all notification data
4. Calls push notification hook (future-ready)

**Code:**
```javascript
const notification = await Notification.create({
  user: userId,
  type: type || 'general',
  title: title || 'Notification',
  message: message || '',
  complaintId: complaintId || null,
  read: false
});
```

---

#### 4. Push Notification Hook (Future-ready)
**Location:** `services/notificationService.js` → `sendPushNotification()`

**What Happens:**
- Currently logs the notification
- Ready for FCM/APNS integration
- Can be extended to send actual push notifications

---

#### 5. User Fetches Notifications
**Location:** `controllers/notificationController.js` → `getNotifications()`

**What Happens:**
1. User requests notifications
2. System queries MongoDB for user's notifications
3. Filters by read status if requested
4. Returns notifications sorted by date

---

## 🛣️ API Endpoints

### Base URL: `/api/notifications`

All endpoints require authentication (Bearer token).

---

### 1. Get Notifications
```
GET /api/notifications
GET /api/notifications?unreadOnly=true
GET /api/notifications?limit=20&page=1
```

**Query Parameters:**
- `unreadOnly` (boolean) - Filter unread notifications only
- `limit` (number) - Number of notifications per page (default: 50)
- `page` (number) - Page number (default: 1)

**Access:** Private (authenticated users only)

---

### 2. Get Unread Count
```
GET /api/notifications/unread-count
```

**Access:** Private

---

### 3. Mark Notification as Read
```
PUT /api/notifications/:id/read
```

**Access:** Private (only own notifications)

---

### 4. Mark All as Read
```
PUT /api/notifications/read-all
```

**Access:** Private

---

### 5. Delete Notification
```
DELETE /api/notifications/:id
```

**Access:** Private (only own notifications)

---

### 6. Register Device for Push Notifications
```
POST /api/notifications/register-device
Content-Type: application/json

{
  "deviceToken": "fcm_token_here",
  "platform": "android"
}
```

**Access:** Private

**Body:**
- `deviceToken` (string, required) - FCM/APNS device token
- `platform` (string, optional) - "android" or "ios"

---

## 📨 Sample Requests & Responses

### 1. Get All Notifications

**Request:**
```http
GET /api/notifications
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "unreadCount": 3,
  "data": [
    {
      "_id": "65b1111111111111",
      "user": "65b1234567890123",
      "type": "status_update",
      "title": "Complaint Status Updated",
      "message": "Your complaint \"Pothole on Main Street\" status has been changed from Pending to In Progress.",
      "complaintId": {
        "_id": "65b2222222222222",
        "title": "Pothole on Main Street",
        "complaintId": "COMP-20240115-12345"
      },
      "read": false,
      "readAt": null,
      "createdAt": "2024-01-15T11:00:00Z",
      "updatedAt": "2024-01-15T11:00:00Z"
    },
    {
      "_id": "65b1111111111112",
      "user": "65b1234567890123",
      "type": "complaint_submitted",
      "title": "Complaint Submitted",
      "message": "Your complaint \"Pothole on Main Street\" has been submitted successfully. Complaint ID: COMP-20240115-12345",
      "complaintId": {
        "_id": "65b2222222222222",
        "title": "Pothole on Main Street",
        "complaintId": "COMP-20240115-12345"
      },
      "read": true,
      "readAt": "2024-01-15T10:35:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:35:00Z"
    }
  ]
}
```

---

### 2. Get Unread Notifications Only

**Request:**
```http
GET /api/notifications?unreadOnly=true
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "unreadCount": 3,
  "data": [
    {
      "_id": "65b1111111111111",
      "type": "status_update",
      "title": "Complaint Status Updated",
      "message": "Your complaint status has been changed to In Progress.",
      "read": false,
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

---

### 3. Get Unread Count

**Request:**
```http
GET /api/notifications/unread-count
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "unreadCount": 3
}
```

---

### 4. Mark Notification as Read

**Request:**
```http
PUT /api/notifications/65b1111111111111/read
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "_id": "65b1111111111111",
    "read": true,
    "readAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

### 5. Mark All as Read

**Request:**
```http
PUT /api/notifications/read-all
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### 6. Delete Notification

**Request:**
```http
DELETE /api/notifications/65b1111111111111
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

### 7. Register Device for Push Notifications

**Request:**
```http
POST /api/notifications/register-device
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "deviceToken": "fcm_token_abc123xyz789",
  "platform": "android"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device registered for push notifications",
  "data": {
    "userId": "65b1234567890123",
    "deviceToken": "fcm_token_abc123xyz789",
    "platform": "android",
    "registeredAt": "2024-01-15T12:00:00Z"
  }
}
```

---

## 📱 Push Notification Integration

### Current Implementation

The notification system is **future-ready** for push notifications. The infrastructure is in place:

1. **Device Registration Endpoint** - `/api/notifications/register-device`
2. **Push Notification Hook** - `sendPushNotification()` method
3. **Notification Service** - Ready to integrate FCM/APNS

### Future Implementation Steps

#### 1. Install Firebase Admin SDK (for FCM)
```bash
npm install firebase-admin
```

#### 2. Initialize Firebase Admin
```javascript
// config/firebase.js
const admin = require('firebase-admin');

const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
```

#### 3. Enhance User Model
Add device tokens array to User model:
```javascript
deviceTokens: [{
  token: String,
  platform: String, // 'android' or 'ios'
  createdAt: Date
}]
```

#### 4. Update sendPushNotification Method
```javascript
async sendPushNotification(userId, notification) {
  const admin = require('../config/firebase');
  const User = require('../models/User');
  
  // Get user's device tokens
  const user = await User.findById(userId);
  const tokens = user.deviceTokens.map(dt => dt.token);
  
  if (tokens.length === 0) return;
  
  // Prepare message
  const message = {
    notification: {
      title: notification.title,
      body: notification.message
    },
    data: {
      type: notification.type,
      complaintId: notification.complaintId?.toString() || '',
      notificationId: notification._id.toString()
    },
    tokens: tokens
  };
  
  // Send push notification
  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log(`Push notification sent: ${response.successCount} successful`);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}
```

#### 5. For iOS (APNS)
Use `apn` package or integrate via Firebase:
```bash
npm install apn
```

---

## 🔔 Notification Triggers

### When Notifications Are Sent

| Event | Recipient | Type | Message |
|-------|-----------|------|---------|
| Complaint created | Citizen | complaint_submitted | "Complaint submitted. ID: COMP-..." |
| Complaint created | Officer | complaint_assigned | "New complaint assigned" |
| Status changed | Citizen | status_update | "Status updated to [status]" |
| Status = Resolved | Citizen | complaint_resolved | "Complaint resolved!" |
| Officer assigned | Citizen | officer_assigned | "Officer assigned" |
| Officer assigned | Officer | complaint_assigned | "Complaint assigned to you" |
| Comment added | Citizen/Officer | comment_added | "New comment on complaint" |

---

## 📊 Notification Service Methods

### `sendNotification(notificationData)`
Creates and stores notification in database.

**Parameters:**
- `userId` - User ID
- `type` - Notification type
- `title` - Notification title
- `message` - Notification message
- `complaintId` - Related complaint ID (optional)

---

### `getUserNotifications(userId, options)`
Gets notifications for a user.

**Parameters:**
- `userId` - User ID
- `options` - { unreadOnly, limit, page }

**Returns:** Array of notifications

---

### `getUnreadCount(userId)`
Gets count of unread notifications.

**Returns:** Number

---

### `markAsRead(notificationId, userId)`
Marks a notification as read.

**Returns:** Updated notification

---

### `markAllAsRead(userId)`
Marks all user notifications as read.

---

### `deleteNotification(notificationId, userId)`
Deletes a notification.

**Returns:** Deleted notification

---

### `registerDevice(userId, deviceToken, platform)`
Registers device for push notifications (future-ready).

**Parameters:**
- `userId` - User ID
- `deviceToken` - FCM/APNS token
- `platform` - "android" or "ios"

---

### `sendPushNotification(userId, notification)`
Sends push notification (future-ready hook).

**Currently:** Logs notification  
**Future:** Sends via FCM/APNS

---

## 🔄 Complete Notification Flow Example

### Scenario: Complaint Status Changes

1. **Officer Updates Status**
   ```
   PUT /api/complaints/:id/status
   { "status": "In Progress" }
   ```

2. **Notification Service Called**
   ```javascript
   await notificationService.sendNotification({
     userId: complaint.submittedBy,
     type: 'status_update',
     title: 'Complaint Status Updated',
     message: 'Status changed to In Progress',
     complaintId: complaint._id
   });
   ```

3. **Notification Created in Database**
   - Stored in MongoDB
   - `read: false`
   - Linked to complaint

4. **Push Notification Hook Called**
   - `sendPushNotification()` called
   - Ready for FCM/APNS integration

5. **User Fetches Notifications**
   ```
   GET /api/notifications
   ```
   - Returns notification
   - Shows unread count

6. **User Marks as Read**
   ```
   PUT /api/notifications/:id/read
   ```
   - Notification marked as read
   - `readAt` timestamp set

---

## 🚀 Future Enhancements

### 1. Email Notifications
- Send email when important notifications occur
- Configurable email preferences per user

### 2. SMS Notifications
- Send SMS for urgent notifications
- Integration with SMS service provider

### 3. WebSocket Real-time Updates
- Real-time notification delivery
- No need to poll for new notifications

### 4. Notification Preferences
- User can choose which notifications to receive
- Per-type notification settings

### 5. Notification Grouping
- Group similar notifications
- Reduce notification clutter

### 6. Rich Notifications
- Images in notifications
- Action buttons
- Deep linking to specific screens

---

## ✅ Summary

**Notification System Features:**
- ✅ Notifications stored in MongoDB
- ✅ Notification on status change
- ✅ Fetch notifications per user
- ✅ Mark as read/unread
- ✅ Unread count tracking
- ✅ Future-ready for push notifications
- ✅ Device registration endpoint
- ✅ Complete API endpoints

**All requirements met!** 🎉

---

**For quick reference, see `NOTIFICATION_QUICK_REFERENCE.md`**
