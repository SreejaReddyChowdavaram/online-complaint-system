# JAN SUVIDHA - Flutter Frontend Quick Reference

## 📁 Folder Structure

```
lib/
├── config/          # App configuration
├── models/          # Data models
├── providers/       # State management (Provider)
├── routes/          # Navigation
├── screens/         # UI Screens
├── services/        # API services
├── utils/           # Utilities
├── widgets/         # Reusable widgets
└── main.dart        # Entry point
```

---

## 🖥️ Screens

### Authentication
- **Login Screen** → `POST /api/auth/login`
- **Register Screen** → `POST /api/auth/register`

### Complaints
- **Citizen Dashboard** → `GET /api/complaints?submittedBy={userId}`
- **Create Complaint** → `POST /api/complaints`
- **Track Complaint** → `GET /api/complaints/:id`

### Profile
- **Profile Screen** → `GET /api/auth/me`

---

## 🔧 Services

### ApiService
- Base HTTP client
- Automatic token injection
- Error handling

### AuthService
- `register()` → `POST /api/auth/register`
- `login()` → `POST /api/auth/login`
- `getCurrentUser()` → `GET /api/auth/me`

### ComplaintService
- `getComplaints()` → `GET /api/complaints`
- `createComplaint()` → `POST /api/complaints`
- `getComplaint()` → `GET /api/complaints/:id`

### NotificationService
- `getNotifications()` → `GET /api/notifications`
- `getUnreadCount()` → `GET /api/notifications/unread-count`

---

## 📊 Providers

### AuthProvider
- Manages user authentication state
- Methods: `login()`, `register()`, `logout()`

### ComplaintProvider
- Manages complaint state
- Methods: `getComplaints()`, `createComplaint()`, `getComplaint()`

### NotificationProvider
- Manages notification state
- Methods: `loadNotifications()`, `markAsRead()`

---

## 🎨 Widgets

- `CustomTextField` - Text input field
- `CustomButton` - Button with loading state
- `ComplaintCard` - Complaint display card

---

## 🔗 Screen → API Quick Map

| Screen | API Endpoint |
|--------|--------------|
| Login | `POST /api/auth/login` |
| Register | `POST /api/auth/register` |
| Dashboard | `GET /api/complaints?submittedBy={id}` |
| Create Complaint | `POST /api/complaints` |
| Track Complaint | `GET /api/complaints/:id` |
| Profile | `GET /api/auth/me` |

---

**For detailed documentation, see `FLUTTER_STRUCTURE.md` and `API_INTEGRATION_MAP.md`**
