# Notification System - Complete Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Notification Schema](#notification-schema)
3. [Notification Flow](#notification-flow)
4. [API Endpoints](#api-endpoints)
5. [Service Logic](#service-logic)
6. [Future-Ready Features](#future-ready-features)
7. [Integration Examples](#integration-examples)

---

## 🎯 Overview

**Notification System** keeps users informed about important events in the complaint workflow. It:
- Stores notifications in MongoDB
- Triggers automatically on complaint events
- Provides API to fetch notifications
- Ready for WebSocket/push notifications

**Key Features:**
- ✅ Automatic notification on status updates
- ✅ Notification on complaint assignment
- ✅ Notification on comments
- ✅ Read/unread tracking
- ✅ Future-ready for push notifications
- ✅ Future-ready for WebSocket

---

## 📊 Notification Schema

### Model Structure

```javascript
// models/Notification.js

{
  user: ObjectId,              // User who receives notification (required)
  type: String,                // Notification type (enum)
  title: String,               // Notification title (required)
  message: String,              // Notification message (required)
  complaintId: ObjectId,        // Related complaint (optional)
  read: Boolean,                // Read status (default: false)
  readAt: Date,                 // When notification was read
  createdAt: Date,              // When notification was created
  updatedAt: Date                // Last update time
}
```

### Notification Types

```javascript
enum: [
  'complaint_submitted',    // Citizen: Complaint submitted successfully
  'complaint_assigned',      // Officer: New complaint assigned
  'status_update',           // Both: Status changed
  'complaint_resolved',      // Citizen: Complaint resolved
  'officer_assigned',        // Citizen: Officer assigned
  'comment_added',           // Both: Comment added
  'general'                  // General notifications
]
```

### Indexes

```javascript
// Optimized for queries
{ user: 1, read: 1, createdAt: -1 }  // Get unread notifications
{ user: 1, createdAt: -1 }              // Get all notifications
```

**Why these indexes?**
- Fast queries for user's notifications
- Fast filtering by read status
- Sorted by creation date (newest first)

---

## 🔄 Notification Flow

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              COMPLAINT EVENT OCCURS                         │
│  (Status update, Assignment, Comment, etc.)                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              COMPLAINT SERVICE                              │
│  Calls: notificationService.sendNotification()              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              NOTIFICATION SERVICE                           │
│  1. Create notification in MongoDB                         │
│  2. Send push notification (future-ready)                  │
│  3. Trigger WebSocket event (future-ready)                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              NOTIFICATION STORED                            │
│  • Saved to MongoDB                                         │
│  • Marked as unread                                         │
│  • Linked to user and complaint                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              USER FETCHES NOTIFICATIONS                     │
│  GET /api/notifications                                     │
│  • Returns unread count                                     │
│  • Returns notification list                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              USER MARKS AS READ                             │
│  PUT /api/notifications/:id/read                            │
│  • Updates read status                                     │
│  • Sets readAt timestamp                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Flow

### Step 1: Complaint Status Update

**What happens:**
1. Officer updates complaint status
2. Complaint service calls `updateStatus()`
3. Status updated in database
4. `triggerStatusNotifications()` called

**Code:**
```javascript
// services/complaintService.js

async updateStatus(id, status, changedBy, notes = null) {
  // ... update status ...
  
  // Trigger notifications
  await this.triggerStatusNotifications(complaint, oldStatus, status, changedBy);
}
```

---

### Step 2: Trigger Notifications

**What happens:**
1. Notification service called
2. Notification created in MongoDB
3. Push notification sent (future-ready)
4. WebSocket event triggered (future-ready)

**Code:**
```javascript
// services/complaintService.js

async triggerStatusNotifications(complaint, oldStatus, newStatus, changedBy) {
  // Notify citizen
  await notificationService.sendNotification({
    userId: complaint.submittedBy,
    type: 'status_update',
    title: 'Complaint Status Updated',
    message: `Your complaint "${complaint.title}" status changed from ${oldStatus} to ${newStatus}.`,
    complaintId: complaint._id
  });

  // Notify officer (if different)
  if (complaint.assignedTo && complaint.assignedTo.toString() !== changedBy.toString()) {
    await notificationService.sendNotification({
      userId: complaint.assignedTo,
      type: 'status_update',
      title: 'Complaint Status Updated',
      message: `Complaint "${complaint.title}" status changed to ${newStatus}.`,
      complaintId: complaint._id
    });
  }

  // Special notification when resolved
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

---

### Step 3: Send Notification

**What happens:**
1. Notification created in database
2. Push notification hook called (future-ready)
3. WebSocket event triggered (future-ready)
4. Returns notification object

**Code:**
```javascript
// services/notificationService.js

async sendNotification(notificationData) {
  const { userId, type, title, message, complaintId } = notificationData;

  // Create notification in database
  const notification = await Notification.create({
    user: userId,
    type: type || 'general',
    title: title || 'Notification',
    message: message || '',
    complaintId: complaintId || null,
    read: false
  });

  // Future-ready: Send push notification
  await this.sendPushNotification(userId, notification);

  // Future-ready: WebSocket notification
  // await this.sendWebSocketNotification(userId, notification);

  return notification;
}
```

---

### Step 4: User Fetches Notifications

**What happens:**
1. User requests notifications
2. API fetches from database
3. Returns unread count
4. Returns notification list

**Code:**
```javascript
// controllers/notificationController.js

exports.getNotifications = async (req, res, next) => {
  const { unreadOnly, limit } = req.query;
  
  const options = {
    unreadOnly: unreadOnly === 'true',
    limit: parseInt(limit) || 50
  };

  const notifications = await notificationService.getUserNotifications(
    req.user.id,
    options
  );

  const unreadCount = await notificationService.getUnreadCount(req.user.id);

  res.status(200).json({
    success: true,
    count: notifications.length,
    unreadCount: unreadCount,
    data: notifications
  });
};
```

---

## 🔗 API Endpoints

### Get Notifications
```http
GET /api/notifications
Authorization: Bearer <token>
Query Parameters:
  - unreadOnly: boolean (default: false)
  - limit: number (default: 50)
  - page: number (default: 1)
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "unreadCount": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "type": "status_update",
      "title": "Complaint Status Updated",
      "message": "Your complaint status changed to In Progress",
      "complaintId": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Pothole on Main Street",
        "complaintId": "COMP-20260125-12345"
      },
      "read": false,
      "createdAt": "2026-01-25T10:00:00.000Z"
    }
  ]
}
```

---

### Get Unread Count
```http
GET /api/notifications/unread-count
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "unreadCount": 3
}
```

---

### Mark as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "read": true,
    "readAt": "2026-01-25T11:00:00.000Z"
  }
}
```

---

### Mark All as Read
```http
PUT /api/notifications/read-all
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### Delete Notification
```http
DELETE /api/notifications/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

### Register Device (Future-Ready)
```http
POST /api/notifications/register-device
Authorization: Bearer <token>
Content-Type: application/json

{
  "deviceToken": "fcm-token-here",
  "platform": "android"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device registered for push notifications",
  "data": {
    "userId": "507f191e810c19729de860ea",
    "deviceToken": "fcm-token-here",
    "platform": "android",
    "registeredAt": "2026-01-25T10:00:00.000Z"
  }
}
```

---

## 💻 Service Logic

### Send Notification

```javascript
// services/notificationService.js

async sendNotification(notificationData) {
  const { userId, type, title, message, complaintId } = notificationData;

  // Create notification in database
  const notification = await Notification.create({
    user: userId,
    type: type || 'general',
    title: title || 'Notification',
    message: message || '',
    complaintId: complaintId || null,
    read: false
  });

  // Future-ready: Send push notification
  await this.sendPushNotification(userId, notification);

  return notification;
}
```

**What it does:**
1. Creates notification in MongoDB
2. Calls push notification hook (future-ready)
3. Returns notification object
4. Error handling (doesn't fail main operation)

---

### Get User Notifications

```javascript
// services/notificationService.js

async getUserNotifications(userId, options = {}) {
  const { unreadOnly = false, limit = 50 } = options;

  const filter = { user: userId };
  if (unreadOnly) {
    filter.read = false;
  }

  const notifications = await Notification.find(filter)
    .populate('complaintId', 'title complaintId')
    .sort({ createdAt: -1 })
    .limit(limit);

  return notifications;
}
```

**What it does:**
1. Filters by user
2. Optionally filters by read status
3. Populates complaint details
4. Sorts by newest first
5. Limits results

---

### Mark as Read

```javascript
// services/notificationService.js

async markAsRead(notificationId, userId) {
  const notification = await Notification.findOne({
    _id: notificationId,
    user: userId
  });

  if (notification) {
    notification.read = true;
    notification.readAt = new Date();
    await notification.save();
  }

  return notification;
}
```

**What it does:**
1. Finds notification (ensures it belongs to user)
2. Marks as read
3. Sets readAt timestamp
4. Saves to database

---

### Get Unread Count

```javascript
// services/notificationService.js

async getUnreadCount(userId) {
  const count = await Notification.countDocuments({
    user: userId,
    read: false
  });
  return count;
}
```

**What it does:**
1. Counts unread notifications for user
2. Uses index for fast query
3. Returns count

---

## 🚀 Future-Ready Features

### 1. Push Notifications

**Current Implementation:**
```javascript
// services/notificationService.js

async sendPushNotification(userId, notification) {
  // Future implementation:
  // 1. Get user's device tokens
  // 2. Send push notification via FCM (Android) or APNS (iOS)
  // 3. Handle errors and retry logic
  
  console.log(`Push notification would be sent to user ${userId}: ${notification.title}`);
}
```

**Future Implementation:**
```javascript
// Example with Firebase Cloud Messaging (FCM)
const admin = require('firebase-admin');

async sendPushNotification(userId, notification) {
  // Get user's device tokens
  const user = await User.findById(userId);
  const deviceTokens = user.deviceTokens.map(dt => dt.token);

  if (deviceTokens.length === 0) return;

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
    tokens: deviceTokens
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log(`Push notification sent: ${response.successCount} successful`);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}
```

**To Enable:**
1. Install Firebase Admin SDK: `npm install firebase-admin`
2. Initialize Firebase Admin
3. Store device tokens in User model
4. Implement `sendPushNotification()` method

---

### 2. WebSocket Notifications

**Future Implementation:**
```javascript
// services/notificationService.js

async sendNotification(notificationData) {
  // ... create notification ...
  
  // Send WebSocket notification
  await this.sendWebSocketNotification(userId, notification);
  
  return notification;
}

async sendWebSocketNotification(userId, notification) {
  // Get WebSocket connection for user
  const io = require('../socket').getIO();
  
  // Send notification to user's room
  io.to(`user_${userId}`).emit('notification', {
    type: notification.type,
    title: notification.title,
    message: notification.message,
    complaintId: notification.complaintId,
    createdAt: notification.createdAt
  });
}
```

**Socket.io Setup:**
```javascript
// socket.js
const socketIO = require('socket.io');

let io;

function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    // Authenticate user
    socket.on('authenticate', (token) => {
      // Verify JWT token
      const user = verifyToken(token);
      if (user) {
        socket.join(`user_${user.id}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = { initializeSocket, getIO };
```

**To Enable:**
1. Install Socket.io: `npm install socket.io`
2. Initialize Socket.io in server.js
3. Implement authentication
4. Add `sendWebSocketNotification()` method

---

### 3. Email Notifications

**Future Implementation:**
```javascript
// services/notificationService.js

async sendNotification(notificationData) {
  // ... create notification ...
  
  // Send email notification
  await this.sendEmailNotification(userId, notification);
  
  return notification;
}

async sendEmailNotification(userId, notification) {
  const user = await User.findById(userId);
  
  const emailData = {
    to: user.email,
    subject: notification.title,
    html: `
      <h2>${notification.title}</h2>
      <p>${notification.message}</p>
      ${notification.complaintId ? 
        `<a href="${process.env.FRONTEND_URL}/complaints/${notification.complaintId}">View Complaint</a>` 
        : ''}
    `
  };

  // Send email using nodemailer, sendgrid, etc.
  await emailService.send(emailData);
}
```

**To Enable:**
1. Install email service (nodemailer, sendgrid, etc.)
2. Configure email service
3. Add `sendEmailNotification()` method

---

## 🔔 Notification Triggers

### When Notifications Are Sent

| Event | Type | Sent To | Triggered By |
|-------|------|---------|--------------|
| Complaint Submitted | `complaint_submitted` | Citizen | Complaint Service |
| Officer Assigned | `complaint_assigned` | Officer | Complaint Service |
| Officer Assigned | `officer_assigned` | Citizen | Complaint Service |
| Status Updated | `status_update` | Both | Complaint Service |
| Complaint Resolved | `complaint_resolved` | Citizen | Complaint Service |
| Comment Added | `comment_added` | Other Party | Complaint Service |

---

## 📊 Integration Examples

### Example 1: Status Update Notification

```javascript
// services/complaintService.js

async updateStatus(id, status, changedBy, notes = null) {
  // ... update status ...
  
  // Trigger notification
  await notificationService.sendNotification({
    userId: complaint.submittedBy,
    type: 'status_update',
    title: 'Complaint Status Updated',
    message: `Your complaint "${complaint.title}" status changed to ${status}.`,
    complaintId: complaint._id
  });
}
```

---

### Example 2: Comment Notification

```javascript
// services/complaintService.js

async addComment(id, commentData) {
  // ... add comment ...
  
  // Notify other party
  if (isCitizen && complaint.assignedTo) {
    await notificationService.sendNotification({
      userId: complaint.assignedTo,
      type: 'comment_added',
      title: 'New Comment on Complaint',
      message: `A comment has been added to complaint "${complaint.title}"`,
      complaintId: complaint._id
    });
  }
}
```

---

### Example 3: Frontend Integration

```javascript
// Frontend: Fetch notifications
const fetchNotifications = async () => {
  const response = await fetch('/api/notifications?unreadOnly=true', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const { data, unreadCount } = await response.json();
  
  // Display notifications
  displayNotifications(data);
  updateBadge(unreadCount);
};

// Frontend: Mark as read
const markAsRead = async (notificationId) => {
  await fetch(`/api/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
```

---

## ✅ Summary

**Notification System Features:**
1. ✅ Stores notifications in MongoDB
2. ✅ Automatic notifications on complaint events
3. ✅ Read/unread tracking
4. ✅ API to fetch notifications
5. ✅ Future-ready for push notifications
6. ✅ Future-ready for WebSocket
7. ✅ Future-ready for email

**Notification Flow:**
1. Event occurs (status update, comment, etc.)
2. Notification service called
3. Notification saved to MongoDB
4. Push notification sent (future-ready)
5. WebSocket event triggered (future-ready)
6. User fetches notifications via API
7. User marks as read

**Future Enhancements:**
- Push notifications (FCM/APNS)
- WebSocket real-time updates
- Email notifications
- SMS notifications
- Notification preferences

The notification system is complete and ready for future enhancements! 🔔
