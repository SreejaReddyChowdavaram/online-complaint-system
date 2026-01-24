# JAN SUVIDHA - Notification System Quick Reference

## 🎯 Quick Overview

Notification system with MongoDB storage, status change triggers, and future-ready push notification support.

---

## 📊 Notification Schema

**Fields:**
- `user` - Recipient (ObjectId)
- `type` - Notification type (enum)
- `title` - Notification title
- `message` - Notification message
- `complaintId` - Related complaint (optional)
- `read` - Read status (boolean)
- `readAt` - Read timestamp
- `createdAt` - Created timestamp

---

## 🔔 Notification Types

- `complaint_submitted` - Complaint submitted
- `complaint_assigned` - Complaint assigned to officer
- `status_update` - Status changed
- `complaint_resolved` - Complaint resolved
- `officer_assigned` - Officer assigned
- `comment_added` - Comment added
- `general` - General notification

---

## 🛣️ API Endpoints

### Get Notifications
```
GET /api/notifications
GET /api/notifications?unreadOnly=true
GET /api/notifications?limit=20&page=1
```

### Get Unread Count
```
GET /api/notifications/unread-count
```

### Mark as Read
```
PUT /api/notifications/:id/read
```

### Mark All as Read
```
PUT /api/notifications/read-all
```

### Delete Notification
```
DELETE /api/notifications/:id
```

### Register Device
```
POST /api/notifications/register-device
Body: { deviceToken, platform }
```

---

## 📝 Sample Request: Get Notifications

```http
GET /api/notifications
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "unreadCount": 3,
  "data": [
    {
      "_id": "...",
      "type": "status_update",
      "title": "Complaint Status Updated",
      "message": "Status changed to In Progress",
      "read": false,
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

---

## 🔄 Notification Flow

1. **Event Occurs** (e.g., status change)
2. **Notification Service Called** → `sendNotification()`
3. **Notification Created** in MongoDB
4. **Push Hook Called** → `sendPushNotification()` (future-ready)
5. **User Fetches** → `GET /api/notifications`
6. **User Marks Read** → `PUT /api/notifications/:id/read`

---

## 🔔 Notification Triggers

| Event | Type | Recipient |
|-------|------|-----------|
| Complaint submitted | complaint_submitted | Citizen |
| Complaint assigned | complaint_assigned | Officer |
| Status changed | status_update | Citizen |
| Complaint resolved | complaint_resolved | Citizen |
| Officer assigned | officer_assigned | Citizen |
| Comment added | comment_added | Citizen/Officer |

---

## 📱 Push Notifications (Future-ready)

**Current:** Logs notifications  
**Future:** FCM/APNS integration ready

**Device Registration:**
```
POST /api/notifications/register-device
{ "deviceToken": "fcm_token", "platform": "android" }
```

---

## ✅ Key Features

✅ MongoDB storage  
✅ Status change triggers  
✅ Per-user notifications  
✅ Read/unread tracking  
✅ Unread count  
✅ Future-ready for push  
✅ Device registration  

---

**For detailed documentation, see `NOTIFICATION_SYSTEM.md`**
